// Buttons, drag-to-scroll, win/lose screen.
const UI = {
  init() {
    const bar = document.getElementById('bar'), c = document.getElementById('c');
    this.btn = {};
    for (const k in CFG.units) {
      const b = document.createElement('button');
      b.onclick = () => Game.train(k); bar.appendChild(b); this.btn[k] = b;
    }
    this.st = document.createElement('button'); this.st.className = 'stance';
    this.st.onclick = () => { Game.stance = Game.stance === 'attack' ? 'defend' : 'attack'; };
    bar.appendChild(this.st);
    let sx = null, cam0 = 0;                   // drag the battlefield to look around
    c.onpointerdown = e => { sx = e.clientX; cam0 = Game.cam; c.setPointerCapture(e.pointerId); };
    c.onpointermove = e => { if (sx !== null) Game.cam = cam0 - (e.clientX - sx) / (c.height / CFG.viewH); };
    c.onpointerup = () => { sx = null; };
    this.msg = document.getElementById('msg');
    document.getElementById('again').onclick = () => Game.init();
  },
  refresh(G) {
    for (const k in this.btn) {
      const d = CFG.units[k], b = this.btn[k];
      b.textContent = d.label + ' ' + d.cost;
      b.disabled = G.gold < d.cost || G.pop() >= CFG.popCap || G.cool[k] > 0;
    }
    this.st.textContent = G.stance === 'attack' ? 'Attack' : 'Defend';
    this.msg.hidden = !G.over;
    document.getElementById('msgText').textContent = G.over === 'win' ? 'Victory!' : 'Defeat';
  }
};
