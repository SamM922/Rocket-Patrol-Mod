class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
        this.highScore = 0;
    }

    preload() {
        // Load image and bg sprites
        // All sprites from Nathan Altice https://github.com/nathanaltice/RocketPatrol
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('saucer', './assets/saucer.png');
        this.load.image('particle', './assets/particle.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // 5 point mod: Background music
        const bgMusic = this.sound.add('bg_music', {volume: 0.5});
        bgMusic.play();
        // Add tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // Green top background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // White borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // Player rocket
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        // Add spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        this.saucer = new Saucer(this, game.config.width, borderUISize*3, 'saucer', 0, 50).setOrigin(0,0);
        // Controls
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        // The purpose of life
        this.p1Score = 0;
        // Display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.add.text(borderUISize + borderPadding + 110, borderUISize + borderPadding*2, "SCORE", scoreConfig);
        this.fireText = this.add.text(borderUISize + borderPadding + 220, borderUISize + borderPadding*2, "FIRE", scoreConfig);
        this.highScoreRight = this.add.text(borderUISize + borderPadding + 330, borderUISize + borderPadding*2, this.highScore, scoreConfig);
        this.add.text(borderUISize + borderPadding + 440, borderUISize + borderPadding*2, "BEST", scoreConfig);
        this.gameOver = false;   // Ending control
        // 60-second timer
        scoreConfig.fixedWidth = 0;
        // 5 point mod: Speed up halfway through
        this.speedClock = this.time.delayedCall(game.settings.gameSpeedUp, () => {
            game.settings.faster = true;
            console.log("Things sped up! Did you notice?");
        }, null, this);
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for the Menu', scoreConfig).setOrigin(0.5);
            // 5 point mod: High Score
            if (this.p1Score > this.highScore) {
                this.highScore = this.p1Score;
                this.add.text(game.config.width/2, game.config.height/2 + 128, 'New High Score!', scoreConfig).setOrigin(0.5)
            }
            bgMusic.stop()
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // If game over, check for restart input
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        // Check for menu input
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        // Scroll bg
        this.starfield.tilePositionX -= 2;
        if (!this.gameOver) {
            this.p1Rocket.update();   // Update rocket
            this.ship01.update();   // Update ships
            this.ship02.update();
            this.ship03.update();
            this.saucer.update();
        }
        // 5 point mod: FIRE text from original game
        if (this.p1Rocket.isFiring == true) {
            this.fireText.visible = true;
        } else {
            this.fireText.visible = false;
        }
        // Check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.saucer)) {
            this.p1Rocket.reset();
            this.shipExplode(this.saucer);
        }
    }

    checkCollision(rocket, ship) {
        // Collision detection
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // Hide
        ship.alpha = 0;
        // Add explosion
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');   //BOOM!
        // 15 point mod: Particles on explosion
        
        // 10 point mod: 4 new explosions randomized
        if (Phaser.Math.Between(1, 3) == 1) {
            this.sound.play('sfx_explosion');
        } else if (Phaser.Math.Between(1, 3) == 1) {
            this.sound.play('sfx_explosion2');
        } else if (Phaser.Math.Between(1, 3) == 1) {
            this.sound.play('sfx_explosion3');
        } else if (Phaser.Math.Between(1, 3) == 1) {
            this.sound.play('sfx_explosion4');
        } else {
            this.sound.play('sfx_explosion5')
        }
        // Reset after animation
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        // Add score and update text
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
    }
}