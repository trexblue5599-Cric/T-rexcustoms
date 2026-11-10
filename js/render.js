// Everything that draws to the canvas.
const Render = {
  init(canvas) { this.c = canvas; this.g = canvas.getContext('2d'); },
  resize() { this.c.width = this.c.clientWidth; this.c.height = this.c.clientHeight; },
  draw(G) {
    const c = this.c, g = this.g, gy = CFG.groundY, s = c.height / CFG.viewH, vw = c.width / s;
    G.cam = Math.max(0, Math.min(G.cam, CFG.worldW - vw));
    g.setTransform(s, 0, 0, s, -G.cam * s, 0);
    const sky = g.createLinearGradient(0, 0, 0, gy);
    sky.addColorStop(0, '#5aa9d6'); sky.addColorStop(1, '#cfe9f5');
    g.fillStyle = sky; g.fillRect(G.cam, 0, vw, gy);
    g.fillStyle = '#8aa88a';
    for (let x = 0; x < CFG.worldW; x += 400) {
      g.beginPath(); g.moveTo(x, gy); g.quadraticCurveTo(x + 200, gy - 90, x + 400, gy); g.fill();
    }
    g.fillStyle = '#4a7c3a'; g.fillRect(G.cam, gy, vw, CFG.viewH - gy);
    this.mine(g, CFG.mineX);
    G.statues.forEach(st => this.statue(g, st));
    G.units.forEach(u => this.unit(g, u));
    g.strokeStyle = '#fff'; g.lineWidth = 1.5;
    for (const f of G.fx) { g.beginPath(); g.moveTo(f.x1, gy - 24); g.lineTo(f.x2, gy - 24); g.stroke(); }
    g.setTransform(1, 0, 0, 1, 0, 0);          // HUD
    g.fillStyle = '#fff'; g.font = 'bold 16px sans-serif';
    g.fillText('Gold ' + G.gold + '   Pop ' + G.pop() + '/' + CFG.popCap + '   Stance: ' + G.stance, 10, 22);
  },
  bar(g, x, y, w, p) {
    g.fillStyle = '#000a'; g.fillRect(x - w / 2, y, w, 5);
    g.fillStyle = p > 0.5 ? '#4c4' : '#e44'; g.fillRect(x - w / 2, y, w * Math.max(0, p), 5);
  },
  mine(g, x) {
    const gy = CFG.groundY;
    g.fillStyle = '#6b6b6b'; g.beginPath(); g.moveTo(x - 30, gy); g.lineTo(x - 12, gy - 40);
    g.lineTo(x + 10, gy - 28); g.lineTo(x + 30, gy); g.fill();
    g.fillStyle = '#f2c94c'; g.fillRect(x - 6, gy - 22, 8, 8); g.fillRect(x + 8, gy - 14, 6, 6);
  },
  statue(g, st) {
    const gy = CFG.groundY, x = st.x;
    g.fillStyle = '#888'; g.fillRect(x - 22, gy - 30, 44, 30);
    g.fillStyle = st.team ? '#b53a2f' : '#2f6fb5';
    g.fillRect(x - 10, gy - 90, 20, 60); g.beginPath(); g.arc(x, gy - 100, 12, 0, 7); g.fill();
    this.bar(g, x, gy - 125, 60, st.hp / st.max);
  },
  unit(g, u) {
    const gy = CFG.groundY, x = u.x, d = u.d, sw = Math.sin(u.walk * 10) * 6;
    const hit = u.acting ? Math.sin(u.t * 14 + u.walk * 14) * 6 : 0;
    g.strokeStyle = u.team ? '#b53a2f' : '#1b3f6e'; g.lineWidth = 3; g.lineCap = 'round';
    g.beginPath();
    g.moveTo(x, gy - 32); g.lineTo(x, gy - 14);
    g.moveTo(x, gy - 14); g.lineTo(x - sw, gy);
    g.moveTo(x, gy - 14); g.lineTo(x + sw, gy);
    g.moveTo(x, gy - 28); g.lineTo(x + d * 9, gy - 20 + hit);
    g.stroke();
    g.beginPath(); g.arc(x, gy - 38, 6, 0, 7); g.stroke();
    g.strokeStyle = '#d8d8d8'; g.beginPath();
    if (u.type === 'miner') { g.strokeStyle = '#c9b27c'; g.moveTo(x + d * 9, gy - 20 + hit); g.lineTo(x + d * 19, gy - 34 + hit); }
    else if (u.type === 'sword') { g.moveTo(x + d * 9, gy - 20 + hit); g.lineTo(x + d * 24, gy - 32 + hit); }
    else if (u.type === 'spear') { g.moveTo(x - d * 4, gy - 14); g.lineTo(x + d * 34, gy - 34 + hit); }
    else g.arc(x + d * 10, gy - 24, 12, d > 0 ? -1.3 : Math.PI - 1.3, d > 0 ? 1.3 : Math.PI + 1.3);
    g.stroke();
    if (u.carry) { g.fillStyle = '#f2c94c'; g.fillRect(x - 4, gy - 56, 8, 8); }
    if (u.hp < u.maxHp) this.bar(g, x, gy - 62, 24, u.hp / u.maxHp);
  }
};
