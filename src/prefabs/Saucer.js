// 15 point mod: New type of shootable ship
class Saucer extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.saucerSpeed;
    }

    update() {
        // Movement
        if (game.settings.faster == true) {
            this.x -= this.moveSpeed + 1;
        } else {
            this.x -= this.moveSpeed;
        }
        // Wrap around
        if (this.x <= 0 - this.width) {
            this.reset();
        }
    }

    reset() {
        this.x = game.config.width;
    }
}