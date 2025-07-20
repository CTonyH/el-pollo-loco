/**
 * Collectible bottle class for power-ups
 * @class Bottle
 * @extends MoveableObject
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class Bottle extends MoveableObject {
  /** @type {number} Bottle width in pixels */
  width = 65;

  /** @type {number} Bottle height in pixels */
  height = 60;

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
    top: 10,
    right: 0,
    bottom: 0,
    left: 10,
  };

  /** @type {string[]} Array of bottle image paths */
  IMAGES_Bottles = ["img/6_salsa_bottle/1_salsa_bottle_on_ground.png", "img/6_salsa_bottle/2_salsa_bottle_on_ground.png"];

  /**
   * Creates a new collectible bottle instance
   * Initializes bottle with random position
   */
  constructor() {
    super().loadImage(this.IMAGES_Bottles[0]);
    this.loadImages(this.IMAGES_Bottles);
    this.y = 380;
    this.x = 200 + Math.random() * 2000;
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
   * Draws the bottle on the canvas
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  draw(ctx) {
    this.getRealFrame();
    super.draw(ctx);
  }
}
