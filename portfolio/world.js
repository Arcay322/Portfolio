import * as THREE from './vendor/three.module.min.js';
import { OrbitControls } from './vendor/OrbitControls.js';
import { mergeGeometries } from './vendor/BufferGeometryUtils.js';
import { places as locations } from './places.js';

export function startWorld({ onSelect, onReady, onFailure, isReducedMotion = false }) {
const $ = id => document.getElementById(id);
let reducedMotion = isReducedMotion;
let activePlace = null, cameraTransition = null;
let controls, camera, renderer, scene, animationId;
const home = { camera: [21, 17, 25], target: [0, 1.4, 0] };
function openPlace(name) { onSelect(name); }
function flyTo(position, target) {
  const destination = new THREE.Vector3(...position);
  if (innerWidth < 600) destination.multiplyScalar(1.18);
  if (reducedMotion) { camera.position.copy(destination); controls.target.set(...target); controls.update(); return; }
  cameraTransition = { started: performance.now(), from: camera.position.clone(), to: destination, fromTarget: controls.target.clone(), toTarget: new THREE.Vector3(...target) };
}
try {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#657c72');
  scene.fog = new THREE.FogExp2('#75897a', .018);
  camera = new THREE.PerspectiveCamera(36, innerWidth / innerHeight, .1, 220);
  camera.position.set(...home.camera);
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power', alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  $('landscape').appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(...home.target);
  controls.enableDamping = true;
  controls.dampingFactor = .06;
  controls.enablePan = false;
  controls.minDistance = 18;
  controls.maxDistance = 46;
  controls.minPolarAngle = .45;
  controls.maxPolarAngle = 1.25;
  controls.minAzimuthAngle = -.7;
  controls.maxAzimuthAngle = 1.45;
  controls.autoRotate = false;
  controls.addEventListener('start', () => { cameraTransition = null; });
  scene.add(new THREE.HemisphereLight('#d8e0c3', '#253d35', 2.2));
  const sun = new THREE.DirectionalLight('#ffe4b4', 3.6);
  sun.position.set(-8, 22, 11);
  sun.castShadow = true;
  sun.shadow.mapSize.set(innerWidth < 600 ? 1024 : 2048, innerWidth < 600 ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -19, right: 19, top: 20, bottom: -16, near: .5, far: 65 });
  sun.shadow.bias = -.0005;
  sun.shadow.normalBias = .035;
  scene.add(sun);
  const light = new THREE.DirectionalLight('#b9d8db', .8); light.position.set(15, 5, -10); scene.add(light);
  const world = new THREE.Group(); scene.add(world);
  let seed = 35219;
  const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const stoneMaterials = Array.from({ length: 8 }, (_, i) => new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(.14, .07 + i * .003, .32 + i * .024), roughness: .99, flatShading: true }));
  const dirtMat = new THREE.MeshStandardMaterial({ color: '#656957', roughness: 1, flatShading: true });
  const grassMat = new THREE.MeshStandardMaterial({ color: '#7b8860', roughness: 1, flatShading: true });
  const goldMat = new THREE.MeshStandardMaterial({ color: '#bca266', metalness: .5, roughness: .5 });
  const darkMat = new THREE.MeshStandardMaterial({ color: '#223d35', roughness: 1 });
  const glowMat = new THREE.MeshStandardMaterial({ color: '#efcc83', emissive: '#d8a64f', emissiveIntensity: 1.6, roughness: .4 });
  function block(x, y, z, w, h, d, material = stoneMaterials[Math.floor(rand() * 8)], group = world) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh); return mesh;
  }
  function rock(x, y, z, size, material = stoneMaterials[2], group = world) {
    const geo = new THREE.DodecahedronGeometry(size, 0);
    const mesh = new THREE.Mesh(geo, material); mesh.position.set(x, y, z); mesh.scale.set(1.2, .65 + rand() * .6, .9); mesh.rotation.set(rand(), rand() * 6, rand()); mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh); return mesh;
  }
  function stoneWall(cx, cy, cz, width, height, depth, rotation = 0) {
    const g = new THREE.Group(); g.position.set(cx, cy, cz); g.rotation.y = rotation; world.add(g);
    const rows = Math.ceil(height / .53);
    for (let row = 0; row < rows; row++) {
      let left = -width / 2;
      while (left < width / 2 - .02) {
        const segment = Math.min(.65 + rand() * .6, width / 2 - left);
        const h = height / rows - .025;
        const mesh = block(left + segment / 2, (row + .5) * height / rows, (rand() - .5) * .035, segment - .025, h, depth + rand() * .05, undefined, g);
        mesh.rotation.z = (rand() - .5) * .022;
        left += segment;
      }
    }
    return g;
  }
  // Irregular highland ground, continuous with the terraces.
  const terrainGeo = new THREE.PlaneGeometry(130, 130, 30, 30);
  terrainGeo.rotateX(-Math.PI / 2);
  const pos = terrainGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const edge = Math.max(0, Math.sqrt(x * x + z * z) - 12);
    pos.setY(i, -1.5 + rand() * .25 + Math.sin(x * .2) * Math.cos(z * .15) * edge * .05);
  }
  terrainGeo.computeVertexNormals();
  const ground = new THREE.Mesh(terrainGeo, new THREE.MeshStandardMaterial({ color: '#63765b', flatShading: true, roughness: 1 })); ground.receiveShadow = true; world.add(ground);
  // Layered retaining walls and grass-capped agricultural terraces.
  for (let level = 0; level < 5; level++) {
    const w = 19 - level * 2.4, depth = 15 - level * 1.8, y = -1 + level * .62, z = -level * .5;
    block(0, y, z, w, .58, depth, dirtMat);
    block(0, y + .31, z, w - .12, .07, depth - .13, grassMat);
    stoneWall(0, y - .28, z + depth / 2, w, .58, .42);
    stoneWall(-w / 2, y - .28, z, depth, .58, .42, Math.PI / 2);
    stoneWall(w / 2, y - .28, z, depth, .58, .42, Math.PI / 2);
  }
  // A continuous stairway climbing the terraces.
  for (let i = 0; i < 19; i++) block(.35, -.55 + i * .165, 8.2 - i * .54, 1.65, .24, .65, stoneMaterials[5]);
  // Upper ceremonial court, stepped entry, and a trapezoidal portal.
  const topY = 2.05;
  block(0, 1.65, -4.4, 7.7, .9, 6.2, dirtMat);
  for (let x = -3; x <= 3; x++) for (let z = -6; z <= -2; z++) block(x * .95, topY + (rand() - .5) * .035, z, .92, .16, .97, stoneMaterials[4]);
  stoneWall(-3.7, 1.6, -4.4, 6.3, 1.4, .7, Math.PI / 2);
  stoneWall(3.7, 1.6, -4.4, 6.3, 1.4, .7, Math.PI / 2);
  stoneWall(0, 1.6, -7.3, 7.7, 1.8, .7);
  // Portal pillars taper inward, leaving a true open doorway.
  for (let row = 0; row < 7; row++) {
    const y = topY + row * .49;
    const inset = row * .045;
    block(-1.55 + inset, y + .25, -5.5, .84, .46, 1.1);
    block(1.55 - inset, y + .25, -5.5, .84, .46, 1.1);
  }
  block(0, topY + 3.58, -5.5, 3.55, .65, 1.25, stoneMaterials[6]);
  block(0, topY + 4, -5.5, 3.85, .22, 1.42, stoneMaterials[3]);
  // Gold stepped symbol inset above the portal: a geometric artistic motif.
  const emblem = new THREE.Group(); emblem.position.set(0, topY + 3.6, -4.85); world.add(emblem);
  block(0, 0, 0, .23, .55, .055, goldMat, emblem); block(0, 0, .01, .55, .23, .055, goldMat, emblem);
  // Flanking niches echo trapezoidal stonework without naming sacred spaces.
  [-2.9, 2.9].forEach((x) => { stoneWall(x, topY, -5.7, 1.5, 2.2, .75); block(x, topY + 1.25, -5.25, .55, .8, .12, darkMat); });
  // Ventify workshop courtyard, lower left.
  const workshop = new THREE.Group(); workshop.position.set(-4.8, .55, 3.1); world.add(workshop);
  block(0, .1, 0, 4.2, .3, 3.1, stoneMaterials[3], workshop);
  // Stone courses in the workshop are deliberately irregular.
  for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) block(-1.7 + k * .82, .55 + r * .48, -1.25, .79, .45, .56, undefined, workshop);
  for (let r = 0; r < 3; r++) { block(-1.85, .55 + r * .48, -.2, .55, .45, 1.8, undefined, workshop); block(1.85, .55 + r * .48, -.2, .55, .45, 1.8, undefined, workshop); }
  block(-.75, .5, .25, .8, .7, .7, stoneMaterials[6], workshop);
  block(.75, .5, .25, .8, .7, .7, stoneMaterials[6], workshop);
  block(0, .95, .25, 2.8, .25, 1, stoneMaterials[4], workshop);
  [-.7, 0, .7].forEach((x) => block(x, 1.18, .3, .22, .22, .22, goldMat, workshop));
  // IMPREX: two terraces linked by a narrow stone bridge.
  block(4.6, 1.75, .1, 4.3, .65, 3.5, dirtMat);
  block(4.6, 2.1, .1, 4.5, .15, 3.6, stoneMaterials[4]);
  stoneWall(6.4, 1.8, -.1, 3.6, 1.8, .7, Math.PI / 2);
  stoneWall(4.8, 1.8, -1.55, 3.8, 2.1, .7);
  for (let i = 0; i < 9; i++) { block(1.1 + i * .5, 2.3, .2, .49, .22, 1.6, stoneMaterials[4]); if (i % 2 === 0) { block(1.1 + i * .5, 2.7, -.58, .14, .7, .14, stoneMaterials[3]); block(1.1 + i * .5, 2.7, .98, .14, .7, .14, stoneMaterials[3]); } }
  // Golden light traces along the bridge handrails.
  block(3.1, 3.05, -.58, 4.4, .055, .055, goldMat);
  block(3.1, 3.05, .98, 4.4, .055, .055, goldMat);
  // Paths, broken perimeter walls and smaller stone details.
  for (let i = 0; i < 9; i++) block(-5.2 + i * .6, .67, 4.8, .5, .09, .8, stoneMaterials[3]);
  stoneWall(-6, .6, -.8, 3, .9, .5);
  stoneWall(6.7, -.2, 4.5, 3, .8, .6);
  for (let i = 0; i < 75; i++) {
    const a = rand() * Math.PI * 2, radius = 10 + rand() * 10;
    rock(Math.cos(a) * radius, -1.3, Math.sin(a) * radius, .2 + rand() * .8);
  }
  // Sparse highland grasses. Shared geometries and materials keep draw calls bounded.
  const bladeGeo = new THREE.ConeGeometry(.09, .6, 3);
  const grassColors = ['#889465', '#748458', '#9a9c6c'];
  for (let batch = 0; batch < 3; batch++) {
    const grass = new THREE.InstancedMesh(bladeGeo, new THREE.MeshStandardMaterial({ color: grassColors[batch], roughness: 1, flatShading: true }), 160);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 160; i++) {
      const x = (rand() - .5) * 37, z = (rand() - .5) * 32;
      let y = -1.2;
      for (let l = 0; l < 5; l++) if (Math.abs(x) < (19 - l * 2.4) / 2 && Math.abs(z + l * .5) < (15 - l * 1.8) / 2) y = -.6 + l * .62;
      if ((Math.abs(x) < 2 && z > -7 && z < 9) || (Math.abs(x) < 4.1 && z < -1 && z > -7)) { dummy.position.set(0, -20, 0); }
      else dummy.position.set(x, y + .15, z);
      dummy.rotation.set((rand() - .5) * .3, rand() * 6, (rand() - .5) * .5);
      dummy.scale.setScalar(.5 + rand() * .8); dummy.updateMatrix(); grass.setMatrixAt(i, dummy.matrix);
    }
    world.add(grass);
  }
  // Mountain silhouettes, coarse geometry for a hand-shaped horizon.
  for (let i = 0; i < 18; i++) {
    const x = (i - 9) * 7, z = -24 - rand() * 20, height = 9 + rand() * 14;
    const mountain = new THREE.Mesh(new THREE.ConeGeometry(8 + rand() * 6, height, 5 + Math.floor(rand() * 3)), new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(.38, .09, .26 + rand() * .09), flatShading: true, roughness: 1 }));
    mountain.position.set(x, height / 2 - 3, z); mountain.rotation.y = rand() * 6; scene.add(mountain);
  }
  world.updateMatrixWorld(true);
  const batches = new Map();
  const staticMeshes = [];
  world.traverse(object => {
    if (object.isMesh && !object.isInstancedMesh) {
      const copy = object.geometry.clone().applyMatrix4(object.matrixWorld);
      const geometry = copy.index ? copy.toNonIndexed() : copy;
      if (copy !== geometry) copy.dispose();
      if (!batches.has(object.material)) batches.set(object.material, []);
      batches.get(object.material).push(geometry);
      staticMeshes.push(object);
    }
  });
  staticMeshes.forEach(object => { object.parent.remove(object); object.geometry.dispose(); });
  batches.forEach((geometries, material) => {
    const merged = mergeGeometries(geometries, false);
    geometries.forEach(geometry => geometry.dispose());
    const mesh = new THREE.Mesh(merged, material);
    mesh.castShadow = true; mesh.receiveShadow = true; scene.add(mesh);
  });
  // Slow drifting motes and marker lights guide exploration.
  const motesGeo = new THREE.BufferGeometry();
  const motes = new Float32Array(160 * 3);
  for (let i = 0; i < motes.length; i += 3) { motes[i] = (rand() - .5) * 35; motes[i + 1] = rand() * 12; motes[i + 2] = (rand() - .5) * 25; }
  motesGeo.setAttribute('position', new THREE.BufferAttribute(motes, 3));
  const dust = new THREE.Points(motesGeo, new THREE.PointsMaterial({ color: '#e4c895', size: .035, transparent: true, opacity: .5, depthWrite: false })); scene.add(dust);
  const pickable = [];
  Object.entries(locations).forEach(([name, place]) => {
    const marker = new THREE.Mesh(new THREE.OctahedronGeometry(.14), glowMat);
    marker.position.set(...place.point); marker.position.y -= .65;
    marker.userData.place = name; marker.userData.baseY = marker.position.y;
    world.add(marker); pickable.push(marker);
    const spot = new THREE.PointLight('#e7b865', 1.4, 3); spot.position.copy(marker.position); world.add(spot);
  });
  const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2();
  let pointerDown;
  renderer.domElement.addEventListener('pointerdown', (e) => { pointerDown = { x: e.clientX, y: e.clientY }; });
  renderer.domElement.addEventListener('pointerup', (e) => {
    if (!pointerDown || Math.hypot(e.clientX - pointerDown.x, e.clientY - pointerDown.y) > 8) return;
    pointer.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(pickable)[0];
    if (hit) openPlace(hit.object.userData.place);
  });
  function resize() {
    camera.aspect = innerWidth / innerHeight;
    // Offset the world to leave breathing room for the author's name.
    camera.setViewOffset(innerWidth, innerHeight, innerWidth < 600 ? 0 : -innerWidth * .16, innerWidth < 600 ? -innerHeight * .13 : 0, innerWidth, innerHeight);
    camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight);
  }
  addEventListener('resize', resize); resize();
  if (innerWidth < 600) camera.position.multiplyScalar(1.2);
  controls.update();
  onReady?.();
  const labelVector = new THREE.Vector3();
  const labels = [...document.querySelectorAll('.world-label')];
  let lastFrame = 0;
  let visible = true;
  const visibilityChanged = () => { visible = !document.hidden; };
  document.addEventListener('visibilitychange', visibilityChanged);
  function animate(now) {
    animationId = requestAnimationFrame(animate);
    if (!visible || now - lastFrame < (innerWidth < 600 ? 32 : 24)) return;
    lastFrame = now;
    if (cameraTransition) {
      const t = Math.min((now - cameraTransition.started) / 1600, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      camera.position.lerpVectors(cameraTransition.from, cameraTransition.to, eased);
      controls.target.lerpVectors(cameraTransition.fromTarget, cameraTransition.toTarget, eased);
      if (t === 1) cameraTransition = null;
    }
    if (!reducedMotion) {
      dust.rotation.y = now * .000008;
      pickable.forEach((marker, i) => { marker.position.y = marker.userData.baseY + Math.sin(now * .0015 + i) * .08; marker.rotation.y = now * .0006; });
    }
    controls.update();
    labels.forEach((label) => {
      const p = locations[label.dataset.place].point;
      labelVector.set(...p).project(camera);
      const x = (labelVector.x * .5 + .5) * innerWidth;
      const y = (-labelVector.y * .5 + .5) * innerHeight;
      label.style.left = `${x}px`; label.style.top = `${y}px`;
      const hide = labelVector.z > 1 || x < 50 || x > innerWidth - 50 || y < 90 || y > innerHeight - 140 || (activePlace && activePlace !== label.dataset.place);
      label.style.visibility = hide ? 'hidden' : 'visible';
    });
    renderer.render(scene, camera);
  }
  animate(0);
  renderer.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); cancelAnimationFrame(animationId); onFailure?.(); });
  return {
    focus(name) { if (!locations[name]) return; activePlace = name; flyTo(locations[name].camera, locations[name].target); },
    reset() { activePlace = null; flyTo(home.camera, home.target); },
    setMotion(paused) { reducedMotion = paused; },
    dispose() {
      cancelAnimationFrame(animationId);
      removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibilityChanged);
      controls.dispose(); renderer.dispose(); renderer.domElement.remove();
      scene.traverse(object => { object.geometry?.dispose(); if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => material.dispose()); });
    },
  };
} catch (error) {
  cancelAnimationFrame(animationId);
  controls?.dispose(); renderer?.dispose(); renderer?.domElement.remove();
  onFailure?.(error);
  return null;
}
}
