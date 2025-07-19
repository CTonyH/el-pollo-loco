class MoveableObject extends DrawableObject {
  speed = 1.2;
  otherDirection = false;
  speedY;
  acceleration = 2.5;
  energy = 100;
  coins = 0;
  bottles = 0;

  constructor() {
    super();
    this.world = world;
    this.jumpSfx = new Audio("audio/jump.mp3");
    this.hurtSfx = new Audio("audio/damage.mp3");
    this.walkSfx = new Audio("audio/walk.mp3");

    // Audio-Einstellungen
    this.jumpSfx.volume = 0.3;
    this.hurtSfx.volume = 0.4;
    this.walkSfx.volume = 0.2;
    this.walkSfx.loop = true; // Walk Sound loopen

    this.isWalking = false; // Walk-Status verfolgen
  }

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.y = 180;
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 180;
    }
  }

  isColliding(mo) {
    this.getRealFrame();
    mo.getRealFrame();
    return this.rX + this.rW > mo.rX && this.rX < mo.rX + mo.rW && this.rY + this.rH > mo.rY && this.rY < mo.rY + mo.rH;
  }

  hit() {
    console.log("MoveableObject hit() called on:", this.constructor.name);
    if (this.world.gameWon) return;
    const now = new Date().getTime();
    if (now - this.lastHit < 1000) return;
    this.energy -= 10;
    this.lastHit = now;

    if (!isMuted) {
      this.hurtSfx.currentTime = 0;
      this.hurtSfx.play().catch((e) => console.log("Hurt audio failed:", e));
    }

    if (this.energy <= 0) {
      this.energy = 0;
      this.hurtSfx.pause();
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

  startWalkSound() {
    if (!this.isWalking && !isMuted) {
      this.isWalking = true;
      this.walkSfx.currentTime = 0;
      this.walkSfx.play().catch((e) => console.log("Walk audio failed:", e));
    }
  }

  stopWalkSound() {
    if (this.isWalking) {
      this.isWalking = false;
      this.walkSfx.pause();
      this.walkSfx.currentTime = 0;
    }
  }

  jump() {
    this.speedY = 30;
    if (!isMuted) {
      this.jumpSfx.currentTime = 0;
      this.jumpSfx.play().catch((e) => console.log("Jump audio failed:", e));
    }
  }

  getRealFrame() {
    this.rX = this.x + (this.offset?.left || 0);
    this.rY = this.y + (this.offset?.top || 0);
    this.rW = this.width - ((this.offset?.left || 0) + (this.offset?.right || 0));
    this.rH = this.height - ((this.offset?.top || 0) + (this.offset?.bottom || 0));
  }
}
