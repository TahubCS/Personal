import {
  BoxGeometry,
  CylinderGeometry,
  EdgesGeometry,
  ExtrudeGeometry,
  Group,
  LineSegments,
  Mesh,
  Path,
  Shape,
  Vector3,
  BufferGeometry,
  type MeshStandardMaterial,
} from 'three';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';
import type { CoreMaterials } from './materials';

function contour(width: number, height: number, chamfer: number): Shape {
  const x = width / 2;
  const y = height / 2;
  const shape = new Shape();
  shape.moveTo(-x + chamfer, -y);
  shape.lineTo(x - chamfer * 1.7, -y);
  shape.lineTo(x, -y + chamfer * 1.7);
  shape.lineTo(x, y - chamfer);
  shape.lineTo(x - chamfer, y);
  shape.lineTo(-x + chamfer * 1.7, y);
  shape.lineTo(-x, y - chamfer * 1.7);
  shape.lineTo(-x, -y + chamfer);
  shape.closePath();
  return shape;
}

function casing(
  width: number,
  height: number,
  depth: number,
  aperture = 0,
): ExtrudeGeometry {
  const shape = contour(width, height, 0.44);
  if (aperture > 0) {
    // Keep the aperture strictly inside the chamfered envelope, even for a thin rim.
    const hole = contour(
      width - aperture,
      height - aperture,
      0.44 * (1 - aperture / Math.min(width, height)),
    );
    shape.holes.push(new Path(hole.getPoints().reverse()));
  }
  const geometry = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: aperture > 0 ? Math.min(0.035, aperture / 6) : 0.055,
    bevelThickness: aperture > 0 ? Math.min(0.035, aperture / 6) : 0.055,
    curveSegments: 1,
  });
  geometry.translate(0, 0, -depth / 2);
  // Extrusions are non-indexed: smooth the bevel normals in place while
  // retaining hard edges above 30 degrees and the exact original silhouette.
  toCreasedNormals(geometry, Math.PI / 6);
  return geometry;
}

function columnEdges(w: number, h: number, d: number): BufferGeometry {
  const hw = w / 2;
  const hh = h / 2;
  const hd = d / 2;
  return new BufferGeometry().setFromPoints([
    new Vector3(-hw, -hh, -hd),
    new Vector3(-hw, hh, -hd),
    new Vector3(hw, -hh, -hd),
    new Vector3(hw, hh, -hd),
    new Vector3(hw, -hh, hd),
    new Vector3(hw, hh, hd),
    new Vector3(-hw, -hh, hd),
    new Vector3(-hw, hh, hd),
  ]);
}

function lineSegmentEdge(): BufferGeometry {
  return new BufferGeometry().setFromPoints([
    new Vector3(0, -0.5, 0),
    new Vector3(0, 0.5, 0),
  ]);
}

export function buildCore(materials: CoreMaterials) {
  const root = new Group();
  const layers = [
    new Group(),
    new Group(),
    new Group(),
    new Group(),
    new Group(),
  ] as const;
  root.add(...layers);
  const [back, routing, lattice, frame, face] = layers;
  if (!back || !routing || !lattice || !frame || !face)
    throw new Error('Core assembly needs five structural groups.');

  function part(
    group: Group,
    geometry: BufferGeometry,
    material: MeshStandardMaterial,
    position: readonly [number, number, number],
    customEdges?: BufferGeometry,
  ) {
    const mesh = new Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.receiveShadow = true;
    // Only the enclosure, inner frame and central body cast shadows. Fine ribs
    // receive their shade without multiplying the shadow pass's draw calls.
    mesh.castShadow =
      material === materials.graphite ||
      (material === materials.ceramic && geometry instanceof ExtrudeGeometry) ||
      (group === lattice && material === materials.interior);
    const edges = new LineSegments(
      customEdges ?? new EdgesGeometry(geometry, 28),
      materials.edge,
    );
    mesh.add(edges);
    group.add(mesh);
    return mesh;
  }

  // A thick hollow chassis, with a stepped inner back wall and integral side rails.
  part(back, casing(3.6, 4, 0.32), materials.graphite, [0, 0, -0.82]);
  part(back, casing(3.12, 3.52, 0.12), materials.interior, [0, 0, -0.6]);
  for (const x of [-1.52, 1.52]) {
    part(back, new BoxGeometry(0.2, 2.9, 1.12), materials.graphite, [
      x,
      0,
      -0.12,
    ]);
    for (let i = 0; i < 13; i++) {
      part(back, new BoxGeometry(0.26, 0.055, 0.78), materials.structure, [
        x,
        -1.23 + i * 0.205,
        -0.2,
      ]);
    }
  }

  // Routing is a comb of continuous conductors with different physical lengths.
  for (let i = 0; i < 11; i++) {
    const x = (i - 5) * 0.235;
    const length = 1.7 + (i % 3) * 0.31;
    part(
      routing,
      new BoxGeometry(0.045, length, 0.07),
      materials.copper,
      [x, -0.15, -0.35],
      columnEdges(0.045, length, 0.07),
    );
    part(routing, new BoxGeometry(0.18, 0.19, 0.14), materials.copper, [
      x,
      length / 2 - 0.15,
      -0.32,
    ]);
    part(routing, new BoxGeometry(0.19, 0.34, 0.15), materials.interior, [
      x,
      -length / 2 - 0.12,
      -0.31,
    ]);
  }
  part(
    routing,
    new BoxGeometry(2.7, 0.12, 0.19),
    materials.structure,
    [0, -0.6, -0.4],
  );

  // The center is an open three-dimensional truss, rather than a solid card.
  const strutGeometry = new CylinderGeometry(0.014, 0.014, 1, 5);
  const up = new Vector3(0, 1, 0);
  function strut(start: Vector3, end: Vector3) {
    const direction = end.clone().sub(start);
    const mesh = part(
      lattice,
      strutGeometry,
      materials.structure,
      [0, 0, 0],
      lineSegmentEdge(),
    );
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(up, direction.clone().normalize());
    mesh.scale.y = direction.length();
  }
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 4; col++) {
      const x = (col - 1.5) * 0.47;
      const y = (row - 2) * 0.47;
      const a = new Vector3(x - 0.2, y - 0.2, -0.27);
      const b = new Vector3(x + 0.2, y + 0.2, 0.16);
      strut(a, b);
      strut(
        new Vector3(x + 0.2, y - 0.2, -0.27),
        new Vector3(x - 0.2, y + 0.2, 0.16),
      );
    }
  }
  part(
    lattice,
    casing(1.3, 1.65, 0.34),
    materials.interior,
    [0.18, 0.05, 0.23],
  );
  for (let i = 0; i < 7; i++) {
    part(
      lattice,
      new BoxGeometry(0.08, 0.84 + (i % 3) * 0.1, 0.06),
      materials.signal,
      [-0.19 + i * 0.12, 0.05, 0.45],
    );
  }

  part(frame, casing(2.95, 3.36, 0.25, 0.35), materials.ceramic, [0, 0, 0.58]);
  for (const x of [-1.14, 1.14]) {
    for (const y of [-1.3, 1.3]) {
      const post = part(
        frame,
        new CylinderGeometry(0.09, 0.09, 0.52, 8),
        materials.copper,
        [x, y, 0.35],
      );
      post.rotation.x = Math.PI / 2;
    }
  }
  // The deeper, smaller opening masks the frame and routing when assembled.
  // Its front surface stays at the original depth, preserving camera framing.
  part(face, casing(3.6, 4, 0.5, 1.35), materials.graphite, [0, 0, 0.85]);
  part(
    face,
    casing(2.27, 2.67, 0.045, 0.09),
    materials.perimeter,
    [0, 0, 1.08],
  );
  for (let i = 0; i < 9; i++) {
    part(face, new BoxGeometry(0.32, 0.027, 0.035), materials.structure, [
      -1.55,
      -0.9 + i * 0.17,
      1.115,
    ]);
  }
  return { root, layers };
}