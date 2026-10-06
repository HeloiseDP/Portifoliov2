/* Portfólio Heloise Demétrio — interações do site estático */
(function () {
  'use strict';

  /* Copiar e-mail */
  document.querySelectorAll('[data-copy-email]').forEach(function (btn) {
    var hint = btn.querySelector('[data-hint]');
    var original = hint ? hint.textContent : '';
    btn.addEventListener('click', function () {
      var email = btn.getAttribute('data-copy-email');
      var fallback = function () {
        var ta = document.createElement('textarea');
        ta.value = email; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).catch(fallback);
      } else { fallback(); }
      if (hint) {
        hint.textContent = btn.getAttribute('data-copied-text') || original;
        clearTimeout(btn._t);
        btn._t = setTimeout(function () { hint.textContent = original; }, 2200);
      }
    });
  });

  /* Comparador antes/depois */
  document.querySelectorAll('[data-compare-frame]').forEach(function (frame) {
    var fig = frame.closest('figure');
    var before = frame.querySelector('[data-before]');
    var handle = frame.querySelector('[data-handle]');
    var slider = fig ? fig.querySelector('[data-slider]') : null;
    function set(p) {
      p = Math.max(0, Math.min(100, Math.round(p)));
      before.style.clipPath = 'inset(0 ' + (100 - p) + '% 0 0)';
      handle.style.left = p + '%';
      if (slider) slider.value = p;
    }
    function fromX(x) {
      var r = frame.getBoundingClientRect();
      set(((x - r.left) / r.width) * 100);
    }
    frame.addEventListener('mousemove', function (e) { fromX(e.clientX); });
    frame.addEventListener('touchmove', function (e) { if (e.touches[0]) fromX(e.touches[0].clientX); }, { passive: true });
    if (slider) slider.addEventListener('input', function () { set(Number(slider.value)); });
  });

  /* Abas da Ficha PJ + modal de envio de documento */
  var tabsRoot = document.querySelector('[data-tabs]');
  if (tabsRoot) {
    var data = JSON.parse(tabsRoot.getAttribute('data-tabs'));
    var fig = tabsRoot.closest('figure');
    var img = fig.querySelector('[data-tab-img]');
    var url = fig.querySelector('[data-tab-url]');
    var cap = fig.querySelector('[data-tab-caption]');
    var hotspot = fig.querySelector('[data-docs-hotspot]');
    var modal = fig.querySelector('[data-modal]');
    var phases = fig.querySelectorAll('[data-phase]');
    var bar = fig.querySelector('[data-pct-bar]');
    var pctText = fig.querySelector('[data-pct-text]');
    var timer = null, phase = 'idle', pct = 0;
    var show = function (el, on) { if (el) el.style.display = on ? 'contents' : 'none'; };

    function setPhase(p) {
      phase = p;
      phases.forEach(function (el) { show(el, el.getAttribute('data-phase') === p); });
    }
    function setPct(v) {
      pct = v;
      if (bar) bar.style.width = v + '%';
      if (pctText) pctText.textContent = v + '%';
    }
    function closeModal() { clearInterval(timer); show(modal, false); setPhase('idle'); setPct(0); }
    function openModal() { setPhase('idle'); setPct(0); show(modal, true); }
    function sendDoc() {
      if (phase !== 'idle') return;
      setPhase('uploading'); setPct(0);
      clearInterval(timer);
      timer = setInterval(function () {
        var p = Math.min(100, pct + 5);
        setPct(p);
        if (p >= 100) { clearInterval(timer); setPhase('success'); }
      }, 70);
    }
    function selectTab(i) {
      closeModal();
      var t = data[i];
      img.src = t.img; img.alt = t.label;
      url.textContent = t.url;
      cap.textContent = t.caption;
      show(hotspot, i === data.length - 1);
      tabsRoot.querySelectorAll('[data-tab]').forEach(function (b, j) {
        var on = j === i;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.style.background = on ? '#1f4b3f' : 'transparent';
        b.style.color = on ? '#f4f1ea' : '#443c31';
        b.style.borderColor = on ? '#1f4b3f' : 'rgba(22,19,15,.14)';
      });
    }
    tabsRoot.querySelectorAll('[data-tab]').forEach(function (b) {
      b.addEventListener('click', function () { selectTab(Number(b.getAttribute('data-tab'))); });
    });
    fig.querySelectorAll('[data-action]').forEach(function (el) {
      var a = el.getAttribute('data-action');
      el.addEventListener('click', a === 'open-modal' ? openModal : a === 'close-modal' ? closeModal : sendDoc);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.style.display !== 'none') closeModal();
    });
  }
})();
