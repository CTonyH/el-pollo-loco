class Clouds extends MoveableObject {
  width = 600;
  height = 350;
  y = 25;

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 300;
    this.animate();
  }

  animate() {
    this.moveLeft()
  }


}
