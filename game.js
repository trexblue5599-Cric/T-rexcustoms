// --- UI AND GAME LOGIC ---
let currentGold = 350;
let phaserGame = null; // Variable to hold the Phaser instance

// Function to transition from Menu to Game
function startGame(mode) {
  document.getElementById('menu-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  
  // Reset Gold
  currentGold = 350;
  updateGoldUI();

  // Initialize Phaser only if it hasn't been created yet
  if (!phaserGame) {
    initPhaser();
  } else {
    // If game already exists, resume it
    phaserGame.scene.resume('MainScene');
  }
}

// Function to return to Menu
function goToMenu() {
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('menu-screen').classList.remove('hidden');
  
  // Pause the game engine so it stops running in the background
  if (phaserGame) {
    phaserGame.scene.pause('MainScene');
  }
}

// Update the gold text on screen
function updateGoldUI() {
  document.getElementById('gold').innerText = currentGold;
}

// Handle Recruit Buttons
function recruit(type, cost) {
  if (currentGold >= cost) {
    currentGold -= cost;
    updateGoldUI();
    console.log("Spawned unit: " + type);
    // Here you will eventually tell Phaser to spawn a unit sprite
  } else {
    alert("Not enough gold!");
  }
}

// Handle Command Buttons
function commandArmy(action) {
  console.log("Army command: " + action);
}

// --- PHASER ENGINE SETUP ---
function initPhaser() {
  const config = {
    type: Phaser.AUTO,
    width: 800,       // Game width
    height: 600,      // Game height
    parent: 'game-container', // Injects the canvas into this div
    scale: {
      mode: Phaser.Scale.FIT, // Makes it resize to fit the screen
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
      key: 'MainScene',
      preload: preload,
      create: create,
      update: update
    },
    backgroundColor: '#90ee90' // Light green background
  };

  phaserGame = new Phaser.Game(config);
}

// --- PHASER SCENE FUNCTIONS ---
function preload() {
  // We will load actual images here later (stickmen, castles, etc.)
}

function create() {
  // 1. Draw the Ground
  // this.add.rectangle(x, y, width, height, color)
  this.add.rectangle(400, 450, 800, 300, 0x8FBC8F).setOrigin(0.5); 
  
  // 2. Draw the Blue Base (Left)
  this.add.rectangle(100, 400, 60, 150, 0x0000FF).setOrigin(0.5);
  
  // 3. Draw the Red Base (Right)
  this.add.rectangle(700, 400, 60, 150, 0xFF0000).setOrigin(0.5);

  // 4. Add Text
  this.add.text(400, 50, 'Prepare your army!', { fontFamily: 'Courier', fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
  this.add.text(100, 300, 'BLUE KINGDOM', { fontFamily: 'Courier', fontSize: '14px', color: '#ffffff' }).setOrigin(0.5);
  this.add.text(700, 300, 'RED KINGDOM', { fontFamily: 'Courier', fontSize: '14px', color: '#ffffff' }).setOrigin(0.5);
}

function update() {
  // This runs 60 times a second. 
  // Later, you will put the logic to move your units here!
}
