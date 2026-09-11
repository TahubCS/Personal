import {
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  LineSegments,
  OrthographicCamera,
  Scene,
  WebGLRenderer,
  Box3,
  Vector3,
  PMREMGenerator,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildCore } from './geometry';
import { coreMaterials } from './materials';
import { corePose, normalizedProgress } from './pose';

export function mountCore(stage: HTMLElement, runway: HTMLElement): () => void {
  const host = stage.querySelector<HTMLElement>('.lab-canvas');
  const phase = stage.querySelector<HTMLElement>('.lab-phase');
  const instruction = stage.querySelector<HTMLElement>('.lab-instruction');
  if (!host || !phase || !instruction) return () => {};
  const labels = { phase, instruction };

  let renderer: WebGLRenderer;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', { antialias: true, alpha: true });
  if (!context) {
    console.warn(
      '[motion-lab] WebGL 2 unavailable; showing the static construction study.',
    );
    return () => {};
  }
  try {
    renderer = new WebGLRenderer({
      canvas,
      context,
      antialias: true,
      alpha: true,
      powerPreference: 'low-power',
    });
  } catch (error) {
    console.warn(
      '[motion-lab] WebGL unavailable; showing the static construction study.',
      error,
    );
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  host.append(renderer.domElement);
  const scene = new Scene();
  const room = new RoomEnvironment();
  const environmentGenerator = new PMREMGenerator(renderer);
  const environment = environmentGenerator.fromScene(room, 0.06);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.65;
  room.dispose();
  environmentGenerator.dispose();
  const camera = new OrthographicCamera(-5, 5, 3.4, -3.4, 0.1, 100);
  camera.position.z = 20;
  const uniforms = { paper: { value: 0 }, height: { value: 1 } };
  const materials = coreMaterials(uniforms);
  const { root, layers } = buildCore(materials);
  const objectBounds = new Box3();
  const objectSize = new Vector3();
  const objectCenter = new Vector3();
  scene.add(root);
  scene.add(new AmbientLight('#e8ece8', 0.6));
  scene.add(new HemisphereLight('#dfeaf3', '#443624', 1.1));
  const key = new DirectionalLight('#ffdfb2', 2.8);
  key.position.set(-3, 6, 5);
  scene.add(key);
  const rim = new DirectionalLight('#b5d5ea', 2);
  rim.position.set(4, -1, 1);
  scene.add(rim);

  let frame = 0;
  let disposed = false;
  let inView = true;
  let contextAvailable = true;
  let width = 1;
  let height = 1;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function render(): void {
    frame = 0;
    if (disposed || document.hidden || !inView || !contextAvailable) return;
    const bounds = runway.getBoundingClientRect();
    const progress = reduced.matches
      ? 1
      : normalizedProgress(-bounds.top / Math.max(1, bounds.height - height));
    const pose = corePose(progress);
    const mobile = width < 701;
    root.rotation.set(...pose.rotation);
    root.position.set(0, 0, 0);
    root.scale.setScalar(pose.scale);
    layers.forEach((layer, index) => {
      layer.position.z = pose.separation[index] ?? 0;
    });
    objectBounds.setFromObject(root);
    objectBounds.getSize(objectSize);
    objectBounds.getCenter(objectCenter);
    const aspect = width / height;
    const viewHeight = Math.max(
      mobile ? 7 : 6.8,
      objectSize.y / (mobile ? 0.53 : 0.75),
      objectSize.x / (aspect * (mobile ? 0.9 : 0.63)),
    );
    camera.left = (-viewHeight * width) / height / 2;
    camera.right = -camera.left;
    camera.top = viewHeight / 2;
    camera.bottom = -camera.top;
    camera.updateProjectionMatrix();
    root.position.set(
      (mobile ? 0 : viewHeight * aspect * 0.16) - objectCenter.x,
      (mobile ? -viewHeight * 0.12 : 0) - objectCenter.y,
      0,
    );
    uniforms.paper.value = pose.paper;
    stage.style.setProperty('--paper-progress', String(pose.paper));
    stage.style.setProperty('--scroll-progress', String(progress));
    stage.style.setProperty(
      '--drawing-labels',
      String(normalizedProgress((progress - 0.89) / 0.08)),
    );
    stage.dataset.progress = progress.toFixed(4);
    labels.phase.textContent =
      progress < 0.23
        ? '01 — Assembled'
        : progress < 0.6
          ? '02 — Underneath'
          : '03 — Understood';
    labels.instruction.textContent = reduced.matches
      ? 'Static view · reduced motion'
      : 'Scroll to look underneath ↓';
    renderer.render(scene, camera);
    stage.dataset.ready = '';
  }

  function schedule(): void {
    if (!frame && !disposed && !document.hidden && inView)
      frame = requestAnimationFrame(render);
  }
  function resize(): void {
    width = stage.clientWidth;
    height = stage.clientHeight;
    renderer.setSize(width, height, false);
    uniforms.height.value = renderer.domElement.height;
    schedule();
  }
  function onContextLost(event: Event): void {
    event.preventDefault();
    contextAvailable = false;
    renderer.domElement.style.visibility = 'hidden';
    delete stage.dataset.ready;
    delete runway.dataset.enhanced;
    stage.style.removeProperty('--paper-progress');
    stage.style.removeProperty('--drawing-labels');
    labels.phase.textContent = 'Construction study';
    labels.instruction.textContent = 'Static view · scroll to continue';
    console.warn(
      '[motion-lab] Graphics context lost; static construction study is available.',
    );
  }
  function onContextRestored(): void {
    contextAvailable = true;
    renderer.domElement.style.visibility = 'visible';
    runway.dataset.enhanced = '';
    resize();
  }

  const intersection = new IntersectionObserver(([entry]) => {
    inView = entry?.isIntersecting ?? false;
    schedule();
  });
  const observer = new ResizeObserver(resize);
  intersection.observe(stage);
  observer.observe(stage);
  runway.dataset.enhanced = '';
  window.addEventListener('scroll', schedule, { passive: true });
  function alignFragment(): void {
    if (window.location.hash === '#after-core') {
      document.getElementById('after-core')?.scrollIntoView();
    }
  }
  window.addEventListener('hashchange', alignFragment);
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', resize);
  renderer.domElement.addEventListener('webglcontextlost', onContextLost);
  renderer.domElement.addEventListener(
    'webglcontextrestored',
    onContextRestored,
  );
  // A late font load can change the measured scene height at text zoom.
  void document.fonts.ready.then(() => {
    if (!disposed) {
      resize();
      // Native fragment navigation can happen before enhancement extends the runway.
      alignFragment();
    }
  });
  resize();

  function cleanup(): void {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    intersection.disconnect();
    observer.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('hashchange', alignFragment);
    document.removeEventListener('visibilitychange', schedule);
    reduced.removeEventListener('change', resize);
    renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
    renderer.domElement.removeEventListener(
      'webglcontextrestored',
      onContextRestored,
    );
    scene.traverse((object) => {
      if (object instanceof Mesh || object instanceof LineSegments)
        object.geometry.dispose();
    });
    for (const material of Object.values(materials)) material.dispose();
    environment.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    delete stage.dataset.ready;
    delete runway.dataset.enhanced;
    window.removeEventListener('pagehide', onPageHide);
  }
  function onPageHide(event: PageTransitionEvent): void {
    if (!event.persisted) cleanup();
  }
  window.addEventListener('pagehide', onPageHide);
  return cleanup;
}
