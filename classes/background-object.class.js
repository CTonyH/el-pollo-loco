/**
 * Background object class for static background elements
 * @class BackgroundObject
 * @extends MoveableObject
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class BackgroundObject extends MoveableObject {
  /** @type {number} Background object width in pixels */
  width = 720;

  /** @type {number} Background object height in pixels */
  height = 480;

  /**
   * Creates a new background object
   * @param {string} imagePath - Path to the background image
   * @param {number} x - X position of the background object
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
