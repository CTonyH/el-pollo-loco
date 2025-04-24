class Chicken extends MoveableObject{
    width = 45;
    height = 40;
    IMAGES_WALKING = [
        "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
      ];


    constructor(){
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);   
        this.x = 200 + Math.random()*300;
        this.y = 375;
        this.speed = 0.15 + Math.random()*0.25;
        this.animate();
        this.moveLeft();
    }

    animate() {
        setInterval(() => {
          let i = this.currentImage % this.IMAGES_WALKING.length;
          let path = this.IMAGES_WALKING[i];
          this.img = this.imageCache[path];
          this.currentImage++;
        }, 200);
    }

}