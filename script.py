import os
import json
import time
import requests
from dotenv import load_dotenv
from flask import Flask, request, jsonify

app = Flask(__name__)

load_dotenv()

# ====== CONFIG ======
WAHA_BASE_URL = os.getenv("WAHA_BASE_URL", "http://localhost:3000")
WAHA_API_KEY = os.getenv("WAHA_API_KEY", "")  # sua chave do WAHA
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")  # sua chave OpenAI

# Modelo: escolha um custo/benefício para MVP
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")  # exemplo de modelo suportado :contentReference[oaicite:1]{index=1}

# ====== "BANCO" EM MEMÓRIA (MVP) ======
# chave: chatId, valor: dict com perfil + etapa
DB = {}  # { "5521...@c.us": {"etapa": 0, "perfil": {...}, "ultimo_update": 123 } }

PERGUNTAS = [
    ("objetivo", "Qual é seu objetivo principal? (hipertrofia / emagrecimento / condicionamento)"),
    ("dias", "Quantos dias por semana você pode treinar? (ex: 3, 4, 5)"),
    ("tempo", "Quanto tempo por treino? (ex: 45 min, 60 min)"),
    ("nivel", "Seu nível? (iniciante / intermediário / avançado)"),
    ("equipamentos", "Você treina onde? (academia / halteres em casa / peso do corpo)"),
    ("restricoes", "Você tem alguma lesão ou restrição? (se não, escreva: não)"),
]

# ====== HELPERS ======
def headers_waha():
    h = {"Content-Type": "application/json"}
    if WAHA_API_KEY:
        h["X-Api-Key"] = WAHA_API_KEY
    return h

def enviar_texto_waha(session, chat_id, texto):
    url = f"{WAHA_BASE_URL}/api/sendText"
    payload = {"session": session, "chatId": chat_id, "text": texto}
    r = requests.post(url, json=payload, headers=headers_waha(), timeout=20)
    return r

def normalizar_texto(texto):
    if texto is None:
        return ""
    return str(texto).strip()

def validar_campo(campo, valor):
    v = normalizar_texto(valor).lower()

    if campo == "dias":
        # aceita "3" ou "3 dias"
        digitos = "".join([c for c in v if c.isdigit()])
        if digitos == "":
            return None, "Me diga um número de dias (ex: 3, 4, 5)."
        n = int(digitos)
        if n < 1 or n > 7:
            return None, "Escolha entre 1 e 7 dias."
        return n, None

    if campo == "objetivo":
        if "hiper" in v:
            return "hipertrofia", None
        if "emag" in v or "perd" in v:
            return "emagrecimento", None
        if "cond" in v or "cardio" in v:
            return "condicionamento", None
        return None, "Escolha: hipertrofia / emagrecimento / condicionamento."

    if campo == "nivel":
        if "inic" in v:
            return "iniciante", None
        if "inter" in v:
            return "intermediario", None
        if "avan" in v:
            return "avancado", None
        return None, "Escolha: iniciante / intermediário / avançado."

    # campos livres
    return normalizar_texto(valor), None

def montar_prompt_treino(perfil):
    # Instruções de segurança e formato
    instrucoes = (
        "Você é um treinador que monta um treino semanal seguro e realista.\n"
        "Regras:\n"
        "- Não prescreva nada médico; se houver dor/lesão, recomende avaliação profissional.\n"
        "- Proponha aquecimento curto e orientação de progressão (RPE ou aumento gradual de carga).\n"
        "- Respeite o tempo por treino e os equipamentos disponíveis.\n"
        "- Gere um plano SEMANAL, com dias numerados.\n"
        "- Responda APENAS em JSON válido, sem texto extra.\n"
        "Formato JSON:\n"
        "{"
        "\"resumo\":\"...\","
        "\"semana\":["
        "{\"dia\":1,\"foco\":\"...\",\"aquecimento\":\"...\","
        "\"exercicios\":[{\"nome\":\"...\",\"series\":3,\"reps\":\"8-12\",\"descanso_seg\":90,\"observacao\":\"...\"}],"
        "\"finalizacao\":\"...\"}"
        "],"
        "\"observacoes_gerais\":[\"...\"]"
        "}"
    )

    entrada = {
        "perfil": perfil,
        "observacao": "Monte um treino semanal baseado nesse perfil."
    }

    return instrucoes, entrada

def gerar_treino_openai(perfil):
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY não configurada.")

    instrucoes, entrada = montar_prompt_treino(perfil)

    url = "https://api.openai.com/v1/responses"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}",
    }

    # Responses API: model + instructions + input :contentReference[oaicite:2]{index=2}
    payload = {
        "model": OPENAI_MODEL,
        "instructions": instrucoes,
        "input": json.dumps(entrada, ensure_ascii=False),
    }

    r = requests.post(url, headers=headers, json=payload, timeout=60)
    r.raise_for_status()
    data = r.json()

    # A forma mais segura é extrair texto da resposta
    # Em geral, `output_text` vem pronto em muitos exemplos; se não vier, caímos no parsing do output
    output_text = data.get("output_text")
    if output_text is None:
        # fallback: tenta varrer 'output'
        output = data.get("output", [])
        textos = []
        for item in output:
            content = item.get("content", [])
            for c in content:
                t = c.get("text")
                if t:
                    textos.append(t)
        output_text = "\n".join(textos).strip()

    if not output_text:
        raise RuntimeError("Resposta da OpenAI veio vazia.")

    # deve ser JSON
    return json.loads(output_text)

def formatar_treino_para_whatsapp(treino):
    linhas = []
    linhas.append("📅 *Seu treino semanal*")
    linhas.append(treino.get("resumo", ""))

    semana = treino.get("semana", [])
    for dia in semana:
        linhas.append("")
        linhas.append(f"*Dia {dia.get('dia')} — {dia.get('foco','')}*")
        aquecimento = dia.get("aquecimento")
        if aquecimento:
            linhas.append(f"• Aquecimento: {aquecimento}")

        exercicios = dia.get("exercicios", [])
        for ex in exercicios:
            nome = ex.get("nome", "")
            series = ex.get("series", "")
            reps = ex.get("reps", "")
            descanso = ex.get("descanso_seg", "")
            obs = ex.get("observacao", "")
            linha = f"• {nome} — {series}x {reps} — descanso {descanso}s"
            if obs:
                linha = linha + f" ({obs})"
            linhas.append(linha)

        finalizacao = dia.get("finalizacao")
        if finalizacao:
            linhas.append(f"• Finalização: {finalizacao}")

    obs_gerais = treino.get("observacoes_gerais", [])
    if obs_gerais:
        linhas.append("")
        linhas.append("*Observações gerais:*")
        for o in obs_gerais:
            linhas.append(f"• {o}")

    # WhatsApp gosta de mensagens não gigantes; MVP ok. Se ficar grande, a gente quebra em 2-3 mensagens.
    return "\n".join([l for l in linhas if l is not None])

# ====== WEBHOOK DO WAHA ======
@app.route("/webhook/waha", methods=["POST"])
def webhook_waha():
    raw = request.get_json(silent=True) or {}
    print("WEBHOOK CHEGOU:", raw)

    session = raw.get("session") or "default"

    # A mensagem real vem dentro de raw["payload"]
    msg = raw.get("payload") or {}

    chat_id = msg.get("from") or ""
    texto = msg.get("body") or ""
    from_me = msg.get("fromMe", False)

    chat_id = normalizar_texto(chat_id)
    texto = normalizar_texto(texto)

    if chat_id == "" or texto == "":
        return jsonify({"ok": True, "ignorado": True, "motivo": "sem chat_id ou texto"})

    if from_me is True:
        return jsonify({"ok": True, "ignorado": True, "motivo": "fromMe"})

    # Inicializa usuário
    if chat_id not in DB:
        DB[chat_id] = {"etapa": 0, "perfil": {}, "ultimo_update": time.time()}

    estado = DB[chat_id]
    etapa = estado["etapa"]
    perfil = estado["perfil"]

    # Comandos simples
    tlow = texto.lower()
    if tlow in ["reset", "reiniciar", "recomeçar", "recomecar"]:
        DB[chat_id] = {"etapa": 0, "perfil": {}, "ultimo_update": time.time()}
        enviar_texto_waha(session, chat_id, "Ok. Vamos recomeçar.\n" + PERGUNTAS[0][1])
        return jsonify({"ok": True})

    if tlow in ["treino", "montar treino", "quero treino", "começar", "comecar"]:
        estado["etapa"] = 0
        estado["perfil"] = {}
        enviar_texto_waha(session, chat_id, "Perfeito. Vou montar seu treino semanal.\n" + PERGUNTAS[0][1])
        return jsonify({"ok": True})

    # Se está coletando perfil
    if etapa < len(PERGUNTAS):
        campo, pergunta = PERGUNTAS[etapa]
        valor, erro = validar_campo(campo, texto)
        if erro:
            enviar_texto_waha(session, chat_id, erro)
            return jsonify({"ok": True})

        perfil[campo] = valor
        estado["etapa"] = etapa + 1
        estado["ultimo_update"] = time.time()

        if estado["etapa"] < len(PERGUNTAS):
            prox_pergunta = PERGUNTAS[estado["etapa"]][1]
            enviar_texto_waha(session, chat_id, prox_pergunta)
            return jsonify({"ok": True})

        # Já tem dados suficientes -> gera treino
        try:
            treino = gerar_treino_openai(perfil)
            msg = formatar_treino_para_whatsapp(treino)
            enviar_texto_waha(session, chat_id, msg)
            enviar_texto_waha(session, chat_id, "Se quiser ajuste, diga: mais leve / mais pesado / trocar exercícios. (ou 'reset')")
        except Exception as e:
            enviar_texto_waha(session, chat_id, f"Deu erro ao gerar o treino: {e}")
        return jsonify({"ok": True})

    # Se já terminou o onboarding, você pode tratar pedidos de ajuste aqui
    enviar_texto_waha(session, chat_id, "Entendi. Se quiser um novo treino, diga 'treino'. Para recomeçar, 'reset'.")
    return jsonify({"ok": True})

if __name__ == "__main__":
    # Por padrão roda em localhost:5000
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=True)
