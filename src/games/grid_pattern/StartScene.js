import * as Phaser from 'phaser';
import neon1 from '../../assets/img/runes/neon-1.png'
import neon2 from '../../assets/img/runes/neon-2.png'
import neon3 from '../../assets/img/runes/neon-3.png'
import neon4 from '../../assets/img/runes/neon-4.png'
import neon5 from '../../assets/img/runes/neon-5.png'
import neon6 from '../../assets/img/runes/neon-6.png'
import ConsoleLines from './ConsoleLines';
import Run from './Run';

const RUNS = [
    {
        seed: 'demo-1',
        maxEnergy: 200,
        numSlots: 4,
        numChoices: 3,
        viewUpcoming: 2,
        viewRemaining: true,
    },
    {
        seed: 'demo-2',
        maxEnergy: 150,
        numSlots: 4,
        numChoices: 4,
        viewUpcoming: 0,
        viewRemaining: false,
    },
    {
        seed: 'demo-3',
        maxEnergy: 100,
        numSlots: 9,
        numChoices: 6,
        viewUpcoming: 1,
        viewRemaining: true,
    },
    {
        seed: 'demo-4',
        maxEnergy: 400,
        numSlots: 16,
        numChoices: 6,
        viewUpcoming: 3,
        viewRemaining: true,
    },
];

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
        this.lines = new ConsoleLines(this, 0, 0, {
            minDelay: 100,
            maxDelay: 500,
            onComplete: this.addStartButton,
            lines: [
                '//',
                '// welcome to codebreaker-chronicles',
                '...',
                '...',
                '// try to crack the code',
                '...',
                '// each puzzle has a unique sequence',
                '// the cells rotate through the possibilities',
                '// click to guess; but be careful!',
                '...',
                '// incorrect guesses decrease your energy',
                '// correct guesses increase your energy',
                '...',
                '// you win if you guess the full sequence',
                '// you lose if you run out of energy',
                '...',
                '// good luck out there',
                '//',
            ],
        });
    }

    addStartButton() {
        this.add.text(24, this.lines.displayHeight + 50, 'Start: Demo-1', {
            fill: '#ffc300',
            fontSize: '42px'
         }).setInteractive()
            .setOrigin(0, 0)
            .on('pointerdown', () => this.startGame(0));
        this.add.text(24, this.lines.displayHeight + 100, 'Start: Demo-2', {
            fill: '#ffc300',
            fontSize: '42px'
         }).setInteractive()
            .setOrigin(0, 0)
            .on('pointerdown', () => this.startGame(1));
        this.add.text(24, this.lines.displayHeight + 150, 'Start: Demo-3', {
            fill: '#ffc300',
            fontSize: '42px'
         }).setInteractive()
            .setOrigin(0, 0)
            .on('pointerdown', () => this.startGame(2));
        this.add.text(24, this.lines.displayHeight + 200, 'Start: Demo-4', {
            fill: '#ffc300',
            fontSize: '42px'
         }).setInteractive()
            .setOrigin(0, 0)
            .on('pointerdown', () => this.startGame(3));
    }

    startGame(index) {
        // prep the run
        const run = Run.generate(RUNS[index]);
        this.registry.set('run', run);

        // Start GridScene and HudScene, stop StartScene
        this.scene.start('GridScene');
        this.scene.launch('HudScene');
        this.scene.stop('StartScene');
    }
}