/**
 * Normal sized chicken enemy class
 * @class Chicken
 * @extends MoveableObject
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class Chicken extends MoveableObject {
  /** @type {number} Chicken width in pixels */
  width = 85;

  /** @type {number} Chicken height in pixels */
  height = 80;

  /** @type {boolean} Mirror state for sprite direction */
  mirrow = false;

  /** @type {string[]} Walking animation image paths */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /** @type {string[]} Death image paths */
  IMAGE_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  /** @type {Object} Enemy reference */
  enemy;

  /** @type {boolean} Whether the chicken has been defeated */
  defeated = false;

  /** @type {number} Real frame X coordinate for collision detection */
  rX;

  /** @type {number} Real frame Y coordinate for collision detection */
  rY;

  /** @type {number} Real frame width for collision detection */
  rW;

  /** @type {number} Real frame height for collision detection */
  rH;

  /** @type {Object} Collision detection offset values */
  offset = {
    top: 5,
    right: 10,
    bottom: 10,
    left: 5,
  };

  /**
   * Creates a new chicken enemy instance
   * Initializes chicken with random position and speed
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGE_DEAD);
    this.x = 1000 + Math.random() * 3000;
    this.y = 350;
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  /**
   * Calculates the real collision frame for precise collision detection
   * Updates rX, rY, rW, rH properties based on offset values
   */
  getRealFrame() {
    this.rX = this.x + this.offset.left;
    this.rY = this.y + this.offset.top;
    this.rW = this.width - this.offset.left - this.offset.right;
    this.rH = this.height - this.offset.top - this.offset.bottom;
  }

  /**
   * Draws the chicken on the canvas
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  draw(ctx) {
    this.getRealFrame();
    super.draw(ctx);
  }

  /**
   * Starts the chicken's movement and animation loops
   * Sets up intervals for walking movement and sprite animation
   */
  animate() {
    setInterval(() => {
      this.moveLeft(this.mirrow);
    }, 1000 / 60);

    this.animationIntervall = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }

  /**
   * Handles chicken being hit/defeated
   * Stops animation, changes to death sprite, and marks for deletion
   */
  gotHit() {
    this.defeated = true;
    clearInterval(this.animationIntervall);
    this.img = this.imageCache[this.IMAGE_DEAD];
    this.speed = 0;
    setTimeout(() => {
      this.markedForDeletion = true;
    }, 500);
  }

  /**
   * Moves the chicken left if not defeated
   * Called continuously during the game loop
   */
  move() {
    if (!this.defeated) {
      this.x -= this.speed;
    }
  }
}
