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
  if (world?.gameOver) return;
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
  if (world?.gameOver) return;
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

  function startGame(){
    console.log('Fehler');
    
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-over').style.display = 'none';
  document.getElementById('canvas').style.display = 'block';
  document.getElementById("game-over").style.display = "none";
  document.getElementById("mute-button").style.display = "block";
  bttnDisappear()
  initLevel();
  init();
}

function showStartScreen() {
  document.getElementById("start-screen").style.display = "flex";
  document.getElementById('game-over').style.display = 'none';
  document.getElementById('canvas').style.display = 'none';
  document.getElementById("game-over").style.display = "none";
  document.getElementById("mute-button").style.display = "none";
  bttnDisappear();
}

function bttnDisappear(){
  console.log('buttons verschwinden');
  
  document.getElementById('restart-button').style.display = 'none';
  document.getElementById('menu-button').style.display = 'none';
}

function checkOrientation(){
  const overlay = document.getElementById('rotate-screen');
  if (window.innerHeight > window.innerWidth) {
      overlay.style.display = 'flex';
  } else {
    overlay.style.display = 'none';
  }

  
}

 function toggleMute() {
    const icon = document.getElementById('mute-icon');
    isMuted = !isMuted;

    if (isMuted) {
      icon.src = './img/logo/mute.png'; 
    } else {
      icon.src = './img/logo/volume.png'; 
    }
  }

