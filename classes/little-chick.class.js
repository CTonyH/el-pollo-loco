/**
 * Small chicken enemy class
 * @class Chick
 * @extends MoveableObject
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class Chick extends MoveableObject {
  /** @type {number} Chick width in pixels */
  width = 45;

  /** @type {number} Chick height in pixels */
  height = 40;

  /** @type {boolean} Mirror state for sprite direction */
  mirrow = false;

  /** @type {boolean} Whether the chick has been defeated */
  defeated = false;

  /** @type {string[]} Walking animation image paths */
  IMAGES_CHICK_WALK = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /** @type {string[]} Death image paths */
  IMAGES_CHICK_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  /** @type {Object} Enemy reference */
  enemy;

  /** @type {Object} Collision detection offset values */
  offset = {
    top: 2,
    right: 5,
    bottom: 5,
    left: 3,
  };

  /**
   * Creates a new small chick enemy instance
   * Initializes chick with random position and speed
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_CHICK_WALK);
    this.loadImages(this.IMAGES_CHICK_DEAD);
    this.x = 1000 + Math.random() * 3000;
    this.y = 380;
    this.speed = 0.15 + Math.random() * 1;
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
   * Draws the chick on the canvas
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  draw(ctx) {
    this.getRealFrame();
    super.draw(ctx);
  }

  /**
   * Starts the chick's movement and animation loops
   * Sets up intervals for walking movement and sprite animation
   */
  animate() {
    setInterval(() => {
      this.moveLeft(this.mirrow);
    }, 1000 / 60);

    this.animationIntervall = setInterval(() => {
      this.playAnimation(this.IMAGES_CHICK_WALK);
    }, 200);
  }

  /**
   * Handles chick being hit/defeated
   * Stops animation, changes to death sprite, and marks for deletion
   */
  gotHit() {
    this.defeated = true;
    clearInterval(this.animationIntervall);
    this.img = this.imageCache[this.IMAGES_CHICK_DEAD];
    this.speed = 0;
    setTimeout(() => {
      this.markedForDeletion = true;
    }, 500);
  }

  /**
   * Moves the chick left if not defeated
   * Called continuously during the game loop
   */
  move() {
    if (!this.defeated) {
      this.x -= this.speed;
    }
  }
}
