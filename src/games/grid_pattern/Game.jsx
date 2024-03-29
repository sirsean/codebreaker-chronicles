import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import * as Phaser from 'phaser';
import HudScene from './HudScene'
import GridScene from './GridScene'
import StartScene from './StartScene';
import WinScene from './WinScene';
import LoseScene from './LoseScene';

export function Game() {
  const navigate = useNavigate();
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
    const handleEscape = (event) => {
      navigate('/');
    }

    window.addEventListener('won', handleWon);
    window.addEventListener('escape', handleEscape);

    return () => {
      window.removeEventListener('won', handleWon);
      window.removeEventListener('escape', handleEscape);
    }
  }, [])

  return (
    <canvas ref={canvasRef} />
  );
}