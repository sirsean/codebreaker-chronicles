import * as Phaser from 'phaser';
import neon1 from './assets/img/runes/neon-1.png'
import neon2 from './assets/img/runes/neon-2.png'
import neon3 from './assets/img/runes/neon-3.png'
import neon4 from './assets/img/runes/neon-4.png'
import neon5 from './assets/img/runes/neon-5.png'
import neon6 from './assets/img/runes/neon-6.png'
import { shuffle, wrappingSlice } from './util'

const State = Object.freeze({
  UNKNOWN: 'UNKNOWN',
  CORRECT: 'CORRECT',
  WRONG: 'WRONG',
})

class RotatingSprite extends Phaser.GameObjects.Container {
  constructor(scene, run, cellSize, x, y, target, values) {
    super(scene, x, y);

    this.cellSize = cellSize;
    this.target = target;
    this.values = shuffle(values);
    this._currentIndex = 0;
    this.delayMin = 1600;
    this.delayMax = 4500;
    this.nextDelay();
    this.state = State.UNKNOWN;

    scene.add.existing(this);

    const scale = this.cellSize / 200;

    this.symbolSprite = new Phaser.GameObjects.Sprite(scene, 0, 0);
    this.symbolSprite.setScale(scale);
    this.symbolSprite.setInteractive().setOrigin(0, 0);
    this.add(this.symbolSprite);

    this.upcomingSprites = [];
    for (let i = 0; i < run.viewUpcoming; i++) {
      const sprite = new Phaser.GameObjects.Sprite(scene, this.cellSize, i*40*scale).setOrigin(1, 0).setScale(0.2*scale);
      this.add(sprite);
      this.upcomingSprites.push(sprite);
    }

    this.cooldownStart = this.scene.time.now;
    this.cooldownCircle = new Phaser.GameObjects.Arc(scene, 5, 5, 15*scale, 360, 360, true, 0xFFC300);
    this.cooldownCircle.setOrigin(0, 0);
    this.add(this.cooldownCircle);

    this.timer = this.scene.time.delayedCall(this.delay, this.nextTexture, [], this);

    this.symbolSprite.on('pointerdown', this.onClick, this);
  }

  onClick() {
    if ((this.state == State.CORRECT) || (this.state == State.WRONG)) {
      return;
    }
    const current = this.currentValue;
    this.scene.events.emit('guess', current);
    if (current == this.target) {
      if (this.timer) {
        this.timer.remove();
        this.timer = null;
      }
      this.state = State.CORRECT;
      this.scene.events.emit('found', this.target);
    } else {
      if (this.timer) {
        this.timer.remove();
        this.timer = null;
      }
      this.state = State.WRONG;
      this.values = shuffle(this.values.filter(value => value != current));
      this.timer = this.scene.time.delayedCall(2000, this.nextTexture, [], this);
    }
  }

  get currentIndex() {
    return this._currentIndex % this.values.length;
  }

  nextTexture() {
    this._currentIndex++;
    this.state = State.UNKNOWN;
    this.nextDelay();
    this.cooldownStart = this.scene.time.now;
    this.timer = this.scene.time.delayedCall(this.delay, this.nextTexture, [], this);
  }

  nextDelay() {
    this.delay = Phaser.Math.Between(this.delayMin, this.delayMax);
  }

  get currentValue() {
    return this.values[this.currentIndex];
  }

  get currentTexture() {
    return `neon-${this.currentValue}`;
  }

  upcomingTextures() {
    return wrappingSlice(this.values, (this.currentIndex + 1) % this.values.length, this.upcomingSprites.length).map(value => `neon-${value}`);
  }

  update() {
    this.symbolSprite.setTexture(this.currentTexture);
    if (this.state == State.UNKNOWN) {
      this.setAlpha(0.55);
    } else if (this.state == State.CORRECT) {
      this.setAlpha(1);
    } else if (this.state == State.WRONG) {
      this.setAlpha(0.2);
    }

    if (this.state == State.CORRECT) {
        this.upcomingSprites.forEach(sprite => sprite.setTexture(null));
    } else {
        const textures = this.upcomingTextures();
        for (let i = 0; i < this.upcomingSprites.length; i++) {
            this.upcomingSprites[i].setTexture(textures[i]);
        }
    }

    if (this.state == State.UNKNOWN) {
      const elapsed = this.scene.time.now - this.cooldownStart;
      const remaining = this.delay - elapsed;
      const angle = remaining / this.delay * 360;
      this.cooldownCircle.setStartAngle(angle);
    } else {
      // the cooldown disappears if we're not counting down
      this.cooldownCircle.setStartAngle(360);
    }
  }

  cleanup() {
    if (this.timer) {
      this.timer.remove();
      this.timer = null;
    }
  }
}

export default class GridScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GridScene' });
  }

  preload() {
    console.log('grid preload');
  }

  create() {
    console.log('create');
    this.gameOver = false;
    const run = this.registry.get('run');

    const topBarHeight = 50;
    const gridSize = Math.ceil(Math.sqrt(run.numSlots));
    const { width, height } = this.sys.game.config;
    const screenSize = Math.min(width, height - topBarHeight);
    const cellSize = Math.min(200, screenSize / gridSize);
    this.slots = [];
    for (let i = 0; i < run.numSlots; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;

      const x = col * cellSize;
      const y = topBarHeight + row * cellSize;

      this.slots.push(new RotatingSprite(this, run, cellSize, x, y, run.targets[i], run.choices));
    }
    this.events.on('guess', this.onGuess, this)
    this.events.on('found', this.onFound, this)
    this.events.on('won', this.onWon, this)
    this.events.on('lost', this.onLost, this)
    this.events.on('shutdown', this.onShutdown, this)

    this.time.addEvent({
        delay: 500,
        loop: true,
        callback: () => this.tick(),
    })
  }

  onShutdown() {
    this.events.off('guess', this.onGuess, this)
    this.events.off('found', this.onFound, this)
    //this.events.off('won', this.onWon, this)
    //this.events.off('shutdown', this.onShutdown, this)
  }

  tick() {
      const run = this.registry.get('run');
      run.tick();

      if (run.energy <= 0) {
        this.gameOver = true;
        this.scene.scene.events.emit('lost', {});
      }
  }

  onGuess(guess) {
    const run = this.registry.get('run');
    run.guess(guess);
  }

    onFound(target) {
        const run = this.registry.get('run');
        run.found(target);
    }

  onWon() {
      this.scene.start('WinScene');
      this.scene.stop('GridScene');
      this.scene.stop('HudScene');
  }

  onLost() {
      this.scene.start('LoseScene');
      this.scene.stop('GridScene');
      this.scene.stop('HudScene');
  }

  update(time, delta) {
    this.slots.forEach(slot => slot.update());
    const won = this.slots.every(slot => slot.state == State.CORRECT);
    if (!this.gameOver && won) {
      console.log('won');
      this.gameOver = true;
      this.scene.scene.events.emit('won', {});
      /*
      const event = new CustomEvent('won', {
        detail: {
          textures: this.slots.map(slot => slot.currentTexture),
        }
      });
      window.dispatchEvent(event);
      */
    }
  }
}