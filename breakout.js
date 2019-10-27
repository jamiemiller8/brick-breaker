let player, ball, violetBricks, yellowBricks, redBricks, cursors;

let gameStarted = false;

let openingText, gameOverText, playerWonText;

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
            gravity: false, 
            debug: true //allows me to see sprites' boundary boxes/outlines 
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
        immovable: true, // allows ball to not lose velocity when it hits a brick
        setXY: {
            x: 80,
            y: 140,
            stepX: 70 // length in pixels between repeated sprites on x-axis
        }
    });

    yellowBricks = this.physics.add.group({
        key: 'brick2',
        repeat: 9,
        immovable: true,
        setXY: {
            x: 80,
            y: 90,
            stepX: 70
        }
    });

    redBricks = this.physics.add.group({
        key: 'brick3',
        repeat: 9,
        immovable: true,
        setXY: {
            x: 80,
            y: 40,
            stepX: 70
        }
    });

    cursors = this.input.keyboard.createCursorKeys();

    //enables collision within the game scene so that ball and player paddle cannot move beyond screen
    player.setCollideWorldBounds(true);
    ball.setCollideWorldBounds(true);

    //defines bounch property for the ball and sets how much velocity to maintain
    // after colliding with an object
    ball.setBounce(1,1);

    //disables collision within the bottom of the game so it allows the ball to fall off screen
    this.physics.world.checkCollision.down = false;

    // tells game to execute the hitBrick function the ball collides with one of the brick groups
    this.physics.add.collider(ball, violetBricks, hitBrick, null, this);
    this.physics.add.collider(ball, yellowBricks, hitBrick, null, this);
    this.physics.add.collider(ball, redBricks, hitBrick, null, this);

    //manages collisions between the player paddle and the ball
    player.setImmovable(true);

    this.physics.add.collider(ball, player, hitPlayer, null, this);

    //shows text to tell player how to start game
    openingText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Press SPACE to start game',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '50px',
            fill: '#fff'
        }
    );
    openingText.setOrigin(0.5);

    // create 'game over' message
    gameOverText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Game Over',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '50px',
            fill: '#fff'
        }
    );
    gameOverText.setOrigin(0.5);

    // make text invisible until the player loses
    gameOverText.setVisible(false);

    //create the 'game won' message
    playerWonText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'You Won!',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '50px',
            fill: '#fff'
        }
    );
    playerWonText.setOrigin(0.5);

    // make it invisible until the player wins 
    playerWonText.setVisible(false);
}

function update() {
    // Checks if the ball left the scene which means game is over
    if (isGameOver(this.physics.world)) {
        gameOverText.setVisible(true);
        ball.disableBody(true, true);
    } else if (isWon()) {
        playerWonText.setVisible(true);
        ball.disableBody(true, true);
    } else {
        //player stays still if no key is being pressed
        player.body.setVelocityX(0);

        if (cursors.left.isDown) {
            player.body.setVelocityX(-350);
        } else if (cursors.right.isDown) {
            player.body.setVelocityX(350);
        }
        // if the game hasn't started, set X-coordinate of ball to center of player
        if (!gameStarted) {
            ball.setX(player.x);

            // if the space bar is down, it means the game has started and the ball Y-velocity is -200,
            // which sends it upwards
            if (cursors.space.isDown) {
                gameStarted = true;
                ball.setVelocityY(-200);
                openingText.setVisible(false); // start message disappears when spacebar is pressed
            }
        }
    }
}


// Checks whether Y coordinate of the ball is greater than the height of the game world,
// which lets the game know when the player has lost
function isGameOver(world) {
    return ball.body.y > world.bounds.height;
}

// Checks if the player has won by counting the amount of 'active' bricks
function isWon() {
    return violetBricks.countActive() + yellowBricks.countActive() + redBricks.countActive() === 0;
}

// if a brick is hit, make it inactive and hide it from the screen 
function hitBrick(ball, brick) {
    brick.disableBody(true, true);
    // if X-velocity of ball is 0, then giev ball a velocity depening on value of random number
    if (ball.body.velocity.x === 0) {
        randNum = Math.random();
        if (randNum >= 0.5) {
            ball.body.setVelocityX(150);
        } else {
            ball.body.setVelocityX(-150);
        }
    }
}

// when the ball hits the player paddle, the ball should move a bit faster and also dealing
// with horizontal angles depending on which side of the paddle the ball hits
function hitPlayer(ball, player) {
    // increase the velocity of the ball after it bounces
    ball.setVelocityY(ball.body.velocity.y - 5);

    let newXVelocity = Math.abs(ball.body.velocity.x) + 5;
    // if the ball is to the left of the player, ensure the X-velocity is negative
    if (ball.x < player.x) {
        ball.setVelocityX(-newXVelocity);
    } else {
        ball.setVelocityX(newXVelocity);
    }
}