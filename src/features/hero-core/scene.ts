import {
  Box3,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  LineSegments,
  OrthographicCamera,
  PCFSoftShadowMap,
  PMREMGenerator,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildCore } from '../../labs/system-core/geometry';
import { coreMaterials } from '../../labs/system-core/materials';
import { corePose } from '../../labs/system-core/pose';
import { openingProgress } from './progress';

/** Homepage adapter. The approved lab geometry, materials and pose stay unchanged. */
export function mountHeroCore(
  figure: HTMLElement,
  opening: HTMLElement,
): () => void {
  const stage = figure.querySelector<HTMLElement>('.hero-core-stage');
  const host = figure.querySelector<HTMLElement>('.hero-core-canvas');
  const identity = opening.querySelector<HTMLElement>('.identity');
  const thread = document.querySelector<HTMLElement>('.handoff-question .thread');
  if (!stage || !host || !identity) return () => {};
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true });
  if (!context) {
    opening.dataset.static = '';
    return () => {};
  }
  const renderer = new WebGLRenderer({
    canvas,
    context,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  host.append(canvas);
  const scene = new Scene();
  const room = new RoomEnvironment();
  const generator = new PMREMGenerator(renderer);
  const environment = generator.fromScene(room, 0.06);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.3;
  room.dispose();
  generator.dispose();
  const materials = coreMaterials({
    paper: { value: 0 },
    height: { value: 1 },
  });
  const { root, layers } = buildCore(materials);
  materials.edgePrimary.visible = false;
  materials.edgeSecondary.visible = false;
  materials.edgeSubdued.visible = false;
  materials.edgeSignal.visible = false;
  scene.add(root);
  const fill = new HemisphereLight('#d3dce1', '#171c1d', 0.35);
  const key = new DirectionalLight('#f3e4d1', 3.2);
  key.position.set(-3, 5, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, {
    left: -7,
    right: 7,
    top: 7,
    bottom: -7,
    near: 0.5,
    far: 25,
  });
  key.shadow.normalBias = 0.025;
  key.shadow.bias = -0.0002;
  const rim = new DirectionalLight('#b5ccdc', 1.1);
  rim.position.set(4, 1, -2);
  scene.add(fill, key, rim);
  const camera = new OrthographicCamera(-5, 5, 3, -3, 0.1, 100);
  camera.position.z = 20;
  const box = new Box3();
  const size = new Vector3();
  const center = new Vector3();
  let width = 1;
  let height = 1;
  let frame = 0;
  let visible = true;
  let disposed = false;
  let available = true;

  function render() {
    frame = 0;
    if (disposed || !visible || document.hidden || !available || !identity)
      return;
    const narrow = innerWidth < 768;
    const styles = getComputedStyle(opening);
    const runway = opening.closest<HTMLElement>('.hero-runway');
    const pin = opening.closest<HTMLElement>('.hero-pin');
    const travel =
      !narrow && runway && pin
        ? runway.offsetHeight - pin.offsetHeight
        : opening.offsetHeight -
          parseFloat(styles.getPropertyValue('--opening-height'));
    const top = opening.getBoundingClientRect().top + scrollY;
    const start =
      !narrow && runway && pin
        ? Math.max(
            0,
            runway.getBoundingClientRect().top +
              scrollY -
              parseFloat(getComputedStyle(pin).top),
          )
        : Math.max(
            0,
            top +
              identity.offsetHeight +
              parseFloat(styles.rowGap) -
              parseFloat(getComputedStyle(figure).top),
          );
    const progress = openingProgress(scrollY, start, travel);
    const pose = corePose(progress, narrow ? 'narrow' : 'wide');
    root.rotation.set(...pose.rotation);
    root.scale.setScalar(pose.scale);
    root.position.set(0, 0, 0);
    layers.forEach((layer, index) => {
      layer.position.z = pose.separation[index] ?? 0;
    });
    box.setFromObject(root).getSize(size);
    box.getCenter(center);
    const aspect = width / height;
    // The source poster is cropped to 4.095 × 4.382 world units at the assembled pose.
    const initial = Math.max(4.3822, 4.0951 / aspect);
    const fit = Math.max(initial, size.y / 0.94, size.x / (aspect * 0.94));
    const t = Math.min(1, progress / 0.12);
    const viewHeight = initial + (fit - initial) * t * t * (3 - 2 * t);
    camera.top = viewHeight / 2;
    camera.bottom = -camera.top;
    camera.right = (viewHeight * aspect) / 2;
    camera.left = -camera.right;
    camera.updateProjectionMatrix();
    root.position.set(-center.x, -center.y, 0);
    fill.intensity = 0.35 + pose.exposure * 0.2;
    renderer.render(scene, camera);
    figure.dataset.ready = '';
    figure.dataset.progress = progress.toFixed(4);
    const depart =
      !narrow && runway && pin && scrollY > start + travel
        ? Math.min(220, (scrollY - (start + travel)) * 0.45)
        : 0;
    figure.style.setProperty('--core-depart-y', `${depart.toFixed(1)}px`);
    if (thread) {
      const threadT =
        !narrow && scrollY > start + travel
          ? Math.min(1, Math.max(0, (scrollY - (start + travel)) / 180))
          : narrow
            ? 1
            : 0;
      thread.style.setProperty('--thread-progress', threadT.toFixed(3));
    }
  }
  function schedule() {
    if (!frame && !disposed && visible && !document.hidden && available)
      frame = requestAnimationFrame(render);
  }
  function resize() {
    if (!stage || !identity) return;
    const narrow = innerWidth < 768;
    const runway = opening.closest<HTMLElement>('.hero-runway');
    const pin = opening.closest<HTMLElement>('.hero-pin');
    if (!narrow && runway && pin) {
      runway.style.setProperty(
        '--hero-pin-top',
        `${runway.getBoundingClientRect().top + scrollY}px`,
      );
      runway.style.setProperty('--composition-height', `${pin.offsetHeight}px`);
    }
    const baseHeight = narrow
      ? identity.offsetHeight + 32 + figure.offsetHeight
      : Math.max(
          identity.offsetHeight + (innerWidth >= 1024 ? 44 : 0),
          figure.offsetHeight,
        );
    opening.style.setProperty('--opening-height', `${baseHeight}px`);
    width = stage.clientWidth;
    height = stage.clientHeight;
    renderer.setSize(width, height, false);
    schedule();
  }
  function lost(event: Event) {
    event.preventDefault();
    available = false;
    delete figure.dataset.ready;
    opening.dataset.static = '';
  }
  function restored() {
    available = true;
    delete opening.dataset.static;
    resize();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  observer.observe(identity);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    schedule();
  });
  intersection.observe(figure);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', resize);
  window.addEventListener('pageshow', resize);
  document.addEventListener('visibilitychange', schedule);
  canvas.addEventListener('webglcontextlost', lost);
  canvas.addEventListener('webglcontextrestored', restored);
  void document.fonts.ready.then(() => {
    if (!disposed) resize();
  });
  resize();
  function cleanup() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    intersection.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pageshow', resize);
    window.removeEventListener('pagehide', pagehide);
    document.removeEventListener('visibilitychange', schedule);
    canvas.removeEventListener('webglcontextlost', lost);
    canvas.removeEventListener('webglcontextrestored', restored);
    const geometries = new Set<import('three').BufferGeometry>();
    scene.traverse((object) => {
      if (object instanceof Mesh || object instanceof LineSegments)
        geometries.add(object.geometry);
    });
    geometries.forEach((geometry) => geometry.dispose());
    new Set(Object.values(materials)).forEach((material) => material.dispose());
    environment.dispose();
    key.shadow.dispose();
    renderer.dispose();
    canvas.remove();
    delete figure.dataset.ready;
    delete figure.dataset.progress;
    figure.style.removeProperty('--core-depart-y');
    thread?.style.removeProperty('--thread-progress');
  }
  function pagehide(event: PageTransitionEvent) {
    if (!event.persisted) cleanup();
  }
  window.addEventListener('pagehide', pagehide);
  return cleanup;
}
