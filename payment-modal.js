/* ══════════════════════════════════════
   PAYMENT MODAL — Franq
   Fluxo: Autenticação → Pagamento → Confirmação
══════════════════════════════════════ */

(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────────────
  // CPF simulado para demonstrar o estado "não cadastrado"
  const NOT_REGISTERED_CPF = '000.000.000-00';

  // ── HTML do modal ────────────────────────────────────────────────
  const MODAL_HTML = `
  <div class="pm-overlay" id="pmOverlay" role="dialog" aria-modal="true" aria-label="Contratar plano">
    <div class="pm-modal">

      <!-- Header -->
      <div class="pm-header">
        <div class="pm-steps" id="pmSteps">
          <div class="pm-step is-active" data-step="auth">
            <div class="pm-step__dot">1</div>
            <span>Autenticação</span>
          </div>
          <div class="pm-step__line"></div>
          <div class="pm-step" data-step="payment">
            <div class="pm-step__dot">2</div>
            <span>Pagamento</span>
          </div>
        </div>
        <button class="pm-close" id="pmClose" aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="pm-body">

        <!-- ── PASSO 1: Autenticação ── -->
        <div id="pmPanelAuth">
          <h2 class="pm-title">Confirme sua identidade</h2>
          <p class="pm-subtitle">Use os dados cadastrados na Franq para acessar seu plano.</p>

          <div class="pm-field">
            <label class="pm-label" for="pmCpf">CPF</label>
            <input class="pm-input" id="pmCpf" type="text" inputmode="numeric"
              placeholder="000.000.000-00" maxlength="14" autocomplete="off"/>
          </div>
          <div class="pm-field">
            <label class="pm-label" for="pmEmail">E-mail cadastrado</label>
            <input class="pm-input" id="pmEmail" type="email"
              placeholder="seu@email.com.br" autocomplete="email"/>
          </div>

          <!-- Erro genérico -->
          <div class="pm-error" id="pmAuthError">
            <div class="pm-error__title">CPF ou e-mail incorretos</div>
            <div class="pm-error__desc">Verifique os dados e tente novamente.</div>
          </div>

          <button class="pm-btn" id="pmAuthSubmit">Continuar</button>

          <!-- Estado: não cadastrado / não aprovado -->
          <div class="pm-not-registered" id="pmNotRegistered">
            <div class="pm-not-registered__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
            </div>
            <div class="pm-not-registered__title">CPF ou e-mail não encontrado</div>
            <div class="pm-not-registered__desc">
              Os planos da Franq são exclusivos para Personal Bankers aprovados. Para contratar, você precisa primeiro passar pelo nosso processo de seleção.
            </div>
            <div class="pm-not-registered__steps">
              <div class="pm-nr-step">
                <div class="pm-nr-step__num">1</div>
                <div class="pm-nr-step__text">Faça seu cadastro com seus dados e histórico profissional</div>
              </div>
              <div class="pm-nr-step">
                <div class="pm-nr-step__num">2</div>
                <div class="pm-nr-step__text">Nossa equipe avalia seu perfil e realiza uma entrevista</div>
              </div>
              <div class="pm-nr-step">
                <div class="pm-nr-step__num">3</div>
                <div class="pm-nr-step__text">Após aprovado, você recebe acesso para contratar seu plano</div>
              </div>
            </div>
            <button class="pm-btn" onclick="pmClose(); if(typeof window.rmOpen==='function') window.rmOpen();">
              Iniciar meu cadastro
            </button>
            <button class="pm-btn pm-btn--ghost" id="pmNotRegisteredBack" style="margin-top:10px">
              Tentar com outros dados
            </button>
          </div>
        </div>

        <!-- ── PASSO 2: Pagamento ── -->
        <div id="pmPanelPayment" style="display:none">
          <div class="pm-summary" id="pmSummary">
            <div>
              <div class="pm-summary__label">Você está contratando</div>
              <div class="pm-summary__plan" id="pmSummaryPlan">Plano Anual</div>
            </div>
            <div style="text-align:right">
              <div class="pm-summary__price" id="pmSummaryPrice">R$ 1.200</div>
              <div class="pm-summary__period" id="pmSummaryPeriod">/ano</div>
            </div>
          </div>

          <div class="pm-tabs">
            <button class="pm-tab is-active" id="pmTabCard" onclick="pmSwitchTab('card')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>
              </svg>
              Cartão
            </button>
            <button class="pm-tab" id="pmTabPix" onclick="pmSwitchTab('pix')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              PIX
            </button>
          </div>

          <!-- Cartão (campos Asaas — ordem e campos não alterados) -->
          <div class="pm-tab-panel is-active" id="pmPanelCard">
            <div class="pm-field">
              <label class="pm-label" for="pmCardNumber">Número do cartão</label>
              <input class="pm-input" id="pmCardNumber" type="text" inputmode="numeric"
                placeholder="0000 0000 0000 0000" maxlength="19" autocomplete="cc-number"/>
            </div>
            <div class="pm-field">
              <label class="pm-label" for="pmCardName">Nome impresso no cartão</label>
              <input class="pm-input" id="pmCardName" type="text"
                placeholder="Como aparece no cartão" autocomplete="cc-name"
                oninput="this.value = this.value.toUpperCase()"/>
            </div>
            <div class="pm-row">
              <div class="pm-field">
                <label class="pm-label" for="pmCardExpiry">Validade</label>
                <input class="pm-input" id="pmCardExpiry" type="text" inputmode="numeric"
                  placeholder="MM/AA" maxlength="5" autocomplete="cc-exp"/>
              </div>
              <div class="pm-field">
                <label class="pm-label" for="pmCardCvv">CVV</label>
                <input class="pm-input" id="pmCardCvv" type="text" inputmode="numeric"
                  placeholder="000" maxlength="4" autocomplete="cc-csc"/>
              </div>
            </div>

            <div class="pm-error" id="pmCardError">
              <div class="pm-error__title">Dados inválidos</div>
              <div class="pm-error__desc">Verifique os dados do cartão e tente novamente.</div>
            </div>

            <button class="pm-btn" id="pmCardSubmit">Pagar</button>

            <div class="pm-footer-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Pagamento seguro via Asaas
            </div>
          </div>

          <!-- PIX -->
          <div class="pm-tab-panel" id="pmPanelPix">
            <div class="pm-pix">
              <div class="pm-pix__qr" id="pmQrCode">
                <!-- QR code gerado pelo Asaas -->
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <!-- QR placeholder visual -->
                  <rect width="100" height="100" fill="#fff"/>
                  <rect x="5" y="5" width="35" height="35" fill="none" stroke="#000" stroke-width="5"/>
                  <rect x="13" y="13" width="19" height="19" fill="#000"/>
                  <rect x="60" y="5" width="35" height="35" fill="none" stroke="#000" stroke-width="5"/>
                  <rect x="68" y="13" width="19" height="19" fill="#000"/>
                  <rect x="5" y="60" width="35" height="35" fill="none" stroke="#000" stroke-width="5"/>
                  <rect x="13" y="68" width="19" height="19" fill="#000"/>
                  <!-- Padrão central -->
                  <rect x="44" y="5" width="5" height="5" fill="#000"/>
                  <rect x="51" y="5" width="5" height="5" fill="#000"/>
                  <rect x="44" y="12" width="5" height="5" fill="#000"/>
                  <rect x="44" y="19" width="5" height="5" fill="#000"/>
                  <rect x="51" y="19" width="5" height="5" fill="#000"/>
                  <rect x="44" y="44" width="5" height="5" fill="#000"/>
                  <rect x="51" y="44" width="5" height="5" fill="#000"/>
                  <rect x="58" y="44" width="5" height="5" fill="#000"/>
                  <rect x="65" y="44" width="5" height="5" fill="#000"/>
                  <rect x="72" y="44" width="5" height="5" fill="#000"/>
                  <rect x="44" y="51" width="5" height="5" fill="#000"/>
                  <rect x="58" y="51" width="5" height="5" fill="#000"/>
                  <rect x="65" y="58" width="5" height="5" fill="#000"/>
                  <rect x="44" y="65" width="5" height="5" fill="#000"/>
                  <rect x="58" y="65" width="5" height="5" fill="#000"/>
                  <rect x="72" y="58" width="5" height="5" fill="#000"/>
                  <rect x="51" y="72" width="5" height="5" fill="#000"/>
                  <rect x="65" y="72" width="5" height="5" fill="#000"/>
                  <rect x="44" y="79" width="5" height="5" fill="#000"/>
                  <rect x="65" y="79" width="5" height="5" fill="#000"/>
                  <rect x="72" y="79" width="5" height="5" fill="#000"/>
                  <rect x="51" y="86" width="5" height="5" fill="#000"/>
                  <rect x="58" y="86" width="5" height="5" fill="#000"/>
                  <rect x="72" y="86" width="5" height="5" fill="#000"/>
                </svg>
              </div>
              <div class="pm-pix__label">Copie o código PIX ou escaneie o QR Code</div>
              <div class="pm-pix__key" id="pmPixKey">00020126580014br.gov.bcb.pix0136a3f6a5f8-2c4d-4e1b-9f67-3b2c1d4e5f6a520400005303986540...</div>
              <div class="pm-pix__timer" id="pmPixTimer">⏱ Expira em 30:00</div>
              <button class="pm-btn pm-btn--copy" id="pmPixCopy" onclick="pmCopyPix()">
                Copiar código PIX
              </button>
              <div class="pm-footer-note" style="margin-top:14px">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                PIX gerado via Asaas · Confirmação em até 1 minuto
              </div>
              <!-- Botão para simular confirmação via PIX (em produção, Asaas notifica via webhook) -->
              <button class="pm-btn" id="pmPixConfirm" style="margin-top:16px">
                Já realizei o pagamento
              </button>
            </div>
          </div>
        </div>

        <!-- ── PASSO 3: Confirmação / Recibo ── -->
        <div id="pmPanelSuccess" style="display:none">
          <div class="pm-success">
            <div class="pm-success__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div class="pm-success__title">Plano ativado!</div>
            <div class="pm-success__desc" id="pmSuccessDesc"></div>

            <!-- Recibo -->
            <div class="pm-receipt">
              <div class="pm-receipt__header">
                <span class="pm-receipt__plan-name" id="pmReceiptPlan"></span>
                <span class="pm-receipt__amount" id="pmReceiptAmount"></span>
              </div>
              <div class="pm-receipt__rows">
                <div class="pm-receipt__row">
                  <span class="pm-receipt__key">Data do pagamento</span>
                  <span class="pm-receipt__val" id="pmReceiptDate"></span>
                </div>
                <div class="pm-receipt__row" id="pmReceiptRenewalRow">
                  <span class="pm-receipt__key" id="pmReceiptRenewalLabel">Renovação automática</span>
                  <span class="pm-receipt__val" id="pmReceiptRenewal"></span>
                </div>
                <div class="pm-receipt__row">
                  <span class="pm-receipt__key">Forma de pagamento</span>
                  <span class="pm-receipt__val" id="pmReceiptMethod"></span>
                </div>
                <div class="pm-receipt__row pm-receipt__row--id">
                  <span class="pm-receipt__key">ID da transação</span>
                  <span class="pm-receipt__val pm-receipt__val--mono" id="pmReceiptId"></span>
                </div>
              </div>
            </div>

            <div class="pm-success__email-note" id="pmSuccessEmailNote"></div>
            <button class="pm-btn" onclick="pmClose()">Concluir</button>
          </div>
        </div>

      </div>
    </div>
  </div>`;

  // ── Estado ───────────────────────────────────────────────────────
  let currentPlan = { name: 'Plano Anual', price: 'R$ 1.200', period: '/ano', type: 'anual' };
  let lastPaymentMethod = 'card'; // 'card' | 'pix'
  let lastCardLast4 = '';
  let pixTimer = null;
  let pixSeconds = 1800; // 30 min

  // ── Init ─────────────────────────────────────────────────────────
  function init() {
    // Injecta o modal no DOM
    document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

    // Fechar
    document.getElementById('pmClose').addEventListener('click', pmClose);
    document.getElementById('pmOverlay').addEventListener('click', function(e) {
      if (e.target === this) pmClose();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') pmClose();
    });

    // Auth submit
    document.getElementById('pmAuthSubmit').addEventListener('click', pmHandleAuth);
    document.getElementById('pmEmail').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') pmHandleAuth();
    });

    // Voltar do não-cadastrado
    document.getElementById('pmNotRegisteredBack').addEventListener('click', pmResetAuth);

    // Máscaras
    document.getElementById('pmCpf').addEventListener('input', maskCpf);
    document.getElementById('pmCardNumber').addEventListener('input', maskCard);
    document.getElementById('pmCardExpiry').addEventListener('input', maskExpiry);
    document.getElementById('pmCardCvv').addEventListener('input', function() {
      this.value = this.value.replace(/\D/g, '');
    });

    // Card submit
    document.getElementById('pmCardSubmit').addEventListener('click', pmHandleCardPayment);

    // PIX confirm (em produção: webhook Asaas → redireciona automaticamente)
    document.getElementById('pmPixConfirm').addEventListener('click', function() {
      lastPaymentMethod = 'pix';
      lastCardLast4 = '';
      renderReceipt();
      showPanel('success');
      updateStepIndicator('done');
      if (pixTimer) clearInterval(pixTimer);
    });

    // Wiring nos botões das páginas
    wireButtons();
  }

  function wireButtons() {
    const triggers = document.querySelectorAll('[data-pm-trigger]');
    triggers.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const plan = btn.getAttribute('data-pm-plan') || 'anual';
        pmOpen(plan);
      });
    });
  }

  // ── Abrir / Fechar ───────────────────────────────────────────────
  window.pmOpen = function(plan) {
    if (plan === 'mensal') {
      currentPlan = { name: 'Plano Mensal', price: 'R$ 200', period: '/mês', type: 'mensal' };
    } else {
      currentPlan = { name: 'Plano Anual', price: 'R$ 1.200', period: '/ano', type: 'anual' };
    }
    pmResetAll();
    document.getElementById('pmOverlay').classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
      document.getElementById('pmCpf').focus();
    }, 280);
  };

  window.pmClose = function() {
    document.getElementById('pmOverlay').classList.remove('is-open');
    document.body.style.overflow = '';
    if (pixTimer) clearInterval(pixTimer);
  };

  // ── Reset ────────────────────────────────────────────────────────
  function pmResetAll() {
    showPanel('auth');
    pmResetAuth();
    updateStepIndicator('auth');
  }

  function pmResetAuth() {
    document.getElementById('pmCpf').value = '';
    document.getElementById('pmEmail').value = '';
    document.getElementById('pmAuthError').classList.remove('is-visible');
    document.getElementById('pmNotRegistered').classList.remove('is-visible');
    // Mostra os campos
    document.getElementById('pmCpf').closest('.pm-field').style.display = '';
    document.getElementById('pmEmail').closest('.pm-field').style.display = '';
    document.getElementById('pmAuthSubmit').style.display = '';
    document.querySelector('#pmPanelAuth .pm-title').style.display = '';
    document.querySelector('#pmPanelAuth .pm-subtitle').style.display = '';
    document.getElementById('pmCpf').classList.remove('has-error');
    document.getElementById('pmEmail').classList.remove('has-error');
    document.getElementById('pmCpf').focus();
  }

  // ── Painéis ──────────────────────────────────────────────────────
  function showPanel(name) {
    document.getElementById('pmPanelAuth').style.display = name === 'auth' ? '' : 'none';
    document.getElementById('pmPanelPayment').style.display = name === 'payment' ? '' : 'none';
    document.getElementById('pmPanelSuccess').style.display = name === 'success' ? '' : 'none';
  }

  function updateStepIndicator(active) {
    const steps = document.querySelectorAll('.pm-step');
    steps.forEach(function(s) {
      s.classList.remove('is-active', 'is-done');
    });
    if (active === 'auth') {
      steps[0].classList.add('is-active');
    } else if (active === 'payment') {
      steps[0].classList.add('is-done');
      steps[1].classList.add('is-active');
    } else {
      steps[0].classList.add('is-done');
      steps[1].classList.add('is-done');
    }
  }

  // ── Auth ─────────────────────────────────────────────────────────
  function pmHandleAuth() {
    const cpf = document.getElementById('pmCpf').value.trim();
    const email = document.getElementById('pmEmail').value.trim();
    const errEl = document.getElementById('pmAuthError');

    // Limpa erros
    errEl.classList.remove('is-visible');
    document.getElementById('pmCpf').classList.remove('has-error');
    document.getElementById('pmEmail').classList.remove('has-error');

    // Validação básica
    if (!cpfIsValid(cpf)) {
      document.getElementById('pmCpf').classList.add('has-error');
      errEl.querySelector('.pm-error__title').textContent = 'CPF inválido';
      errEl.querySelector('.pm-error__desc').textContent = 'Digite um CPF válido no formato 000.000.000-00.';
      errEl.classList.add('is-visible');
      return;
    }
    if (!emailIsValid(email)) {
      document.getElementById('pmEmail').classList.add('has-error');
      errEl.querySelector('.pm-error__title').textContent = 'E-mail inválido';
      errEl.querySelector('.pm-error__desc').textContent = 'Digite um endereço de e-mail válido.';
      errEl.classList.add('is-visible');
      return;
    }

    // Simula PB não cadastrado
    if (cpf === NOT_REGISTERED_CPF) {
      showNotRegistered();
      return;
    }

    // Simula autenticação bem-sucedida → vai para pagamento
    goToPayment();
  }

  function showNotRegistered() {
    // Esconde campos e botão principal
    document.getElementById('pmCpf').closest('.pm-field').style.display = 'none';
    document.getElementById('pmEmail').closest('.pm-field').style.display = 'none';
    document.getElementById('pmAuthSubmit').style.display = 'none';
    document.querySelector('#pmPanelAuth .pm-title').style.display = 'none';
    document.querySelector('#pmPanelAuth .pm-subtitle').style.display = 'none';
    document.getElementById('pmAuthError').classList.remove('is-visible');
    document.getElementById('pmNotRegistered').classList.add('is-visible');
  }

  // ── Pagamento ────────────────────────────────────────────────────
  function goToPayment() {
    document.getElementById('pmSummaryPlan').textContent = currentPlan.name;
    document.getElementById('pmSummaryPrice').textContent = currentPlan.price;
    document.getElementById('pmSummaryPeriod').textContent = currentPlan.period;
    showPanel('payment');
    updateStepIndicator('payment');
    startPixTimer();
  }

  // ── Recibo ───────────────────────────────────────────────────────
  function renderReceipt() {
    var today = new Date();

    // Data formatada: DD/MM/AAAA
    function fmtDate(d) {
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    // Data de renovação
    var renewal = new Date(today);
    if (currentPlan.type === 'anual') {
      renewal.setFullYear(renewal.getFullYear() + 1);
    } else {
      renewal.setMonth(renewal.getMonth() + 1);
    }

    // ID de transação simulado
    var txId = 'FRQ-' + today.getFullYear()
      + String(today.getMonth() + 1).padStart(2, '0')
      + String(today.getDate()).padStart(2, '0')
      + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();

    // Método de pagamento
    var methodText = lastPaymentMethod === 'pix'
      ? 'PIX'
      : 'Cartão •••• ' + lastCardLast4;

    // Preenche elementos
    document.getElementById('pmReceiptPlan').textContent = currentPlan.name;
    document.getElementById('pmReceiptAmount').textContent = currentPlan.price + currentPlan.period;
    document.getElementById('pmReceiptDate').textContent = fmtDate(today);
    document.getElementById('pmReceiptRenewal').textContent = fmtDate(renewal);
    document.getElementById('pmReceiptMethod').textContent = methodText;
    document.getElementById('pmReceiptId').textContent = txId;

    // Label de renovação por tipo
    if (currentPlan.type === 'anual') {
      document.getElementById('pmReceiptRenewalLabel').textContent = 'Renovação automática';
      document.getElementById('pmSuccessDesc').textContent =
        'Seu pagamento foi confirmado e o plano está ativo. Guarde este recibo para seus registros.';
    } else {
      document.getElementById('pmReceiptRenewalLabel').textContent = 'Próxima cobrança';
      document.getElementById('pmSuccessDesc').textContent =
        'Seu pagamento foi confirmado. Você pode cancelar a qualquer momento sem multa.';
    }

    // Nota de e-mail
    var email = document.getElementById('pmEmail').value || 'seu e-mail cadastrado';
    document.getElementById('pmSuccessEmailNote').textContent =
      'Uma confirmação foi enviada para ' + email;
  }

  window.pmSwitchTab = function(tab) {
    document.getElementById('pmTabCard').classList.toggle('is-active', tab === 'card');
    document.getElementById('pmTabPix').classList.toggle('is-active', tab === 'pix');
    document.getElementById('pmPanelCard').classList.toggle('is-active', tab === 'card');
    document.getElementById('pmPanelPix').classList.toggle('is-active', tab === 'pix');
  };

  function pmHandleCardPayment() {
    const num = document.getElementById('pmCardNumber').value.replace(/\s/g, '');
    const name = document.getElementById('pmCardName').value.trim();
    const exp = document.getElementById('pmCardExpiry').value.trim();
    const cvv = document.getElementById('pmCardCvv').value.trim();
    const errEl = document.getElementById('pmCardError');

    errEl.classList.remove('is-visible');

    if (num.length < 16 || !name || exp.length < 5 || cvv.length < 3) {
      errEl.classList.add('is-visible');
      return;
    }

    // Guarda últimos 4 dígitos
    lastPaymentMethod = 'card';
    lastCardLast4 = num.slice(-4);

    // Simula processamento
    const btn = document.getElementById('pmCardSubmit');
    btn.disabled = true;
    btn.textContent = 'Processando...';
    setTimeout(function() {
      renderReceipt();
      showPanel('success');
      updateStepIndicator('done');
      if (pixTimer) clearInterval(pixTimer);
    }, 1800);
  }

  // ── PIX timer ────────────────────────────────────────────────────
  function startPixTimer() {
    if (pixTimer) clearInterval(pixTimer);
    pixSeconds = 1800;
    updatePixTimer();
    pixTimer = setInterval(function() {
      pixSeconds--;
      updatePixTimer();
      if (pixSeconds <= 0) clearInterval(pixTimer);
    }, 1000);
  }

  function updatePixTimer() {
    const m = Math.floor(pixSeconds / 60).toString().padStart(2, '0');
    const s = (pixSeconds % 60).toString().padStart(2, '0');
    const el = document.getElementById('pmPixTimer');
    if (el) el.textContent = '⏱ Expira em ' + m + ':' + s;
  }

  window.pmCopyPix = function() {
    const key = document.getElementById('pmPixKey').textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(key).then(function() {
        const btn = document.getElementById('pmPixCopy');
        btn.textContent = '✓ Copiado!';
        setTimeout(function() { btn.textContent = 'Copiar código PIX'; }, 2000);
      });
    }
  };

  // ── Máscaras ─────────────────────────────────────────────────────
  function maskCpf() {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    this.value = v;
  }

  function maskCard() {
    let v = this.value.replace(/\D/g, '').slice(0, 16);
    v = v.replace(/(.{4})/g, '$1 ').trim();
    this.value = v;
  }

  function maskExpiry() {
    let v = this.value.replace(/\D/g, '').slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
    this.value = v;
  }

  // ── Validadores ──────────────────────────────────────────────────
  function cpfIsValid(cpf) {
    const clean = cpf.replace(/\D/g, '');
    return clean.length === 11;
  }

  function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ── Start ────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
