let player, ball, violetBricks, yellowBricks, redBricks, cursors;

//Phaser.js configurations 
const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 650,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload,
        create,
        update,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: false 
        },
    }
};

//create the game instance
const game = new Phaser.Game(config);

function preload() { 
    this.load.image('ball', 'images/ball_32_32.png');
    this.load.image('paddle', 'images/paddle_128_32.png');
    this.load.image('brick1', 'images/brick1_64_32.png');
    this.load.image('brick2', 'images/brick2_64_32.png');
    this.load.image('brick3', 'images/brick3_64_32.png');
}

function create() { 
    player = this.physics.add.sprite(
        400, // x-position
        600, // y-position
        'paddle', // key of image for the sprite
    );

    ball = this.physics.add.sprite(
        400, // x-position
        565, // y-position
        'ball' // key of image for the sprite
    );

    violetBricks = this.physics.add.group({
        key: 'brick1',
        repeat: 9, // tells how many more times to create a sprite 
        setXY: {
            x: 80,
            y: 140,
            stepX: 70 // length in pixels between repeated sprites on x-axis
        }
    });

    yellowBricks = this.physics.add.group({
        key: 'brick2',
        repeat: 9,
        setXY: {
            x: 80,
            y: 90,
            stepX: 70
        }
    });

    redBricks = this.physics.add.group({
        key: 'brick3',
        repeat: 9,
        setXY: {
            x: 80,
            y: 40,
            stepX: 70
        }
    });
}

function update() { }