class ThrowableObject extends MoveableObject {
  IMAGES_BOTTLE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];
  IMAGES_BROKEN = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y, direction) {
    super();
    this.loadImages(this.IMAGES_BOTTLE);
    this.loadImages(this.IMAGES_BROKEN);
    this.img = this.imageCache[this.IMAGES_BOTTLE[0]];
    this.x = x;
    this.y = y - 50;
    this.height = 100;
    this.broken = false;
    this.otherDirection = direction;
    this.throw();
    this.animate();
  }

  throw(direction) {
    this.speedY = 10; // nach oben
    this.acceleration = 0.5;
    this.applyGravity(); // startet Interval mit Fallbewegung

    if (direction === "left") {
      this.xSpeed = -10;
    } else {
      this.xSpeed = 10;
    }

    this.throwInterval = setInterval(() => {
      this.x += this.otherDirection ? -10 : 10; // rechtsbewegung
    }, 25);
  }

  animate() {
    let i = 0;
    this.animationInterval = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_BOTTLE[i]];
      i = (i + 1) % this.IMAGES_BOTTLE.length;
    }, 100);
  }

  break() {
    this.broken = true;
    clearInterval(this.throwInterval);
    clearInterval(this.animationInterval);
    clearInterval(this.gravityInterval);

    let i = 0;
    this.breakAnimation = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_BROKEN[i]];
      i++;
      if (i >= this.IMAGES_BROKEN.length) {
        clearInterval(this.breakAnimation);
        const index = world.throwableObjects.indexOf(this);
        if (index > -1) {
          world.throwableObjects.splice(index, 1);
        }
      }
    }, 100); 
  }

  checkGroundCollision() {
    if (this.y >= 350 && !this.broken) {
      this.break();
    }
  }
}
