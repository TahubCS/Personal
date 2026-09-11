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
    color: '#293238',
    roughness: 0.38,
    metalness: 0.6,
  });
  const ceramic = new MeshStandardMaterial({
    color: '#777f7a',
    roughness: 0.62,
    metalness: 0.05,
  });
  const copper = new MeshStandardMaterial({
    color: '#bd824b',
    roughness: 0.3,
    metalness: 0.85,
  });
  const interior = new MeshStandardMaterial({
    color: '#111b20',
    roughness: 0.66,
    metalness: 0.2,
  });
  const structure = new MeshStandardMaterial({
    color: '#455553',
    roughness: 0.65,
    metalness: 0.25,
    envMapIntensity: 0.3,
  });
  const perimeter = new MeshStandardMaterial({
    color: '#806140',
    roughness: 0.48,
    metalness: 0.75,
  });
  const signal = new MeshStandardMaterial({
    color: '#e4a24b',
    emissive: new Color('#d78b2b'),
    emissiveIntensity: 0.55,
    roughness: 0.45,
    metalness: 0.15,
  });
  const edge = new LineBasicMaterial({
    color: '#70817e',
    transparent: true,
    // Surface lighting defines the solid object; outlines belong to the drawing.
    opacity: 0,
  });
  for (const material of [
    graphite,
    ceramic,
    copper,
    interior,
    structure,
    perimeter,
    signal,
  ]) {
    material.polygonOffset = true;
    material.polygonOffsetFactor = 1;
    material.polygonOffsetUnits = 1;
    applyDrawingCut(material, uniforms, false);
  }
  applyDrawingCut(edge, uniforms, true);
  return {
    graphite,
    ceramic,
    copper,
    interior,
    structure,
    perimeter,
    signal,
    edge,
  };
}

export type CoreMaterials = ReturnType<typeof coreMaterials>;
