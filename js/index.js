// class Example extends Phaser.Scene {
//   constructor() {
//     super();
//   }

//   preload() {
//     this.load.setBaseURL("https://labs.phaser.io");

//     this.load.image("sky", "assets/skies/space3.png");
//     this.load.image("logo", "assets/sprites/phaser3-logo.png");
//     this.load.image("red", "assets/particles/red.png");
//   }

//   create() {
//     this.add.image(400, 300, "sky");

//     const particles = this.add.particles(0, 0, "red", {
//       speed: 100,
//       scale: { start: 1, end: 0 },
//       blendMode: "ADD",
//     });

//     const logo = this.physics.add.image(400, 100, "logo");

//     logo.setVelocity(100, 200);
//     logo.setBounce(1, 1);
//     logo.setCollideWorldBounds(true);

//     particles.startFollow(logo);
//   }
// }

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

class BrickBreak extends Phaser.Scene {
  hsv;
  constructor() {
    super();
  }
  preload() {
    this.load.image("background", "img/granite.jpg");
    this.load.image("ball", "img/ball.png");
    this.load.image("paddle", "img/paddle.png");
    this.load.image("brick", "img/brick.png");
  }
  create() {
    this.background = this.add.image(400, 300, "background");
    this.background.scaleX = 0.25;
    this.background.scaleY = 0.25;

    // Keyboard Controls
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.right = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.physics.world.setBounds(0, 0, 800, 600, true, true, true, false);
    this.physics.world.setBounds(0, 0, 800, 600, true, true, true, false);

    // Paddle
    this.paddle = this.physics.add.image(400, 575, "paddle");
    this.paddleSpeed = 250;
    this.paddle.setCollideWorldBounds(true);
    this.paddle.body.immovable = true;

    // Ball
    this.BALL_MAX_SPEED = 5;
    this.ball = this.physics.add.image(
      this.paddle.x,
      this.paddle.y - 10,
      "ball"
    );
    this.ball.setCircle(5);
    this.ball.setBounce(1, 1);
    this.ball.setCollideWorldBounds(true, this.ballSpeed, this.ballSpeed);
    this.ball.width = 10;
    this.ball.height = 10;
    this.isBallLaunched = false;
    this.isBallAlive = true;
    this.ballSpeed = 200;
    this.ballDirection = new Phaser.Math.Vector2(0, -1);

    // Bricks
    const group = this.physics.add.group({
      key: ["brick"],
      frame: [0],
      repeat: 399,
    });

    Phaser.Actions.GridAlign(group.getChildren(), {
      width: 20,
      height: 20,
      cellWidth: 40,
      cellHeight: 15,
      x: 0,
      y: 0,
    });
    this.hsv = Phaser.Display.Color.HSVColorWheel();

    group.getChildren().forEach((child) => {
      const tint = this.hsv[getRandomInt(0, 256)];
      child.setTint(tint.color);
      child.body.immovable = true;
    });

    //Collision
    this.physics.add.collider(this.paddle, this.ball);
    this.physics.add.collider(group.getChildren(), this.ball);

    //UI
  }
  update() {
    if (this.left.isDown) {
      // this.paddle.x -= this.paddleSpeed;
      this.paddle.body.setVelocityX(-this.paddleSpeed);
      if (this.isBallLaunched === false) {
        this.ball.body.setVelocityX(-this.ballSpeed);
      }
    } else if (this.right.isDown) {
      // this.paddle.x += this.paddleSpeed;
      this.paddle.body.setVelocityX(this.paddleSpeed);
      if (this.isBallLaunched === false) {
        this.ball.body.setVelocityX(this.ballSpeed);
      }
    } else {
      this.paddle.body.setVelocityX(0);
      if (this.isBallLaunched === false) {
        this.ball.body.setVelocityX(0);
      }
    }
    this.checkBottomBounds(this.ball);
    this.ballLaunchControls(this.ball, this.paddle);
  }
  checkBottomBounds(ball) {
    if (ball.y - 5 >= 600) {
      ball.destroy();
    }
  }
  ballLaunchControls(ball, player) {
    if (this.spacebar.isDown) {
      ball.body.setVelocityY(-this.ballSpeed);
      this.isBallLaunched = true;
    } else if (this.isBallLaunched === false) {
      ball.x = player.x;
    }
  }
}

// game is set for 600 height but has extra for hud
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 625,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      // debug: true,
    },
  },
  scene: BrickBreak,
};

const game = new Phaser.Game(config);
