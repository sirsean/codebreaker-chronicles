import * as Phaser from 'phaser';
import ConsoleLines from './ConsoleLines';

export default class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
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
                '$ transmission completed.',
                '.. analyzing ..',
                '>>>> You win! <<<<',
                '$ ... ',
                (run.numSlots == 1) ? `>> There was ${run.numSlots} cell in the grid <<` : `>> There were ${run.numSlots} cells in the grid <<`,
                '$ ... ',
                (run.numGuesses == 1) ? `>> You guessed ${run.numGuesses} time <<` : `>> You guessed ${run.numGuesses} times <<`,
                '$ ... ',
                '$ ... ',
                `.. efficiency rating ${(100 * run.efficiency).toFixed(2)}% ..`,
                '. . .',
                '... ...',
                `// final score: ${run.score.toFixed(0)} //`,
            ],
        });
    }

    addStartButton() {
        this.add.text(24, this.lines.displayHeight + 50, 'Play Again', {
            fill: '#ffc300',
            fontSize: '42px',
         }).setInteractive()
            .on('pointerdown', () => this.playAgain());
        
        this.add.text(24, this.lines.displayHeight + 100, 'Main Menu', {
            fill: '#ffc300',
            fontSize: '42px',
         }).setInteractive()
            .on('pointerdown', () => this.mainMenu());
    }

    playAgain() {
        // prep the run
        const run = this.registry.get('run');
        run.restart();

        // Start GridScene and HudScene, stop WinScene
        this.scene.start('GridScene');
        this.scene.stop('WinScene');
    }

    mainMenu() {
        this.scene.start('StartScene');
        this.scene.stop('WinScene');
    }
}