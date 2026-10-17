// ============================================================
//  CAR RENDERER
//  Pure function that turns state + config → SVG string.
//  Does not touch the DOM except via the returned string.
// ============================================================

const CarRenderer = (() => {

  function _wheel(cx, cy, r, rimColor, spokes) {
    let spokeLines = '';
    const innerR = r * 0.55;
    for (let i = 0; i < spokes; i++) {
      const angle = (i * 360) / spokes;
      const rad = (angle * Math.PI) / 180;
      const x = cx + Math.cos(rad) * innerR;
      const y = cy + Math.sin(rad) * innerR;
      spokeLines += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"
                       stroke="${rimColor}" stroke-width="2.5" stroke-linecap="round"/>`;
    }
    return `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0f0f0f" stroke="#111" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="${innerR}" fill="none"
              stroke="${rimColor}" stroke-width="3"/>
      ${spokeLines}
      <circle cx="${cx}" cy="${cy}" r="${r * 0.15}" fill="${rimColor}"/>
    `;
  }

  function render(state) {
    const paint   = CONFIG.paints.find(p => p.id === state.paint)   || CONFIG.paints[0];
    const wheel   = CONFIG.wheels.find(w => w.id === state.wheel)   || CONFIG.wheels[0];
    const finish  = CONFIG.finishes.find(f => f.id === state.finish)|| CONFIG.finishes[0];
    const g       = CONFIG.carGeometry;

    const bodyFill = paint.hex;
    const bodyOpacity = finish.opacity;
    const bodyFilter = finish.extraFilter
      ? `style="filter:${finish.extraFilter}"`
      : '';

    return `
      <svg class="car-svg" viewBox="${g.viewBox}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Customized car">
        <!-- shadow -->
        <ellipse cx="200" cy="172" rx="160" ry="10" fill="rgba(0,0,0,0.45)"/>

        <!-- body -->
        <path d="${g.bodyPath}"
              fill="${bodyFill}"
              fill-opacity="${bodyOpacity}"
              stroke="#0b0b0b" stroke-width="1.5"
              ${bodyFilter}
              class="car-body"/>

        <!-- windows -->
        <path d="${g.windowPath}" fill="#1b1f2c" stroke="#3a4155" stroke-width="1.2"/>

        <!-- headlight + taillight -->
        <circle cx="${g.headlight.cx}" cy="${g.headlight.cy}" r="${g.headlight.r}"
                fill="#f5e56b" style="filter:drop-shadow(0 0 6px #f5e56b)"/>
        <circle cx="${g.taillight.cx}" cy="${g.taillight.cy}" r="${g.taillight.r}"
                fill="#ef4444" style="filter:drop-shadow(0 0 5px #ef4444)"/>

        <!-- wheels -->
        ${_wheel(g.wheelFront.cx, g.wheelFront.cy, g.wheelFront.r, wheel.rimColor, wheel.spokes)}
        ${_wheel(g.wheelRear.cx,  g.wheelRear.cy,  g.wheelRear.r,  wheel.rimColor, wheel.spokes)}
      </svg>
    `;
  }

  return { render };
})();
