import seedrandom from 'seedrandom';
import { seededRandInt } from './util';

export default class Run {
    constructor({ maxEnergy, numSlots, numChoices, viewUpcoming, viewRemaining, targets }) {
        this.maxEnergy = maxEnergy;
        this.numSlots = numSlots;
        this.numChoices = numChoices;
        this.viewUpcoming = viewUpcoming;
        this.viewRemaining = viewRemaining;
        this.targets = targets;
        this.energy = 0;
        this.numGuesses = 0;
        this.restart();
    }

    restart() {
        this.energy = this.maxEnergy;
        this.numGuesses = 0;
        this.targetsFound = this.targets.reduce((acc, target) => {
            acc[target] = 0;
            return acc;
        }, {});
    }

    get choices() {
        return Array.from({ length: this.numChoices }, (_, i) => i + 1);
    }

    get efficiency() {
        return this.numSlots / this.numGuesses;
    }

    get score() {
        // Base Score Calculation: simple linear relation to numCells
        const baseScorePerCell = 25; // Points per cell, adjust as needed
        const baseScore = this.numSlots * baseScorePerCell;
        
        // Efficiency Factor: numCells / numGuesses
        // Prevent division by zero in case of no guesses
        const efficiency = this.numGuesses > 0 ? this.numSlots / this.numGuesses : 0;
    
        // Efficiency Factor: Adjust this formula as needed to balance your game
        const efficiencyBonus = efficiency * 50; // Adjust multiplier for balancing
        
        // Energy Bonus: directly proportional to the remaining energy
        const energyBonus = this.energy * 2; // Adjust multiplier for balancing
    
        // Final Score
        const score = baseScore * efficiencyBonus + energyBonus;
    
        return Math.round(score); // Returning the score rounded to the nearest integer
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
        this.energy -= 20;
        this.numGuesses += 1;
    }

    found(target) {
        this.energy += 50;
        this.targetsFound[target] += 1;
    }

    tick() {
        this.energy -= 1;
    }

    static generate({ seed, maxEnergy, numSlots, numChoices, viewUpcoming, viewRemaining }) {
        const rng = seedrandom(seed);
        return new Run({
            maxEnergy,
            numSlots,
            numChoices,
            viewUpcoming,
            viewRemaining,
            targets: Array.from({ length: numSlots }, () => seededRandInt(rng, 1, numChoices)),
        });
    }
}