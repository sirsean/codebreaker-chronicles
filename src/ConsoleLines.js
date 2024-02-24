import Phaser from 'phaser';

export default class ConsoleLines extends Phaser.GameObjects.Container {
    constructor(scene, x, y, { minDelay, maxDelay, lines, onComplete }) {
        super(scene, x, y);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.minDelay = minDelay || 1000;
        this.maxDelay = maxDelay || 3000;
        this.lines = lines;
        this.onComplete = onComplete || this.defaultOnComplete.bind(this);

        scene.add.existing(this);

        this.resultsText = this.scene.add.text(12, 24, '', {
            fill: '#ffc300',
            fontSize: '24px',
        });

        this.nextLine();
    }

    nextLine() {
        const line = this.lines.shift();
        this.resultsText.setText(this.resultsText.text + '\n' + line);
        if (this.lines.length > 0) {
            this.scene.time.delayedCall(Phaser.Math.Between(this.minDelay, this.maxDelay), this.nextLine, [], this);
        } else {
            this.scene.time.delayedCall(this.minDelay, this.onComplete, [], this.scene);
        }
    }

    defaultOnComplete() {
    }
}