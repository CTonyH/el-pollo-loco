/**
 * Keyboard input handler class
 * Tracks the state of various keyboard keys for game controls
 * @class Keyboard
 * @author El Pollo Loco Team
 * @since 1.0.0
 */
class Keyboard {
  /** @type {boolean} Left arrow key state */
  LEFT = false;

  /** @type {boolean} Right arrow key state */
  RIGHT = false;

  /** @type {boolean} Up arrow key state */
  UP = false;

  /** @type {boolean} Down arrow key state */
  DOWN = false;

  /** @type {boolean} Spacebar key state (jump/attack) */
  SPACE = false;

  /** @type {boolean} D key state (throw bottles) */
  D = false;
}
