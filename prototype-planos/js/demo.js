/* ══════════════════════════════════════
   Protótipo de portfólio — camada de demonstração
   • Aviso fixo de que é um protótipo com conteúdo fictício
   • Cartão com dados de demonstração (somente leitura)
   • Canais de contato reais da Franq desativados
   • Toast para feedback das ações simuladas
   Carregar DEPOIS de payment-modal.js e register-modal.js.
══════════════════════════════════════ */

(function () {
  'use strict';

  var DEMO_CARD = {
    pmCardNumber: '4242 4242 4242 4242',
    pmCardName: 'CLIENTE DEMONSTRACAO',
    pmCardExpiry: '12/30',
    pmCardCvv: '123'
  };

  var toastEl, toastTimer;
  window.demoToast = function (msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'demo-toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 3600);
  };

  function addBanner() {
    var b = document.createElement('div');
    b.className = 'demo-banner';
    b.innerHTML = '<span><strong>Protótipo de portfólio</strong> · Heloise Demétrio · Conteúdo e valores fictícios, não é um site oficial da Franq. Nada do que você digitar é enviado.</span>' +
      '<button type="button" class="demo-banner__close" aria-label="Fechar aviso">×</button>';
    b.querySelector('button').addEventListener('click', function () { b.remove(); });
    document.body.appendChild(b);
  }

  function prepPaymentModal() {
    Object.keys(DEMO_CARD).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.value = DEMO_CARD[id];
      el.readOnly = true;
      el.setAttribute('aria-readonly', 'true');
      el.setAttribute('autocomplete', 'off');
    });
    var card = document.getElementById('pmPanelCard');
    if (card && !card.querySelector('.demo-note')) {
      var n = document.createElement('p');
      n.className = 'demo-note';
      n.textContent = 'Cartão de demonstração, já preenchido. Nenhum pagamento é processado.';
      card.insertBefore(n, card.firstChild);
    }
    var auth = document.getElementById('pmPanelAuth');
    if (auth && !auth.querySelector('.demo-note')) {
      var a = document.createElement('p');
      a.className = 'demo-note';
      a.innerHTML = 'Para testar: use <strong>123.456.789-09</strong> e qualquer e-mail para seguir até o pagamento, ou <strong>000.000.000-00</strong> para ver o fluxo de quem ainda não é Personal Banker.';
      var sub = auth.querySelector('.pm-subtitle');
      if (sub) sub.insertAdjacentElement('afterend', a); else auth.insertBefore(a, auth.firstChild);
    }
  }

  function prepRegisterModal() {
    var step1 = document.getElementById('rmStep1');
    if (step1 && !step1.querySelector('.demo-note')) {
      var n = document.createElement('p');
      n.className = 'demo-note';
      n.textContent = 'Cadastro simulado: use dados fictícios. Nada é enviado nem salvo.';
      step1.insertBefore(n, step1.firstChild);
    }
  }

  function wireEmptyLinks() {
    document.querySelectorAll('a[href="#"]:not([data-rm-trigger]):not([data-pm-trigger])').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        window.demoToast('Esta página não faz parte do protótipo.');
      });
    });
  }

  function neutralizeRealContacts() {
    var sel = 'a[href^="mailto:"], a[href^="tel:"], a[href*="wa.me"]';
    document.querySelectorAll(sel).forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        window.demoToast('Canal de atendimento desativado neste protótipo.');
      });
    });
  }

  function wireMobileMenu() {
    var header = document.querySelector('.header');
    var btn = document.querySelector('.header__hamburger');
    if (!header || !btn) return;
    btn.addEventListener('click', function () {
      var open = header.classList.toggle('is-menu-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    header.querySelectorAll('.header__nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('is-menu-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function init() {
    addBanner();
    wireMobileMenu();
    neutralizeRealContacts();
    wireEmptyLinks();
    prepPaymentModal();
    prepRegisterModal();

    if (typeof window.pmOpen === 'function') {
      var origOpen = window.pmOpen;
      window.pmOpen = function (plan) {
        origOpen(plan);
        prepPaymentModal();
      };
    }
    if (typeof window.rmOpen === 'function') {
      var origRm = window.rmOpen;
      window.rmOpen = function () {
        origRm.apply(this, arguments);
        prepRegisterModal();
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
