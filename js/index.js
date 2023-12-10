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

class BrickBreak extends Phaser.Scene {
  constructor() {
    super();
  }
  preload() {
    this.load.image("background", "img/granite.jpg");
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

    // Paddle
    this.paddle = this.add.rectangle(400, 575, 75, 10, 0xaaaaaa);
    this.paddleSpeed = 3;

    // Ball
    this.BALL_MAX_SPEED = 5;

    this.ball = this.add.circle(this.paddle.x, this.paddle.y - 10, 5, 0xffffff);
    this.ball.setCircle(5);
    console.log(this.ball);
    this.isBallLaunched = false;
    this.ballVelocity = new Phaser.Math.Vector2(0, 0);
    this.ballAcceleration = 3;
    this.ballDirection = new Phaser.Math.Vector2(0, -1);
  }
  update() {
    if (this.left.isDown) {
      this.paddle.x -= this.paddleSpeed;
      if (this.isBallLaunched === false) {
        this.ballDirection.x = -1;
      }
    }
    if (this.right.isDown) {
      this.paddle.x += this.paddleSpeed;
      if (this.isBallLaunched === false) {
        this.ballDirection.x = 1;
      }
    }
    this.createBounds(this.paddle, this.ball, this.ballDirection);
    this.ballLaunchControls(this.ball, this.paddle);
    if (this.isBallLaunched === true) {
      this.ball.x += this.ballDirection.x * this.ballAcceleration;
      this.ball.y += this.ballDirection.y * this.ballAcceleration;
    }
  }
  createBounds(player, ball, ballDirection) {
    if (player.x + 37.5 >= 800) {
      player.x = 800 - 37.5;
    } else if (player.x - 37.5 <= 0) {
      player.x = 0 + 37.5;
    }
    if (ball.x - 5 <= 0) {
      ballDirection.x = 1;
    } else if (ball.x + 5 >= 800) {
      ballDirection.x = -1;
    }
    if (ball.y - 5 <= 0) {
      ballDirection.y = 1;
    }
  }
  ballLaunchControls(ball, player) {
    if (this.spacebar.isDown) {
      this.isBallLaunched = true;
    } else if (this.isBallLaunched === false) {
      ball.x = player.x;
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "matter",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: BrickBreak,
};

const game = new Phaser.Game(config);
