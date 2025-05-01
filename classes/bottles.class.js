class Bottle extends MoveableObject {
    width = 65;
    height = 60;
    rX;
    rY;
    rW;
    rH;
    offset = {
      top: 10,
      right: 0,
      bottom: 0,
      left: 10
    };
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