// ============================================================
//  CONFIG — everything tweakable in one place.
// ============================================================

export const CONFIG = {
  // -------- Model --------
  modelPath: 'assets/models/car.glb',

  // -------- Paints (applied to body material) --------
  paints: [
    { id: 'midnight', name: 'Midnight Blue',  hex: '#1e3a5f', metalness: 0.9, roughness: 0.3 },
    { id: 'crimson',  name: 'Crimson Red',    hex: '#b91c1c', metalness: 0.9, roughness: 0.25 },
    { id: 'sunburst', name: 'Sunburst Yellow',hex: '#f5c518', metalness: 0.85, roughness: 0.3 },
    { id: 'forest',   name: 'Forest Green',   hex: '#14532d', metalness: 0.9, roughness: 0.3 },
    { id: 'pearl',    name: 'Pearl White',    hex: '#e5e7eb', metalness: 0.6, roughness: 0.2 },
    { id: 'graphite', name: 'Graphite',       hex: '#374151', metalness: 0.95, roughness: 0.35 },
    { id: 'violet',   name: 'Ultra Violet',   hex: '#6d28d9', metalness: 0.9, roughness: 0.25 },
    { id: 'orange',   name: 'Lava Orange',    hex: '#ea580c', metalness: 0.9, roughness: 0.3 },
  ],

  // -------- Wheels (rim color applied to a named wheel material) --------
  // NOTE: your .glb must have wheel meshes whose material name
  // matches `materialName` (e.g. "WheelMaterial"). Adjust per model.
  wheels: [
    { id: 'sport',  name: 'Sport Alloy', rimHex: '#cbd5e1', metalness: 1.0, roughness: 0.2 },
    { id: 'black',  name: 'Black Alloy', rimHex: '#1f2937', metalness: 1.0, roughness: 0.4 },
    { id: 'gold',   name: 'Gold Edition',rimHex: '#d4af37', metalness: 1.0, roughness: 0.15 },
    { id: 'chrome', name: 'Chrome',      rimHex: '#e5e7eb', metalness: 1.0, roughness: 0.05 },
  ],

  // -------- Finishes (material property presets) --------
  finishes: [
    { id: 'gloss',   name: 'Gloss',    roughnessMul: 0.8, clearcoat: 1.0, clearcoatRoughness: 0.05 },
    { id: 'metallic',name: 'Metallic', roughnessMul: 0.7, clearcoat: 1.0, clearcoatRoughness: 0.1  },
    { id: 'matte',   name: 'Matte',    roughnessMul: 1.4, clearcoat: 0.0, clearcoatRoughness: 1.0  },
    { id: 'chrome',  name: 'Chrome',   roughnessMul: 0.2, clearcoat: 1.0, clearcoatRoughness: 0.0  },
  ],

  // -------- Default selection --------
  defaults: {
    paint: 'midnight',
    wheel: 'sport',
    finish: 'gloss',
  },

  // -------- Camera --------
  camera: {
    fov: 40,
    position: [4.5, 1.8, 5.5],
    target: [0, 0.6, 0],
  },
}; 
