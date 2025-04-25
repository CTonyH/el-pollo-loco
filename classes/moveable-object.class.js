class MoveableObject {
  x;
  y;
  img;
  imageCache = {};
  currentImage = 0;
  speed = 1.2;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  applyGravity() {
    setInterval(() => {
      if (this.y < 180) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
    
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(array) {
    array.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }

  playAnimation(image) {
    let i = this.currentImage % image.length;
    let path = image[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
}
