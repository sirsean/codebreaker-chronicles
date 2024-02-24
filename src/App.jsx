import { useEffect, useRef, useState } from 'react'
import * as Phaser from 'phaser';
import './App.css'
import HudScene from './HudScene'
import GridScene from './GridScene'
import StartScene from './StartScene';
import WinScene from './WinScene';
import LoseScene from './LoseScene';

function Game() {
  const [game, setGame] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef) {
      const g = new Phaser.Game({
        type: Phaser.WEBGL,
        width: window.innerWidth,
        height: window.innerHeight,
        canvas: canvasRef.current,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0 },
            debug: false
          }
        },
        scene: [
          StartScene,
          WinScene,
          LoseScene,
          GridScene,
          HudScene,
        ],
      });
      setGame(g);
    }
    return () => {
      if (game) {
        game.destroy();
      }
      setGame(null);
    }
  }, [])

  useEffect(() => {
    const handleWon = (event) => {
      console.log(event);
    }

    window.addEventListener('won', handleWon);

    return () => {
      window.removeEventListener('won', handleWon);
    }
  }, [])

  return (
    <canvas ref={canvasRef} />
  )
}

function App() {
  return (
    <>
      <Game />
    </>
  )
}

export default App
