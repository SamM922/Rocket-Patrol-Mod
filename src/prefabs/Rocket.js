class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        // add object to existing scene
        scene.add.existing(this);
        this.isFiring = false;   //Track firing
        this.moveSpeed = 3;   //Speed in pixels per frame
        this.sfxRocket = scene.sound.add('sfx_rocket');
        this.sfxExplo = scene.sound.add('sfx_explosion3');
    }

    preload() {
        this.load.spritesheet('explosion2', './assets/explosion2.png', {frameWidth: 16, frameHeight: 8, startFrame: 0, endFrame: 5});
    }

    create() {
        this.anims.create({
            key: 'explode2',
            frames: this.anims.generateFrameNumbers('explosion2', { start: 0, end: 5, first: 0}),
            frameRate: 30
        });
    }

    update () {
        //Move left and right
        // 5 point mod: Allows player to control rocket while firing (Removed if !isFiring check)
        if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.moveSpeed;
        } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.x += this.moveSpeed;
        }
        //Fire button
        if(Phaser.Input.Keyboard.JustDown(keyF)) {
            if(this.isFiring == false) {
                this.isFiring = true;
                this.sfxRocket.play();
            } else {
                // Custom mod: Explode rocket if fire button hit while flying
                this.sfxExplo.play();
                this.explode();
            }
        }
        //If fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        //Reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }
    
    // Reset to bottom
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }

    explode() {
        let boom2 = this.add.sprite(this.x, this.y, 'explosion2').setOrigin(0, 0);
        boom2.anims.play('explode2');
        boom2.on('animationcomplete', () => {
            this.reset();
            boom2.destroy();
        });
    }
}