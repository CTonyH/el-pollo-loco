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

    // Add bottle sounds
    this.throwSfx = new Audio("audio/bottle-throw.mp3");
    this.breakSfx = new Audio("audio/bottle-broke.mp3");
    this.throwSfx.volume = 0.4;
    this.breakSfx.volume = 0.5;

    this.throw();
    this.animate();
  }

  throw() {
    // Play throw sound
    if (!isMuted) {
      this.throwSfx.currentTime = 0;
      this.throwSfx.play().catch((e) => console.log("Bottle throw audio failed:", e));
    }

    this.speedY = 10;
    this.acceleration = 0.5;
    this.applyGravity();

    this.throwInterval = setInterval(() => {
      this.x += 10;
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

    // Play break sound
    if (!isMuted) {
      this.breakSfx.currentTime = 0;
      this.breakSfx.play().catch((e) => console.log("Bottle break audio failed:", e));
    }

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
    if (this.y >= 320 && !this.broken) {
      this.break();
    }
  }
}
