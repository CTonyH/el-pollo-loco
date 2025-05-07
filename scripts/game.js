let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

window.addEventListener("keydown", (e) => {
  if (world?.gameOver) return;
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }
  if (e.keyCode == 38) {
    keyboard.UP = true;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (e.keyCode == 68) {
    keyboard.D = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (world?.gameOver) return;
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }
  if (e.keyCode == 38) {
    keyboard.UP = false;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (e.keyCode == 68) {
    keyboard.D = false;
  }
});

function restartGame() {
  // 1. Alle laufenden Intervalle stoppen (falls du sie gespeichert hast)
  if (world?.char?.animationInterval) clearInterval(world.char.animationInterval);
  if (world?.char?.movementInterval) clearInterval(world.char.movementInterval);
  
  // 2. Musik/Audio stoppen
  // if (world?.backgroundMusic) {
  //   world.backgroundMusic.pause();
  //   world.backgroundMusic.currentTime = 0;
  // }

  // 3. DOM-Status zurücksetzen (z.B. Statusleisten)
  document.getElementById("game-over-screen").style.display = "none";
  // Optional: Status-Leisten manuell auf 0/Startwert setzen

  // 4. Gegner / Endboss / Items etc. zurücksetzen passiert beim Laden von Level
  level1 = createLevel1(); // Falls du dynamisch generierst
  keyboard = new Keyboard();   // Neue Tastaturinstanz
  
  // 5. Neue Welt erstellen (neues Spiel)
  world = new World(canvas, keyboard);
}

