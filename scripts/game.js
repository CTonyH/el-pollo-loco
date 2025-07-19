let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;

function loadMuteStatus() {
  const savedMuteStatus = localStorage.getItem("elPolloLocoMuted");
  if (savedMuteStatus !== null) {
    isMuted = JSON.parse(savedMuteStatus);
    updateMuteIcon();
  }
}

function updateMuteIcon() {
  const icon = document.getElementById("mute-icon");
  if (icon) {
    icon.src = isMuted ? "./img/logo/mute.png" : "./img/logo/volume.png";
  }
}

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

window.addEventListener("keydown", (e) => {
  if (world?.gameOver || !world?.gameRunning) return;
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
  if (world?.gameOver || !world?.gameRunning) return;
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

function stopAllSounds() {
  if (world) {
    if (world.winSfx) {
      world.winSfx.pause();
      world.winSfx.currentTime = 0;
    }

    if (world.gameOverSfx) {
      world.gameOverSfx.pause();
      world.gameOverSfx.currentTime = 0;
    }

    if (world.stopBackgroundMusic) {
      world.stopBackgroundMusic();
    }

    if (world.char) {
      if (world.char.stopWalkSound) world.char.stopWalkSound();
      if (world.char.stopSnoreSound) world.char.stopSnoreSound();
    }

    if (world.endboss && world.endboss.stopEndbossSound) {
      world.endboss.stopEndbossSound();
    }
  }
}

function startGame() {
  stopAllSounds();
  if (world) {
    if (world.animationFrameId) {
      cancelAnimationFrame(world.animationFrameId);
    }
    world.throwableObjects = [];
    if (world.level && world.level.enemies) {
      world.level.enemies.forEach((enemy) => {
        if (enemy.animationInterval) clearInterval(enemy.animationInterval);
        if (enemy.stopEndbossSound) enemy.stopEndbossSound();
      });
      world.level.enemies = [];
    }

    world = null;
  }
  if (typeof level1 !== "undefined") {
    level1 = null;
  }
  setStyles();
  bttnDisappear();
  initLevel();
  init();
  setTimeout(() => {
    if (world && world.startBackgroundMusic && !isMuted) {
      world.startBackgroundMusic();
    }
  }, 100);
}

function setStylesStartGame() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-over").style.display = "none";
  document.getElementById("canvas").style.display = "block";
  document.getElementById("game-won").style.display = "none";
  document.getElementById("mute-button").style.display = "block";
  const touchControls = document.getElementById("touch-controls");
  if (touchControls && window.innerWidth <= 720) {
    touchControls.style.display = "block";
  }
}

function setStylesStartScreen() {
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
  updateMuteIcon();
  const touchControls = document.getElementById("touch-infos");

  if (touchControls) {
    touchControls.style.display = "none";
  }
}

function showStartScreen() {
  stopAllSounds();
  if (world && world.stopGame) {
    world.stopGame();
  }
  setStylesStartScreen();
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
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", function () {
  setTimeout(checkOrientation, 100);
});

function toggleMute() {
  const icon = document.getElementById("mute-icon");
  isMuted = !isMuted;
  localStorage.setItem("elPolloLocoMuted", JSON.stringify(isMuted));

  if (isMuted) {
    icon.src = "./img/logo/mute.png";
    stopAllSounds();
    if (world && world.char) {
      world.char.stopWalkSound();
      if (world.char.stopSnoreSound) world.char.stopSnoreSound();
    }
  } else {
    icon.src = "./img/logo/volume.png";
    if (world && !world.gameOver && !world.gameWon && world.gameRunning) {
      if (world.endboss && world.bossBehaviorStarted) {
        world.endboss.endbossSfx.currentTime = 0;
        world.endboss.endbossSfx.play().catch((e) => console.log("Endboss audio failed:", e));
      } else {
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

function initTouchControls() {
  const touchLeft = document.getElementById("touch-left");
  const touchRight = document.getElementById("touch-right");
  const touchThrow = document.getElementById("touch-throw");
  const touchAttack = document.getElementById("touch-attack");
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

  [touchLeft, touchRight, touchThrow, touchAttack].forEach((button) => {
    button.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      keyboard.LEFT = false;
      keyboard.RIGHT = false;
      keyboard.D = false;
      keyboard.SPACE = false;
    });
  });
}
document.addEventListener("DOMContentLoaded", function () {
  initTouchControls();
  loadMuteStatus();
});

function showGameOver() {
  document.getElementById("game-over").style.display = "block";
  document.getElementById("game-over-screen").style.display = "flex";
  const touchControls = document.getElementById("touch-controls");
  if (touchControls) {
    touchControls.style.display = "none";
  }
}

function showGameWon() {
  document.getElementById("game-won").style.display = "block";
  document.getElementById("game-won-screen").style.display = "flex";
  const touchControls = document.getElementById("touch-controls");
  if (touchControls) {
    touchControls.style.display = "none";
  }
}
