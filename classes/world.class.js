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
  world;

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.ctx = canvas.getContext("2d");
    this.char = new Char(this);
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
    }, 40);
  }

  checkThrowableObjects() {
    if (this.keyboard.D && this.char.bottles > 0) {
      let bottle = new ThrowableObject(this.char.rX + 100, this.char.rY + 100);
      this.throwableObjects.push(bottle);
      this.char.bottles -= 1;
      this.bottlesBar.setPercentage(this.char.bottles * 10);
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.char.isColliding(enemy)) {
        console.log("Collision detected");
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
        if (!bottle.broken && bottle.isColliding(enemy)) {
          bottle.break();
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
      this.ctx.fillStyle = "red";

      //Restart-Button
      const restartY = this.canvas.height / 2 + 150;
      this.ctx.fillStyle = "blue";
      this.ctx.fillRect(this.canvas.width / 2 - 75, restartY, 150, 40);
      this.ctx.fillStyle = "white";
      this.ctx.font = "20px Fredericka";
      this.ctx.fillText("Restart", this.canvas.width / 2 - 35, restartY + 28);

      //Hauptmenü-Button
      const menuY = restartY + 60;
      this.ctx.fillStyle = "blue";
      this.ctx.fillRect(this.canvas.width / 2 - 75, menuY, 150, 40);
      this.ctx.fillStyle = "white";
      this.ctx.fillText("Hauptmenü", this.canvas.width / 2 - 50, menuY + 28);

      this.registerRestartClick();
      return;
    }
  }

  registerRestartClick() {
    this.canvas.addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const restartBtn = {
        x: this.canvas.width / 2 - 75,
        y: this.canvas.height / 2 + 150,
        w: 150,
        h: 40,
      };

      const menuBtn = {
        x: this.canvas.width / 2 - 75,
        y: this.canvas.height / 2 + 210,
        w: 150,
        h: 40,
      };

      if (x >= restartBtn.x && x <= restartBtn.x + restartBtn.w && y >= restartBtn.y && y <= restartBtn.y + restartBtn.h) {
        restartGame(); // oder: this.restartGame() wenn du das als Methode möchtest
      }

      if (x >= menuBtn.x && x <= menuBtn.x + menuBtn.w && y >= menuBtn.y && y <= menuBtn.y + menuBtn.h) {
        startMenu(this.canvas);
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
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}

function startMenu(canvas) {
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "30px Fredericka";
  ctx.fillText("Willkommen zum Spiel!", canvas.width / 2 - 150, canvas.height / 2 - 50);

  ctx.fillStyle = "green";
  ctx.fillRect(canvas.width / 2 - 75, canvas.height / 2, 150, 40);
  ctx.fillStyle = "white";
  ctx.fillText("Start", canvas.width / 2 - 30, canvas.height / 2 + 30);

  canvas.addEventListener("click", handleStartClick);
}

function handleStartClick(e) {
  const canvas = e.currentTarget; // ✅ korrektes Canvas-Element aus Event
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const btnX = canvas.width / 2 - 75;
  const btnY = canvas.height / 2;
  const btnW = 150;
  const btnH = 40;

  if (x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH) {
    canvas.removeEventListener("click", handleStartClick);
    startGame();
  }
}
