// Start-up and the main loop.
Render.init(document.getElementById('c'));
Game.init();
UI.init();
addEventListener('resize', () => Render.resize());
Render.resize();
let last = performance.now();
function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  Game.update(dt);
  Render.draw(Game);
  UI.refresh(Game);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
