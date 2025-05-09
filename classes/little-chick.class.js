class Chick extends MoveableObject {
  width = 45;
  height = 40;
  mirrow = false;
  defeated = false;
  IMAGES_CHICK_WALK = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_CHICK_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];
  enemy;

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_CHICK_WALK);
    this.loadImages(this.IMAGES_CHICK_DEAD);
    this.x = 1000 + Math.random() * 3000;
    this.y = 380;
    this.speed = 0.15 + Math.random() * 1;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft(this.mirrow);
    }, 1000 / 60);

    this.animationIntervall = setInterval(() => {
      this.playAnimation(this.IMAGES_CHICK_WALK);
    }, 200);
  }

  gotHit() {
    this.defeated = true;
    clearInterval(this.animationIntervall);
    this.img = this.imageCache[this.IMAGES_CHICK_DEAD];
    this.speed = 0;
    setTimeout(() => {
      this.markedForDeletion = true;
    }, 500);
  }

  move() {
    if (!this.defeated) {
      this.x -= this.speed;
    }
  }
}
