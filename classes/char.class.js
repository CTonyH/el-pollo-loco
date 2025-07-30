/**
 * Main character class representing the player character Pepe
 * @class Char
 * @extends MoveableObject
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class Char extends MoveableObject {
  width = 150;
  height = 250;
  mirrow = true;
  y = 180;
  speed = 10;
  offset = { top: 70, right: 30, bottom: 10, left: 20 };
  lastHit = 0;
  isJumpAnimationPlaying = false;
  jumpAnimationFrame = 0;

  IMAGES_WALKING = ["img/2_character_pepe/2_walk/W-21.png", "img/2_character_pepe/2_walk/W-23.png", "img/2_character_pepe/2_walk/W-22.png", "img/2_character_pepe/2_walk/W-24.png", "img/2_character_pepe/2_walk/W-25.png", "img/2_character_pepe/2_walk/W-26.png"];
  IMAGES_JUMPING = ["img/2_character_pepe/3_jump/J-31.png", "img/2_character_pepe/3_jump/J-32.png", "img/2_character_pepe/3_jump/J-33.png", "img/2_character_pepe/3_jump/J-34.png", "img/2_character_pepe/3_jump/J-35.png", "img/2_character_pepe/3_jump/J-36.png", "img/2_character_pepe/3_jump/J-37.png", "img/2_character_pepe/3_jump/J-38.png", "img/2_character_pepe/3_jump/J-39.png"];
  CHAR_IMAGES_DEAD = ["img/2_character_pepe/5_dead/D-51.png", "img/2_character_pepe/5_dead/D-52.png", "img/2_character_pepe/5_dead/D-53.png", "img/2_character_pepe/5_dead/D-54.png", "img/2_character_pepe/5_dead/D-55.png", "img/2_character_pepe/5_dead/D-56.png", "img/2_character_pepe/5_dead/D-57.png"];
  IMAGES_HURT = ["img/2_character_pepe/4_hurt/H-41.png", "img/2_character_pepe/4_hurt/H-42.png", "img/2_character_pepe/4_hurt/H-43.png"];
  IMAGES_IDLE = ["img/2_character_pepe/1_idle/idle/I-1.png", "img/2_character_pepe/1_idle/idle/I-2.png", "img/2_character_pepe/1_idle/idle/I-3.png", "img/2_character_pepe/1_idle/idle/I-4.png", "img/2_character_pepe/1_idle/idle/I-5.png", "img/2_character_pepe/1_idle/idle/I-6.png", "img/2_character_pepe/1_idle/idle/I-7.png", "img/2_character_pepe/1_idle/idle/I-8.png", "img/2_character_pepe/1_idle/idle/I-9.png", "img/2_character_pepe/1_idle/idle/I-10.png"];
  IMAGES_LONG_IDLE = ["img/2_character_pepe/1_idle/long_idle/I-11.png", "img/2_character_pepe/1_idle/long_idle/I-12.png", "img/2_character_pepe/1_idle/long_idle/I-13.png", "img/2_character_pepe/1_idle/long_idle/I-14.png", "img/2_character_pepe/1_idle/long_idle/I-15.png", "img/2_character_pepe/1_idle/long_idle/I-16.png", "img/2_character_pepe/1_idle/long_idle/I-17.png", "img/2_character_pepe/1_idle/long_idle/I-18.png", "img/2_character_pepe/1_idle/long_idle/I-19.png", "img/2_character_pepe/1_idle/long_idle/I-20.png"];

  constructor(world, keyboard) {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png", 100, 200);
    Object.assign(this, { world, keyboard, x: 100, y: 180, bottles: 0, coins: 0, isSnoring: false, idleTime: null, longIdleDelay: 3000 });
    [this.IMAGES_WALKING, this.IMAGES_JUMPING, this.CHAR_IMAGES_DEAD, this.IMAGES_HURT, this.IMAGES_IDLE, this.IMAGES_LONG_IDLE].forEach(imgs => this.loadImages(imgs));
    this.animate();
    this.applyGravity();
  }

  getRealFrame() {
    [this.rX, this.rY, this.rW, this.rH] = [this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.left - this.offset.right, this.height - this.offset.top - this.offset.bottom];
  }

  draw(ctx) { this.getRealFrame(); super.draw(ctx); }

  handleMovement() {
    if (!this.world.gameRunning) return;
    let isMoving = false;
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) { this.moveRight(); isMoving = true; }
    if (this.world.keyboard.LEFT && this.x > 0) { this.moveLeft(this.mirrow); isMoving = true; }
    this.handleWalkSound(isMoving);
    if (this.world.keyboard.SPACE && !this.isAboveGround()) this.jump();
    this.world.camera_x = -this.x + 100;
  }

  handleWalkSound(isMoving) { isMoving && !this.isAboveGround() ? this.startWalkSound() : this.stopWalkSound(); }

  handleAnimationStates() {
    if (!this.world.gameRunning) return;
    if (this.isDead() && !this.deadAnimationPlayed) return this.handleDeathAnimation();
    if (this.isHurt()) { this.playAnimation(this.IMAGES_HURT); this.resetIdleTimer(); }
    else if (this.isAboveGround()) { this.handleJumpAnimation(); this.resetIdleTimer(); }
    else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) { this.resetJumpAnimation(); this.playAnimation(this.IMAGES_WALKING); this.resetIdleTimer(); }
    else if (this.world.keyboard.D) { this.resetJumpAnimation(); this.resetIdleTimer(); this.playAnimation(this.IMAGES_IDLE); }
    else { this.resetJumpAnimation(); this.getIdleAnimation(); }
  }

  handleDeathAnimation() {
    this.deadAnimationPlayed = true;
    [this.animationInterval, this.movementInterval].forEach(clearInterval);
    this.playAnimationOnce(this.CHAR_IMAGES_DEAD, () => { this.visible = false; this.gameOverScreen(); });
  }

  animate() {
    this.movementInterval = setInterval(() => this.handleMovement(), 1000 / 60);
    this.animationInterval = setInterval(() => this.handleAnimationStates(), 100);
  }

  resetIdleTimer() { this.lastMovement = new Date().getTime(); this.idleTime = null; }

  handleJumpAnimation() {
    if (!this.isJumpAnimationPlaying) { this.isJumpAnimationPlaying = true; this.jumpAnimationFrame = 0; }
    let path = this.IMAGES_JUMPING[Math.min(this.jumpAnimationFrame, this.IMAGES_JUMPING.length - 1)];
    this.img = this.imageCache[path];
    if (this.jumpAnimationFrame < this.IMAGES_JUMPING.length) this.jumpAnimationFrame++;
  }

  resetJumpAnimation() { this.isJumpAnimationPlaying = false; this.jumpAnimationFrame = 0; }
  jump() { this.speedY = 30; AudioManager.safePlay("audio/jump.mp3", 0.3); this.resetJumpAnimation(); }

  triggerDeathAnimation() {
    if (this.deadAnimationPlayed) return;
    this.deadAnimationPlayed = true;
    [this.animationInterval, this.movementInterval].forEach(clearInterval);
    this.playAnimationOnce(this.CHAR_IMAGES_DEAD, () => { this.visible = false; this.gameOverScreen(); });
  }

  getIdleAnimation() {
    const now = Date.now();
    if (!this.idleTime) { this.idleTime = now; this.playAnimation(this.IMAGES_IDLE); this.stopSnoreSound(); }
    else if (now - this.idleTime >= this.longIdleDelay) { this.playAnimation(this.IMAGES_LONG_IDLE); this.startSnoreSound(); }
    else { this.playAnimation(this.IMAGES_IDLE); this.stopSnoreSound(); }
  }

  playAnimationOnce(images, onComplete) {
    let i = 0;
    let interval = setInterval(() => {
      if (i < images.length) { this.img = this.imageCache[images[i]]; i++; }
      else { clearInterval(interval); if (onComplete) onComplete(); }
    }, 100);
  }

  startSnoreSound() {
    if (!this.isSnoring && !isMuted) {
      this.isSnoring = true;
      this.snoreSound = AudioManager.getAudio("audio/snore.mp3");
      if (this.snoreSound) {
        Object.assign(this.snoreSound, { loop: true, volume: 0.3, currentTime: 0 });
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
    if (this.world?.stopGame) this.world.stopGame();
    this.stopSnoreSound();
    if (this.world?.playGameOverSound) this.world.playGameOverSound();
    if (this.world?.stopBackgroundMusic) this.world.stopBackgroundMusic();
    showGameOver();
    ["restart-button", "menu-button"].forEach(id => document.getElementById(id).style.display = "block");
    ["canvas", "mute-button"].forEach(id => document.getElementById(id).style.display = "none");
  }
}
