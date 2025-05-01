class World {
  char = new Char();
  level = level1;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar("health", 10, 3, 100);
  coinsBar = new StatusBar("coins", 10, 35, 0);
  bottlesBar = new StatusBar("bottles", 10, 65, 0);
  throwableObjects = [];
  gameOverImage = new Image();
 

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
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
  }

  setWorld() {
    this.char.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowableObjects();
    }, 200);
  }

  checkThrowableObjects() {
    if (this.keyboard.D && this.char.bottles > 0) {
      let bottle = new ThrowableObject(this.char.x + 100, this.char.y + 100);
      this.throwableObjects.push(bottle);
      this.char.bottles -= 1;
      this.bottlesBar.setPercentage(this.char.bottles * 10);
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.char.isColliding(enemy)) {
        const charBottom = this.char.rY + this.char.rH;
        const enemyTop = enemy.y + 20;
        if (charBottom - 20 < enemyTop && this.char.speedY < 0) {
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
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.coinsBar);
    this.addToMap(this.bottlesBar);
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.char);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.enemies);
    this.level.enemies.forEach((e) => e.move && e.move());
    this.level.enemies = this.level.enemies.filter((e) => !e.markedForDeletion);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
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
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(this.canvas.width / 2 - 75, this.canvas.height / 2 + 170, 150, 40);
      this.ctx.fillStyle = "white";
      this.ctx.font = "20px Fredericka";
      this.ctx.fillText("Restart", this.canvas.width / 2 - 35, this.canvas.height / 2 + 198);

      this.registerRestartClick();
      return;
    }
  }

  registerRestartClick() {
    if (this.restartClickRegistered) return;
    this.restartClickRegistered = true;

    this.canvas.addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const btnX = this.canvas.width / 2 - 75;
      const btnY = this.canvas.height / 2 + 170;
      const btnW = 150;
      const btnH = 40;

      if (x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH) {
        location.reload();
      }
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

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.rW, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
