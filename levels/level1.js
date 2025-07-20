let level1;
function initLevel(){



  level1 = new Level(
    [
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chick(),
      new Chick(),
      new Chick(),
      new Chick(),
      new Chick(),
      new Chick(),
      new Chick(),
      new Chick(),
      new Chick(),
      new Chick(),
      new Endboss()
    ],

    [ 
      new Clouds(0), 
      new Clouds(400), 
      new Clouds(800), 
      new Clouds(1200), 
      new Clouds(1600),
      new Clouds(2000),
      new Clouds(2400),
      new Clouds(2800)
    ],

    [
      new BackgroundObject("img/5_background/layers/air.png", -719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -719),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),
      new BackgroundObject("img/5_background/layers/air.png", 0),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/air.png", 719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3),
    ],

    [
      new Coins(), new Coins(), new Coins(), new Coins(), new Coins(),
      new Coins(), new Coins(), new Coins(), new Coins(), new Coins(),
      new Coins(), new Coins(), new Coins(), new Coins()
    ],

    [
      new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(),
      new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(),
      new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle()
    ]
  );
}
