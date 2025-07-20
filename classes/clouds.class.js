/**
 * Cloud background element class for atmospheric effects
 * @class Clouds
 * @extends MoveableObject
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class Clouds extends MoveableObject {
  /** @type {number} Cloud width in pixels */
  width = 600;

  /** @type {number} Cloud height in pixels */
  height = 350;

  /** @type {number} Y position in pixels */
  y = 25;

  /**
   * Creates a new cloud instance
   * Initializes cloud with random starting position and animation
   * @param {number} [startX] - Optional starting X position for the cloud
   */
  constructor(startX) {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = startX !== undefined ? startX : Math.random() * 300;
    this.speed = 0.15 + Math.random() * 0.3;
    this.animate();
  }

  /**
   * Starts the cloud movement animation
   * Makes the cloud move continuously to the left in a loop
   * Resets position when cloud moves off-screen
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
      this.checkReset();
    }, 1000 / 60);
  }

  /**
   * Checks if cloud has moved off-screen and resets position
   * Creates seamless looping effect
   */
  checkReset() {
    if (this.x + this.width < -200) {
      this.x = 720 + Math.random() * 300;
    }
  }
}
