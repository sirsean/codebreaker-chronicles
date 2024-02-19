import * as Phaser from 'phaser';
import neon1 from './assets/img/runes/neon-1.png'
import neon2 from './assets/img/runes/neon-2.png'
import neon3 from './assets/img/runes/neon-3.png'
import neon4 from './assets/img/runes/neon-4.png'
import neon5 from './assets/img/runes/neon-5.png'
import neon6 from './assets/img/runes/neon-6.png'

class TargetCounter extends Phaser.GameObjects.Container {
    constructor(scene, x, y, target) {
        super(scene, x, y);
        scene.add.existing(this);

        this.target = target;

        this.symbolSprite = new Phaser.GameObjects.Sprite(scene, 0, 0);
        this.symbolSprite.setOrigin(0, 0);
        this.symbolSprite.setTexture(`neon-${target}`);
        this.symbolSprite.setScale(0.2);
        this.symbolSprite.setAlpha(0.5);
        this.add(this.symbolSprite);

        this.counterText = new Phaser.GameObjects.Text(scene, 0, 40, '100', {fill: '#ffc300'});
        this.counterText.setOrigin(0, 1);
        this.add(this.counterText);
    }

    update() {
        const run = this.scene.registry.get('run');
        this.counterText.setText(`${run.summary.remaining[this.target]}`);
    }
}

export default class HudScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HudScene' });
  }

  preload() {
    console.log('hud preload');
  }

  create() {
    console.log('hud create');
    const { width } = this.sys.game.config;
    const run = this.registry.get('run');

    this.targetCounters = {};
      if (run.viewRemaining) {
          const targets = Object.keys(run.summary.targets);
          for (let i = 0; i < targets.length; i++) {
              const target = targets[i];
              this.targetCounters[target] = new TargetCounter(this, width - 40, i * 40, target);
          }
      }
  }

  update(time, delta) {
    Object.values(this.targetCounters).forEach((counter) => {
        counter.update(time, delta);
    })
  }
}