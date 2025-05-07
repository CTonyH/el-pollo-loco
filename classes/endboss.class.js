class Endboss extends MoveableObject {
  width = 350;
  height = 400;

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

  IMAGES_WALK = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

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
  animationInterval;

  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_ATTACK);
    this.x = 2800;
    this.y = -400;
  }

  startBehavior(char) {
    this.stopAnimation();
    this.animationInterval = setInterval(() => {
      let distance = this.x - char.x;
  
      if (Math.abs(distance) > 100) {
        this.playAnimation(this.IMAGES_WALK);
  
        // Drehrichtung abhängig von Spielerposition
        if (char.x < this.x) {
          this.otherDirection = false;
          this.moveLeft();
        } else {
          this.otherDirection = true;
          this.moveRight();
        }
  
      } else {
        this.playAnimation(this.IMAGES_ATTACK);
      }
    }, 150);
  }

  stopAnimation(){
    clearInterval(this.animationInterval);
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
        this.animateAlert(); // nur hier rufen wir die Animation bewusst auf
        if(onComplete) onComplete();
      }
    }, 30);
  }

  moveLeft(){
    this.x -= 30;
  }

  moveRight() {
    this.x += 30;
  }

  hit() {
    this.energy -= 20; // z. B. 20 Schaden pro Flasche
    if (this.energy < 0) this.energy = 0;
  
    // Optional: Animation oder Verhalten bei Schaden
    if (this.energy === 0) {
      this.die(); // falls du ein Ende oder Tod hast
    }
  }
}
