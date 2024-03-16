import * as Phaser from 'phaser';
import ConsoleLines from './ConsoleLines';

export default class LoseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoseScene' });
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
        const buttons = [
            { text: 'Play Again', fn: () => this.startGame() },
            { text: 'Main Menu', fn: () => this.mainMenu() },
        ];
        buttons.forEach((b, i) => {
            this.add.text(24, this.lines.displayHeight + 50 * (i + 1), b.text, {
                fill: '#ffc300',
                fontSize: '42px',
            }).setInteractive()
                .on('pointerdown', () => b.fn());
        });
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

    mainMenu() {
        this.scene.start('StartScene');
        this.scene.stop('LoseScene');
    }
}