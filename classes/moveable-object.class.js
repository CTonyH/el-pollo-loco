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

  /** @type {number} Timestamp of last hit taken */
  lastHit = 0;

  /** @type {boolean} Whether the object is currently walking */
  isWalking = false;

  /** @type {HTMLAudioElement} Audio element for walking sound */
  walkSound;

  /** @type {number} Interval ID for gravity effect */
  gravityInterval;

  /** @type {Object} Reference to the game world */
  world;

  /** @type {number} Real frame X position for collision detection */
  rX;

  /** @type {number} Real frame Y position for collision detection */
  rY;

  /** @type {number} Real frame width for collision detection */
  rW;

  /** @type {number} Real frame height for collision detection */
  rH;

  /**
   * Creates a new moveable object
   * Initializes audio effects and world reference
   * @constructor
   */
  constructor() {
    super();
    this.world = world;
    this.isWalking = false;
  }

  /**
   * Applies gravity effect to the object
   * Makes object fall down when above ground
   * @method
   */
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

  /**
   * Checks if object is above ground level
   * @method
   * @returns {boolean} True if object is above ground or is a throwable object
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 180;
    }
  }

  /**
   * Checks collision between this object and another moveable object
   * @method
   * @param {MoveableObject} mo - The other moveable object to check collision with
   * @returns {boolean} True if objects are colliding
   */
  isColliding(mo) {
    this.getRealFrame();
    mo.getRealFrame();
    return this.rX + this.rW > mo.rX && this.rX < mo.rX + mo.rW && this.rY + this.rH > mo.rY && this.rY < mo.rY + mo.rH;
  }

  /**
   * Checks if object can take a hit (cooldown check)
   * @method
   * @returns {boolean} True if object can take damage
   */
  canTakeHit() {
    if (this.world && this.world.gameWon) return false;
    const now = new Date().getTime();
    return now - this.lastHit >= 1000;
  }

  /**
   * Applies damage to the object and updates status bar
   * @method
   */
  applyDamage() {
    this.energy -= 10;
    this.lastHit = new Date().getTime();
    if (this.world && this.world.statusBar) {
      this.world.statusBar.setPercentage(this.energy);
    }
  }

  /**
   * Plays hurt sound effect
   * @method
   */
  playHurtSound() {
    AudioManager.safePlay("audio/damage.mp3", 0.4);
  }

  /**
   * Handles object death - sets energy to 0 and updates status bar
   * @method
   */
  handleDeath() {
    this.energy = 0;
    if (this.world && this.world.statusBar) {
      this.world.statusBar.setPercentage(0);
    }
  }

  /**
   * Makes object take damage with cooldown protection
   * @method
   */
  hit() {
    if (!this.canTakeHit()) return;
    this.applyDamage();
    this.playHurtSound();
    if (this.energy <= 0) {
      this.handleDeath();
    }
  }

  /**
   * Checks if object is currently hurt (within hurt animation timeframe)
   * @method
   * @returns {boolean} True if object was recently hit
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    return timepassed / 100 < 5;
  }

  /**
   * Checks if object is dead
   * @method
   * @returns {boolean} True if energy is 0
   */
  isDead() {
    return this.energy === 0;
  }

  /**
   * Plays animation by cycling through image array
   * @method
   * @param {string[]} image - Array of image paths for animation
   */
  playAnimation(image) {
    let i = this.currentImage % image.length;
    let path = image[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves object to the right
   * @method
   */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  /**
   * Moves object to the left
   * @method
   * @param {boolean} mirrow - Whether to mirror the object direction
   */
  moveLeft(mirrow) {
    this.x -= this.speed;
    this.otherDirection = mirrow;
  }

  /**
   * Starts playing walking sound effect in loop
   * @method
   */
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

  /**
   * Stops playing walking sound effect
   * @method
   */
  stopWalkSound() {
    if (this.isWalking && this.walkSound) {
      this.isWalking = false;
      this.walkSound.pause();
      this.walkSound.currentTime = 0;
    }
  }

  /**
   * Makes object jump with upward velocity and sound effect
   * @method
   */
  jump() {
    this.speedY = 30;
    AudioManager.safePlay("audio/jump.mp3", 0.3);
  }

  /**
   * Calculates real frame boundaries for accurate collision detection
   * Takes into account offset values for precise hitboxes
   * @method
   */
  getRealFrame() {
    this.rX = this.x + (this.offset?.left || 0);
    this.rY = this.y + (this.offset?.top || 0);
    this.rW = this.width - ((this.offset?.left || 0) + (this.offset?.right || 0));
    this.rH = this.height - ((this.offset?.top || 0) + (this.offset?.bottom || 0));
  }
}
