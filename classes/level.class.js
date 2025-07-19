/**
 * Game level class that contains all objects for a specific level
 * @class Level
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class Level {
  /** @type {MoveableObject[]} Array of enemy objects */
  enemies;

  /** @type {Cloud[]} Array of cloud objects */
  clouds;

  /** @type {BackgroundObject[]} Array of background objects */
  backgroundObjects;

  /** @type {Coin[]} Array of coin objects */
  coins;

  /** @type {Bottle[]} Array of bottle objects */
  bottles;

  /** @type {number} X coordinate where the level ends */
  level_end_x = 2250;

  /**
   * Creates a new level instance
   * @param {MoveableObject[]} enemies - Array of enemy objects
   * @param {Cloud[]} clouds - Array of cloud objects
   * @param {BackgroundObject[]} backgroundObjects - Array of background objects
   * @param {Coin[]} coins - Array of coin objects
   * @param {Bottle[]} bottles - Array of bottle objects
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}
