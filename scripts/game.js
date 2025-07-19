let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  // initLevel();
}

window.addEventListener("keydown", (e) => {
  if (world?.gameOver || !world?.gameRunning) return; // Check if game is running
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
  if (world?.gameOver || !world?.gameRunning) return; // Check if game is running
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

// Helper function to stop all sounds
function stopAllSounds() {
  if (world) {
    // Stop win sound
    if (world.winSfx) {
      world.winSfx.pause();
      world.winSfx.currentTime = 0;
    }

    // Stop game over sound
    if (world.gameOverSfx) {
      world.gameOverSfx.pause();
      world.gameOverSfx.currentTime = 0;
    }

    // Stop background music
    if (world.stopBackgroundMusic) {
      world.stopBackgroundMusic();
    }

    // Stop character sounds
    if (world.char) {
      if (world.char.stopWalkSound) world.char.stopWalkSound();
      if (world.char.stopSnoreSound) world.char.stopSnoreSound();
    }

    // Stop endboss sound
    if (world.endboss && world.endboss.stopEndbossSound) {
      world.endboss.stopEndbossSound();
    }
  }
}

function startGame() {
  // Stop all sounds including win sound
  stopAllSounds();

  // Clear all previous references completely
  if (world) {
    // Stop all intervals and clear references
    if (world.animationFrameId) {
      cancelAnimationFrame(world.animationFrameId);
    }

    // Clear throwable objects that might reference old endboss
    world.throwableObjects = [];

    // Clear level enemies
    if (world.level && world.level.enemies) {
      world.level.enemies.forEach((enemy) => {
        if (enemy.animationInterval) clearInterval(enemy.animationInterval);
        if (enemy.stopEndbossSound) enemy.stopEndbossSound();
      });
      world.level.enemies = [];
    }

    world = null;
  }

  // Also clear global level1
  if (typeof level1 !== "undefined") {
    level1 = null;
  }

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-over").style.display = "none";
  document.getElementById("canvas").style.display = "block";
  document.getElementById("game-won").style.display = "none";
  document.getElementById("mute-button").style.display = "block";

  // Touch Controls anzeigen (nur auf Mobile)
  const touchControls = document.getElementById("touch-controls");
  if (touchControls && window.innerWidth <= 720) {
    touchControls.style.display = "block";
  }

  bttnDisappear();
  initLevel(); // Create fresh level with new endboss
  init(); // Create new world that uses the fresh level

  // Start background music after world is initialized
  setTimeout(() => {
    if (world && world.startBackgroundMusic && !isMuted) {
      world.startBackgroundMusic();
    }
  }, 100);
}

function showStartScreen() {
  // Stop all sounds including win sound
  stopAllSounds();

  // Stop game completely
  if (world && world.stopGame) {
    world.stopGame();
  }

  if (window.innerWidth >= 1024) {
    document.getElementById("start-screen").style.display = "flex";
    document.getElementById("controls-info").style.display = "block";
  } else if (window.innerWidth < 1024) {
    document.getElementById("controls-info").style.display = "none";
  }
  document.getElementById("game-over").style.display = "none";
  document.getElementById("canvas").style.display = "none";
  document.getElementById("game-won").style.display = "none";
  document.getElementById("mute-button").style.display = "block";

  // Touch Controls verstecken im Hauptmenü
  const touchControls = document.getElementById("touch-infos");

  if (touchControls) {
    touchControls.style.display = "none";
  }

  bttnDisappear();
}

function bttnDisappear() {
  console.log("buttons verschwinden");

  document.getElementById("restart-button").style.display = "none";
  document.getElementById("menu-button").style.display = "none";
}

function checkOrientation() {
  const overlay = document.getElementById("rotate-screen");
  if (window.innerHeight > window.innerWidth) {
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
}

// Event Listener für Orientierungsänderungen hinzufügen
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", function () {
  // Kleine Verzögerung, da orientationchange manchmal vor dem tatsächlichen Resize feuert
  setTimeout(checkOrientation, 100);
});

function toggleMute() {
  const icon = document.getElementById("mute-icon");
  isMuted = !isMuted;

  if (isMuted) {
    icon.src = "./img/logo/mute.png";
    // Stop all sounds when muting
    stopAllSounds();
  } else {
    icon.src = "./img/logo/volume.png";

    // Resume appropriate music based on game state
    if (world && !world.gameOver && !world.gameWon && world.gameRunning) {
      // If endboss is active and has behavior started, play endboss music
      if (world.endboss && world.bossBehaviorStarted) {
        world.endboss.endbossSfx.currentTime = 0;
        world.endboss.endbossSfx.play().catch((e) => console.log("Endboss audio failed:", e));
      } else {
        // Otherwise play background music
        world.startBackgroundMusic();
      }
    }
  }
}

function toggleCopyright() {
  const overlay = document.getElementById("copyright-overlay");

  if (overlay.style.display === "none" || overlay.style.display === "") {
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
}

function toggleControls() {
  const panel = document.getElementById("controls-panel");
  const button = document.getElementById("controls-toggle");

  if (panel.style.display === "none" || panel.style.display === "") {
    panel.style.display = "block";
    button.textContent = "🎮 Steuerung verbergen";
  } else {
    panel.style.display = "none";
    button.textContent = "🎮 Steuerung anzeigen";
  }
}

// Touch Controls für Mobile
function initTouchControls() {
  // D-Pad Buttons
  const touchLeft = document.getElementById("touch-left");
  const touchRight = document.getElementById("touch-right");

  // Action Buttons
  const touchThrow = document.getElementById("touch-throw");
  const touchAttack = document.getElementById("touch-attack");

  // Touch Start Events (Button gedrückt)
  touchLeft.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.LEFT = true;
  });

  touchRight.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.RIGHT = true;
  });

  touchThrow.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.D = true;
  });

  touchAttack.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.SPACE = true;
  });

  // Touch End Events (Button losgelassen)
  touchLeft.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.LEFT = false;
  });

  touchRight.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.RIGHT = false;
  });

  touchThrow.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.D = false;
  });

  touchAttack.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.SPACE = false;
  });

  // Touch Cancel Events (für den Fall, dass Touch unterbrochen wird)
  [touchLeft, touchRight, touchThrow, touchAttack].forEach((button) => {
    button.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      // Alle Tasten loslassen
      keyboard.LEFT = false;
      keyboard.RIGHT = false;
      keyboard.D = false;
      keyboard.SPACE = false;
    });
  });
}

// Touch Controls initialisieren wenn die Seite geladen ist
document.addEventListener("DOMContentLoaded", initTouchControls);

function showGameOver() {
  document.getElementById("game-over").style.display = "block";
  document.getElementById("game-over-screen").style.display = "flex";

  // Touch Controls verstecken bei Game Over
  const touchControls = document.getElementById("touch-controls");
  if (touchControls) {
    touchControls.style.display = "none";
  }
}

function showGameWon() {
  document.getElementById("game-won").style.display = "block";
  document.getElementById("game-won-screen").style.display = "flex";

  // Touch Controls verstecken bei Game Won
  const touchControls = document.getElementById("touch-controls");
  if (touchControls) {
    touchControls.style.display = "none";
  }
}
