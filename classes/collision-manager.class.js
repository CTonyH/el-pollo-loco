/**
 * Manages all collision detection logic for the game
 * @class CollisionManager
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class CollisionManager {
  /**
   * Creates a new collision manager instance
   * @constructor
   * @param {World} world - Reference to the game world
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Main collision checking method that calls all specific collision checks
   */
  checkAllCollisions() {
    if (!this.world.gameRunning) return;
    this.checkEnemyCollisions();
    this.checkCoinCollisions();
    this.checkBottleCollisions();
    this.checkThrowableCollisions();
  }

  /**
   * Checks collisions between character and enemies, handles jump kills
   */
  checkEnemyCollisions() {
    const collidingEnemies = this.world.level.enemies.filter((enemy) => this.world.char.isColliding(enemy) && !enemy.defeated);
    if (collidingEnemies.length === 0) return;

    const charData = {
      bottom: this.world.char.rY + this.world.char.rH,
      centerY: this.world.char.rY + this.world.char.rH / 2,
      isFalling: this.world.char.speedY < 0,
    };

    const jumpKill = collidingEnemies.some((enemy) => {
      const enemyTop = enemy.rY;
      const enemyCenterY = enemy.rY + enemy.rH / 2;
      const isCharAboveCenter = charData.centerY < enemyCenterY - 10;
      const isLandingOnTop = charData.bottom <= enemyTop + 20 && charData.isFalling;

      if (isLandingOnTop && isCharAboveCenter) {
        enemy.gotHit();
        this.world.char.jump();
        return true;
      }
      return false;
    });

    if (!jumpKill) {
      this.world.char.hit();
      this.world.statusBar.setPercentage(this.world.char.energy);
    }
  }

  /**
   * Checks collisions between character and coins, handles coin collection
   */
  checkCoinCollisions() {
    this.world.level.coins.forEach((coin, index) => {
      if (this.world.char.isColliding(coin)) {
        this.world.char.coins += 1;
        const percent = Math.min(100, (this.world.char.coins / this.world.maxCoins) * 100);
        this.world.coinsBar.setPercentage(percent);
        this.world.level.coins.splice(index, 1);
        AudioManager.safePlay("audio/collect-coin.mp3", 0.4);

        if (this.world.char.coins >= this.world.maxCoins && !this.world.coinBonusAwarded) {
          this.world.awardCoinCompletionBonus();
        }
      }
    });
  }

  /**
   * Checks collisions between character and bottles, handles bottle collection
   */
  checkBottleCollisions() {
    this.world.level.bottles.forEach((bottle, index) => {
      if (this.world.char.isColliding(bottle) && this.world.char.bottles < 10) {
        this.world.char.bottles += 1;
        this.world.updateBottleStatusBar();
        this.world.level.bottles.splice(index, 1);
      }
    });
  }

  /**
   * Checks collisions between thrown bottles and enemies/endboss
   */
  checkThrowableCollisions() {
    this.world.throwableObjects.forEach((bottle) => {
      if (bottle.broken) return;
      this.checkBottleEndbossCollision(bottle);
      this.checkBottleEnemyCollisions(bottle);
    });
  }

  /**
   * Checks collision between bottle and endboss
   * @param {ThrowableObject} bottle - The thrown bottle
   */
  checkBottleEndbossCollision(bottle) {
    if (this.world.endboss && bottle.isColliding(this.world.endboss)) {
      const endbossInLevel = this.world.level.enemies.find((e) => e instanceof Endboss && e.id === this.world.endboss.id);
      if (endbossInLevel) {
        bottle.break();
        this.world.endboss.hit();
        this.world.endbossBar.setPercentage(this.world.endboss.energy);
      }
    }
  }

  /**
   * Checks collision between bottle and regular enemies
   * @param {ThrowableObject} bottle - The thrown bottle
   */
  checkBottleEnemyCollisions(bottle) {
    this.world.level.enemies.forEach((enemy) => {
      if (!enemy.defeated && bottle.isColliding(enemy)) {
        bottle.break();
        enemy.gotHit();
        if (typeof AudioManager !== "undefined") {
          AudioManager.safePlay("audio/damage.mp3", 0.5);
        }
      }
    });
  }
}
