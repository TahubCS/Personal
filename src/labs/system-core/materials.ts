import { Color, LineBasicMaterial, MeshStandardMaterial } from 'three';

export interface DrawingUniforms {
  readonly paper: { value: number };
  readonly height: { value: number };
  readonly width?: { value: number };
  readonly angle?: { value: number };
}

interface DrawingCutOptions {
  readonly inkColor?: string;
  readonly targetAlpha?: number;
  readonly key?: string;
}

/** One screen-space boundary changes the actual surfaces, not a second pose. */
function applyDrawingCut(
  material: MeshStandardMaterial | LineBasicMaterial,
  uniforms: DrawingUniforms,
  options: DrawingCutOptions | boolean,
): void {
  const isInk = typeof options === 'boolean' ? options : true;
  const inkColor =
    typeof options === 'object' && options.inkColor
      ? options.inkColor
      : '0.22, 0.27, 0.28';
  const targetAlpha =
    typeof options === 'object' && options.targetAlpha !== undefined
      ? options.targetAlpha.toFixed(2)
      : '1.0';
  const programKey =
    typeof options === 'object' && options.key
      ? options.key
      : isInk
        ? 'core-drawing-edge'
        : 'core-drawing-surface';

  const widthUniform = uniforms.width ?? { value: 1440 };
  const angleUniform = uniforms.angle ?? { value: 0.5 };

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uPaper = uniforms.paper;
    shader.uniforms.uHeight = uniforms.height;
    shader.uniforms.uWidth = widthUniform;
    shader.uniforms.uAngle = angleUniform;
    shader.fragmentShader = `uniform float uPaper;\nuniform float uHeight;\nuniform float uWidth;\nuniform float uAngle;\n${shader.fragmentShader}`;
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `#include <dithering_fragment>
       vec2 uv = gl_FragCoord.xy / vec2(uWidth, uHeight);
       float cosA = cos(uAngle);
       float sinA = sin(uAngle);
       float span = cosA + sinA;
       float proj = (uv.x * cosA + uv.y * sinA) / span;
       float onPaper = step(proj, uPaper);
       gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(${isInk ? inkColor : '0.949, 0.937, 0.906'}), onPaper);
       gl_FragColor.a = mix(gl_FragColor.a, ${targetAlpha}, onPaper);`,
    );
  };
  material.customProgramCacheKey = () => programKey;
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

  // Four-tier technical drafting ink hierarchy
  const edgePrimary = new LineBasicMaterial({
    color: '#1a2226',
    transparent: true,
    opacity: 0,
  });
  const edgeSecondary = new LineBasicMaterial({
    color: '#425255',
    transparent: true,
    opacity: 0,
  });
  const edgeSubdued = new LineBasicMaterial({
    color: '#6f8285',
    transparent: true,
    opacity: 0,
  });
  const edgeSignal = new LineBasicMaterial({
    color: '#b87428',
    transparent: true,
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

  applyDrawingCut(edgePrimary, uniforms, {
    inkColor: '0.10, 0.13, 0.15',
    targetAlpha: 1.0,
    key: 'core-drawing-edge-primary',
  });
  applyDrawingCut(edgeSecondary, uniforms, {
    inkColor: '0.20, 0.26, 0.28',
    targetAlpha: 0.95,
    key: 'core-drawing-edge-secondary',
  });
  applyDrawingCut(edgeSubdued, uniforms, {
    inkColor: '0.28, 0.35, 0.37',
    targetAlpha: 0.92,
    key: 'core-drawing-edge-subdued',
  });
  applyDrawingCut(edgeSignal, uniforms, {
    inkColor: '0.72, 0.45, 0.16',
    targetAlpha: 1.0,
    key: 'core-drawing-edge-signal',
  });

  return {
    graphite,
    ceramic,
    copper,
    interior,
    structure,
    perimeter,
    signal,
    edgePrimary,
    edgeSecondary,
    edgeSubdued,
    edgeSignal,
    edge: edgePrimary,
  };
}

export type CoreMaterials = ReturnType<typeof coreMaterials>;
