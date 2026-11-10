// Everything that draws to the canvas.
const Render = {
  init(canvas) { this.c = canvas; this.g = canvas.getContext('2d'); },
  resize() { this.c.width = this.c.clientWidth; this.c.height = this.c.clientHeight; },
  draw(G) {
    const c = this.c, g = this.g, gy = CFG.groundY, s = c.height / CFG.viewH, vw = c.width / s;
    G.cam = Math.max(0, Math.min(G.cam, CFG.worldW - vw));
    g.setTransform(s, 0, 0, s, -G.cam * s, 0);
    // sunset sky, sun, mountains
    const sky = g.createLinearGradient(0, 0, 0, gy);
    sky.addColorStop(0, '#2b1d5c'); sky.addColorStop(0.55, '#b8344a'); sky.addColorStop(1, '#ffb347');
    g.fillStyle = sky; g.fillRect(G.cam, 0, vw, gy);
    const sx = G.cam + vw * 0.62;
    const glow = g.createRadialGradient(sx, gy - 60, 10, sx, gy - 60, 120);
    glow.addColorStop(0, '#ffe27acc'); glow.addColorStop(1, '#ffe27a00');
    g.fillStyle = glow; g.fillRect(sx - 130, gy - 190, 260, 260);
    g.fillStyle = '#ffe27a'; g.beginPath(); g.arc(sx, gy - 60, 50, 0, 7); g.fill();
    g.fillStyle = '#3a1f4f'; g.beginPath();
    const o = G.cam * 0.5; g.moveTo(o, gy);
    for (let x = 0; x <= CFG.worldW; x += 120) g.lineTo(o + x, gy - ((x / 120) % 2 ? 40 : 110 + (x * 7) % 50));
    g.lineTo(o + CFG.worldW, gy); g.fill();
    // grass
    const gr = g.createLinearGradient(0, gy, 0, CFG.viewH);
    gr.addColorStop(0, '#4aa03c'); gr.addColorStop(1, '#1f5a22');
    g.fillStyle = gr; g.fillRect(G.cam, gy, vw, CFG.viewH - gy);
    g.strokeStyle = '#2c7a2c'; g.lineWidth = 2; g.beginPath();
    for (let x = Math.floor(G.cam / 37) * 37; x < G.cam + vw; x += 37) {
      const y = gy + 8 + (x * 13) % 55;
      g.moveTo(x, y); g.lineTo(x + 4, y - 8); g.moveTo(x + 8, y); g.lineTo(x + 4, y - 8);
    }
    g.stroke();
    this.mine(g, CFG.mineX);
    G.statues.forEach(st => this.statue(g, st));
    G.units.slice().sort((a, b) => (a.def.scale || 1) - (b.def.scale || 1)).forEach(u => this.unit(g, u));
    for (const f of G.fx) {                    // arrows and magic bolts
      g.strokeStyle = f.c || '#fff'; g.lineWidth = f.c ? 4 : 1.5;
      g.beginPath(); g.moveTo(f.x1, gy - 24); g.lineTo(f.x2, gy - 24); g.stroke();
    }
    g.font = 'bold 15px sans-serif'; g.textAlign = 'center'; g.lineWidth = 3;
    for (const n of G.nums) {                  // red floating damage numbers
      g.globalAlpha = Math.min(1, n.t * 2); g.strokeStyle = '#000'; g.fillStyle = '#e22';
      g.strokeText(n.v, n.x, n.y); g.fillText(n.v, n.x, n.y);
    }
    g.globalAlpha = 1; g.textAlign = 'left';
  },
  bar(g, x, y, w, p) {
    g.fillStyle = '#000a'; g.fillRect(x - w / 2, y, w, 5);
    g.fillStyle = p > 0.5 ? '#4c4' : '#e44'; g.fillRect(x - w / 2, y, w * Math.max(0, p), 5);
  },
  mine(g, x) {                                 // pile of gold
    const gy = CFG.groundY;
    g.fillStyle = '#777'; g.beginPath(); g.ellipse(x + 34, gy - 6, 16, 10, 0, 0, 7); g.fill();
    for (let i = 0; i < 9; i++) {
      g.fillStyle = i % 2 ? '#f2c94c' : '#e0a800'; g.beginPath();
      g.ellipse(x - 40 + i * 10, gy - 4 - (i % 3) * 5 - (i === 4 ? 8 : 0), 11, 7, 0, 0, 7); g.fill();
    }
  },
  statue(g, st) {                              // big stone stickman pointing at the enemy
    const gy = CFG.groundY, x = st.x, d = st.team ? -1 : 1;
    g.fillStyle = '#666'; g.beginPath(); g.ellipse(x, gy - 6, 42, 16, 0, 0, 7); g.fill();
    g.strokeStyle = g.fillStyle = st.team ? '#a8605a' : '#9a9a9a'; g.lineWidth = 9; g.lineCap = 'round';
    g.beginPath();
    g.moveTo(x, gy - 108); g.lineTo(x, gy - 58);
    g.moveTo(x, gy - 58); g.lineTo(x - 16, gy - 14); g.moveTo(x, gy - 58); g.lineTo(x + 16, gy - 14);
    g.moveTo(x, gy - 98); g.lineTo(x + d * 44, gy - 100); g.moveTo(x, gy - 98); g.lineTo(x - d * 12, gy - 70);
    g.stroke();
    g.beginPath(); g.arc(x, gy - 122, 14, 0, 7); g.fill();
    this.bar(g, x, gy - 150, 70, st.hp / st.max);
  },
  unit(g, u) {                                 // drawn facing right, then flipped by u.d
    const gy = CFG.groundY, T = u.type, sc = u.def.scale || 1;
    const sw = Math.sin(u.walk * 10) * 6, hit = u.acting ? Math.sin((u.t + u.walk) * 14) * 7 : 0;
    const hx = 9, hy = -20 + hit;
    g.save(); g.translate(u.x, gy); g.scale(u.d * sc, sc);
    g.lineCap = 'round'; g.lineWidth = 3;
    g.strokeStyle = g.fillStyle = u.team ? '#b3241c' : '#111';
    g.beginPath();
    g.moveTo(0, -32); g.lineTo(0, -14);
    g.moveTo(0, -14); g.lineTo(-sw, 0); g.moveTo(0, -14); g.lineTo(sw, 0);
    g.moveTo(0, -28); g.lineTo(hx, hy);
    g.stroke();
    g.beginPath(); g.arc(0, -38, 6, 0, 7); g.fill();
    if (T === 'miner') {
      g.strokeStyle = '#8a6a2a'; g.beginPath(); g.moveTo(hx - 2, hy + 4); g.lineTo(hx + 12, hy - 16); g.stroke();
      g.strokeStyle = '#ccc'; g.beginPath(); g.moveTo(hx + 6, hy - 18); g.lineTo(hx + 18, hy - 12); g.stroke();
    } else if (T === 'sword') {
      g.strokeStyle = '#ddd'; g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx + 16, hy - 12); g.stroke();
    } else if (T === 'archer') {
      g.strokeStyle = '#caa05a'; g.beginPath(); g.arc(hx + 4, -24, 13, -1.3, 1.3); g.stroke();
    } else if (T === 'spear') {                // golden helmet, crest, shield, long spear
      g.fillStyle = '#e0b030'; g.beginPath(); g.arc(0, -40, 7, Math.PI, 0); g.fill(); g.fillRect(-1, -52, 2, 6);
      g.beginPath(); g.arc(hx + 2, -22, 10, 0, 7); g.fill();
      g.strokeStyle = '#ddd'; g.lineWidth = 2; g.beginPath(); g.moveTo(-6, -12); g.lineTo(hx + 30, hy - 14); g.stroke();
    } else if (T === 'mage') {                 // pointy hat, robe, glowing staff
      g.fillStyle = '#6a2fb5'; g.beginPath(); g.moveTo(-8, -43); g.lineTo(0, -62); g.lineTo(8, -43); g.fill();
      g.beginPath(); g.moveTo(-7, -30); g.lineTo(7, -30); g.lineTo(11, -4); g.lineTo(-11, -4); g.fill();
      g.strokeStyle = '#8a6a2a'; g.beginPath(); g.moveTo(hx, hy + 10); g.lineTo(hx + 4, hy - 24); g.stroke();
      g.fillStyle = '#6cf'; g.beginPath(); g.arc(hx + 4, hy - 27, 5, 0, 7); g.fill();
    } else if (T === 'giant') {                // big club
      g.strokeStyle = '#5a3a1a'; g.lineWidth = 4; g.beginPath(); g.moveTo(hx, hy + 6); g.lineTo(hx + 16, hy - 22); g.stroke();
      g.fillStyle = '#777'; g.beginPath(); g.arc(hx + 18, hy - 26, 7, 0, 7); g.fill();
    }
    if (u.carry) { g.fillStyle = '#f2c94c'; g.fillRect(-4, -56, 8, 8); }
    g.restore();
    if (u.hp < u.maxHp) this.bar(g, u.x, gy - 60 * sc - 6, 24 * Math.max(1, sc * 0.8), u.hp / u.maxHp);
  }
};
