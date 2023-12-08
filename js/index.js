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
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.right = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.paddle = this.add.rectangle(400, 575, 75, 10, 0xeeeeee);
  }
  update() {
    if (this.left.isDown) {
      this.paddle.x -= 2;
    }
    if (this.right.isDown) {
      this.paddle.x += 2;
    }
    this.createBounds(this.paddle);
  }
  createBounds(player) {
    if (player.x + 37.5 >= 800) {
      player.x = 800 - 37.5;
    }
    if (player.x - 37.5 <= 0) {
      player.x = 0 + 37.5;
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: BrickBreak,
};

const game = new Phaser.Game(config);
