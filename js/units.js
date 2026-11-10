// One class for every unit type. Behaviour is driven by CFG.units[type].
class Unit {
  constructor(type, team, x) {
    this.type = type; this.team = team; this.x = x;
    this.d = team === 0 ? 1 : -1;            // facing direction
    this.def = CFG.units[type];
    this.hp = this.maxHp = this.def.hp;
    this.t = 0; this.walk = 0; this.acting = false;
    this.state = 'toMine'; this.carry = 0;
  }
  step(dt, gx) {
    this.d = Math.sign(gx - this.x) || this.d;
    this.x += this.d * Math.min(this.def.speed * dt, Math.abs(gx - this.x));
    this.walk += dt;
  }
  update(dt, G) {
    this.acting = false;
    if (this.type === 'miner') return this.mine(dt, G);
    this.t += dt;
    const d = this.def, foe = G.nearestFoe(this), dist = Math.abs(foe.x - this.x);
    if (dist <= d.range) {                     // attack
      this.acting = true; this.d = Math.sign(foe.x - this.x) || this.d;
      if (this.t >= d.rate) { this.t = 0; G.hit(this, foe); }
      return;
    }
    if (this.team === 0 && G.stance === 'defend' && dist >= d.sight) {
      if (Math.abs(CFG.defendX - this.x) > 8) this.step(dt, CFG.defendX);
    } else this.step(dt, foe.x);
  }
  mine(dt, G) {
    const home = CFG.playerStatueX + 40, rock = CFG.mineX - 26;
    if (this.state === 'toMine') {
      this.step(dt, rock);
      if (this.x === rock) { this.state = 'dig'; this.t = 0; }
    } else if (this.state === 'dig') {
      this.acting = true; this.walk += dt; this.t += dt;
      if (this.t >= CFG.mineTime) { this.carry = CFG.mineGold; this.state = 'toBase'; }
    } else {
      this.step(dt, home);
      if (this.x === home) { G.gold += this.carry; this.carry = 0; this.state = 'toMine'; }
    }
  }
}
