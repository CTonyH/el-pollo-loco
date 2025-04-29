class Bottle extends MoveableObject {
    width = 65;
    height = 60;

    IMAGES_Bottles = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
      ]

      constructor(){
        super().loadImage(this.IMAGES_Bottles[0]);
        this.loadImages(this.IMAGES_Bottles);
        this.y = 380;
        this.x = 200 + Math.random()*2000;
      }
    
}