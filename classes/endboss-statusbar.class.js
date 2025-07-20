/**
 * Endboss health status bar class
 * @class EndbossStatusbar
 * @extends DrawableObject
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class EndbossStatusbar extends DrawableObject {
  /** @type {string[]} Endboss health bar image paths */
  IMAGES = [
    "img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
  ];

  /** @type {number} Current percentage value */
  percentage;

  /**
   * Creates a new endboss status bar instance
   * Initializes the status bar with full health
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
    this.width = 120;
    this.height = 30;
  }

  /**
   * Sets the status bar fill percentage (deprecated method)
   * @deprecated Use setPercentage instead
   * @param {number} percentage - Percentage value from 0 to 100
   */
  setpercentage(percentage) {
    this.percentage = percentage;
    let index = Math.floor(percentage / 20);
    if (index > 5) index = 5;
    this.img = this.imageCache[this.IMAGES[index]];
  }

  /**
   * Updates the position of the status bar relative to the boss
   * @param {Object} boss - The endboss object to position relative to
   */
  updatePosition(boss) {
    this.x = boss.x + boss.width / 2 - this.width / 2;
    this.y = boss.y;
  }

  /**
   * Sets the status bar fill percentage and updates the displayed image
   * @param {number} percentage - Percentage value from 0 to 100
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves which image index to use based on current percentage
   * @returns {number} Image array index (0-5)
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
