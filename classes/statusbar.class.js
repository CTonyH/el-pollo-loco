/**
 * Status bar class for displaying health, coins, and bottles
 * @class StatusBar
 * @extends DrawableObject
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class StatusBar extends DrawableObject {
  /** @type {string[]} Health status bar image paths */
  IMAGES_HEALTH = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  /** @type {string[]} Coins status bar image paths */
  IMAGES_COINS_BAR = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
  ];

  /** @type {string[]} Bottles status bar image paths */
  IMAGES_BOTTLES_BAR = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
  ];

  /** @type {number} Current percentage value */
  percentage = 100;

  /**
   * Creates a new status bar instance
   * @param {string} type - Type of status bar ("health", "coins", or "bottles")
   * @param {number} x - X position of the status bar
   * @param {number} y - Y position of the status bar
   * @param {number} fill - Initial fill percentage
   */
  constructor(type, x, y, fill) {
    super();
    this.type = type;
    if (type === "coins") {
      this.images = this.IMAGES_COINS_BAR;
    } else if (type === "bottles") {
      this.images = this.IMAGES_BOTTLES_BAR;
    } else {
      this.images = this.IMAGES_HEALTH;
    }
    this.loadImages(this.images);
    this.x = x;
    this.y = y;
    this.height = 50;
    this.width = 200;
    this.setPercentage(fill);
  }

  /**
   * Sets the status bar fill percentage and updates the displayed image
   * @param {number} percentage - Percentage value from 0 to 100
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.images[this.resolveImageIndex()];
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
