/**
 * Main character class representing the player character Pepe
 * @class Char
 * @extends MoveableObject
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class Char extends MoveableObject {
  /** @type {number} Character width in pixels */
  width = 150;

  /** @type {number} Character height in pixels */
  height = 250;

  /** @type {boolean} Mirror state for sprite direction */
  mirrow = true;

  /** @type {number} Initial Y position */
  y = 180;

  /** @type {string[]} Walking animation image paths */
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  /** @type {string[]} Jumping animation image paths */
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

  /** @type {string[]} Death animation image paths */
  CHAR_IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  /** @type {string[]} Hurt animation image paths */
  IMAGES_HURT = ["img/2_character_pepe/4_hurt/H-41.png", "img/2_character_pepe/4_hurt/H-42.png", "img/2_character_pepe/4_hurt/H-43.png"];

  /** @type {string[]} Idle animation image paths */
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

  /** @type {string[]} Long idle animation image paths */
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

  /** @type {World} Reference to the game world */
  world;

  /** @type {number} Movement speed in pixels */
  speed = 10;

  /** @type {number} Real frame X coordinate for collision detection */
  rX;

  /** @type {number} Real frame Y coordinate for collision detection */
  rY;

  /** @type {number} Real frame width for collision detection */
  rW;

  /** @type {number} Real frame height for collision detection */
  rH;

  /** @type {Object} Collision detection offset values */
  offset = {
    top: 70,
    right: 30,
    bottom: 10,
    left: 20,
  };

  /** @type {number} Timestamp of last hit for damage cooldown */
  lastHit = 0;

  /** @type {boolean} Whether jump animation is currently playing */
  isJumpAnimationPlaying = false;

  /** @type {number} Current frame of jump animation */
  jumpAnimationFrame = 0;

  /**
   * Creates a new character instance
   * @param {World} world - The game world instance
   * @param {Keyboard} keyboard - The keyboard input handler
   */
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
    this.isSnoring = false;

    this.x = 100;
    this.y = 180;
    this.bottles = 0;
    this.coins = 0;
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
  }

  handleMovement() {
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
    this.handleWalkSound(isMoving);
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
    }
    this.world.camera_x = -this.x + 100;
  }

  handleWalkSound(isMoving) {
    if (isMoving && !this.isAboveGround()) {
      this.startWalkSound();
    } else {
      this.stopWalkSound();
    }
  }

  handleAnimationStates() {
    if (!this.world.gameRunning) return;
    if (this.isDead() && !this.deadAnimationPlayed) {
      this.handleDeathAnimation();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      this.resetIdleTimer();
    } else if (this.isAboveGround()) {
      this.handleJumpAnimation();
      this.resetIdleTimer();
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.resetJumpAnimation();
      this.playAnimation(this.IMAGES_WALKING);
      this.resetIdleTimer();
    } else if (this.world.keyboard.D) {
      this.resetJumpAnimation();
      this.resetIdleTimer();
      this.playAnimation(this.IMAGES_IDLE);
    } else {
      this.resetJumpAnimation();
      this.getIdleAnimation();
    }
  }

  handleDeathAnimation() {
    this.deadAnimationPlayed = true;
    clearInterval(this.animationInterval);
    clearInterval(this.movementInterval);
    this.playAnimationOnce(this.CHAR_IMAGES_DEAD, () => {
      this.visible = false;
      this.gameOverScreen();
    });
  }

  animate() {
    this.movementInterval = setInterval(() => this.handleMovement(), 1000 / 60);
    this.animationInterval = setInterval(() => this.handleAnimationStates(), 100);
  }

  resetIdleTimer() {
    this.lastMovement = new Date().getTime();
    this.idleTime = null;
  }

  handleJumpAnimation() {
    if (!this.isJumpAnimationPlaying) {
      this.isJumpAnimationPlaying = true;
      this.jumpAnimationFrame = 0;
    }

    if (this.jumpAnimationFrame < this.IMAGES_JUMPING.length) {
      let path = this.IMAGES_JUMPING[this.jumpAnimationFrame];
      this.img = this.imageCache[path];
      this.jumpAnimationFrame++;
    } else {
      let path = this.IMAGES_JUMPING[this.IMAGES_JUMPING.length - 1];
      this.img = this.imageCache[path];
    }
  }

  resetJumpAnimation() {
    this.isJumpAnimationPlaying = false;
    this.jumpAnimationFrame = 0;
  }

  jump() {
    this.speedY = 30;
    AudioManager.safePlay("audio/jump.mp3", 0.3);
    this.resetJumpAnimation();
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
      this.snoreSound = AudioManager.getAudio("audio/snore.mp3");
      if (this.snoreSound) {
        this.snoreSound.loop = true;
        this.snoreSound.volume = 0.3;
        this.snoreSound.currentTime = 0;
        this.snoreSound.play().catch((e) => console.log("Snore audio failed:", e));
      }
    }
  }

  stopSnoreSound() {
    if (this.isSnoring && this.snoreSound) {
      this.isSnoring = false;
      this.snoreSound.pause();
      this.snoreSound.currentTime = 0;
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
