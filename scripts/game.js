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
      if (mainMenuMusic) Object.assign(mainMenuMusic, { loop: true, volume: 0.3 });
    }
    mainMenuMusic?.play?.().catch((e) => console.log("Main menu music failed:", e));
  } else if (action === "pause" && mainMenuMusic?.paused === false) {
    mainMenuMusic.pause();
  } else if (action === "stop" && mainMenuMusic) {
    Object.assign(mainMenuMusic, { currentTime: 0 });
    mainMenuMusic.pause();
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
 * Handles keydown and keyup events for game controls
 * @param {KeyboardEvent} e - The keyboard event
 * @param {boolean} isDown - True for keydown, false for keyup
 * @function
 */
function handleKeyEvent(e, isDown) {
  if (world?.gameOver || !world?.gameRunning) return;
  const keyMap = { 39: "RIGHT", 37: "LEFT", 40: "DOWN", 38: "UP", 32: "SPACE", 68: "D" };
  if (keyMap[e.keyCode]) keyboard[keyMap[e.keyCode]] = isDown;
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
    [world.winSfx, world.gameOverSfx].forEach((sfx) => sfx && (sfx.pause(), (sfx.currentTime = 0)));
    world.stopBackgroundMusic?.();
    world.char?.stopWalkSound?.();
    world.char?.stopSnoreSound?.();
    world.endboss?.stopEndbossSound?.();
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
    world.level?.enemies?.forEach((enemy) => {
      if (enemy.animationInterval) clearInterval(enemy.animationInterval);
      enemy.stopEndbossSound?.();
    });
    if (world.level) world.level.enemies = [];
    world = null;
  }
  if (typeof level1 !== "undefined") level1 = null;
}

/**
 * Resets all keyboard states to false
 * @function
 */
function resetKeyboard() {
  Object.keys(keyboard).forEach((key) => (keyboard[key] = false));
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
    if (world?.startBackgroundMusic && !isMuted) world.startBackgroundMusic();
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
    start: { "start-screen": "flex", others: "none" },
    game: { canvas: "block", others: "none" },
    over: { "game-over": "block", "game-over-screen": "flex", others: "none" },
    won: { "game-won": "block", "game-won-screen": "flex", others: "none" },
  };

  screens.forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.style.display = visibility[screen][id] || visibility[screen].others;
  });

  document.getElementById("mute-button").style.display = "block";
  const touchControls = document.getElementById("touch-controls");

  if (screen === "start") {
    setControlsVisibility();
    updateMuteIcon();
    manageMainMenuMusic("start");
  } else if (screen === "game") {
    manageMainMenuMusic("pause");
    updateTouchControls();
  } else if (touchControls) touchControls.style.display = "none";
}

/**
 * Updates touch controls based on device type and game state
 * @function
 */
function updateTouchControls() {
  updateTouchToggleVisibility();
  const touchControls = document.getElementById("touch-controls");
  if (!touchControls) return;

  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isGameActive = document.getElementById("canvas").style.display === "block";
  const width = window.innerWidth;

  if (isTouchDevice && isGameActive) {
    if (width < 768) {
      touchControls.style.display = "block";
      touchControls.classList.add("show");
    } else if (width >= 768 && width <= 1024) {
      const show = !touchControls.hasAttribute("data-user-toggled") || touchControls.classList.contains("show");
      touchControls.style.display = show ? "block" : "none";
      if (!touchControls.hasAttribute("data-user-toggled")) touchControls.classList.add("show");
    } else {
      touchControls.style.display = touchControls.classList.contains("show") ? "block" : "none";
    }
  } else {
    touchControls.style.display = "none";
    touchControls.classList.remove("show");
    touchControls.removeAttribute("data-user-toggled");
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

/**
 * Returns to the start screen and resets game state
 * @function
 */
function showStartScreen() {
  stopAllSounds();
  resetKeyboard();
  world?.stopGame?.();
  setGameScreens("start");
  bttnDisappear();
}

/**
 * Hides restart and menu buttons
 * @function
 */
function bttnDisappear() {
  ["restart-button", "menu-button"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.style.display = "none";
  });
}

/**
 * Checks device orientation and shows rotation overlay if needed
 * @function
 */
function checkOrientation() {
  const overlay = document.getElementById("rotate-screen");
  if (overlay) overlay.style.display = window.innerHeight > window.innerWidth ? "flex" : "none";
  updateTouchToggleVisibility();
}

window.addEventListener("resize", () => {
  checkOrientation();
  updateTouchToggleVisibility();
});
window.addEventListener("orientationchange", () =>
  setTimeout(() => {
    checkOrientation();
    updateTouchToggleVisibility();
  }, 100)
);

/**
 * Handles mute/unmute functionality with audio management
 * @param {boolean} mute - True to mute, false to unmute
 * @function
 */
function handleMuteToggle(mute) {
  document.getElementById("mute-icon").src = mute ? "./img/logo/mute.png" : "./img/logo/volume.png";

  if (mute) {
    world?.backgroundMusic?.pause();
    world?.endboss?.endbossSfx?.pause();
    manageMainMenuMusic("pause");
    AudioManager.stopAll();
    world?.char?.stopWalkSound();
    world?.char?.stopSnoreSound?.();
  } else {
    if (world?.gameRunning && !world.gameOver && !world.gameWon) {
      world.endboss?.endbossSfx && world.bossBehaviorStarted
        ? world.endboss.endbossSfx.play().catch((e) => console.log("Endboss music failed:", e))
        : world.backgroundMusic?.paused
        ? world.backgroundMusic.play().catch((e) => console.log("Background music resume failed:", e))
        : world.startBackgroundMusic();
    } else if (document.getElementById("start-screen")?.style.display !== "none") manageMainMenuMusic("start");
  }
}

/**
 * Toggles mute state and saves to localStorage
 * @function
 */
function toggleMute() {
  isMuted = !isMuted;
  localStorage.setItem("elPolloLocoMuted", JSON.stringify(isMuted));
  handleMuteToggle(isMuted);
}

/**
 * Toggles copyright overlay visibility
 * @function
 */
function toggleCopyright() {
  const overlay = document.getElementById("copyright-overlay");
  if (overlay) overlay.style.display = overlay.style.display === "none" || overlay.style.display === "" ? "flex" : "none";
}

/**
 * Toggles controls panel visibility and updates button text
 * @function
 */
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
 * Toggles touch controls visibility on tablets/iPads and medium screens
 * @function
 */
function toggleTouchControls() {
  const touchControls = document.getElementById("touch-controls");
  const toggleButton = document.getElementById("touch-toggle");

  if (touchControls && toggleButton) {
    const isCurrentlyVisible = touchControls.classList.contains("show") || touchControls.style.display === "block";
    touchControls.setAttribute("data-user-toggled", "true");

    if (isCurrentlyVisible) {
      touchControls.classList.remove("show");
      touchControls.style.display = "none";
      Object.assign(toggleButton, { textContent: "📱", title: "Touch-Controls anzeigen" });
    } else {
      touchControls.classList.add("show");
      touchControls.style.display = "block";
      Object.assign(toggleButton, { textContent: "✕", title: "Touch-Controls verbergen" });
    }
  }
}

/**
 * Checks if touch toggle should be shown (only during active gameplay)
 * @function
 * @returns {boolean} True if toggle should be shown
 */
function shouldShowTouchToggle() {
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isLargeTablet = window.innerWidth >= 1024 && window.innerHeight >= 768;
  const isGameActive = document.getElementById("canvas").style.display === "block";
  return isTouchDevice && isLargeTablet && isGameActive;
}

/**
 * Updates touch toggle button visibility based on device and game state
 * @function
 */
function updateTouchToggleVisibility() {
  const toggleButton = document.getElementById("touch-toggle");
  const touchControls = document.getElementById("touch-controls");
  if (!toggleButton || !touchControls) return;

  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isGameActive = document.getElementById("canvas").style.display === "block";
  const width = window.innerWidth;

  if (isTouchDevice && isGameActive && ((width >= 768 && width < 1024) || shouldShowTouchToggle())) {
    const isVisible = touchControls.classList.contains("show") || touchControls.style.display === "block";
    Object.assign(toggleButton, {
      style: { display: "flex" },
      textContent: isVisible ? "✕" : "📱",
      title: isVisible ? "Touch-Controls verbergen" : "Touch-Controls anzeigen",
    });
  } else {
    toggleButton.style.display = "none";
    if (!isGameActive) touchControls.classList.remove("show");
  }
}

/**
 * Initializes touch controls with event listeners
 * @function
 */
function initTouchControls() {
  const elements = { touchLeft: "LEFT", touchRight: "RIGHT", touchThrow: "D", touchAttack: "SPACE" };

  Object.entries(elements).forEach(([id, key]) => {
    const element = document.getElementById(id.replace(/([A-Z])/g, "-$1").toLowerCase());
    if (element) {
      ["touchstart", "touchend", "touchcancel"].forEach((event) => {
        element.addEventListener(event, (e) => {
          e.preventDefault();
          event === "touchcancel"
            ? Object.values(elements).forEach((k) => (keyboard[k] = false))
            : (keyboard[key] = event === "touchstart");
        });
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  initTouchControls();
  loadMuteStatus();
  updateTouchToggleVisibility();
  await ResourcePreloader.preloadAll();
});

/**
 * Shows game over screen and plays game over sound
 * @function
 */
function showGameOver() {
  world?.playGameOverSound?.();
  setGameScreens("over");
}

/**
 * Shows game won screen and plays win sound
 * @function
 */
function showGameWon() {
  world?.playWinSound?.();
  setGameScreens("won");
}
