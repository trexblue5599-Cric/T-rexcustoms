// ============================================================
//  APP — state + UI. Wires config → controls → 3D scene.
// ============================================================

import { CONFIG } from './config.js';
import { createScene } from './scene.js';
import { loadCar, applyPaint, applyWheels } from './carModel.js';

(async () => {
  // ---- DOM ----
  const els = {
    canvas:        document.getElementById('sceneCanvas'),
    loader:        document.getElementById('loader'),
    carSpecs:      document.getElementById('carSpecs'),
    paintSwatches: document.getElementById('paintSwatches'),
    wheelOptions:  document.getElementById('wheelOptions'),
    finishOptions: document.getElementById('finishOptions'),
    summary:       document.getElementById('summary'),
    resetBtn:      document.getElementById('resetBtn'),
  };

  // ---- State ----
  const state = { ...CONFIG.defaults };

  // ---- 3D ----
  const three = createScene(els.canvas);

  let carRefs = { bodyMats: [], wheelMats: [] };
  try {
    carRefs = await loadCar(three.scene, (p) => {
      els.loader.textContent = `Loading car… ${p}%`;
    });
    els.loader.classList.add('is-hidden');
  } catch (err) {
    console.error(err);
    els.loader.textContent = 'Failed to load car model';
  }

  // ---- UI builders ----
  function buildPaints() {
    els.paintSwatches.innerHTML = CONFIG.paints.map((p) => `
      <button class="swatch ${state.paint === p.id ? 'is-active' : ''}"
              style="background:${p.hex}"
              data-paint="${p.id}"
              title="${p.name}"
              aria-label="${p.name}"
              type="button"></button>
    `).join('');
  }

  function buildWheels() {
    els.wheelOptions.innerHTML = CONFIG.wheels.map((w) => `
      <button class="option ${state.wheel === w.id ? 'is-active' : ''}"
              data-wheel="${w.id}" type="button">
        <span class="option__dot" style="background:${w.rimHex}"></span>
        ${w.name}
      </button>
    `).join('');
  }

  function buildFinishes() {
    els.finishOptions.innerHTML = CONFIG.finishes.map((f) => `
      <button class="option ${state.finish === f.id ? 'is-active' : ''}"
              data-finish="${f.id}" type="button">${f.name}</button>
    `).join('');
  }

  // ---- Apply state to 3D ----
  function applyState() {
    const paint  = CONFIG.paints.find((p) => p.id === state.paint)   || CONFIG.paints[0];
    const wheel  = CONFIG.wheels.find((w) => w.id === state.wheel)   || CONFIG.wheels[0];
    const finish = CONFIG.finishes.find((f) => f.id === state.finish)|| CONFIG.finishes[0];

    applyPaint(carRefs.bodyMats, paint, finish);
    applyWheels(carRefs.wheelMats, wheel);

    // specs + summary
    els.carSpecs.innerHTML = `
      <li class="chip"><i>●</i>${paint.name}</li>
      <li class="chip"><i>◉</i>${wheel.name}</li>
      <li class="chip"><i>✦</i>${finish.name}</li>
    `;
    els.summary.innerHTML = `
      <div class="summary__row"><dt>Paint</dt><dd>${paint.name}</dd></div>
      <div class="summary__row"><dt>Interior</dt><dd>${wheel.name}</dd></div>
      <div class="summary__row"><dt>Finish</dt><dd>${finish.name}</dd></div>
    `;
  }

  function renderAll() {
    buildPaints();
    buildWheels();
    buildFinishes();
    applyState();
  }

  // ---- Events ----
  els.paintSwatches.addEventListener('click', (e) => {
    const b = e.target.closest('[data-paint]'); if (!b) return;
    state.paint = b.dataset.paint; renderAll();
  });
  els.wheelOptions.addEventListener('click', (e) => {
    const b = e.target.closest('[data-wheel]'); if (!b) return;
    state.wheel = b.dataset.wheel; renderAll();
  });
  els.finishOptions.addEventListener('click', (e) => {
    const b = e.target.closest('[data-finish]'); if (!b) return;
    state.finish = b.dataset.finish; renderAll();
  });
  els.resetBtn.addEventListener('click', () => {
    Object.assign(state, CONFIG.defaults); renderAll();
  });

  renderAll();
})();
