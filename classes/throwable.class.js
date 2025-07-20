/**
 * Represents a throwable bottle object in the game
 * @class ThrowableObject
 * @extends MoveableObject
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class ThrowableObject extends MoveableObject {
  /** @type {string[]} Array of bottle rotation image paths */
  IMAGES_BOTTLE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /** @type {string[]} Array of bottle breaking/splash image paths */
  IMAGES_BROKEN = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Creates a new throwable bottle object
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   * @param {boolean} direction - Throw direction (true = left, false = right)
   * @example
   * // Create a bottle thrown to the right from position (100, 200)
   * const bottle = new ThrowableObject(100, 200, false);
   */
  constructor(x, y, direction) {
    super();
    this.loadImages(this.IMAGES_BOTTLE);
    this.loadImages(this.IMAGES_BROKEN);
    this.img = this.imageCache[this.IMAGES_BOTTLE[0]];
    this.x = x;
    this.y = y - 50;
    this.height = 100;
    this.broken = false;
    this.otherDirection = direction;
    this.throwDirection = direction;
    this.offset = {
      top: 10,
      left: 10,
      right: 10,
      bottom: 10,
    };

    this.throw();
    this.animate();
  }

  /**
   * Initiates the throwing motion of the bottle
   * Plays throw sound, applies gravity, and starts horizontal movement
   * @throws {Error} Audio playback may fail in some browsers
   * @example
   * // Bottle will automatically throw when created
   * const bottle = new ThrowableObject(100, 200, false);
   */
  throw() {
    AudioManager.safePlay("audio/bottle-throw.mp3", 0.4);

    this.speedY = 10;
    this.acceleration = 0.5;
    this.applyGravity();

    let throwSpeed = this.throwDirection ? -10 : 10;
    this.throwInterval = setInterval(() => {
      this.x += throwSpeed;
    }, 25);
  }

  /**
   * Starts the bottle rotation animation
   * Cycles through bottle rotation images continuously
   * @private
   */
  animate() {
    let i = 0;
    this.animationInterval = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_BOTTLE[i]];
      i = (i + 1) % this.IMAGES_BOTTLE.length;
    }, 100);
  }

  /**
   * Plays the bottle break sound effect
   * @private
   * @throws {Error} Audio playback may fail if audio context is not available
   */
  playBreakSound() {
    AudioManager.safePlay("audio/bottle-broke.mp3", 0.5);
  }

  /**
   * Stops all running animations and intervals
   * @private
   */
  stopAnimations() {
    clearInterval(this.throwInterval);
    clearInterval(this.animationInterval);
    clearInterval(this.gravityInterval);
  }

  /**
   * Animates the bottle breaking sequence
   * Shows splash animation and removes bottle from world when complete
   * @private
   */
  animateBreaking() {
    let i = 0;
    this.breakAnimation = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_BROKEN[i]];
      i++;
      if (i >= this.IMAGES_BROKEN.length) {
        clearInterval(this.breakAnimation);
        const index = world.throwableObjects.indexOf(this);
        if (index > -1) {
          world.throwableObjects.splice(index, 1);
        }
      }
    }, 100);
  }

  /**
   * Breaks the bottle and triggers breaking animation
   * Sets broken state, plays sound, stops movement, and starts break animation
   * @public
   */
  break() {
    this.broken = true;
    this.playBreakSound();
    this.stopAnimations();
    this.animateBreaking();
  }

  /**
   * Checks if bottle has hit the ground and breaks it if so
   * @public
   */
  checkGroundCollision() {
    if (this.y >= 320 && !this.broken) {
      this.break();
    }
  }

  /**
   * Checks if the bottle is outside the visible game area
   * @returns {boolean} True if bottle is out of bounds, false otherwise
   * @public
   */
  isOutOfBounds() {
    let cameraX = world ? world.camera_x : 0;
    let leftBound = cameraX - 200;
    let rightBound = cameraX + 720 + 200;
    return this.x < leftBound || this.x > rightBound;
  }
}
