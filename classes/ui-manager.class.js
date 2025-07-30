/**
 * UI Manager class that handles user interface elements and messages
 * @class UIManager
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class UIManager {
  /**
   * Creates a new UI manager instance
   * @constructor
   * @param {World} world - Reference to the game world
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Shows an animated bonus message on screen
   * @param {string} message - The message to display
   */
  showBonusMessage(message) {
    const messageElement = this.createBonusElement(message);
    const style = this.createBonusStyles();

    document.head.appendChild(style);
    document.body.appendChild(messageElement);

    setTimeout(() => {
      document.body.removeChild(messageElement);
      document.head.removeChild(style);
    }, 3500);
  }

  /**
   * Creates a bonus message DOM element
   * @param {string} message - The message text
   * @returns {HTMLElement} The styled message element
   */
  createBonusElement(message) {
    const element = document.createElement("div");
    element.textContent = message;
    element.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: linear-gradient(45deg, gold, orange); color: white;
      padding: 20px 40px; border-radius: 15px; font-size: 24px;
      font-family: 'Fredericka', cursive; font-weight: bold;
      text-align: center; z-index: 2000; box-shadow: 0 0 30px gold;
      animation: bounce 0.6s ease-in-out, fadeOut 2s ease-in-out 1.5s forwards;
    `;
    return element;
  }

  /**
   * Creates CSS styles for bonus message animations
   * @returns {HTMLStyleElement} The style element with animation CSS
   */
  createBonusStyles() {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translate(-50%, -50%) translateY(0); }
        40% { transform: translate(-50%, -50%) translateY(-30px); }
        60% { transform: translate(-50%, -50%) translateY(-15px); }
      }
      @keyframes fadeOut {
        to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      }
    `;
    return style;
  }

  /**
   * Updates touch controls for active gameplay
   */
  updateTouchControlsForGameplay() {
    if (typeof updateTouchControls === "function") {
      updateTouchControls();
    }
  }

  /**
   * Hides touch controls when game ends
   */
  hideTouchControlsOnGameEnd() {
    const touchControls = document.getElementById("touch-controls");
    const toggleButton = document.getElementById("touch-toggle");

    if (touchControls) {
      touchControls.style.display = "none";
      touchControls.classList.remove("show");
    }

    if (toggleButton) {
      toggleButton.style.display = "none";
    }
  }
}
