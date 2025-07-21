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
/** @type {HTMLAudioElement|null} Main menu background music */
let mainMenuMusic = null;

/**
 * Loads the saved mute status from localStorage and updates the mute icon
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
  if (icon) icon.src = isMuted ? "./img/logo/mute.png" : "./img/logo/volume.png";
}

/**
 * Manages main menu background music - starts, pauses, or stops
 * @param {string} action - "start", "pause", or "stop"
 * @function
 */
function manageMainMenuMusic(action) {
  if (action === "start" && !isMuted) {
    if (!mainMenuMusic) {
      mainMenuMusic = AudioManager.getAudio("audio/main-menu.mp3");
      if (mainMenuMusic) {
        mainMenuMusic.loop = true;
        mainMenuMusic.volume = 0.3;
        mainMenuMusic.play().catch((e) => console.log("Main menu music failed:", e));
      }
    } else if (mainMenuMusic.paused) {
      mainMenuMusic.play().catch((e) => console.log("Main menu music resume failed:", e));
    }
  } else if (action === "pause" && mainMenuMusic && !mainMenuMusic.paused) {
    mainMenuMusic.pause();
  } else if (action === "stop" && mainMenuMusic) {
    mainMenuMusic.pause();
    mainMenuMusic.currentTime = 0;
    mainMenuMusic = null;
  }
}

/**
 * Initializes the game canvas and world
 * @function
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
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

/**
 * Handles keydown and keyup events for game controls
 * @param {KeyboardEvent} e - The keyboard event
 * @param {boolean} isDown - True for keydown, false for keyup
 * @function
 */
function handleKeyEvent(e, isDown) {
  if (world?.gameOver || !world?.gameRunning) return;
  setKeyState(e.keyCode, isDown);
}

window.addEventListener("keydown", (e) => handleKeyEvent(e, true));
window.addEventListener("keyup", (e) => handleKeyEvent(e, false));

/**
 * Stops all audio in the game including background music and sound effects
 * @function
 */
function stopAllSounds() {
  AudioManager.stopAll();
  if (world) {
    if (world.winSfx) { world.winSfx.pause(); world.winSfx.currentTime = 0; }
    if (world.gameOverSfx) { world.gameOverSfx.pause(); world.gameOverSfx.currentTime = 0; }
    if (world.stopBackgroundMusic) world.stopBackgroundMusic();
    if (world.char) {
      if (world.char.stopWalkSound) world.char.stopWalkSound();
      if (world.char.stopSnoreSound) world.char.stopSnoreSound();
    }
    if (world.endboss && world.endboss.stopEndbossSound) world.endboss.stopEndbossSound();
  }
}

/**
 * Cleans up the current world instance and resets level data
 * @function
 */
function cleanupWorld() {
  if (world) {
    if (world.animationFrameId) cancelAnimationFrame(world.animationFrameId);
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
  if (typeof level1 !== "undefined") level1 = null;
}

/**
 * Resets all keyboard states to false
 * @function
 */
function resetKeyboard() {
  Object.keys(keyboard).forEach(key => keyboard[key] = false);
}

/**
 * Starts a new game session
 * @function
 */
async function startGame() {
  AudioManager.stopAll();
  resetKeyboard();
  cleanupWorld();
  setGameScreens("game");
  bttnDisappear();
  await ResourcePreloader.preloadAll();
  initLevel();
  init();
  setTimeout(() => {
    if (world && world.startBackgroundMusic && !isMuted) world.startBackgroundMusic();
  }, 100);
}

/**
 * Manages game screen visibility and touch controls
 * @param {string} screen - "start", "game", "over", or "won"
 * @function
 */
function setGameScreens(screen) {
  const screens = ["start-screen", "game-over", "game-won", "canvas"];
  const visibility = {
    "start": { "start-screen": "flex", others: "none" },
    "game": { "canvas": "block", others: "none" },
    "over": { "game-over": "block", "game-over-screen": "flex", others: "none" },
    "won": { "game-won": "block", "game-won-screen": "flex", others: "none" }
  };
  
  screens.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.style.display = visibility[screen][id] || visibility[screen].others;
  });
  
  document.getElementById("mute-button").style.display = "block";
  
  if (screen === "start") {
    setControlsVisibility();
    updateMuteIcon();
    manageMainMenuMusic("start");
  } else if (screen === "game") {
    manageMainMenuMusic("pause");
    updateTouchControls();
  } else {
    const touchControls = document.getElementById("touch-controls");
    if (touchControls) touchControls.style.display = "none";
  }
}

/**
 * Updates touch controls based on device type
 * @function
 */
function updateTouchControls() {
  updateTouchToggleVisibility();
  const touchControls = document.getElementById("touch-controls");
  if (touchControls) {
    if (window.innerWidth < 768) {
      touchControls.style.display = "block";
      touchControls.classList.remove("show");
    } else if (shouldShowTouchToggle()) {
      touchControls.style.display = touchControls.classList.contains("show") ? "block" : "none";
    } else {
      touchControls.style.display = "none";
    }
  }
}

/**
 * Sets visibility of control information based on screen size
 * @function
 */
function setControlsVisibility() {
  const controlsInfo = document.getElementById("controls-info");
  if (controlsInfo) controlsInfo.style.display = window.innerWidth >= 1024 ? "block" : "none";
}

function showStartScreen() {
  stopAllSounds();
  resetKeyboard();
  if (world && world.stopGame) world.stopGame();
  setGameScreens("start");
  bttnDisappear();
}

function bttnDisappear() {
  ["restart-button", "menu-button"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.style.display = "none";
  });
}

function checkOrientation() {
  const overlay = document.getElementById("rotate-screen");
  if (overlay) overlay.style.display = window.innerHeight > window.innerWidth ? "flex" : "none";
  updateTouchToggleVisibility();
}

window.addEventListener("resize", () => { checkOrientation(); updateTouchToggleVisibility(); });
window.addEventListener("orientationchange", () => setTimeout(() => { checkOrientation(); updateTouchToggleVisibility(); }, 100));

/**
 * Handles mute/unmute functionality with audio management
 * @param {boolean} mute - True to mute, false to unmute
 * @function
 */
function handleMuteToggle(mute) {
  const icon = document.getElementById("mute-icon");
  icon.src = mute ? "./img/logo/mute.png" : "./img/logo/volume.png";
  
  if (mute) {
    if (world && world.backgroundMusic) world.backgroundMusic.pause();
    if (world && world.endboss && world.endboss.endbossSfx) world.endboss.endbossSfx.pause();
    manageMainMenuMusic("pause");
    AudioManager.stopAll();
    if (world && world.char) {
      world.char.stopWalkSound();
      if (world.char.stopSnoreSound) world.char.stopSnoreSound();
    }
  } else {
    if (world && world.gameRunning && !world.gameOver && !world.gameWon) {
      if (world.endboss && world.bossBehaviorStarted) {
        if (world.endboss.endbossSfx) world.endboss.endbossSfx.play().catch((e) => console.log("Endboss music failed:", e));
      } else {
        if (world.backgroundMusic && world.backgroundMusic.paused) {
          world.backgroundMusic.play().catch((e) => console.log("Background music resume failed:", e));
        } else {
          world.startBackgroundMusic();
        }
      }
    } else {
      const startScreen = document.getElementById("start-screen");
      if (startScreen && startScreen.style.display !== "none") manageMainMenuMusic("start");
    }
  }
}

function toggleMute() {
  isMuted = !isMuted;
  localStorage.setItem("elPolloLocoMuted", JSON.stringify(isMuted));
  handleMuteToggle(isMuted);
}

function toggleCopyright() {
  const overlay = document.getElementById("copyright-overlay");
  if (overlay) overlay.style.display = (overlay.style.display === "none" || overlay.style.display === "") ? "flex" : "none";
}

function toggleControls() {
  const panel = document.getElementById("controls-panel");
  const button = document.getElementById("controls-toggle");
  if (panel && button) {
    const isHidden = panel.style.display === "none" || panel.style.display === "";
    panel.style.display = isHidden ? "block" : "none";
    button.textContent = isHidden ? "🎮 Steuerung verbergen" : "🎮 Steuerung anzeigen";
  }
}

/**
 * Toggles touch controls visibility on tablets/iPads
 * @function
 */
function toggleTouchControls() {
  const touchControls = document.getElementById("touch-controls");
  const toggleButton = document.getElementById("touch-toggle");
  
  if (touchControls && toggleButton) {
    const isVisible = touchControls.classList.contains("show");
    touchControls.classList.toggle("show");
    toggleButton.textContent = isVisible ? "📱" : "✕";
    toggleButton.title = isVisible ? "Touch-Controls anzeigen" : "Touch-Controls verbergen";
  }
}

/**
 * Checks if device should show touch toggle button
 * @function
 */
function shouldShowTouchToggle() {
  return ("ontouchstart" in window || navigator.maxTouchPoints > 0) && window.innerWidth >= 768;
}

/**
 * Updates touch toggle button visibility based on device
 * @function
 */
function updateTouchToggleVisibility() {
  const toggleButton = document.getElementById("touch-toggle");
  const touchControls = document.getElementById("touch-controls");
  
  if (toggleButton && touchControls) {
    if (shouldShowTouchToggle()) {
      toggleButton.style.display = "flex";
      touchControls.classList.remove("show");
      toggleButton.textContent = "📱";
      toggleButton.title = "Touch-Controls anzeigen";
    } else {
      toggleButton.style.display = "none";
      touchControls.classList.remove("show");
    }
  }
}

/**
 * Initializes touch controls with event listeners
 * @function
 */
function initTouchControls() {
  const elements = {
    touchLeft: document.getElementById("touch-left"),
    touchRight: document.getElementById("touch-right"),
    touchThrow: document.getElementById("touch-throw"),
    touchAttack: document.getElementById("touch-attack"),
  };

  Object.entries(elements).forEach(([key, element]) => {
    if (element) {
      const keyMap = { touchLeft: "LEFT", touchRight: "RIGHT", touchThrow: "D", touchAttack: "SPACE" };
      
      element.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keyboard[keyMap[key]] = true;
      });
      
      element.addEventListener("touchend", (e) => {
        e.preventDefault();
        keyboard[keyMap[key]] = false;
      });
      
      element.addEventListener("touchcancel", (e) => {
        e.preventDefault();
        Object.values(keyMap).forEach(k => keyboard[k] = false);
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  initTouchControls();
  loadMuteStatus();
  updateTouchToggleVisibility();
  await ResourcePreloader.preloadAll();
});

function showGameOver() { setGameScreens("over"); }
function showGameWon() { setGameScreens("won"); }
