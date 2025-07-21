/**
 * Main game world class that manages all game objects and logic
 * @class World
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class World {
  /** @type {Level} Current game level */
  level;

  /** @type {CanvasRenderingContext2D} Canvas rendering context */
  ctx;

  /** @type {HTMLCanvasElement} Game canvas element */
  canvas;

  /** @type {Keyboard} Keyboard input handler */
  keyboard;

  /** @type {number} Camera X position for scrolling */
  camera_x = 0;

  /** @type {StatusBar} Health status bar */
  statusBar = new StatusBar("health", 10, 3, 100);

  /** @type {StatusBar} Coins status bar */
  coinsBar = new StatusBar("coins", 10, 35, 0);

  /** @type {StatusBar} Bottles status bar */
  bottlesBar = new StatusBar("bottles", 10, 65, 0);

  /** @type {EndbossStatusbar} Endboss health bar */
  endbossBar = new EndbossStatusbar();

  /** @type {ThrowableObject[]} Array of throwable bottle objects */
  throwableObjects = [];

  /** @type {World} Reference to world instance */
  world;

  /** @type {boolean} Whether the game has been won */
  gameWon = false;

  /** @type {boolean} Whether the game is over */
  gameOver = false;

  /** @type {boolean} Whether the game is currently running */
  gameRunning = true;

  /** @type {number} X position where boss fight triggers */
  bossTriggerX = 2000;

  /** @type {boolean} Whether coin completion bonus has been awarded */
  coinBonusAwarded = false;

  /** @type {Audio} Bonus sound effect for collecting all coins */
  bonusSfx;

  /**
   * Creates a new game world instance
   * @param {HTMLCanvasElement} canvas - The game canvas
   * @param {Keyboard} keyboard - The keyboard input handler
   */
  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.ctx = canvas.getContext("2d");
    this.char = new Char(this, keyboard);
    this.lastThrowTime = 0;
    this.level = level1;
    this.backgroundMusic = AudioManager.getAudio("audio/main-menu.mp3");
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = 0.15;
      this.backgroundMusic.loop = true;
    }
    this.render();
    this.setWorld();
    this.initializeStatusBars();
    this.run();
    this.gameOver = false;
    this.maxCoins = this.level.coins.length;
    this.maxBottles = this.level.bottles.length;
    this.endboss = this.level.enemies.find((e) => e instanceof Endboss);
    this.canThrow = true;
  }

  initializeStatusBars() {
    this.statusBar.setPercentage(this.char.energy);
    this.coinsBar.setPercentage(0);
    this.bottlesBar.setPercentage(0);
  }

  setWorld() {
    this.char.world = this;
  }

  run() {
    this.gameLoop = setInterval(() => {
      if (!this.gameRunning) return;
      this.checkCollisions();
      this.checkThrowableObjects();
    }, 40);
  }

  checkThrowableObjects() {
    if (!this.gameRunning) return;
    if (this.keyboard.D && this.char.bottles > 0 && this.canThrow) {
      let throwX = this.char.otherDirection ? this.char.x - 50 : this.char.x + 100;
      let bottle = new ThrowableObject(throwX, this.char.y + 100, this.char.otherDirection);
      this.throwableObjects.push(bottle);
      this.char.bottles -= 1;
      this.updateBottleStatusBar();
      this.canThrow = false;
      setTimeout(() => {
        this.canThrow = true;
      }, 500);
    }
  }

  checkEnemyCollisions() {
    const collidingEnemies = this.getCollidingEnemies();
    if (collidingEnemies.length === 0) return;

    const jumpKill = this.attemptJumpKill(collidingEnemies);
    if (!jumpKill) {
      this.char.hit();
      this.statusBar.setPercentage(this.char.energy);
    }
  }

  getCollidingEnemies() {
    return this.level.enemies.filter((enemy) => this.char.isColliding(enemy) && !enemy.defeated);
  }

  attemptJumpKill(enemies) {
    const charData = this.getCharacterData();

    for (let enemy of enemies) {
      if (this.isValidJumpKill(enemy, charData)) {
        enemy.gotHit();
        this.char.jump();
        return true;
      }
    }
    return false;
  }

  getCharacterData() {
    return {
      bottom: this.char.rY + this.char.rH,
      centerY: this.char.rY + this.char.rH / 2,
      isFalling: this.char.speedY < 0,
    };
  }

  isValidJumpKill(enemy, charData) {
    const enemyTop = enemy.rY;
    const enemyCenterY = enemy.rY + enemy.rH / 2;

    const isCharAboveCenter = charData.centerY < enemyCenterY - 10;
    const isLandingOnTop = charData.bottom <= enemyTop + 20 && charData.isFalling;

    return isLandingOnTop && isCharAboveCenter;
  }

  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.char.isColliding(coin)) {
        this.char.coins += 1;
        const percent = Math.min(100, (this.char.coins / this.maxCoins) * 100);
        this.coinsBar.setPercentage(percent);
        this.level.coins.splice(index, 1);
        AudioManager.safePlay("audio/collect-coin.mp3", 0.4);
        this.checkCoinCompletion();
      }
    });
  }

  checkCoinCompletion() {
    if (this.allCoinsCollected() && !this.coinBonusAwarded) {
      this.awardCoinCompletionBonus();
    }
  }

  allCoinsCollected() {
    return this.char.coins >= this.maxCoins;
  }

  awardCoinCompletionBonus() {
    this.coinBonusAwarded = true;
    const maxBottles = 10;
    const bottlesToAdd = Math.min(5, maxBottles - this.char.bottles);
    this.char.bottles += bottlesToAdd;
    this.updateBottleStatusBar();
    this.showCoinCompletionEffect();
    this.playBonusSound();
  }

  showCoinCompletionEffect() {
    this.showBonusMessage("🎉 ALL COINS COLLECTED! +5 BOTTLES! 🎉");
  }

  showBonusMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageElement.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: linear-gradient(45deg, gold, orange); color: white;
      padding: 20px 40px; border-radius: 15px; font-size: 24px;
      font-family: 'Fredericka', cursive; font-weight: bold;
      text-align: center; z-index: 2000; box-shadow: 0 0 30px gold;
      animation: bounce 0.6s ease-in-out, fadeOut 2s ease-in-out 1.5s forwards;
    `;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translate(-50%, -50%) translateY(0); }
        40% { transform: translate(-50%, -50%) translateY(-30px); }
        60% { transform: translate(-50%, -50%) translateY(-15px); }
      }
      @keyframes fadeOut {
        to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(messageElement);

    setTimeout(() => {
      document.body.removeChild(messageElement);
      document.head.removeChild(style);
    }, 3500);
  }

  playBonusSound() {
    AudioManager.safePlay("audio/collect-coin.mp3", 0.6);
  }

  checkBottleCollisions() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.char.isColliding(bottle) && this.char.bottles < 10) {
        this.char.bottles += 1;
        this.updateBottleStatusBar();
        this.level.bottles.splice(index, 1);
      }
    });
  }

  updateBottleStatusBar() {
    const maxBottles = 10;
    const percentage = Math.min(100, (this.char.bottles / maxBottles) * 100);
    this.bottlesBar.setPercentage(percentage);
  }

  checkThrowableCollisions() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.broken) return;

      // Check collision with endboss
      if (this.endboss && bottle.isColliding(this.endboss)) {
        const endbossInLevel = this.level.enemies.find((e) => e instanceof Endboss && e.id === this.endboss.id);
        if (endbossInLevel) {
          bottle.break();
          this.endboss.hit();
          this.endbossBar.setPercentage(this.endboss.energy);
        }
      }

      // Check collision with chickens and little chicks
      this.level.enemies.forEach((enemy) => {
        if (!enemy.defeated && bottle.isColliding(enemy)) {
          bottle.break();
          enemy.gotHit();
          if (typeof AudioManager !== "undefined") {
            AudioManager.safePlay("audio/damage.mp3", 0.5);
          }
        }
      });
    });
  }

  checkCollisions() {
    if (!this.gameRunning) return;
    this.checkEnemyCollisions();
    this.checkCoinCollisions();
    this.checkBottleCollisions();
    this.checkThrowableCollisions();
  }

  checkBossTrigger() {
    if (!this.bossTriggered && this.char.x >= this.bossTriggerX) {
      this.bossTriggered = true;
      this.endboss.flyIn(() => {
        this.endboss.startBehavior(this.char);
        this.bossBehaviorStarted = true;
      });
    }
  }

  renderStaticObjects() {
    this.addToMap(this.statusBar);
    this.addToMap(this.coinsBar);
    this.addToMap(this.bottlesBar);
  }

  renderEndbossBar() {
    if (this.endboss && this.endbossBar) {
      this.endbossBar.updatePosition(this.endboss);
      this.addToMap(this.endbossBar);
      this.endbossBar.setPercentage(this.endboss.energy);
    }
  }

  render() {
    if (!this.gameRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addToMap(this.char);
    this.checkBossTrigger();
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.ctx.translate(-this.camera_x, 0);
    this.renderStaticObjects();
    this.ctx.translate(this.camera_x, 0);
    this.renderEndbossBar();
    this.level.enemies.forEach((e) => e.move && e.move());
    this.level.enemies = this.level.enemies.filter((e) => !e.markedForDeletion);
    this.throwableObjects.forEach((bottle) => {
      bottle.checkGroundCollision();
    });
    this.ctx.translate(-this.camera_x, 0);
    let self = this;
    this.animationFrame = requestAnimationFrame(function () {
      self.render();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  startBackgroundMusic() {
    if (!isMuted && this.backgroundMusic) {
      if (this.backgroundMusic.paused) {
        // Resume if paused
        this.backgroundMusic.play().catch((e) => console.log("Background music failed:", e));
      } else if (this.backgroundMusic.currentTime === 0) {
        // Start from beginning only if not started yet
        this.backgroundMusic.play().catch((e) => console.log("Background music failed:", e));
      }
    }
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
  }

  pauseBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
  }

  playGameOverSound() {
    AudioManager.safePlay("audio/gameover.mp3", 0.5);
  }

  playWinSound() {
    AudioManager.safePlay("audio/win.mp3", 0.5);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  stopGame() {
    this.gameRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }
    if (this.char) {
      if (this.char.animationInterval) clearInterval(this.char.animationInterval);
      if (this.char.movementInterval) clearInterval(this.char.movementInterval);
      this.char.stopWalkSound();
      this.char.stopSnoreSound();
    }
    if (this.level && this.level.enemies) {
      this.level.enemies.forEach((enemy) => {
        if (enemy.animationInterval) clearInterval(enemy.animationInterval);
        if (enemy.stopEndbossSound) enemy.stopEndbossSound();
      });
    }
    this.stopBackgroundMusic();
  }
}
