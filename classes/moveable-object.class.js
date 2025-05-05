class MoveableObject extends DrawableObject {
  speed = 1.2;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  coins = 0;
  bottles = 0;

  applyGravity() {
    console.log("applyGravity läuft");
    setInterval(() => {
      if (this.y < 180 || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        console.log("das ist this.y", this.y);
        if (this.y >= 180) {
          this.y = 180;
          this.speedY = 0;
        }
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < 180;
  }

  isColliding(mo) {
    this.getRealFrame();
    mo.getRealFrame();
    return this.rX + this.rW > mo.rX &&
           this.rX < mo.rX + mo.rW &&
           this.rY + this.rH > mo.rY &&
           this.rY < mo.rY + mo.rH;
  }

  hit() {
    const now = new Date().getTime();
    if (now - this.lastHit < 1000) return;
    
    this.energy -= 10;
    this.lastHit = now;

    if (this.energy <= 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    return timepassed / 100 < 5;
  }

  isDead() {
    return this.energy === 0;
  }

  playAnimation(image) {
    let i = this.currentImage % image.length;
    let path = image[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  moveLeft(mirrow) {
    this.x -= this.speed;
    this.otherDirection = mirrow;
  }

  jump() {
    this.speedY = 30;
  }

  getRealFrame() {
    this.rX = this.x + (this.offset?.left || 0);
    this.rY = this.y + (this.offset?.top || 0);
    this.rW = this.width - ((this.offset?.left || 0) + (this.offset?.right || 0));
    this.rH = this.height - ((this.offset?.top || 0) + (this.offset?.bottom || 0));
  }
  
}
