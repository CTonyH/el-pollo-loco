class Coins extends MoveableObject {
  width = 65;
  height = 60;
  IMAGES_Coins = [
    "img/8_coin/coin_1.png", 
    "img/8_coin/coin_2.png"
  ];
  rX;
  rY;
  rW;
  rH;
  offset = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  };
  constructor() {
    super().loadImage(this.IMAGES_Coins[0]);
    this.loadImages(this.IMAGES_Coins);
    this.x = 200 + Math.random() * 2000;
    this.y = 50 + Math.random() * 250;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_Coins);
    }, 200);
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
}
