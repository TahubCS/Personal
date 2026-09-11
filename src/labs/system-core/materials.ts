import { Color, LineBasicMaterial, MeshStandardMaterial } from 'three';

export interface DrawingUniforms {
  readonly paper: { value: number };
  readonly height: { value: number };
}

/** One screen-space boundary changes the actual surfaces, not a second pose. */
function applyDrawingCut(
  material: MeshStandardMaterial | LineBasicMaterial,
  uniforms: DrawingUniforms,
  ink: boolean,
): void {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uPaper = uniforms.paper;
    shader.uniforms.uHeight = uniforms.height;
    shader.fragmentShader = `uniform float uPaper;\nuniform float uHeight;\n${shader.fragmentShader}`;
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `#include <dithering_fragment>
       float onPaper = step(gl_FragCoord.y, uHeight * uPaper);
       gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(${ink ? '0.22, 0.27, 0.28' : '0.949, 0.937, 0.906'}), onPaper);
       gl_FragColor.a = mix(gl_FragColor.a, 1.0, onPaper);`,
    );
  };
  material.customProgramCacheKey = () =>
    ink ? 'core-drawing-edge' : 'core-drawing-surface';
}

export function coreMaterials(uniforms: DrawingUniforms) {
  const graphite = new MeshStandardMaterial({
    color: '#334044',
    roughness: 0.34,
    metalness: 0.72,
  });
  const ceramic = new MeshStandardMaterial({
    color: '#c0c9c5',
    roughness: 0.32,
    metalness: 0.3,
  });
  const copper = new MeshStandardMaterial({
    color: '#dfb578',
    roughness: 0.28,
    metalness: 0.65,
  });
  const interior = new MeshStandardMaterial({
    color: '#14242a',
    roughness: 0.5,
    metalness: 0.45,
  });
  const signal = new MeshStandardMaterial({
    color: '#e4b46b',
    emissive: new Color('#e4b46b'),
    emissiveIntensity: 0.3,
    roughness: 0.4,
  });
  const edge = new LineBasicMaterial({
    color: '#70817e',
    transparent: true,
    opacity: 0.56,
  });
  for (const material of [graphite, ceramic, copper, interior, signal]) {
    material.polygonOffset = true;
    material.polygonOffsetFactor = 1;
    material.polygonOffsetUnits = 1;
    applyDrawingCut(material, uniforms, false);
  }
  applyDrawingCut(edge, uniforms, true);
  return { graphite, ceramic, copper, interior, signal, edge };
}

export type CoreMaterials = ReturnType<typeof coreMaterials>;
