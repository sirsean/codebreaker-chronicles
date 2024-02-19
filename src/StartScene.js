import * as Phaser from 'phaser';
import neon1 from './assets/img/runes/neon-1.png'
import neon2 from './assets/img/runes/neon-2.png'
import neon3 from './assets/img/runes/neon-3.png'
import neon4 from './assets/img/runes/neon-4.png'
import neon5 from './assets/img/runes/neon-5.png'
import neon6 from './assets/img/runes/neon-6.png'

export default class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        console.log('start preload');
        this.load.image('neon-1', neon1);
        this.load.image('neon-2', neon2);
        this.load.image('neon-3', neon3);
        this.load.image('neon-4', neon4);
        this.load.image('neon-5', neon5);
        this.load.image('neon-6', neon6);
    }

    create() {
        // Create a start button and add click event
        const startButton = this.add.text(100, 100, 'Start Run', {
            fill: '#ffc300',
            fontSize: '64px'
         }).setInteractive()
            .on('pointerdown', () => this.startGame());

        // Position the start button (example)
        startButton.x = this.cameras.main.centerX - startButton.width / 2;
        startButton.y = this.cameras.main.centerY - startButton.height / 2;
    }

    startGame() {
        // prep the run
        const run = this.registry.get('run');
        run.restart();

        // Start GridScene and HudScene, stop StartScene
        this.scene.start('GridScene');
        this.scene.launch('HudScene');
        this.scene.stop('StartScene');
    }
}