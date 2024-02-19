import * as Phaser from 'phaser';

export default class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
    }

    create() {
        const banner = this.add.text(100, 100, 'You Win!', {
            fill: '#ffc300',
            fontSize: '64px',
        });
        banner.x = this.cameras.main.centerX - banner.width / 2;
        banner.y = this.cameras.main.centerY - banner.height / 2 - 100;
        // Create a start button and add click event
        const startButton = this.add.text(100, 100, 'Play Again', { fill: '#ffc300' })
            .setInteractive()
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
        this.scene.stop('WinScene');
    }
}