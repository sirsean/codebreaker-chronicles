import * as Phaser from 'phaser';

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
        const { width, height } = this.sys.game.config;
        const run = this.registry.get('run');

        this.targetCounters = {};
        if (run.viewRemaining) {
            Object.keys(run.summary.targets).forEach((target, i) => {
                this.targetCounters[target] = new TargetCounter(this, i * 40, 0, target);
            })
        }

        this.energyText = this.add.text(width - 50, 10, run.energy, {
            fill: '#ffc300',
            fontSize: '24px',
        }).setOrigin(1, 0);
    }

  update(time, delta) {
    const run = this.registry.get('run');
    Object.values(this.targetCounters).forEach((counter) => {
        counter.update(time, delta);
    })
    this.energyText.setText(run.energy);
  }
}