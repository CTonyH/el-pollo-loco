/**
 * Collectible coin class for score and progression
 * @class Coins
 * @extends MoveableObject
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class Coins extends MoveableObject {
  /** @type {number} Coin width in pixels */
  width = 65;

  /** @type {number} Coin height in pixels */
  height = 60;

  /** @type {string[]} Coin animation image paths */
  IMAGES_Coins = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

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
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  };

  /**
   * Creates a new collectible coin instance
   * Initializes coin with random position and starts animation
   */
  constructor() {
    super().loadImage(this.IMAGES_Coins[0]);
    this.loadImages(this.IMAGES_Coins);
    this.x = 200 + Math.random() * 2000;
    this.y = 50 + Math.random() * 250;
    this.animate();
  }

  /**
   * Starts the coin spinning animation
   * Continuously cycles through coin animation frames
   */
  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_Coins);
    }, 200);
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
   * Draws the coin on the canvas
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  draw(ctx) {
    this.getRealFrame();
    super.draw(ctx);
  }
}
