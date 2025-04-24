class MoveableObject {
  x;
  y;
  img;
  imageCache = {};
  currentImage = 0;
  speed = 1.2;
  otherDirection = false;
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(array){
    array.forEach(path => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  moveLeft(){
    setInterval(() => {
        this.x -= this.speed;
      }, 1000 / 60);
  }
}
