import test from 'node:test';
import assert from 'node:assert/strict';
const THREE = await import('../../dist/assets/vendor/three.module.min.js');
const { applyKeyboardControl } = await import('../../dist/assets/world.js');

function cameraAt(position) {
  return { position: new THREE.Vector3(...position), lookAt() {} };
}

function orbitControls(camera, target = [0, 0, 0]) {
  return {
    target: new THREE.Vector3(...target),
    minDistance: 18,
    maxDistance: 46,
    minPolarAngle: 0.45,
    maxPolarAngle: 1.25,
    minAzimuthAngle: -0.7,
    maxAzimuthAngle: 1.45,
    update() {},
    reset() {
      camera.position.set(21, 17, 25);
      this.target.set(0, 1.4, 0);
    },
  };
}

test('keyboard orbit follows the scene limits and ignores unrelated keys', () => {
  const camera = cameraAt([21, 17, 25]);
  const controls = orbitControls(camera, [0, 1.4, 0]);
  const initialTheta = new THREE.Spherical().setFromVector3(
    camera.position.clone().sub(controls.target)
  ).theta;

  assert.equal(applyKeyboardControl('ArrowRight', camera, controls), true);
  const movedTheta = new THREE.Spherical().setFromVector3(
    camera.position.clone().sub(controls.target)
  ).theta;
  assert.ok(movedTheta > initialTheta);

  for (let i = 0; i < 50; i++) applyKeyboardControl('ArrowRight', camera, controls);
  let spherical = new THREE.Spherical().setFromVector3(
    camera.position.clone().sub(controls.target)
  );
  assert.ok(spherical.theta <= controls.maxAzimuthAngle + 1e-9);
  for (let i = 0; i < 50; i++) applyKeyboardControl('ArrowLeft', camera, controls);
  spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
  assert.ok(spherical.theta >= controls.minAzimuthAngle - 1e-9);
  for (let i = 0; i < 50; i++) applyKeyboardControl('ArrowUp', camera, controls);
  spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
  assert.ok(spherical.phi >= controls.minPolarAngle - 1e-9);
  for (let i = 0; i < 50; i++) applyKeyboardControl('ArrowDown', camera, controls);
  spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
  assert.ok(spherical.phi <= controls.maxPolarAngle + 1e-9);
  assert.equal(applyKeyboardControl('Tab', camera, controls), false);
});

test('keyboard zoom stays inside the scene distance limits and Home restores the overview', () => {
  const camera = cameraAt([21, 17, 25]);
  const controls = orbitControls(camera, [0, 1.4, 0]);

  assert.equal(applyKeyboardControl('+', camera, controls), true);
  assert.equal(applyKeyboardControl('-', camera, controls), true);
  for (let i = 0; i < 80; i++) applyKeyboardControl('-', camera, controls);
  let distance = camera.position.distanceTo(controls.target);
  assert.ok(distance <= controls.maxDistance + 1e-9);
  for (let i = 0; i < 80; i++) applyKeyboardControl('+', camera, controls);
  distance = camera.position.distanceTo(controls.target);
  assert.ok(distance >= controls.minDistance - 1e-9);

  assert.equal(applyKeyboardControl('Home', camera, controls), true);
  assert.equal(camera.position.distanceTo(new THREE.Vector3(21, 17, 25)), 0);
  assert.equal(controls.target.distanceTo(new THREE.Vector3(0, 1.4, 0)), 0);
});
