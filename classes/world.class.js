class World {
  level;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar("health", 10, 3, 100);
  coinsBar = new StatusBar("coins", 10, 35, 0);
  bottlesBar = new StatusBar("bottles", 10, 65, 0);
  endbossBar = new EndbossStatusbar();
  throwableObjects = [];
  world;
  gameWon = false;
  gameOver = false;
  gameRunning = true;
  bossTriggerX = 1800;

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.ctx = canvas.getContext("2d");
    this.char = new Char(this, keyboard);
    this.lastThrowTime = 0;
    this.level = level1;
    this.coinCollectSfx = new Audio("audio/collect-coin.mp3");
    this.coinCollectSfx.volume = 0.4;
    this.gameOverSfx = new Audio("audio/gameover.mp3");
    this.gameOverSfx.volume = 0.5;
    this.backgroundMusic = new Audio("audio/main-menu.mp3");
    this.backgroundMusic.volume = 0.3;
    this.backgroundMusic.loop = true;
    this.winSfx = new Audio("audio/win.mp3");
    this.winSfx.volume = 0.5;
    this.render();
    this.setWorld();
    this.run();
    this.gameOver = false;
    this.maxCoins = this.level.coins.length;
    this.maxBottles = this.level.bottles.length;
    this.endboss = this.level.enemies.find((e) => e instanceof Endboss);
    this.canThrow = true;
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
      this.bottlesBar.setPercentage(this.char.bottles * 10);
      this.canThrow = false;
      setInterval(() => {
        this.canThrow = true;
      }, 1000);
    }
  }

  checkCollisions() {
    if (!this.gameRunning) return;

    this.level.enemies.forEach((enemy) => {
      if (this.char.isColliding(enemy)) {
        console.log(`Character colliding with: ${enemy.constructor.name}`);
        const charBottom = this.char.y + this.char.height;
        const enemyTop = enemy.y;

        if (charBottom < enemyTop + 30) {
          enemy.gotHit();
          this.char.speedY = 20;
        } else {
          this.char.hit();
        }
      }
    });

    this.level.coins.forEach((coin, index) => {
      if (this.char.isColliding(coin)) {
        this.char.coins += 1;
        const percent = Math.min(100, (this.char.coins / this.maxCoins) * 100);
        this.coinsBar.setPercentage(percent);
        this.level.coins.splice(index, 1);
        if (!isMuted) {
          this.coinCollectSfx.currentTime = 0;
          this.coinCollectSfx.play().catch((e) => console.log("Coin collect audio failed:", e));
        }
      }
    });

    this.level.bottles.forEach((bottle, index) => {
      if (this.char.isColliding(bottle)) {
        this.char.bottles += 1;
        const percent = Math.min(100, (this.char.bottles / this.maxBottles) * 100);
        this.bottlesBar.setPercentage(percent);
        this.bottlesBar.setPercentage(this.char.bottles * 10);
        this.level.bottles.splice(index, 1);
      }
    });

    this.throwableObjects.forEach((bottle) => {
      if (!bottle.broken && this.endboss && bottle.isColliding(this.endboss)) {
        console.log(`Bottle hit CURRENT endboss! ID: ${this.endboss.id}, Energy: ${this.endboss.energy}`);
        const endbossInLevel = this.level.enemies.find((e) => e instanceof Endboss && e.id === this.endboss.id);
        if (endbossInLevel) {
          console.log("Confirmed: This is the current endboss in level");
          bottle.break();
          this.endboss.hit();
          this.endbossBar.setPercentage(this.endboss.energy);
          console.log(`Endboss energy after hit: ${this.endboss.energy}`);
        } else {
          console.log("ERROR: Bottle hit old endboss reference!");
        }
      }
    });
  }

  render() {
    if (!this.gameRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);

    this.addToMap(this.char);
    if (!this.bossTriggered && this.char.x >= this.bossTriggerX) {
      this.bossTriggered = true;
      this.endboss.flyIn(() => {
        this.endboss.startBehavior(this.char);
        this.bossBehaviorStarted = true;
      });
    }

    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.coinsBar);
    this.addToMap(this.bottlesBar);
    this.ctx.translate(this.camera_x, 0);
    if (this.endboss && this.endbossBar) {
      this.endbossBar.updatePosition(this.endboss);

      this.addToMap(this.endbossBar);
      this.endbossBar.setPercentage(this.endboss.energy);
    }
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
    mo.drawFramework(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  startBackgroundMusic() {
    if (!isMuted) {
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic.play().catch((e) => console.log("Background music failed:", e));
    }
  }

  stopBackgroundMusic() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
  }

  playGameOverSound() {
    if (!isMuted) {
      this.gameOverSfx.currentTime = 0;
      this.gameOverSfx.play().catch((e) => console.log("Game over audio failed:", e));
    }
  }

  playWinSound() {
    if (!isMuted) {
      this.winSfx.currentTime = 0;
      this.winSfx.play().catch((e) => console.log("Win audio failed:", e));
    }
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
    console.log("Stopping game completely...");
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
