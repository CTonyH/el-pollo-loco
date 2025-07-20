/**
 * Base class for all moveable game objects
 * @class MoveableObject
 * @extends DrawableObject
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class MoveableObject extends DrawableObject {
  /** @type {number} Movement speed in pixels */
  speed = 1.2;

  /** @type {boolean} Whether object faces the other direction */
  otherDirection = false;

  /** @type {number} Vertical speed for jumping/falling */
  speedY;

  /** @type {number} Gravity acceleration */
  acceleration = 2.5;

  /** @type {number} Health/energy points */
  energy = 100;

  /** @type {number} Number of collected coins */
  coins = 0;

  /** @type {number} Number of collected bottles */
  bottles = 0;

  /**
   * Creates a new moveable object
   * Initializes audio effects and world reference
   */
  constructor() {
    super();
    this.world = world;
    this.isWalking = false;
  }

  applyGravity() {
    this.gravityInterval = setInterval(() => {
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

  canTakeHit() {
    if (this.world && this.world.gameWon) return false;
    const now = new Date().getTime();
    return now - this.lastHit >= 1000;
  }

  applyDamage() {
    this.energy -= 10;
    this.lastHit = new Date().getTime();
    if (this.world && this.world.statusBar) {
      this.world.statusBar.setPercentage(this.energy);
    }
  }

  playHurtSound() {
    AudioManager.safePlay("audio/damage.mp3", 0.4);
  }

  handleDeath() {
    this.energy = 0;
    if (this.world && this.world.statusBar) {
      this.world.statusBar.setPercentage(0);
    }
  }

  hit() {
    if (!this.canTakeHit()) return;
    this.applyDamage();
    this.playHurtSound();
    if (this.energy <= 0) {
      this.handleDeath();
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
      this.walkSound = AudioManager.getAudio("audio/walk.mp3");
      if (this.walkSound) {
        this.walkSound.loop = true;
        this.walkSound.volume = 0.2;
        this.walkSound.currentTime = 0;
        this.walkSound.play().catch((e) => console.log("Walk audio failed:", e));
      }
    }
  }

  stopWalkSound() {
    if (this.isWalking && this.walkSound) {
      this.isWalking = false;
      this.walkSound.pause();
      this.walkSound.currentTime = 0;
    }
  }

  jump() {
    this.speedY = 30;
    AudioManager.safePlay("audio/jump.mp3", 0.3);
  }

  getRealFrame() {
    this.rX = this.x + (this.offset?.left || 0);
    this.rY = this.y + (this.offset?.top || 0);
    this.rW = this.width - ((this.offset?.left || 0) + (this.offset?.right || 0));
    this.rH = this.height - ((this.offset?.top || 0) + (this.offset?.bottom || 0));
  }
}
