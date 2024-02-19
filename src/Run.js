import seedrandom from 'seedrandom';
import { seededRandInt } from './util';

export default class Run {
    constructor({ numSlots, numChoices, viewUpcoming, viewRemaining, targets }) {
        this.numSlots = numSlots;
        this.numChoices = numChoices;
        this.viewUpcoming = viewUpcoming;
        this.viewRemaining = viewRemaining;
        this.targets = targets;
        this.numGuesses = 0;
        this.restart();
    }

    restart() {
        this.numGuesses = 0;
        this.targetsFound = this.targets.reduce((acc, target) => {
            acc[target] = 0;
            return acc;
        }, {});
    }

    get choices() {
        return Array.from({ length: this.numChoices }, (_, i) => i + 1);
    }

    get summary() {
        const targets = this.targets.reduce((acc, target) => {
            acc[target] = (acc[target] || 0) + 1;
            return acc;
        }, {});
        const remaining = Object.keys(targets).reduce((acc, target) => {
            acc[target] = targets[target] - this.targetsFound[target];
            return acc;
        }, {});
        const remainingCount = Object.values(remaining).reduce((acc, val) => acc + val, 0);
        return {
            numGuesses: this.numGuesses,
            targets,
            remaining,
            remainingCount,
        }
    }

    guess(guess) {
        this.numGuesses += 1;
    }

    found(target) {
        this.targetsFound[target] += 1;
    }

    static generate({ seed, numSlots, numChoices, viewUpcoming, viewRemaining }) {
        const rng = seedrandom(seed);
        return new Run({
            numSlots,
            numChoices,
            viewUpcoming,
            viewRemaining,
            targets: Array.from({ length: numSlots }, () => seededRandInt(rng, 1, numChoices)),
        });
    }
}