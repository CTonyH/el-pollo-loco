class Chicken extends MoveableObject {
  width = 85;
  height = 80;
  mirrow = false;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGE_DEAD = [
    'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
  ];
  enemy;
  defeated = false;
  rX;
  rY;
  rW;
  rH;

  offset = {
    top: 5,
    right: 10,
    bottom: 10,
    left: 5
  };
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGE_DEAD);
    this.x = 1000 + Math.random() * 3000;
    this.y = 350;
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  getRealFrame(){
    this.rX = this.x + this.offset.left;
    this.rY = this.y + this.offset.top;
    this.rW = this.width - this.offset.left - this.offset.right;
    this.rH = this.height - this.offset.top - this.offset.bottom; 
  };

  draw(ctx){
    this.getRealFrame();
    super.draw(ctx);
    this.drawFramework(ctx);
  }

  animate() {
    setInterval(() => {
      this.moveLeft(this.mirrow);
    }, 1000 / 60);

    this.animationIntervall = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }

  gotHit() {
    this.defeated = true;
    clearInterval(this.animationIntervall);
    this.img = this.imageCache[this.IMAGE_DEAD];
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
