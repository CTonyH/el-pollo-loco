/**
 * Audio management class for game sound effects and music
 * Handles preloading, pooling, and safe playback of audio files
 * @class AudioManager
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class AudioManager {
  /** @type {Object} Cache of preloaded audio objects */
  static audioCache = {};

  /** @type {Object} Audio pools for frequently used sounds */
  static audioPools = {};

  /** @type {boolean} Whether audio system is initialized */
  static initialized = false;

  /**
   * Preloads all game audio files
   * @static
   * @returns {Promise<void>}
   */
  static async preloadAllAudio() {
    if (this.initialized) return;

    const audioFiles = [
      "audio/main-menu.mp3",
      "audio/collect-coin.mp3",
      "audio/gameover.mp3",
      "audio/win.mp3",
      "audio/bottle-throw.mp3",
      "audio/bottle-broke.mp3",
      "audio/damage.mp3",
      "audio/jump.mp3",
      "audio/walk.mp3",
      "audio/snore.mp3",
      "audio/endboss.mp3",
    ];

    const loadPromises = audioFiles.map((file) => this.preloadAudio(file));
    await Promise.allSettled(loadPromises);
    this.createAudioPools();
    this.initialized = true;
  }

  /**
   * Preloads a single audio file
   * @static
   * @param {string} src - Audio file path
   * @returns {Promise<HTMLAudioElement>}
   */
  static preloadAudio(src) {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.preload = "auto";
      audio.addEventListener("canplaythrough", () => resolve(audio), { once: true });
      audio.addEventListener("error", () => resolve(null), { once: true });
      audio.src = src;
      this.audioCache[src] = audio;
    });
  }

  /**
   * Creates audio pools for frequently used sounds
   * @static
   */
  static createAudioPools() {
    const pooledSounds = ["audio/collect-coin.mp3", "audio/bottle-throw.mp3", "audio/bottle-broke.mp3"];

    pooledSounds.forEach((src) => {
      this.audioPools[src] = [];
      for (let i = 0; i < 3; i++) {
        const audio = new Audio(src);
        audio.preload = "auto";
        audio.volume = 0.4;
        this.audioPools[src].push(audio);
      }
    });
  }

  /**
   * Gets an available audio instance from pool or cache
   * @static
   * @param {string} src - Audio file path
   * @returns {HTMLAudioElement|null}
   */
  static getAudio(src) {
    if (this.audioPools[src]) {
      const available = this.audioPools[src].find((audio) => audio.paused || audio.ended);
      if (available) return available;
    }
    return this.audioCache[src] || null;
  }

  /**
   * Safely plays an audio file
   * @static
   * @param {string} src - Audio file path
   * @param {number} volume - Volume level (0-1)
   * @param {boolean} loop - Whether to loop the audio
   * @returns {Promise<void>}
   */
  static async safePlay(src, volume = 0.4, loop = false) {
    if (typeof isMuted !== "undefined" && isMuted) return;

    const audio = this.getAudio(src);
    if (!audio) return;

    try {
      audio.volume = volume;
      audio.loop = loop;
      audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      console.log(`Audio play failed for ${src}:`, error.name);
    }
  }

  /**
   * Stops all audio playback
   * @static
   */
  static stopAll() {
    Object.values(this.audioCache).forEach((audio) => {
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    Object.values(this.audioPools).forEach((pool) => {
      pool.forEach((audio) => {
        if (!audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    });
  }
}
