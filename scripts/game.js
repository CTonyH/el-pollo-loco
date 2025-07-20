/**
 * @fileoverview Main game script for El Pollo Loco
 * Contains game initialization, controls, and UI management functions
 * @author El Pollo Loco Team
 * @version 1.0.0
 */

/** @type {HTMLCanvasElement} Main game canvas element */
let canvas;

/** @type {World} Game world instance containing all game objects */
let world;

/** @type {Keyboard} Keyboard input handler instance */
let keyboard = new Keyboard();

/** @type {boolean} Global mute state for all audio */
let isMuted = false;

/**
 * Loads the saved mute status from localStorage
 * Updates the mute icon if status is found
 * @function
 */
function loadMuteStatus() {
  const savedMuteStatus = localStorage.getItem("elPolloLocoMuted");
  if (savedMuteStatus !== null) {
    isMuted = JSON.parse(savedMuteStatus);
    updateMuteIcon();
  }
}

/**
 * Updates the mute icon based on current mute state
 * @function
 */
function updateMuteIcon() {
  const icon = document.getElementById("mute-icon");
  if (icon) {
    icon.src = isMuted ? "./img/logo/mute.png" : "./img/logo/volume.png";
  }
}

/**
 * Initializes the game canvas and world
 * Creates a new World instance with canvas and keyboard
 * @function
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

/**
 * Handles keydown events for game controls
 * @param {KeyboardEvent} e - The keyboard event
 * @function
 */
function handleKeyDown(e) {
  if (world?.gameOver || !world?.gameRunning) return;
  setKeyState(e.keyCode, true);
}

/**
 * Sets the state of keyboard keys based on key code
 * @param {number} keyCode - The key code from the keyboard event
 * @param {boolean} state - The state to set (true for pressed, false for released)
 * @function
 */
function setKeyState(keyCode, state) {
  if (keyCode == 39) keyboard.RIGHT = state;
  if (keyCode == 37) keyboard.LEFT = state;
  if (keyCode == 40) keyboard.DOWN = state;
  if (keyCode == 38) keyboard.UP = state;
  if (keyCode == 32) keyboard.SPACE = state;
  if (keyCode == 68) keyboard.D = state;
}

window.addEventListener("keydown", handleKeyDown);

/**
 * Handles keyup events for game controls
 * @param {KeyboardEvent} e - The keyboard event
 * @function
 */
function handleKeyUp(e) {
  if (world?.gameOver || !world?.gameRunning) return;
  setKeyState(e.keyCode, false);
}

window.addEventListener("keyup", handleKeyUp);

/**
 * Stops world-related sound effects (win and game over sounds)
 * @function
 * @private
 */
function stopWorldSounds() {
  if (world.winSfx) {
    world.winSfx.pause();
    world.winSfx.currentTime = 0;
  }
  if (world.gameOverSfx) {
    world.gameOverSfx.pause();
    world.gameOverSfx.currentTime = 0;
  }
}

/**
 * Stops character-related sound effects (walk and snore sounds)
 * @function
 * @private
 */
function stopCharacterSounds() {
  if (world.char) {
    if (world.char.stopWalkSound) world.char.stopWalkSound();
    if (world.char.stopSnoreSound) world.char.stopSnoreSound();
  }
}

/**
 * Stops all audio in the game including background music and sound effects
 * @function
 */
function stopAllSounds() {
  AudioManager.stopAll();
  if (world) {
    stopWorldSounds();
    if (world.stopBackgroundMusic) {
      world.stopBackgroundMusic();
    }
    stopCharacterSounds();
    if (world.endboss && world.endboss.stopEndbossSound) {
      world.endboss.stopEndbossSound();
    }
  }
}

/**
 * Cleans up the current world instance and resets level data
 * @function
 * @private
 */
function cleanupWorld() {
  if (world) {
    if (world.animationFrameId) {
      cancelAnimationFrame(world.animationFrameId);
    }
    world.throwableObjects = [];
    cleanupEnemies();
    world = null;
  }
  if (typeof level1 !== "undefined") {
    level1 = null;
  }
}

/**
 * Cleans up enemy animations and intervals
 * @function
 * @private
 */
function cleanupEnemies() {
  if (world.level && world.level.enemies) {
    world.level.enemies.forEach((enemy) => {
      if (enemy.animationInterval) clearInterval(enemy.animationInterval);
      if (enemy.stopEndbossSound) enemy.stopEndbossSound();
    });
    world.level.enemies = [];
  }
}

/**
 * Starts background music with a delay
 * @function
 * @private
 */
function startBackgroundMusicDelayed() {
  setTimeout(() => {
    if (world && world.startBackgroundMusic && !isMuted) {
      world.startBackgroundMusic();
    }
  }, 100);
}

/**
 * Starts a new game session
 * Preloads resources and initializes new game
 * @function
 */
async function startGame() {
  AudioManager.stopAll();
  cleanupWorld();
  setStylesStartGame();
  bttnDisappear();

  await ResourcePreloader.preloadAll();

  initLevel();
  init();
  startBackgroundMusicDelayed();
}

/**
 * Sets UI styles when starting the game
 * Shows game canvas and hides menu screens
 * @function
 * @private
 */
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

/**
 * Sets visibility of control information based on screen size
 * @function
 * @private
 */
function setControlsVisibility() {
  if (window.innerWidth >= 1024) {
    document.getElementById("start-screen").style.display = "flex";
    document.getElementById("controls-info").style.display = "block";
  } else if (window.innerWidth < 1024) {
    document.getElementById("controls-info").style.display = "none";
  }
}

function hideGameScreens() {
  document.getElementById("game-over").style.display = "none";
  document.getElementById("canvas").style.display = "none";
  document.getElementById("game-won").style.display = "none";
  document.getElementById("mute-button").style.display = "block";
}

function hideTouchControls() {
  const touchControls = document.getElementById("touch-infos");
  if (touchControls) {
    touchControls.style.display = "none";
  }
}

function setStylesStartScreen() {
  setControlsVisibility();
  hideGameScreens();
  updateMuteIcon();
  hideTouchControls();
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

function handleMuteOn(icon) {
  icon.src = "./img/logo/mute.png";
  AudioManager.stopAll();
  if (world && world.char) {
    world.char.stopWalkSound();
    if (world.char.stopSnoreSound) world.char.stopSnoreSound();
  }
}

function handleMuteOff(icon) {
  icon.src = "./img/logo/volume.png";
  if (world && !world.gameOver && !world.gameWon && world.gameRunning) {
    if (world.endboss && world.bossBehaviorStarted) {
      world.endboss.endbossSfx.currentTime = 0;
    } else {
      world.startBackgroundMusic();
    }
  }
}

function toggleMute() {
  const icon = document.getElementById("mute-icon");
  isMuted = !isMuted;
  localStorage.setItem("elPolloLocoMuted", JSON.stringify(isMuted));

  if (isMuted) {
    handleMuteOn(icon);
  } else {
    handleMuteOff(icon);
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

function getTouchElements() {
  return {
    touchLeft: document.getElementById("touch-left"),
    touchRight: document.getElementById("touch-right"),
    touchThrow: document.getElementById("touch-throw"),
    touchAttack: document.getElementById("touch-attack"),
  };
}

function addTouchStartEvents(elements) {
  elements.touchLeft.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.LEFT = true;
  });
  elements.touchRight.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.RIGHT = true;
  });
  elements.touchThrow.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.D = true;
  });
  elements.touchAttack.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.SPACE = true;
  });
}

function addTouchEndEvents(elements) {
  elements.touchLeft.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.LEFT = false;
  });
  elements.touchRight.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.RIGHT = false;
  });
  elements.touchThrow.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.D = false;
  });
  elements.touchAttack.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.SPACE = false;
  });
}

function addTouchCancelEvents(elements) {
  [elements.touchLeft, elements.touchRight, elements.touchThrow, elements.touchAttack].forEach((button) => {
    button.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      keyboard.LEFT = false;
      keyboard.RIGHT = false;
      keyboard.D = false;
      keyboard.SPACE = false;
    });
  });
}

function initTouchControls() {
  const elements = getTouchElements();
  addTouchStartEvents(elements);
  addTouchEndEvents(elements);
  addTouchCancelEvents(elements);
}
document.addEventListener("DOMContentLoaded", async function () {
  initTouchControls();
  loadMuteStatus();
  await ResourcePreloader.preloadAll();
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
