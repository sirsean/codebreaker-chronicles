import { useEffect, useRef, useState } from 'react'
import * as Phaser from 'phaser';
import background1 from './assets/img/background/background-1.png'
import './App.css'
import Run from './Run'
import HudScene from './HudScene'
import GridScene from './GridScene'
import StartScene from './StartScene';
import WinScene from './WinScene';

function Game({ run }) {
  if (!run) {
    return null;
  }
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
          GridScene,
          HudScene,
        ],
      });
      g.registry.set('run', run);
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
  const run = Run.generate({
    seed: 12345,
    numSlots: 48,
    numChoices: 6,
    viewUpcoming: 2,
    viewRemaining: true,
  });
  return (
    <>
      <Game run={run} />
    </>
  )
}

export default App
