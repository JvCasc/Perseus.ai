import { createRoot } from 'react-dom/client'
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import './index.css'
import './header.css'
import './mainContent.css'



function Topheader(){
  return (
    <header className = "topheader"> 
      <nav className="topbar__nav"> 

        <a className="topbar__perseus" href="/">Perseus.ai</a>

        <div className="topbar__actions">
          <a className="btn btn--primary" href="/">Assinar agora</a>
          <a className="btn btn--link" href="/">Login</a>
        </div>

      </nav>
    </header>
  )
}

function MainText(){
  return(
    <section className = "mainText">
    <div className = "h1text">
      <h1>
        Faça seu treino com a ajuda da I.A e a <br />
        simplicidade do Whatsapp
      </h1>
    </div>

    </section>
  )
}

function Assinar(){
  return(
    <div className = "assinarButton">
        <a className="btn-assinar btn--primary" href="/">Assinar agora</a>
    </div>
  )
}

function Iphone(){
  return(
    <div className = "baseIphone"> 
    <div className = "iphone"> 
      <img src="iphone.png" />
    </div>
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

function App(){
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

createRoot(document.getElementById('root')).render(
  <App />
)
