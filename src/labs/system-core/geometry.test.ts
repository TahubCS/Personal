import assert from 'node:assert/strict';
import test from 'node:test';
import { Mesh, Raycaster, Vector3 } from 'three';
import { buildCore } from './geometry.ts';
import { coreMaterials } from './materials.ts';

test('the front rim has a real open aperture, including the thin amber inlay', () => {
  const materials = coreMaterials({
    paper: { value: 0 },
    height: { value: 900 },
  });
  const { root, layers } = buildCore(materials);
  root.updateMatrixWorld(true);
  const front = layers[4];
  const ray = new Raycaster(new Vector3(0, 0, 5), new Vector3(0, 0, -1));
  const surfaces = front.children.filter((child) => child instanceof Mesh);
  assert.ok(surfaces.length > 1);
  assert.equal(ray.intersectObjects(surfaces, false).length, 0);
  root.traverse((object) => {
    if (object instanceof Mesh) object.geometry.dispose();
  });
  for (const material of Object.values(materials)) material.dispose();
});
