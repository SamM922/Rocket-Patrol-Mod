class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // Loading audio
        this.load.audio('bg_music', './assets/bgMusic.mp3'); //From Adhesive Wombat https://www.youtube.com/watch?v=0HxZn6CzOIo
        this.load.audio('sfx_select', './assets/blip_select12.wav'); //From Nathan Altice https://github.com/nathanaltice/RocketPatrol
        this.load.audio('sfx_explosion', './assets/explosion38.wav'); //From Nathan Altice https://github.com/nathanaltice/RocketPatrol
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav'); //From Nathan Altice https://github.com/nathanaltice/RocketPatrol\
        this.load.audio('sfx_explosion2', './assets/explosion1.wav');
        this.load.audio('sfx_explosion3', './assets/explosion2.wav');
        this.load.audio('sfx_explosion4', './assets/explosion3.wav');
        this.load.audio('sfx_explosion5', './assets/explosion4.wav');
    }

    create() {
        // Menu setup
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // Menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);

        // Keys for menu
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // Easy mode
            game.settings = {
                spaceshipSpeed: 3,
                saucerSpeed: 4,
                gameTimer: 60000,
                gameSpeedUp: 30000,
                faster: false
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // Hard mode
            game.settings = {
                spaceshipSpeed: 4,
                saucerSpeed: 5,
                gameTimer: 45000,
                gameSpeedUp: 22500,
                faster: false
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');    
        }
      }
}