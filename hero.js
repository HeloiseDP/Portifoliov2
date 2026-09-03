/**
 * FRANQ — Hero Scroll Animation
 *
 * Scroll-driven animation for the hero section.
 * Uses IntersectionObserver + requestAnimationFrame for performance.
 *
 * Animation phases (scroll progress 0 → 1):
 *   Phase 1  [0.00 → 0.45] — image shrinks to bottom-right
 *   Phase 2  [0.35 → 0.65] — stage-2 title + intro text appear
 *   Phase 3  [0.70 → 1.00] — final heading enters
 */

(function () {
  'use strict';

  /* ── Boundaries ─────────────────────────────── */
  const PHASE = {
    imgEnd:     0.45,
    textStart:  0.35,
    textEnd:    0.65,
    finalStart: 0.70,
  };

  /* ── Target image dimensions (from Figma design at 1440px) ─── */
  // Full hero:   1440 × 726
  // Shrunken:     900 × 507  →  62.5% × 69.83%
  const IMG_SCALE_X = 900 / 1440;   // 0.625
  const IMG_SCALE_Y = 507 / 726;    // ~0.698

  /* ── DOM refs ─────────────────────────────── */
  const heroWrapper   = document.getElementById('hero-wrapper');
  const heroImage     = document.getElementById('hero-image');
  const titleS1       = document.getElementById('hero-title-s1');
  const titleS2       = document.getElementById('hero-title-s2');
  const introText     = document.getElementById('hero-intro');
  const finalHeading  = document.getElementById('hero-heading-final');
  const scrollHint    = document.getElementById('hero-scroll-hint');

  if (!heroWrapper) return; // guard: hero not present on this page

  /* ── Math helpers ──────────────────────────── */
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  /** Smooth ease-in-out (cubic) */
  function easeInOut(t) {
    return t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  /** Linear sub-progress within a phase range, eased */
  function phase(t, start, end) {
    return easeInOut(clamp((t - start) / (end - start), 0, 1));
  }

  /* ── Scroll progress ─────────────────────── */
  function getProgress() {
    const rect        = heroWrapper.getBoundingClientRect();
    const scrolled    = -rect.top;
    const totalScroll = heroWrapper.offsetHeight - window.innerHeight;
    return clamp(scrolled / totalScroll, 0, 1);
  }

  /* ── Animation frame ─────────────────────── */
  let raf = null;
  let lastP = -1;

  function update() {
    raf = null;
    const p = getProgress();

    // Skip if nothing changed (< 0.001 threshold)
    if (Math.abs(p - lastP) < 0.0005) return;
    lastP = p;

    /* Scroll hint: desaparece assim que o usuário começa a rolar */
    if (scrollHint) {
      scrollHint.classList.toggle('is-hidden', p > 0.04);
    }

    /* Phase sub-values (0→1, eased) */
    const p1 = phase(p, 0,                  PHASE.imgEnd);
    const p2 = phase(p, PHASE.textStart,    PHASE.textEnd);
    const p3 = phase(p, PHASE.finalStart,   1);

    /* ── 1. Hero image: scale from full to bottom-right corner ──
       transform-origin: bottom right (set in CSS)
       scale(1,1)  →  scale(0.625, 0.698)                        */
    const sx = lerp(1, IMG_SCALE_X, p1);
    const sy = lerp(1, IMG_SCALE_Y, p1);
    heroImage.style.transform = `scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`;

    /* ── 2. Stage-1 title: fades + drifts down ── */
    titleS1.style.opacity   = (1 - p1).toFixed(3);
    titleS1.style.transform = `translateY(${lerp(0, 20, p1).toFixed(1)}px)`;

    /* ── 3. Stage-2 title: fades + rises ── */
    titleS2.style.opacity   = p2.toFixed(3);
    titleS2.style.transform = `translateY(${lerp(14, 0, p2).toFixed(1)}px)`;

    /* ── 4. Intro text: fades + rises ── */
    introText.style.opacity   = p2.toFixed(3);
    introText.style.transform = `translateY(${lerp(10, 0, p2).toFixed(1)}px)`;

    /* ── 5. Final heading: fades + slides down from above ── */
    finalHeading.style.opacity   = p3.toFixed(3);
    finalHeading.style.transform = `translateY(${lerp(-28, 0, p3).toFixed(1)}px)`;

  }

  function scheduleUpdate() {
    if (!raf) raf = requestAnimationFrame(update);
  }

  /* ── Events ──────────────────────────────── */
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });

  // Run once on load
  scheduleUpdate();

})();
