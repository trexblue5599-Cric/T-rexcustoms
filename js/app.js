// ============================================================
//  APP — state management and DOM wiring.
//  Builds controls from CONFIG, listens for clicks, re-renders.
// ============================================================

(() => {
  // ---- State ----
  const state = { ...CONFIG.defaults };

  // ---- DOM refs ----
  const els = {
    carStage:      document.getElementById('carStage'),
    carSpecs:      document.getElementById('carSpecs'),
    paintSwatches: document.getElementById('paintSwatches'),
    wheelOptions:  document.getElementById('wheelOptions'),
    finishOptions: document.getElementById('finishOptions'),
    summary:       document.getElementById('summary'),
    resetBtn:      document.getElementById('resetBtn'),
  };

  // ---- Control builders ----

  function buildPaints() {
    els.paintSwatches.innerHTML = CONFIG.paints.map(p => `
      <button class="swatch ${state.paint === p.id ? 'is-active' : ''}"
              style="background:${p.hex}"
              data-paint="${p.id}"
              title="${p.name}"
              aria-label="${p.name}"
              type="button"></button>
    `).join('');
  }

  function buildWheels() {
    els.wheelOptions.innerHTML = CONFIG.wheels.map(w => `
      <button class="option ${state.wheel === w.id ? 'is-active' : ''}"
              data-wheel="${w.id}" type="button">
        <span class="option__dot" style="background:${w.rimColor}"></span>
        ${w.name}
      </button>
    `).join('');
  }

  function buildFinishes() {
    els.finishOptions.innerHTML = CONFIG.finishes.map(f => `
      <button class="option ${state.finish === f.id ? 'is-active' : ''}"
              data-finish="${f.id}" type="button">
        ${f.name}
      </button>
    `).join('');
  }

  // ---- Read-only renders ----

  function renderCar() {
    els.carStage.innerHTML = CarRenderer.render(state);
  }

  function renderSpecs() {
    const paint  = CONFIG.paints.find(p => p.id === state.paint);
    const wheel  = CONFIG.wheels.find(w => w.id === state.wheel);
    const finish = CONFIG.finishes.find(f => f.id === state.finish);
    els.carSpecs.innerHTML = `
      <li class="chip"><i>●</i>${paint.name}</li>
      <li class="chip"><i>◉</i>${wheel.name}</li>
      <li class="chip"><i>✦</i>${finish.name}</li>
    `;
  }

  function renderSummary() {
    const paint  = CONFIG.paints.find(p => p.id === state.paint);
    const wheel  = CONFIG.wheels.find(w => w.id === state.wheel);
    const finish = CONFIG.finishes.find(f => f.id === state.finish);
    els.summary.innerHTML = `
      <div class="summary__row"><dt>Paint</dt><dd>${paint.name}</dd></div>
      <div class="summary__row"><dt>Wheels</dt><dd>${wheel.name}</dd></div>
      <div class="summary__row"><dt>Finish</dt><dd>${finish.name}</dd></div>
    `;
  }

  // ---- Full refresh ----
  function renderAll() {
    renderCar();
    renderSpecs();
    renderSummary();
    buildPaints();
    buildWheels();
    buildFinishes();
  }

  // ---- Event delegation ----
  function bindEvents() {
    els.paintSwatches.addEventListener('click', e => {
      const btn = e.target.closest('[data-paint]');
      if (!btn) return;
      state.paint = btn.dataset.paint;
      renderAll();
    });

    els.wheelOptions.addEventListener('click', e => {
      const btn = e.target.closest('[data-wheel]');
      if (!btn) return;
      state.wheel = btn.dataset.wheel;
      renderAll();
    });

    els.finishOptions.addEventListener('click', e => {
      const btn = e.target.closest('[data-finish]');
      if (!btn) return;
      state.finish = btn.dataset.finish;
      renderAll();
    });

    els.resetBtn.addEventListener('click', () => {
      Object.assign(state, CONFIG.defaults);
      renderAll();
    });
  }

  // ---- Init ----
  function init() {
    bindEvents();
    renderAll();
  }

  init();
})();
