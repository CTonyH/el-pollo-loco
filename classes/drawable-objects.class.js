class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  // x = 120;
  // y = 280;
  height = 150;
  width = 100;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  loadImages(array) {
    array.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  } 

    drawFramework(ctx) {
    if (this instanceof Char || this instanceof Chicken || this instanceof Endboss || this instanceof Coins || this instanceof Bottle) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "red";
      ctx.rect(this.rX, this.rY, this.rW, this.rH);
      ctx.stroke();
    }
  }
}
