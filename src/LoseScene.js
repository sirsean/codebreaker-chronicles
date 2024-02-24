import * as Phaser from 'phaser';
import ConsoleLines from './ConsoleLines';

export default class LoseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoseScene' });
        this.minDelay = 250;
        this.maxDelay = 600;
        this.lines = [];
    }

    create() {
        const run = this.registry.get('run');

        this.lines = new ConsoleLines(this, 0, 0, {
            minDelay: 250,
            maxDelay: 600,
            onComplete: this.addStartButton,
            lines: [
                '$ incoming transmission ...',
                '$ ...',
                '$ ...',
                '$ ...',
                '$ transmission received.',
                '.. analyzing ..',
                '. . .',
                '... ...',
                (run.numSlots == 1) ? `>> There was ${run.numSlots} cell in the grid <<` : `>> There were ${run.numSlots} cells in the grid <<`,
                '.. .. ..',
                (run.numGuesses == 1) ? `>> You guessed ${run.numGuesses} time <<` : `>> You guessed ${run.numGuesses} times <<`,
                '... ...',
                '>>> transmission lost <<<',
                (run.summary.remainingCount == 1) ? `>> There was ${run.summary.remainingCount} cell remaining <<` : `>> There were ${run.summary.remainingCount} cells remaining <<`,
                '$ ...',
            ],
        });
    }

    addStartButton() {
        // Create a start button and add click event
        const startButton = this.add.text(100, 100, 'Play Again', {
            fill: '#ffc300',
            fontSize: '64px',
         }).setInteractive()
            .on('pointerdown', () => this.startGame());

        // Position the start button (example)
        startButton.x = this.cameras.main.centerX - startButton.width / 2;
        startButton.y = this.cameras.main.height * 0.55 - startButton.height / 2;
    }

    startGame() {
        // prep the run
        const run = this.registry.get('run');
        run.restart();

        // Start GridScene and HudScene, stop LoseScene
        this.scene.start('GridScene');
        this.scene.launch('HudScene');
        this.scene.stop('LoseScene');
    }
}