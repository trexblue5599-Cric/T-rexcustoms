// ============================================================
//  SCENE — renderer, camera, lights, controls, loop.
//  Knows nothing about the car or the UI.
// ============================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CONFIG } from './config.js';

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  scene.background = null; // transparent → CSS gradient shows through

  // ---- Camera ----
  const camera = new THREE.PerspectiveCamera(
    CONFIG.camera.fov,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );
  camera.position.set(...CONFIG.camera.position);

  // ---- Controls ----
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(...CONFIG.camera.target);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 3;
  controls.maxDistance = 12;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.update();

  // ---- Lights ----
  const hemi = new THREE.HemisphereLight(0xffffff, 0x222233, 0.9);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(5, 8, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 30;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x9bb8ff, 1.2);
  rim.position.set(-6, 4, -4);
  scene.add(rim);

  const fill = new THREE.PointLight(0xffffff, 0.5);
  fill.position.set(0, 3, 5);
  scene.add(fill);

  // ---- Ground (soft shadow catcher) ----
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(8, 48),
    new THREE.ShadowMaterial({ opacity: 0.35 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  scene.add(ground);

  // ---- Responsive ----
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // ---- Render loop ----
  let raf = 0;
  function tick() {
    raf = requestAnimationFrame(tick);
    controls.update();
    renderer.render(scene, camera);
  }
  tick();

  return {
    scene,
    camera,
    renderer,
    controls,
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
    },
  };
                           } 
