class Coins extends MoveableObject {
  width = 65;
  height = 60;
  IMAGES_Coins = [
    "img/8_coin/coin_1.png", 
    "img/8_coin/coin_2.png"
  ];

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
}
