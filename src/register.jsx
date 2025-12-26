function Topheader(){
  return (
    <header> 
      <nav className="pt-8 m-auto m-0 flex justify-between max-w-320"> 
        <a className="font-[PoppinsExtraBold] text-4xl font-extrabold text-[#383838]" href="/">Perseus.ai</a>


      </nav>
    </header>
  )
}

function TelaCadastroPerseus(){
  return (
    <div className="min-h-screen bg-white">
        <Topheader />

      {/* Conteúdo central */}
      <main className="flex items-start justify-center px-4">
        <div className="w-full max-w-md text-center">
          {/* Ícone */}
          <div className="mx-auto pb-8 flex h-14 w-14 items-center justify-center">
            <img src="/emojis/notebook.png"/>
          </div>

          <h2 className="mb-10 text-lg font-semibold text-gray-900 font-[Poppins]">
            Primeira vez? Crie sua conta.
          </h2>

          {/* Form */}
          <form className="mx-auto w-full max-w-sm text-left">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 font-[Poppins]">
                  Nome
                </label>
                <input type="text" className="text-black h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"/>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 font-[Poppins]">
                  E-mail
                </label>
                <input type="email" placeholder="example@gmail.com" className="text-black h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200"/>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 font-[Poppins]">
                  Senha
                </label>
                <input type="password" className="text-black h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"/>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 font-[Poppins]">
                  Confirmar senha
                </label>
                <input type="password" className="text-black h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"/>
              </div>
            </div>

            {/* Botões */}
            <div className="mt-8 space-y-4">
              <button type="submit" onClick="handleLogin" className=" font-[Poppins] h-11 w-full rounded-md bg-red-500 text-sm font-semibold text-white shadow-md shadow-gray-200 hover:bg-red-600 active:bg-red-700">
                Entrar
              </button>

              <button type="button" onClick="handleLogin" className=" font-[Poppins] h-11 w-full rounded-md border border-gray-300 bg-white text-sm font-semibold text-gray-500 shadow-md shadow-gray-200 hover:bg-gray-50 active:bg-gray-100">
                Criar conta
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export { TelaCadastroPerseus }