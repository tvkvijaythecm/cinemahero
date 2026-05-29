'use client';

import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const raf     = useRef(null);
  const pos     = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e) => {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
    };

    const onEnter = () => document.body.classList.add('cursor-hover');
    const onLeave = () => document.body.classList.remove('cursor-hover');

    document.addEventListener('mousemove', onMove);

    const interactables = 'button, a, [role="button"], input, label';
    document.querySelectorAll(interactables).forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    function animate() {
      raf.current = requestAnimationFrame(animate);
      const p = pos.current;
      p.rx += (p.mx - p.rx) * 0.16;
      p.ry += (p.my - p.ry) * 0.16;

      dot.style.transform  = `translate(calc(${p.mx}px - 50%), calc(${p.my}px - 50%))`;
      ring.style.transform = `translate(calc(${p.rx}px - 50%), calc(${p.ry}px - 50%))`;
    }
    animate();

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div id="cursor">
      <div id="cursor-dot"  ref={dotRef}  />
      <div id="cursor-ring" ref={ringRef} />
    </div>
  );
}
