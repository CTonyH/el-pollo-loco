class World {
  level = createLevel1();
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar("health", 10, 3, 100);
  coinsBar = new StatusBar("coins", 10, 35, 0);
  bottlesBar = new StatusBar("bottles", 10, 65, 0);
  endbossBar = new EndbossStatusbar();
  throwableObjects = [];
  gameOverImage = new Image();
  world;
  bossTriggered = false;
  bossTriggerX = 1800;

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.ctx = canvas.getContext("2d");
    this.char = new Char(this, keyboard);
    this.lastThrowTime = 0;

    this.render();
    this.setWorld();
    this.run();
    this.gameOverImage.onload = () => {
      this.gameOverImageLoaded = true;
    };
    this.gameOverImage.src = "img/You won, you lost/Game over A.png";
    this.gameOver = false;
    this.maxCoins = this.level.coins.length;
    this.maxBottles = this.level.bottles.length;
    this.endboss = this.level.enemies.find((e) => e instanceof Endboss);
  }

  setWorld() {
    this.char.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowableObjects();
    }, 40);
  }

  checkThrowableObjects() {
    if (this.keyboard.D && this.char.bottles > 0) {
      let direction = this.char.otherDirection ? "left" : "right";
      let bottle = new ThrowableObject(this.char.rX + 100, this.char.rY + 100, direction);
      this.throwableObjects.push(bottle);
      this.char.bottles -= 1;
      this.bottlesBar.setPercentage(this.char.bottles * 10);
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.char.isColliding(enemy)) {
        const charBottom = this.char.y + this.char.height;
        const enemyTop = enemy.y;

        if (charBottom < enemyTop + 30) {
          enemy.gotHit();
          this.char.speedY = 20;
        } else {
          this.char.hit();
          this.statusBar.setPercentage(this.char.energy);
        }
      }
    });

    this.level.coins.forEach((coin, index) => {
      if (this.char.isColliding(coin)) {
        this.char.coins += 1;
        const percent = Math.min(100, (this.char.coins / this.maxCoins) * 100);
        this.coinsBar.setPercentage(percent);
        this.level.coins.splice(index, 1);
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

    this.throwableObjects.forEach((bottle, index) => {
      this.level.enemies.forEach((enemy) => {
        if (!bottle.broken && this.level.endboss && bottle.isColliding(enemy)) {
          bottle.break();
          this.level.endboss.hit();
          enemy.gotHit();
        }
      });

      if (!bottle.broken && this.level.endboss && bottle.isColliding(this.level.endboss)) {
        bottle.break();
        this.level.endboss.hit();
      }
    });
  }

  render() {
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
    this.gameOverScreen();
    requestAnimationFrame(function () {
      self.render();
    });
  }

  gameOverScreen() {
    if (this.gameOver && this.gameOverImageLoaded) {
      this.ctx.drawImage(this.gameOverImage, this.canvas.width / 2 - 200, this.canvas.height / 2 - 100, 400, 200);

      // Zeige HTML-Buttons
      document.getElementById("game-over-screen").style.display = "block";
    }
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
}
