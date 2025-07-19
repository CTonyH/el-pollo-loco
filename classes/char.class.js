class Char extends MoveableObject {
  width = 150;
  height = 250;
  mirrow = true;
  y = 180;
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];
  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];
  CHAR_IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];
  IMAGES_HURT = ["img/2_character_pepe/4_hurt/H-41.png", "img/2_character_pepe/4_hurt/H-42.png", "img/2_character_pepe/4_hurt/H-43.png"];
  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];
  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  world;
  speed = 10;
  rX;
  rY;
  rW;
  rH;

  offset = {
    top: 70,
    right: 30,
    bottom: 10,
    left: 20,
  };
  lastHit = 0;

  constructor(world, keyboard) {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png", 100, 200);
    this.world = world;
    this.keyboard = keyboard;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.CHAR_IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.snoreSfx = new Audio("audio/snore.mp3");
    this.snoreSfx.volume = 0.3;
    this.snoreSfx.loop = true;
    this.isSnoring = false;

    this.x = 100;
    this.y = 180;
    this.animate();
    this.applyGravity();
    this.idleTime = null;
    this.longIdleDelay = 3000;
  }

  getRealFrame() {
    this.rX = this.x + this.offset.left;
    this.rY = this.y + this.offset.top;
    this.rW = this.width - this.offset.left - this.offset.right;
    this.rH = this.height - this.offset.top - this.offset.bottom;
  }

  draw(ctx) {
    this.getRealFrame();
    super.draw(ctx);
    this.drawFramework(ctx);
  }

  animate() {
    this.movementInterval = setInterval(() => {
      if (!this.world.gameRunning) return;
      let isMoving = false;
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        isMoving = true;
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft(this.mirrow);
        isMoving = true;
      }
      if (isMoving && !this.isAboveGround()) {
        this.startWalkSound();
      } else {
        this.stopWalkSound();
      }

      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
      }
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      if (!this.world.gameRunning) return;
      if (this.isDead() && !this.deadAnimationPlayed) {
        this.deadAnimationPlayed = true;
        clearInterval(this.animationInterval);
        clearInterval(this.movementInterval);
        this.playAnimationOnce(this.CHAR_IMAGES_DEAD, () => {
          this.visible = false;
          this.gameOverScreen();
        });
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
        this.resetIdleTimer();
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
        this.resetIdleTimer();
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);
        this.resetIdleTimer();
      } else {
        this.getIdleAnimation();
      }
    }, 100);
  }

  resetIdleTimer() {
    this.lastMovement = new Date().getTime();
    this.idleTime = null;
  }

  triggerDeathAnimation() {
    if (this.deadAnimationPlayed) return;
    this.deadAnimationPlayed = true;
    clearInterval(this.animationInterval);
    clearInterval(this.movementInterval);
    this.playAnimationOnce(this.CHAR_IMAGES_DEAD, () => {
      this.visible = false;
      this.gameOverScreen();
    });
  }

  getIdleAnimation() {
    const now = Date.now();
    if (!this.idleTime) {
      this.idleTime = now;
      this.playAnimation(this.IMAGES_IDLE);
      this.stopSnoreSound(); 
    } else if (now - this.idleTime >= this.longIdleDelay) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
      this.startSnoreSound();
    } else {
      this.playAnimation(this.IMAGES_IDLE);
      this.stopSnoreSound();
    }
  }

  playAnimationOnce(images, onComplete) {
    let i = 0;
    let interval = setInterval(() => {
      if (i < images.length) {
        let path = images[i];
        this.img = this.imageCache[path];
        i++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 100);
  }

  startSnoreSound() {
    if (!this.isSnoring && !isMuted) {
      this.isSnoring = true;
      this.snoreSfx.currentTime = 0;
      this.snoreSfx.play().catch((e) => console.log("Snore audio failed:", e));
    }
  }

  stopSnoreSound() {
    if (this.isSnoring) {
      this.isSnoring = false;
      this.snoreSfx.pause();
      this.snoreSfx.currentTime = 0;
    }
  }

  gameOverScreen() {
    if (this.world && this.world.stopGame) {
      this.world.stopGame();
    }
    this.stopSnoreSound();
    if (this.world && this.world.playGameOverSound) {
      this.world.playGameOverSound();
    }
    if (this.world && this.world.stopBackgroundMusic) {
      this.world.stopBackgroundMusic();
    }

    showGameOver();
    document.getElementById("restart-button").style.display = "block";
    document.getElementById("menu-button").style.display = "block";
    document.getElementById("canvas").style.display = "none";
    document.getElementById("mute-button").style.display = "none";
  }
}
