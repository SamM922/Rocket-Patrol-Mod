/* Samuel Maturo
Rocket Patrol II: Fast and Angry (not Furious)
Approx. 15 hours spent
Mod list: (I will also mention the mods at their main implementation point)
    Track a high score that persists across scenes and display it in the UI (5)
    Implement the speed increase that happens after 30 seconds in the original game (5)
        In my game the speed increase happens halfway through so 30 seconds on Novice and 22.5 seconds on Expert
    Allow the player to control the Rocket after it's fired (5)
    Add your own background music to the Play scene (5)
    Implement the 'FIRE' UI text from the original game (5)
*/
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config);
// Control vars
let keyF, keyR, keyLEFT, keyRIGHT;
// UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;