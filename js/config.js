// All game numbers live here. Change them freely.
const CFG = {
  worldW: 2400, viewH: 400, groundY: 320,
  startGold: 300, popCap: 25,
  playerStatueX: 120, enemyStatueX: 2280, statueHP: 1500,
  mineX: 420, mineTime: 1.5, mineGold: 12,
  defendX: 700,                       // where your army waits in Defend stance
  enemy: { interval: 8, minInterval: 3, speedUp: 0.05, mix: ['sword', 'sword', 'archer', 'spear'] },
  // cost = gold, cd = training cooldown (s), rate = seconds between attacks, range/sight = pixels
  units: {
    miner:  { label: 'Miner',  cost: 150, hp: 40,  speed: 60, cd: 2 },
    sword:  { label: 'Sword',  cost: 125, hp: 80,  speed: 70, dmg: 10, range: 22,  rate: 0.6, cd: 1.5, sight: 260 },
    archer: { label: 'Archer', cost: 300, hp: 50,  speed: 55, dmg: 8,  range: 220, rate: 1.1, cd: 2.5, sight: 300 },
    spear:  { label: 'Spear',  cost: 500, hp: 200, speed: 45, dmg: 20, range: 32,  rate: 1.0, cd: 4,   sight: 260 }
  }
};
