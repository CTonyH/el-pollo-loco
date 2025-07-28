/**
 * Final boss enemy class - the big chicken boss
 * @class Endboss
 * @extends MoveableObject
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class Endboss extends MoveableObject {
  /** @type {number} Boss width in pixels */
  width = 350;

  /** @type {number} Boss height in pixels */
  height = 400;

  /** @type {string[]} Alert animation image paths */
  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  /** @type {string[]} Walking animation image paths */
  IMAGES_WALK = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  /** @type {string[]} Attack animation image paths */
  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  /** @type {string[]} Hurt animation image paths */
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  /** @type {string[]} Death animation image paths */
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

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

  /** @type {number} Animation interval reference */
  animationInterval;

  /** @type {boolean} Whether the game has been won */
  gameWon = false;

  /**
   * Creates a new endboss instance
   * Initializes the boss with images and starting position
   */
  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2800;
    this.y = -400;
    this.id = "Endboss_" + Date.now();
    this.energy = 100;
    this.lastHitTime = 0;
    this.hitCooldown = 800;
    this.enraged = false;
    this.speedMultiplier = 1;
    this.offset = {
      top: 50,
      left: 50,
      right: 50,
      bottom: 80,
    };
  }

  initializeBoss() {
    this.stopAnimation();
    if (world && world.stopBackgroundMusic) {
      world.stopBackgroundMusic();
    }
  }

  startBossMusic() {
    this.endbossSound = AudioManager.getAudio("audio/endboss.mp3");
    if (this.endbossSound && !isMuted) {
      this.endbossSound.loop = true;
      this.endbossSound.volume = 0.3;
      this.endbossSound.currentTime = 0;
      this.endbossSound.play().catch((e) => console.log("Endboss audio failed:", e));
    }
  }

  handleBossMovement(char) {
    let distance = this.x - char.x;
    let attackRange = this.enraged ? 50 : 30;

    if (Math.abs(distance) > attackRange) {
      this.playAnimation(this.IMAGES_WALK);
      if (char.x < this.x) {
        this.otherDirection = false;
        this.moveLeft();
      } else {
        this.otherDirection = true;
        this.moveRight();
      }
    } else {
      this.playAnimation(this.IMAGES_ATTACK);

      if (this.enraged && Math.random() < 0.3) {
        this.aggressiveAttack(char);
      }
    }
  }

  aggressiveAttack(char) {
    if (Math.abs(this.x - char.x) > 20) {
      const direction = char.x < this.x ? -1 : 1;
      this.x += direction * 15 * this.speedMultiplier;
    }
  }

  startBehavior(char) {
    this.character = char;
    this.initializeBoss();
    this.startBossMusic();
    this.animationInterval = setInterval(() => {
      this.handleBossMovement(char);
    }, 150);
  }

  stopEndbossSound() {
    if (this.endbossSound) {
      this.endbossSound.pause();
      this.endbossSound.currentTime = 0;
    }
  }

  stopAnimation() {
    clearInterval(this.animationInterval);
    clearInterval(this.hurtAnimationInterval);
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

  animateAlert() {
    this.stopAnimation();
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_ALERT);
    }, 200);
  }

  flyIn(onComplete) {
    let interval = setInterval(() => {
      if (this.y < 45) {
        this.y += 5;
      } else {
        this.y = 45;
        clearInterval(interval);
        this.animateAlert();
        if (onComplete) onComplete();
      }
    }, 30);
  }

  moveLeft() {
    this.x -= 30 * this.speedMultiplier;
  }

  moveRight() {
    this.x += 30 * this.speedMultiplier;
  }

  hit() {
    const currentTime = Date.now();

    if (currentTime - this.lastHitTime < this.hitCooldown) {
      return;
    }

    this.lastHitTime = currentTime;
    this.energy -= 10;
    if (this.energy < 0) this.energy = 0;

    if (this.energy <= 40 && !this.enraged) {
      this.enraged = true;
      this.speedMultiplier = 1.5;
      this.hitCooldown = 600;
    }

    if (this.energy === 0) {
      this.die();
    } else {
      this.playHurtAnimation();
    }
  }

  /**
   * Alternative method name for consistency with other enemies
   * @function
   */
  gotHit() {
    this.hit();
  }

  playHurtAnimation() {
    this.stopAnimation();
    let imageIndex = 0;

    this.hurtAnimationInterval = setInterval(() => {
      if (imageIndex < this.IMAGES_HURT.length) {
        this.img = this.imageCache[this.IMAGES_HURT[imageIndex]];
        imageIndex++;
      } else {
        clearInterval(this.hurtAnimationInterval);
        this.resumeNormalBehavior();
      }
    }, 80);
  }

  resumeNormalBehavior() {
    if (this.character) {
      const interval = this.enraged ? 120 : 150;
      this.animationInterval = setInterval(() => {
        this.handleBossMovement(this.character);
      }, interval);
    }
  }

  die() {
    this.speed = 0;
    this.stopAnimation();
    this.stopEndbossSound();
    this.playDeathAnimation();

    setTimeout(() => {
      this.markedForDeletion = true;
      this.gameWonScreen();
    }, this.IMAGES_DEAD.length * 150 + 200);
  }

  playDeathAnimation() {
    if (this.deathAnimation) return;

    let i = 0;
    this.deathAnimation = setInterval(() => {
      if (i < this.IMAGES_DEAD.length) {
        let imgPath = this.IMAGES_DEAD[i];
        let loadedImage = this.imageCache[imgPath];
        if (loadedImage) {
          this.img = loadedImage;
        }
        i++;
      } else {
        clearInterval(this.deathAnimation);
        this.deathAnimation = null;
      }
    }, 400);
  }

  gameWonScreen() {
    world.gameWon = true;
    if (world && world.stopGame) {
      world.stopGame();
    }
    this.stopEndbossSound();
    if (world && world.stopBackgroundMusic) {
      world.stopBackgroundMusic();
    }
    if (world && world.playWinSound) {
      world.playWinSound();
    }

    showGameWon();
    document.getElementById("restart-button").style.display = "block";
    document.getElementById("menu-button").style.display = "block";
    document.getElementById("canvas").style.display = "none";
    document.getElementById("mute-button").style.display = "none";
  }
}
