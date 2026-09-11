import assert from 'node:assert/strict';
import test from 'node:test';
import { LineSegments, Mesh, Raycaster, Vector3 } from 'three';
import { buildCore } from './geometry.ts';
import { coreMaterials } from './materials.ts';
import { corePose } from './pose.ts';

test('the amber reference stays unobstructed in the late reveal and exposed hold', () => {
  const materials = coreMaterials({
    paper: { value: 0 },
    height: { value: 900 },
  });
  const { root, layers } = buildCore(materials);
  const surfaces: Mesh[] = [];
  root.traverse((object) => {
    if (object instanceof Mesh) surfaces.push(object);
  });
  const bars = surfaces.filter((mesh) => mesh.material === materials.signal);
  assert.equal(bars.length, 7);
  const ray = new Raycaster();
  try {
    for (const layout of ['wide', 'narrow'] as const) {
      for (const progress of [0.4, 0.48, 0.52, 0.56, 0.6]) {
        const pose = corePose(progress, layout);
        root.rotation.set(...pose.rotation);
        layers.forEach((layer, index) => {
          layer.position.z = pose.separation[index] ?? 0;
        });
        root.updateMatrixWorld(true);
        for (const bar of bars) {
          for (const y of [-0.25, 0, 0.25]) {
            const point = bar.localToWorld(new Vector3(0, y, 0.03));
            ray.set(new Vector3(point.x, point.y, 30), new Vector3(0, 0, -1));
            assert.equal(
              ray.intersectObjects(surfaces, false)[0]?.object,
              bar,
              `Amber core obstructed at ${progress} in ${layout} layout`,
            );
          }
        }
      }
    }
  } finally {
    root.traverse((object) => {
      if (object instanceof Mesh || object instanceof LineSegments)
        object.geometry.dispose();
    });
    for (const material of Object.values(materials)) material.dispose();
  }
});
