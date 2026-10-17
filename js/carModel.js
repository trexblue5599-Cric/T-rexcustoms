// ============================================================
//  CAR MODEL — loads the GLB and applies paint/wheel/finish.
//  You may need to tweak `bodyMatName` / `wheelMatName` for
//  your specific .glb (inspect it in https://gltf-viewer.donmccurdy.com/)
// ============================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CONFIG } from './config.js';

// ---- Names to look for in your model's materials ----
const BODY_MAT_NAME  = /toycar|body|paint|car_body/i;
const WHEEL_MAT_NAME = /fabric/i;

export async function loadCar(scene, onProgress) {
  const loader = new GLTFLoader();

  const gltf = await new Promise((resolve, reject) => {
    loader.load(
      CONFIG.modelPath,
      resolve,
      (e) => {
        if (e.total) onProgress?.(Math.round((e.loaded / e.total) * 100));
      },
      reject
    );
  });

  const car = gltf.scene;

  // Fit + center + shadows
  car.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
      if (obj.material) {
        // Enforce PBR + allow clearcoat if supported
        obj.material.envMapIntensity = 1.2;
      }
    }
  });

  // Auto-scale to a target size (~4 units long)
  const box = new THREE.Box3().setFromObject(car);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 4 / maxDim;
  car.scale.setScalar(scale);

  // Re-center on ground
  box.setFromObject(car);
  const center = box.getCenter(new THREE.Vector3());
  car.position.x -= center.x;
  car.position.z -= center.z;
  car.position.y -= box.min.y;

  scene.add(car);

  // ---- Collect body & wheel materials ----
  const bodyMats  = new Set();
  const wheelMats = new Set();

  car.traverse((obj) => {
    if (!obj.isMesh || !obj.material) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    mats.forEach((m) => {
      if (!m || !m.name) return;
      if (BODY_MAT_NAME.test(m.name))  bodyMats.add(m);
      if (WHEEL_MAT_NAME.test(m.name)) wheelMats.add(m);
    });
  });

  // Fallback: if nothing matched, treat the largest material as body
  if (bodyMats.size === 0) {
    const all = [];
    car.traverse((o) => o.isMesh && o.material && all.push(o.material));
    if (all.length) bodyMats.add(all[0]);
  }

  return { car, bodyMats: [...bodyMats], wheelMats: [...wheelMats] };
}

// ---- Apply paint + finish to body materials ----
export function applyPaint(bodyMats, paint, finish) {
  bodyMats.forEach((m) => {
    if (!m.color) return;
    m.color.set(paint.hex);
    if ('metalness' in m) m.metalness = paint.metalness;
    if ('roughness' in m) m.roughness = paint.roughness * (finish.roughnessMul ?? 1);
    if ('clearcoat' in m) {
      m.clearcoat = finish.clearcoat;
      m.clearcoatRoughness = finish.clearcoatRoughness;
    }
    m.needsUpdate = true;
  });
}

// ---- Apply wheel color ----
export function applyWheels(wheelMats, wheel) {
  wheelMats.forEach((m) => {
    if (!m.color) return;
    m.color.set(wheel.rimHex);
    if ('metalness' in m) m.metalness = wheel.metalness;
    if ('roughness' in m) m.roughness = wheel.roughness;
    m.needsUpdate = true;
  });
}
