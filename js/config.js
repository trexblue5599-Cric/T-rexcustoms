// ============================================================
//  CONFIG — change anything here to update the whole app.
//  Colors, wheels, finishes, car shapes, default state.
// ============================================================

const CONFIG = {
  // -------- Paints --------
  paints: [
    { id: 'midnight',  name: 'Midnight Blue',  hex: '#1e3a5f' },
    { id: 'crimson',   name: 'Crimson Red',    hex: '#b91c1c' },
    { id: 'sunburst',  name: 'Sunburst Yellow',hex: '#f5c518' },
    { id: 'forest',    name: 'Forest Green',   hex: '#14532d' },
    { id: 'pearl',     name: 'Pearl White',    hex: '#e5e7eb' },
    { id: 'graphite',  name: 'Graphite',       hex: '#374151' },
    { id: 'violet',    name: 'Ultra Violet',   hex: '#6d28d9' },
    { id: 'orange',    name: 'Lava Orange',    hex: '#ea580c' },
  ],

  // -------- Wheels --------
  wheels: [
    { id: 'sport',   name: 'Sport 5-Spoke', rimColor: '#cbd5e1', spokes: 5 },
    { id: 'turbine', name: 'Turbine',       rimColor: '#94a3b8', spokes: 12 },
    { id: 'black',   name: 'Black Alloy',   rimColor: '#1f2937', spokes: 5 },
    { id: 'gold',    name: 'Gold Edition',  rimColor: '#d4af37', spokes: 6 },
  ],

  // -------- Finishes --------
  finishes: [
    { id: 'gloss',   name: 'Gloss',   opacity: 1,    extraFilter: '' },
    { id: 'metallic',name: 'Metallic',opacity: 0.95, extraFilter: 'brightness(1.15)' },
    { id: 'matte',   name: 'Matte',   opacity: 0.85, extraFilter: 'saturate(0.7)' },
    { id: 'chrome',  name: 'Chrome',  opacity: 1,    extraFilter: 'contrast(1.2) brightness(1.3)' },
  ],

  // -------- Default selection --------
  defaults: {
    paint: 'midnight',
    wheel: 'sport',
    finish: 'gloss',
  },

  // -------- Car geometry (viewBox + shapes) --------
  // All coords assume viewBox "0 0 400 200".
  // Edit path values here to change car silhouette.
  carGeometry: {
    viewBox: '0 0 400 200',
    bodyPath: 'M 60 120 L 80 80 Q 120 55 200 55 Q 280 55 320 80 L 340 120 Q 360 130 350 150 L 320 155 L 80 155 L 50 150 Q 40 130 60 120 Z',
    windowPath: 'M 110 85 Q 150 65 200 65 Q 250 65 290 85 L 280 110 L 120 110 Z',
    wheelFront: { cx: 130, cy: 155, r: 22 },
    wheelRear:  { cx: 290, cy: 155, r: 22 },
    headlight: { cx: 340, cy: 125, r: 6 },
    taillight: { cx: 60,  cy: 125, r: 5 },
  },
}; 
