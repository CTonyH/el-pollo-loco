/**
 * Game-specific audio manager that handles world audio functionality
 * @class GameAudioManager
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class GameAudioManager {
  /**
   * Creates a new game audio manager instance
   * @constructor
   * @param {World} world - Reference to the game world
   */
  constructor(world) {
    this.world = world;
    this.backgroundMusic = null;
  }

  /**
   * Sets up the background music for the game
   */
  setupBackgroundMusic() {
    this.backgroundMusic = AudioManager.getAudio("audio/main-menu.mp3");
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = 0.15;
      this.backgroundMusic.loop = true;
    } else {
      console.warn("Failed to load background music");
    }
  }

  /**
   * Starts playing the background music
   */
  startBackgroundMusic() {
    if (
      typeof isMuted !== "undefined" &&
      !isMuted &&
      this.backgroundMusic &&
      (this.backgroundMusic.paused || this.backgroundMusic.currentTime === 0)
    ) {
      this.backgroundMusic.play().catch((e) => console.log("Background music failed:", e));
    }
  }

  /**
   * Stops the background music
   */
  stopBackgroundMusic() {
    if (this.backgroundMusic) this.backgroundMusic.pause();
  }

  /**
   * Pauses the background music
   */
  pauseBackgroundMusic() {
    this.stopBackgroundMusic();
  }

  /**
   * Plays the game over sound effect
   */
  playGameOverSound() {
    AudioManager.safePlay("audio/gameover.mp3", 0.5);
  }

  /**
   * Plays the win sound effect
   */
  playWinSound() {
    AudioManager.safePlay("audio/win.mp3", 0.5);
  }

  /**
   * Plays bonus sound effect
   */
  playBonusSound() {
    AudioManager.safePlay("audio/collect-coin.mp3", 0.6);
  }

  /**
   * Plays coin collection sound
   */
  playCoinCollectedSound() {
    AudioManager.safePlay("audio/collect-coin.mp3", 0.4);
  }

  /**
   * Plays bottle throw sound
   */
  playBottleThrowSound() {
    AudioManager.safePlay("audio/bottle-throw.mp3", 0.3);
  }

  /**
   * Plays damage sound
   */
  playDamageSound() {
    AudioManager.safePlay("audio/damage.mp3", 0.5);
  }
}
