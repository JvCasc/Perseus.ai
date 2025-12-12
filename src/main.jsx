import { createRoot } from 'react-dom/client'
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import './index.css'
import './header.css'
import './mainText.css'



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
    <div className = "iphone"> 
      <img src="iphone.png" />
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
          type: "text",
          options: {
            text: {
              value: ["💪", "🔥", "🥵", "🏃‍♂️", "🏋️‍♂️", "🍖", "🤸‍♀️", "⚡"],
              font: "Verdana",
              style: "",
              weight: "400",
              fill: true
            }
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
    <EmojiParticles />
    <MainText />
    <Assinar />
    <Iphone />
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <App />
)
