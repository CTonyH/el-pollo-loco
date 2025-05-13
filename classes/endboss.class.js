class Endboss extends MoveableObject {
  width = 350;
  height = 400;

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_WALK = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  rX;
  rY;
  rW;
  rH;
  offset = {
    top: 70,
    right: 30,
    bottom: 10,
    left: 20,
  };
  animationInterval;
  gameWon = false;

  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2800;
    this.y = -400;
  }

  startBehavior(char) {
    this.stopAnimation();
    this.animationInterval = setInterval(() => {
      let distance = this.x - char.x;

      if (Math.abs(distance) > 100) {
        this.playAnimation(this.IMAGES_WALK);

        // Drehrichtung abhängig von Spielerposition
        if (char.x < this.x) {
          this.otherDirection = false;
          this.moveLeft();
        } else {
          this.otherDirection = true;
          this.moveRight();
        }
      } else {
        this.playAnimation(this.IMAGES_ATTACK);
      }
    }, 150);
  }

  stopAnimation() {
    clearInterval(this.animationInterval);
  }

  getRealFrame() {
    this.rX = this.x + this.offset.left;
    this.rY = this.y + this.offset.top;
    this.rW = this.width - this.offset.left - this.offset.right;
    this.rH = this.height - this.offset.top - this.offset.bottom;
  }

  draw(ctx) {
    this.getRealFrame();
    super.draw(ctx);
    this.drawFramework(ctx);
  }

  animateAlert() {
    this.stopAnimation();
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_ALERT);
    }, 200);
  }

  flyIn(onComplete) {
    let interval = setInterval(() => {
      if (this.y < 45) {
        this.y += 5;
      } else {
        this.y = 45;
        clearInterval(interval);
        this.animateAlert();
        if (onComplete) onComplete();
      }
    }, 30);
  }

  moveLeft() {
    this.x -= 30;
  }

  moveRight() {
    this.x += 30;
  }

  hit() {
    this.energy -= 20;
    if (this.energy < 0) this.energy = 0;

    if (this.energy === 0) {
      this.die();
    }
  }

  die() {
    this.speed = 0;
    this.stopAnimation();
    this.playDeathAnimation();

    setTimeout(() => {
      this.markedForDeletion = true;
      this.gameWonScreen();
    }, this.IMAGES_DEAD.length * 150 + 200);
  }

  playDeathAnimation() {
    if (this.deathAnimation) return;

    let i = 0;
    this.deathAnimation = setInterval(() => {
      if (i < this.IMAGES_DEAD.length) {
        let imgPath = this.IMAGES_DEAD[i];
        let loadedImage = this.imageCache[imgPath];
        if (loadedImage) {
          this.img = loadedImage;
        }
        i++;
      } else {
        clearInterval(this.deathAnimation);
        this.deathAnimation = null;
      }
    }, 400);
  }

  gameWonScreen() {
    world.gameWon = true;
    document.getElementById("game-won").style.display = "block";
    document.getElementById("game-won-screen").style.display = "flex";
    document.getElementById("restart-button").style.display = "block";
    document.getElementById("menu-button").style.display = "block";
    document.getElementById("canvas").style.display = "none";
    document.getElementById("mute-button").style.display = "none";
  }
}
