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
}
