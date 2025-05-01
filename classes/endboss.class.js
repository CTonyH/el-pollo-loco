class Endboss extends MoveableObject {
    width = 450;
    height = 500;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  rX;
  rY;
  rW;
  rH;
  offset = {
    top: 70,
    right: 30,
    bottom: 10,
    left: 20
  };

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 700;
    this.y = -40;
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
      this.playAnimation(this.IMAGES_WALKING);
    }, 500);
  }
}
