'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './VideoIntro.module.css';

// Load Three.js layer client-only (no SSR)
const CinematicLayer = dynamic(
  () => import('../CinematicLayer/CinematicLayer'),
  { ssr: false }
);

export default function VideoIntro({ videoSrc = '/video/hero.mp4' }) {
  const mainVideoRef = useRef(null);
  const bgVideoRef   = useRef(null);
  const [isMuted, setIsMuted]   = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hintVisible, setHintVisible] = useState(true);
  const timelineRef = useRef(null);

  /* ---------- GSAP ENTRANCE ---------- */
  useEffect(() => {
    let gsap, ctx;

    async function initGSAP() {
      const mod = await import('gsap');
      gsap = mod.default || mod.gsap;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.5 });
        timelineRef.current = tl;

        tl
          .from(`.${styles.tagline}`, {
            opacity: 0, y: 22, duration: 1.1, ease: 'power3.out',
          })
          .from(`.${styles.nameFirst}`, {
            opacity: 0, y: 70, duration: 1.3, ease: 'expo.out',
          }, '-=0.55')
          .from(`.${styles.nameLast}`, {
            opacity: 0, y: 70, duration: 1.3, ease: 'expo.out',
          }, '-=1.0')
          .from(`.${styles.role}`, {
            opacity: 0, y: 24, duration: 1, ease: 'power3.out',
          }, '-=0.7')
          .from(`.${styles.divider}`, {
            opacity: 0, scaleX: 0, transformOrigin: 'left center',
            duration: 0.9, ease: 'power2.out',
          }, '-=0.55')
          .from(`.${styles.statItem}`, {
            opacity: 0, y: 18, stagger: 0.12, duration: 0.8, ease: 'power3.out',
          }, '-=0.5')
          .from(`.${styles.scrollIndicator}`, {
            opacity: 0, y: 10, duration: 0.9, ease: 'power2.out',
          }, '-=0.3');
      });
    }

    initGSAP();

    return () => ctx?.revert();
  }, []);

  /* ---------- PARALLAX ---------- */
  useEffect(() => {
    let gsap;
    async function setup() {
      const mod = await import('gsap');
      gsap = mod.default || mod.gsap;

      const onMove = (e) => {
        const cx = e.clientX / window.innerWidth - 0.5;
        const cy = e.clientY / window.innerHeight - 0.5;
        gsap.to(`.${styles.content}`, { x: cx * 14, y: cy * 9, duration: 1.4, ease: 'power2.out' });
        gsap.to(`.${styles.videoWrap}`, { x: cx * -10, duration: 1.6, ease: 'power2.out' });
      };
      window.addEventListener('mousemove', onMove);
      return () => window.removeEventListener('mousemove', onMove);
    }
    const cleanup = setup();
    return () => cleanup.then(fn => fn && fn());
  }, []);

  /* ---------- SOUND HINT HIDE ---------- */
  useEffect(() => {
    const timer = setTimeout(() => setHintVisible(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  /* ---------- CONTROLS ---------- */
  const toggleMute = () => {
    const v = mainVideoRef.current;
    if (!v) return;
    const next = !isMuted;
    v.muted = next;
    setIsMuted(next);
    setHintVisible(false);
  };

  const togglePlay = () => {
    const v = mainVideoRef.current;
    const b = bgVideoRef.current;
    if (!v) return;
    const next = !isPlaying;
    next ? (v.play(), b?.play()) : (v.pause(), b?.pause());
    setIsPlaying(next);
  };

  const scrollToNext = () => {
    document.getElementById('next-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero} id="hero">
      {/* Ambient blurred background duplicate */}
      <div className={styles.bgBlur}>
        <video ref={bgVideoRef} src={videoSrc} autoPlay loop muted playsInline
          className={styles.bgVideo} />
      </div>

      {/* Dark gradient base */}
      <div className={styles.gradientBase} />

      {/* Three.js bokeh / particle layer */}
      <CinematicLayer />

      {/* Main foreground talking-head video */}
      <div className={styles.videoWrap}>
        <video ref={mainVideoRef} src={videoSrc} autoPlay loop muted playsInline
          className={styles.mainVideo} />
        <div className={styles.videoEdgeFade} />
      </div>

      {/* Lens vignette */}
      <div className={styles.vignette} />

      {/* Portfolio content */}
      <div className={styles.content}>
        <p className={styles.tagline}>Available for work &nbsp;·&nbsp; 2024</p>

        <div className={styles.nameBlock}>
          <span className={styles.nameFirst}>Alexander</span>
          <span className={styles.nameLast}>Morgan</span>
        </div>

        <p className={styles.role}>
          Creative Developer &amp; Digital Experience<br />
          Architect based in San Francisco
        </p>

        <div className={styles.divider} />

        <div className={styles.stats}>
          {[['08+', 'Years Exp.'], ['120+', 'Projects'], ['40+', 'Clients']].map(([n, l]) => (
            <div className={styles.statItem} key={l}>
              <span className={styles.statNum}>{n}</span>
              <span className={styles.statLabel}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sound hint badge */}
      <div className={`${styles.soundHint} ${!hintVisible ? styles.soundHintHidden : ''}`}>
        <span className={styles.hintDot} />
        <span>Tap for sound</span>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button className={styles.ctrlBtn} onClick={toggleMute} aria-label="Toggle sound">
          {isMuted ? <IconSound /> : <IconMute />}
        </button>
        <button className={styles.ctrlBtn} onClick={togglePlay} aria-label="Toggle play">
          {isPlaying ? <IconPause /> : <IconPlay />}
        </button>
      </div>

      {/* Scroll indicator */}
      <button className={styles.scrollIndicator} onClick={scrollToNext} aria-label="Scroll down">
        <span className={styles.scrollLabel}>Scroll</span>
        <div className={styles.scrollLine} />
      </button>
    </section>
  );
}

/* ---- Inline SVG icons ---- */
function IconSound() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
    </svg>
  );
}
function IconMute() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  );
}
function IconPause() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}
function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
