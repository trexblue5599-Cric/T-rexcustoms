// Game state and rules. No drawing here.
const Game = {
  init() {
    Object.assign(this, {
      gold: CFG.startGold, units: [], fx: [], cool: {}, stance: 'attack',
      over: null, cam: 0, clock: 0, etimer: 3,
      statues: [0, 1].map(team => ({
        team, hp: CFG.statueHP, max: CFG.statueHP,
        x: team === 0 ? CFG.playerStatueX : CFG.enemyStatueX
      }))
    });
    this.spawn('miner', 0); this.spawn('miner', 0);
  },
  pop() { return this.units.filter(u => u.team === 0).length; },
  spawn(type, team) {
    const x = team === 0 ? CFG.playerStatueX + 50 : CFG.enemyStatueX - 50;
    this.units.push(new Unit(type, team, x));
  },
  train(type) {
    const d = CFG.units[type];
    if (this.over || this.gold < d.cost || this.pop() >= CFG.popCap || this.cool[type] > 0) return;
    this.gold -= d.cost; this.cool[type] = d.cd; this.spawn(type, 0);
  },
  nearestFoe(u) {                              // closest enemy unit, else enemy statue
    let best = this.statues[1 - u.team], bd = Math.abs(best.x - u.x);
    for (const o of this.units) {
      const dd = Math.abs(o.x - u.x);
      if (o.team !== u.team && dd < bd) { best = o; bd = dd; }
    }
    return best;
  },
  hit(a, b) {
    b.hp -= a.def.dmg;
    if (a.def.range > 60) this.fx.push({ x1: a.x, x2: b.x, t: 0.15 });
  },
  update(dt) {
    if (this.over) return;
    this.clock += dt;
    for (const k in this.cool) this.cool[k] = Math.max(0, this.cool[k] - dt);
    if ((this.etimer -= dt) <= 0) {            // enemy reinforcements
      const m = CFG.enemy.mix;
      this.spawn(m[Math.floor(Math.random() * m.length)], 1);
      this.etimer = Math.max(CFG.enemy.minInterval, CFG.enemy.interval - this.clock * CFG.enemy.speedUp);
    }
    for (const u of this.units) u.update(dt, this);
    this.units = this.units.filter(u => u.hp > 0);
    for (const f of this.fx) f.t -= dt;
    this.fx = this.fx.filter(f => f.t > 0);
    if (this.statues[1].hp <= 0) this.over = 'win';
    else if (this.statues[0].hp <= 0) this.over = 'lose';
  }
};
