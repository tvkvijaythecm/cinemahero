'use client';

import { useEffect, useRef } from 'react';
import styles from './CinematicLayer.module.css';

export default function CinematicLayer() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const mouseRef = useRef({ tx: 0, ty: 0, cx: 0, cy: 0 });

  useEffect(() => {
    let THREE;

    async function init() {
      THREE = await import('three');
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;

      // Scene + Camera
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;
      cameraRef.current = camera;

      // Particle geometry
      const COUNT = 220;
      const geo = new THREE.BufferGeometry();
      const pos    = new Float32Array(COUNT * 3);
      const sizes  = new Float32Array(COUNT);
      const colors = new Float32Array(COUNT * 3);
      const phases = new Float32Array(COUNT);
      const speeds = new Float32Array(COUNT);

      for (let i = 0; i < COUNT; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * 20;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
        sizes[i]  = Math.random() * 22 + 5;
        phases[i] = Math.random() * Math.PI * 2;
        speeds[i] = Math.random() * 0.35 + 0.12;

        const warm = Math.random();
        if (warm < 0.65) {
          // Warm orange / amber
          colors[i * 3]     = 1;
          colors[i * 3 + 1] = 0.46 + Math.random() * 0.22;
          colors[i * 3 + 2] = 0.18 + Math.random() * 0.18;
        } else {
          // Soft white / cool blue
          colors[i * 3]     = 0.88 + Math.random() * 0.12;
          colors[i * 3 + 1] = 0.92;
          colors[i * 3 + 2] = 1;
        }
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1));
      geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
      geo.setAttribute('aPhase',   new THREE.BufferAttribute(phases, 1));
      geo.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime:  { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
        },
        vertexShader: `
          attribute float aSize;
          attribute float aPhase;
          attribute float aSpeed;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vAlpha;
          uniform float uTime;
          uniform vec2 uMouse;

          void main() {
            vec3 p = position;
            // Slow organic sine drift
            p.y += sin(uTime * aSpeed + aPhase) * 0.35;
            p.x += cos(uTime * aSpeed * 0.65 + aPhase + 1.2) * 0.18;
            p.z += sin(uTime * aSpeed * 0.4 + aPhase * 2.0) * 0.12;
            // Mouse parallax
            p.x += uMouse.x * (1.0 + p.z * 0.1);
            p.y += uMouse.y * (0.6 + p.z * 0.06);
            vColor = color;
            // Depth fade
            float dCenter = length(vec2(p.x * 0.055, p.y * 0.08));
            vAlpha = clamp(0.16 - dCenter * 0.04, 0.0, 0.2);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = aSize * (520.0 / -mv.z);
            gl_Position  = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;

          void main() {
            float d = length(gl_PointCoord - 0.5) * 2.0;
            // Double-smoothstep for softer bokeh core
            float a = 1.0 - smoothstep(0.0, 0.85, d);
            a = a * a * (3.0 - 2.0 * a);
            gl_FragColor = vec4(vColor, a * vAlpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true,
      });
      materialRef.current = material;

      const points = new THREE.Points(geo, material);
      scene.add(points);

      // Mouse tracking
      const onMouseMove = (e) => {
        mouseRef.current.tx = (e.clientX / window.innerWidth - 0.5) * 0.5;
        mouseRef.current.ty = -(e.clientY / window.innerHeight - 0.5) * 0.3;
      };
      window.addEventListener('mousemove', onMouseMove);

      // Animation loop
      let lastTime = 0;
      function animate(t) {
        rafRef.current = requestAnimationFrame(animate);
        const delta = Math.min((t - lastTime) / 1000, 0.05);
        lastTime = t;

        material.uniforms.uTime.value += delta * 0.8;

        // Smooth mouse lag
        const m = mouseRef.current;
        m.cx += (m.tx - m.cx) * 0.04;
        m.cy += (m.ty - m.cy) * 0.04;
        material.uniforms.uMouse.value.set(m.cx, m.cy);

        // Camera parallax
        camera.position.x += (m.cx * 0.6 - camera.position.x) * 0.025;
        camera.position.y += (m.cy * 0.4 - camera.position.y) * 0.025;

        renderer.render(scene, camera);
      }
      animate(0);

      // Resize
      const onResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
      };
    }

    const cleanup = init();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      cleanup.then(fn => fn && fn());
      materialRef.current?.dispose();
      rendererRef.current?.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
