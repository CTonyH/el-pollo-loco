/**
 * Resource preloader for game assets
 * Handles preloading of images, audio, and other game resources
 * @class ResourcePreloader
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class ResourcePreloader {
  /** @type {Object} Cache of preloaded images */
  static imageCache = {};

  /** @type {boolean} Whether preloading is complete */
  static loaded = false;

  /**
   * Preloads all game resources
   * @static
   * @returns {Promise<void>}
   */
  static async preloadAll() {
    if (this.loaded) return;

    const loadingScreen = this.showLoadingScreen();

    try {
      await Promise.all([this.preloadImages(), AudioManager.preloadAllAudio()]);

      this.loaded = true;
      this.hideLoadingScreen(loadingScreen);
    } catch (error) {
      console.log("Preloading error:", error);
      this.hideLoadingScreen(loadingScreen);
    }
  }

  /**
   * Shows a loading screen
   * @static
   * @returns {HTMLElement}
   */
  static showLoadingScreen() {
    const existing = document.getElementById("resource-loading");
    if (existing) return existing;

    const loadingDiv = document.createElement("div");
    loadingDiv.id = "resource-loading";
    loadingDiv.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); display: flex; align-items: center;
      justify-content: center; z-index: 9999; color: white;
      font-family: 'Fredericka', cursive; font-size: 24px;
    `;
    loadingDiv.innerHTML = `
      <div style="text-align: center;">
        <div>🌵 Lade Spiel-Ressourcen... 🐔</div>
        <div style="margin-top: 20px; font-size: 16px;">Bitte warten...</div>
      </div>
    `;

    document.body.appendChild(loadingDiv);
    return loadingDiv;
  }

  /**
   * Hides the loading screen
   * @static
   * @param {HTMLElement} loadingScreen
   */
  static hideLoadingScreen(loadingScreen) {
    if (loadingScreen && loadingScreen.parentNode) {
      loadingScreen.parentNode.removeChild(loadingScreen);
    }
  }

  /**
   * Preloads all game images
   * @static
   * @returns {Promise<void>}
   */
  static async preloadImages() {
    const imagePaths = [
      "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
      "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
      "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
      "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
      "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
    ];

    const loadPromises = imagePaths.map((path) => this.preloadImage(path));
    await Promise.allSettled(loadPromises);
  }

  /**
   * Preloads a single image
   * @static
   * @param {string} src - Image source path
   * @returns {Promise<HTMLImageElement>}
   */
  static preloadImage(src) {
    return new Promise((resolve) => {
      if (this.imageCache[src]) {
        resolve(this.imageCache[src]);
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.imageCache[src] = img;
        resolve(img);
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  /**
   * Gets a preloaded image from cache
   * @static
   * @param {string} src - Image source path
   * @returns {HTMLImageElement|null}
   */
  static getImage(src) {
    return this.imageCache[src] || null;
  }
}
