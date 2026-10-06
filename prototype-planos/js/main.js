/**
 * FRANQ — Main JS
 * Global interactions: header scroll state, smooth scroll
 */

(function () {
  'use strict';

  /* ── Header: add .is-scrolled + sync --header-height CSS var ── */
  const header = document.querySelector('.header');

  if (header) {
    const syncHeaderHeight = () => {
      const h = header.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${h}px`);
    };

    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', syncHeaderHeight, { passive: true });

    syncHeaderHeight(); // set on load
    onScroll();
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Global Scroll Ruler ─────────────────────────────────────────
     Rastreia as 5 seções do site e atualiza:
       • fill bar (altura proporcional à posição dentro do site)
       • dot deslizante
       • contador 01–05
       • tick ativo
  ──────────────────────────────────────────────────────────────── */
  (function () {
    const rulerFill     = document.getElementById('ruler-fill');
    const rulerDot      = document.getElementById('ruler-dot');
    const rulerPhaseNum = document.getElementById('ruler-phase-num');
    const rulerTicks    = document.querySelectorAll('#site-ruler .hero-ruler__tick');

    if (!rulerFill || !rulerDot) return;

    // Seções em ordem de aparição na página
    const SECTION_IDS = [
      'hero-wrapper',
      'planos',
      'personal-banker',
      'sobre',
      'contato',
    ];

    const sections = SECTION_IDS.map(id => document.getElementById(id));

    let rulerRaf = null;

    function updateRuler() {
      rulerRaf = null;

      const scrollY = window.scrollY;
      const viewH   = window.innerHeight;
      const docH    = document.documentElement.scrollHeight - viewH;
      const midY    = scrollY + viewH * 0.45; // ponto de referência ligeiramente acima do centro

      // ── Progresso por seção (fill suave proporcional) ──
      let sectionProgress = 0;
      const total = sections.length;

      for (let i = 0; i < total; i++) {
        const el = sections[i];
        if (!el) continue;
        const top    = el.offsetTop;
        const height = el.offsetHeight;

        if (midY >= top + height) {
          sectionProgress = (i + 1) / total;
        } else if (midY >= top) {
          const pct = (midY - top) / height;
          sectionProgress = (i + Math.min(pct, 1)) / total;
          break;
        }
      }

      const fillPct = (sectionProgress * 100).toFixed(2) + '%';
      rulerFill.style.height = fillPct;
      rulerDot.style.top     = fillPct;

      // ── Seção atual (para contador e tick ativo) ──
      let current = 0;
      for (let i = 0; i < total; i++) {
        const el = sections[i];
        if (el && el.offsetTop <= midY) current = i;
      }

      if (rulerPhaseNum) {
        rulerPhaseNum.textContent = String(current + 1).padStart(2, '0');
      }

      rulerTicks.forEach((tick, i) => {
        tick.classList.toggle('is-active', i === current);
      });
    }

    function scheduleRuler() {
      if (!rulerRaf) rulerRaf = requestAnimationFrame(updateRuler);
    }

    window.addEventListener('scroll', scheduleRuler, { passive: true });
    window.addEventListener('resize', scheduleRuler, { passive: true });
    scheduleRuler(); // estado inicial
  })();

})();
