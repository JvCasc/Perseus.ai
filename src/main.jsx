import { createRoot } from 'react-dom/client'
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TelaCadastroPerseus } from './register';
import { TelaLoginPerseus } from './login';


import './index.css'

function Topheader(){
  return (
    <header> 
      <nav className="pt-8 m-auto m-0 flex justify-between max-w-320"> 
        <a className="font-[PoppinsExtraBold] text-4xl font-extrabold text-[#383838]" href="/">Perseus.ai</a>

        <div className="font-[PoppinsBold] gap-8 items-center flex">
          <a className="shadow-lg inline-flex items-center bg-[#ff4d4d] justify-center rounded-full pt-[8px] pb-[8px] pr-[21px] pl-[21px]" href="/">Assinar agora</a>
          <a className="text-[#111]" href="/login">Login</a>
        </div>

      </nav>
    </header>
  )
}

function MainText(){
  return(
    <section className = "text-center text-[#383838]">
    <div className = "text-6xl pt-[2ch]">
      <h1 className = "font-[PoppinsBold]">
        Faça seu treino com a ajuda da I.A e a <br />
        simplicidade do Whatsapp
      </h1>
    </div>
    </section>
  )
}

function Assinar(){
  return(
    <div className = "flex justify-center pt-12">
        <a className="shadow-lg btn--primary bg-[#ff4d4d] font-[PoppinsBold] text-2xl justify-center inline-flex items-center rounded-full pt-[20px] pb-[20px] pr-[21px] pl-[21px]" href="/">Assinar agora</a>
    </div>
  )
}

function Iphone(){
  return(
    <div className = "pt-20 flex justify-center"> 
      <img src="iphoneTodo.png" />
    </div>
  )
}

function EmojiParticles() {
   const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => setInit(true));
  }, []);

  if (!init) return null;

  return (
    <Particles
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        particles: {
          number: { value: 50 },
          move: { enable: true, speed: 0.2, direction: "bottomRight" },
          opacity: { value: 0.5 },
          size: { value: { min: 8, max: 16 } },
          shape: {
          type: "image",
          options: {
            image: [
              {
                src: "/emojis/fire.png",
                width: 64,
                height: 64,
              },
              {
                src: "/emojis/biceps.png",
                width: 64,
                height: 64,
              },
              {
                src: "/emojis/cambalhota.png",
                width: 64,
                height: 64,
              },
              {
                src: "/emojis/cansado.png",
                width: 64,
                height: 64,
              },
              {
                src: "/emojis/carne.png",
                width: 64,
                height: 64,
              },
              {
                src: "/emojis/peso.png",
                width: 64,
                height: 64,
              },
              {
                src: "/emojis/correndo.png",
                width: 64,
                height: 64,
              }                                                             
            ]
          }
        }
        }
      }}
    />
  );
}

function MainPage(){
  return(
    <>
    <Topheader/>
    <div>
    <EmojiParticles />
    <MainText />
    <Assinar />
    <Iphone />
    </div>
    </>
    )
}

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<TelaCadastroPerseus />} />
        <Route path="/login" element={<TelaLoginPerseus />} />
      </Routes>
    </BrowserRouter>
    )
}

createRoot(document.getElementById('root')).render(
  <App />
)
