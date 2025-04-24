class Coins extends MoveableObject {
    width = 65;
    height = 60;
    IMAGES_WALKING = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
      ];
      constructor(){
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 200 + Math.random()*2000;
        this.y = 50 + Math.random()* 250;
        this.animate();
        
      }

      animate() {
        setInterval(() => {
       this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
      
}