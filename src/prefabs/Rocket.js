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
}