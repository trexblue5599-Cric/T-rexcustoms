// Top unit bar, stance button, drag-to-scroll, win/lose screen.
const UI = {
  init() {
    const bar = document.getElementById('bar'), c = document.getElementById('c');
    this.btn = {};
    for (const k in CFG.units) {
      const b = document.createElement('button'); b.className = 'u';
      b.innerHTML = '<i>' + CFG.units[k].icon + '</i>' + CFG.units[k].cost;
      b.onclick = () => Game.train(k); bar.appendChild(b); this.btn[k] = b;
    }
    this.st = document.getElementById('stance');
    this.st.onclick = () => { Game.stance = Game.stance === 'attack' ? 'defend' : 'attack'; };
    this.stats = document.getElementById('stats');
    let sx = null, cam0 = 0;                   // drag the battlefield to look around
    c.onpointerdown = e => { sx = e.clientX; cam0 = Game.cam; c.setPointerCapture(e.pointerId); };
    c.onpointermove = e => { if (sx !== null) Game.cam = cam0 - (e.clientX - sx) / (c.height / CFG.viewH); };
    c.onpointerup = () => { sx = null; };
    this.msg = document.getElementById('msg');
    document.getElementById('again').onclick = () => Game.init();
  },
  refresh(G) {
    for (const k in this.btn)
      this.btn[k].disabled = G.gold < CFG.units[k].cost || G.pop() >= CFG.popCap || G.cool[k] > 0;
    this.stats.textContent = '🪙 ' + G.gold + '\n👥 ' + G.pop() + '/' + CFG.popCap;
    const key = G.stance;
    if (this.stKey !== key) {                  // only rewrite when it changes, so taps are not lost
      this.stKey = key;
      this.st.innerHTML = key === 'attack' ? '<i>⚔️</i>Attack' : '<i>🛡️</i>Defend';
    }
    this.msg.hidden = !G.over;
    document.getElementById('msgText').textContent = G.over === 'win' ? 'Victory!' : 'Defeat';
  }
};
