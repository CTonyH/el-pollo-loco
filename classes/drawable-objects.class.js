/**
 * Base class for all drawable game objects
 * @class DrawableObject
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class DrawableObject {
  /** @type {Image} Current image object */
  img;
  
  /** @type {Object} Cache for loaded images */
  imageCache = {};
  
  /** @type {number} Current image index for animations */
  currentImage = 0;
  
  /** @type {number} X position in pixels */
  x = 120;
  
  /** @type {number} Y position in pixels */
  y = 280;
  
  /** @type {number} Object height in pixels */
  height = 150;
  
  /** @type {number} Object width in pixels */
  width = 100;

  /**
   * Loads a single image from the given path
   * @param {string} path - Path to the image file
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the object on the canvas
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Loads multiple images into the cache
   * @param {string[]} array - Array of image paths to load
   */
  loadImages(array) {
    array.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  } 

  /**
   * Draws a debug framework around collision-enabled objects
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @private
   */
  drawFramework(ctx) {
    if (this instanceof Char || this instanceof Chicken || this instanceof Endboss || this instanceof Coins || this instanceof Bottle) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "red";
      ctx.rect(this.rX, this.rY, this.rW, this.rH);
      ctx.stroke();
    }
  }
}
