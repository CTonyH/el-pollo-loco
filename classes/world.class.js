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
  /** @type {Char} Main character object */
  char;
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

  /** @type {number} Timestamp of last thrown bottle */
  lastThrowTime = 0;

  /** @type {number} Maximum number of coins in the level */
  maxCoins;

  /** @type {number} Maximum number of bottles in the level */
  maxBottles;

  /** @type {Endboss} Reference to the endboss enemy */
  endboss;

  /** @type {boolean} Whether the player can throw bottles */
  canThrow = true;

  /** @type {number} Game loop interval reference */
  gameLoop;

  /** @type {number} Animation frame reference */
  animationFrame;

  /** @type {boolean} Whether the boss has been triggered */
  bossTriggered = false;

  /** @type {boolean} Whether the boss behavior has started */
  bossBehaviorStarted = false;

  /** @type {CollisionManager} Handles all collision detection */
  collisionManager;

  /** @type {GameAudioManager} Handles all game audio */
  audioManager;

  /** @type {UIManager} Handles all UI elements and messages */
  uiManager;

  /**
   * Creates a new game world instance
   * @constructor
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
    this.gameOver = false;
    this.maxCoins = this.level.coins.length;
    this.maxBottles = this.level.bottles.length;
    this.endboss = this.level.enemies.find((e) => e instanceof Endboss);
    this.canThrow = true;
    this.collisionManager = new CollisionManager(this);
    this.audioManager = new GameAudioManager(this);
    this.uiManager = new UIManager(this);

    this.audioManager.setupBackgroundMusic();
    this.initializeStatusBars();
    this.setWorld();
    this.uiManager.updateTouchControlsForGameplay();
    this.render();
    this.run();
  }

  /**
   * Initializes all status bars with their starting values
   */
  initializeStatusBars() {
    this.statusBar.setPercentage(this.char.energy);
    this.coinsBar.setPercentage(0);
    this.bottlesBar.setPercentage(0);
  }

  /**
   * Sets the world reference for the character
   */
  setWorld() {
    this.char.world = this;
  }

  /**
   * Starts the main game loop
   */
  run() {
    this.gameLoop = setInterval(() => {
      if (!this.gameRunning) return;
      this.collisionManager.checkAllCollisions();
      this.checkThrowableObjects();
    }, 40);
  }

  /**
   * Checks if player wants to throw bottles and handles bottle throwing
   */
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

  /**
   * Awards bonus bottles when all coins are collected
   */
  awardCoinCompletionBonus() {
    this.coinBonusAwarded = true;
    const maxBottles = 10;
    const bottlesToAdd = Math.min(5, maxBottles - this.char.bottles);
    this.char.bottles += bottlesToAdd;
    this.updateBottleStatusBar();
    this.uiManager.showBonusMessage("🎉 ALL COINS COLLECTED! +5 BOTTLES! 🎉");
    this.audioManager.playBonusSound();
  }

  /**
   * Updates the bottle status bar display
   */
  updateBottleStatusBar() {
    const percentage = Math.min(100, (this.char.bottles / 10) * 100);
    this.bottlesBar.setPercentage(percentage);
  }

  /**
   * Checks if character has reached boss trigger position and activates boss
   */
  checkBossTrigger() {
    if (!this.bossTriggered && this.char.x >= this.bossTriggerX) {
      this.bossTriggered = true;
      this.endboss.flyIn(() => {
        this.endboss.startBehavior(this.char);
        this.bossBehaviorStarted = true;
      });
    }
  }

  /**
   * Renders all static UI elements (status bars)
   */
  renderStaticObjects() {
    [this.statusBar, this.coinsBar, this.bottlesBar].forEach((bar) => this.addToMap(bar));
  }

  /**
   * Renders the endboss health bar when boss is active
   */
  renderEndbossBar() {
    if (this.endboss && this.endbossBar) {
      this.endbossBar.updatePosition(this.endboss);
      this.addToMap(this.endbossBar);
      this.endbossBar.setPercentage(this.endboss.energy);
    }
  }

  /**
   * Main rendering method that draws all game objects to the canvas
   * @method
   */
  render() {
    if (!this.gameRunning) return;

    this.clearAndSetupCanvas();
    this.renderAllObjects();
    this.updateGameObjects();
    this.animationFrame = requestAnimationFrame(() => this.render());
  }

  /**
   * Clears canvas and sets up camera position for rendering
   */
  clearAndSetupCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
  }

  /**
   * Renders all game objects in correct order
   */
  renderAllObjects() {
    [
      this.level.backgroundObjects,
      this.level.clouds,
      [this.char],
      this.throwableObjects,
      this.level.enemies,
      this.level.coins,
      this.level.bottles,
    ].forEach((objects) => this.addObjectsToMap(objects));

    this.checkBossTrigger();
    this.ctx.translate(-this.camera_x, 0);
    this.renderStaticObjects();
    this.ctx.translate(this.camera_x, 0);
    this.renderEndbossBar();
  }

  /**
   * Updates game objects and handles cleanup
   */
  updateGameObjects() {
    this.level.enemies.forEach((e) => e.move && e.move());
    this.level.enemies = this.level.enemies.filter((e) => !e.markedForDeletion);
    this.throwableObjects.forEach((bottle) => bottle.checkGroundCollision());
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Adds an array of objects to the map for rendering
   * @param {DrawableObject[]} objects - Array of objects to render
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  /**
   * Adds a single object to the map, handling image flipping if needed
   * @param {DrawableObject} mo - The moveable object to add to map
   */
  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /**
   * Starts playing the background music
   */
  startBackgroundMusic() {
    this.audioManager.startBackgroundMusic();
  }

  /**
   * Stops the background music
   */
  stopBackgroundMusic() {
    this.audioManager.stopBackgroundMusic();
  }

  /**
   * Gets the background music element
   */
  get backgroundMusic() {
    return this.audioManager.backgroundMusic;
  }

  /**
   * Plays the game over sound effect
   */
  playGameOverSound() {
    this.audioManager.playGameOverSound();
  }

  /**
   * Plays the win sound effect
   */
  playWinSound() {
    this.audioManager.playWinSound();
  }

  /**
   * Flips an image horizontally for rendering mirrored objects
   * @method
   * @param {DrawableObject} mo - The object to flip
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the image after flipping
   * @param {DrawableObject} mo - The object to restore
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  stopGame() {
    this.gameRunning = false;
    this.cleanupIntervals();
    this.cleanupCharacter();
    this.cleanupEnemies();
    this.audioManager.stopBackgroundMusic();
    this.uiManager.hideTouchControlsOnGameEnd();
  }

  cleanupIntervals() {
    [this.animationFrame, this.gameLoop].forEach(
      (ref) => ref && (ref === this.animationFrame ? cancelAnimationFrame(ref) : clearInterval(ref))
    );
  }

  /**
   * Cleans up character intervals and sounds
   */
  cleanupCharacter() {
    if (this.char) {
      [this.char.animationInterval, this.char.movementInterval].forEach((interval) => interval && clearInterval(interval));
      this.char.stopWalkSound();
      this.char.stopSnoreSound();
    }
  }

  /**
   * Cleans up all enemy intervals and sounds
   */
  cleanupEnemies() {
    if (this.level?.enemies) {
      this.level.enemies.forEach((enemy) => {
        if (enemy.animationInterval) clearInterval(enemy.animationInterval);
        if (enemy.stopEndbossSound) enemy.stopEndbossSound();
      });
    }
  }
}
