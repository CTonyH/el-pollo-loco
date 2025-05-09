class EndbossStatusbar extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
  ];
  percentage;

  constructor() {
    super();
    this.loadImages(this.IMAGES);

    this.setPercentage(100);
    this.width = 120;
    this.height = 30;
    
  }

  setpercentage(percentage) {
    this.percentage = percentage;
    let index = Math.floor(percentage / 20);
    if (index > 5) index = 5;
    this.img = this.imageCache[this.IMAGES[index]];
  }

  updatePosition(boss) {
    this.x = boss.x + boss.width / 2 - this.width / 2;
    this.y = boss.y;
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
