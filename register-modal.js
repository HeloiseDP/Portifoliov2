/* ══════════════════════════════════════
   REGISTER MODAL — Franq
   Modal de cadastro de novo Personal Banker
══════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Data ── */
  const INSTITUICOES = [
    'Itaú / Unibanco','Bradesco','Santander','Banco do Brasil',
    'Banco Original','Sicoob','Sicredi','HSBC','Safra',
    'XP Investimentos','Outro (especificar)'
  ];
  const CARGOS = [
    'Gerente Relacionamento PF','Gerente Relacionamento PJ',
    'Gerente Geral (agência)','Regional de Vendas','Caixa',
    'Assistente','Gerente Administrativo','Corretor',
    'Correspondente Bancário','Agente Autônomo de Investimentos (AAI)',
    'Operações (tesouraria, retaguarda, crédito)','Diretor / Superintendente',
    'Outro (especificar)'
  ];
  const CERTIFICACOES = [
    'CPA-10 / CPA','CPA-20 / C-Pro R','ANCORD','CEA / C-Pro I',
    'CFP','CGA','CVM','FEBRABAN','SUSEP','APIMEC',
    'Sem certificações','Outra (especificar)'
  ];

  /* ── Modal HTML ── */
  const MODAL_HTML = `
<div class="rm-overlay" id="rmOverlay" role="dialog" aria-modal="true" aria-label="Cadastro Personal Banker">
  <div class="rm-modal">

    <!-- Header -->
    <div class="rm-header">
      <div class="rm-intro">
        <p class="rm-intro__title">Cadastre-se e faça como outros <em>10.000 Personal Bankers.</em></p>
        <p class="rm-intro__sub">O uso do CPF é necessário para confirmar que você é uma pessoa real.</p>
      </div>
      <button class="rm-close" id="rmClose" aria-label="Fechar">
        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/>
        </svg>
      </button>
    </div>

    <!-- Steps indicator -->
    <div class="rm-steps-bar">
      <div class="rm-step-item is-active" id="rmStepItem1">
        <div class="rm-step-item__num">1</div>
        <span>Dados pessoais</span>
      </div>
      <div class="rm-step-connector"></div>
      <div class="rm-step-item" id="rmStepItem2">
        <div class="rm-step-item__num">2</div>
        <span>Dados profissionais</span>
      </div>
      <div class="rm-step-connector"></div>
      <div class="rm-step-item" id="rmStepItem3">
        <div class="rm-step-item__num">3</div>
        <span>Dados residenciais</span>
      </div>
    </div>

    <!-- Scrollable content -->
    <div class="rm-scroll">
      <div class="rm-body">

        <!-- ── STEP 1: Dados pessoais ── -->
        <div class="rm-step is-active" id="rmStep1">
          <div class="rm-section-hd">
            <div class="rm-section-hd__left">
              <div class="rm-section-hd__icon">👤</div>
              <span class="rm-section-hd__title">Dados pessoais</span>
            </div>
            <span class="rm-section-hd__badge">Etapa 1/3</span>
          </div>

          <div class="rm-error" id="rmError1"></div>

          <div class="rm-field">
            <label class="rm-label" for="rmNome">Nome Completo</label>
            <input class="rm-input" id="rmNome" type="text" placeholder="Digite seu nome completo" autocomplete="name" />
          </div>
          <div class="rm-field">
            <label class="rm-label" for="rmEmail">E-mail</label>
            <input class="rm-input" id="rmEmail" type="email" placeholder="@mail.com" autocomplete="email" />
          </div>
          <div class="rm-field">
            <label class="rm-label" for="rmCelular">Celular</label>
            <input class="rm-input" id="rmCelular" type="tel" placeholder="(00) 00000-0000" autocomplete="tel" />
          </div>
          <div class="rm-field">
            <label class="rm-label" for="rmCpf">CPF</label>
            <input class="rm-input" id="rmCpf" type="text" placeholder="000.000.000-00" inputmode="numeric" />
          </div>

          <p class="rm-terms">
            Ao informar meus dados, eu concordo com a
            <a href="#">Política de Privacidade</a> e com os <a href="#">Termos de Uso</a>
          </p>

          <div class="rm-actions">
            <button class="rm-btn" id="rmNext1">Próxima etapa</button>
          </div>
        </div>

        <!-- ── STEP 2: Dados profissionais ── -->
        <div class="rm-step" id="rmStep2">
          <div class="rm-section-hd">
            <div class="rm-section-hd__left">
              <div class="rm-section-hd__icon">💼</div>
              <span class="rm-section-hd__title">Dados profissionais</span>
            </div>
            <span class="rm-section-hd__badge">Etapa 2/3</span>
          </div>

          <div class="rm-error" id="rmError2"></div>

          <!-- 5+ anos de experiência -->
          <div class="rm-field">
            <label class="rm-label">Você possui 5 ou mais anos de experiência no mercado financeiro em instituições como bancos de varejo ou cooperativas de crédito?</label>
            <div class="rm-radio-group">
              <label class="rm-radio-label" id="rmExpSim">
                <input type="radio" name="rmExp" value="sim" />
                <div class="rm-radio-dot"></div>
                Sim
              </label>
              <label class="rm-radio-label" id="rmExpNao">
                <input type="radio" name="rmExp" value="nao" />
                <div class="rm-radio-dot"></div>
                Não
              </label>
            </div>
          </div>

          <hr class="rm-divider" />

          <!-- Instituições -->
          <div class="rm-field">
            <label class="rm-label">Quais instituições financeiras você já trabalhou?</label>
            <div class="rm-multiselect" id="msInstituicoes">
              <button type="button" class="rm-multiselect__trigger" id="msTriggerInst">
                Selecione as opções
                <svg class="rm-multiselect__chevron" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 10.586L2.707 5.293a1 1 0 00-1.414 1.414l6 6a1 1 0 001.414 0l6-6a1 1 0 00-1.414-1.414L8 10.586z"/>
                </svg>
              </button>
              <div class="rm-multiselect__dropdown" id="msDropdownInst"></div>
            </div>
            <div class="rm-outro-input" id="rmOutroInstWrap">
              <input class="rm-input" id="rmOutroInst" type="text" placeholder="Especifique outra instituição" />
            </div>
          </div>

          <!-- Cargos -->
          <div class="rm-field">
            <label class="rm-label">Em quais cargos você já trabalhou?</label>
            <div class="rm-multiselect" id="msCargos">
              <button type="button" class="rm-multiselect__trigger" id="msTriggerCargo">
                Selecione as opções
                <svg class="rm-multiselect__chevron" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 10.586L2.707 5.293a1 1 0 00-1.414 1.414l6 6a1 1 0 001.414 0l6-6a1 1 0 00-1.414-1.414L8 10.586z"/>
                </svg>
              </button>
              <div class="rm-multiselect__dropdown" id="msDropdownCargo"></div>
            </div>
            <div class="rm-outro-input" id="rmOutroCargoWrap">
              <input class="rm-input" id="rmOutroCargo" type="text" placeholder="Especifique outro cargo" />
            </div>
          </div>

          <!-- Certificações -->
          <div class="rm-field">
            <label class="rm-label">Quais certificações você já obteve?</label>
            <div class="rm-multiselect" id="msCerts">
              <button type="button" class="rm-multiselect__trigger" id="msTriggerCert">
                Selecione as opções
                <svg class="rm-multiselect__chevron" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 10.586L2.707 5.293a1 1 0 00-1.414 1.414l6 6a1 1 0 001.414 0l6-6a1 1 0 00-1.414-1.414L8 10.586z"/>
                </svg>
              </button>
              <div class="rm-multiselect__dropdown" id="msDropdownCert"></div>
            </div>
            <div class="rm-outro-input" id="rmOutroCertWrap">
              <input class="rm-input" id="rmOutroCert" type="text" placeholder="Especifique outra certificação" />
            </div>
          </div>

          <!-- LinkedIn -->
          <div class="rm-field">
            <label class="rm-label" for="rmLinkedin">Qual seu LinkedIn? <span style="opacity:.5">(Opcional)</span></label>
            <input class="rm-input" id="rmLinkedin" type="url" placeholder="https://linkedin.com/in/seu-perfil" autocomplete="url" />
          </div>

          <div class="rm-actions">
            <button class="rm-btn rm-btn--ghost" id="rmBack2">Voltar</button>
            <button class="rm-btn" id="rmNext2">Próxima etapa</button>
          </div>
        </div>

        <!-- ── STEP 3: Dados residenciais ── -->
        <div class="rm-step" id="rmStep3">
          <div class="rm-section-hd">
            <div class="rm-section-hd__left">
              <div class="rm-section-hd__icon">🏠</div>
              <span class="rm-section-hd__title">Dados residenciais</span>
            </div>
            <span class="rm-section-hd__badge">Etapa 3/3</span>
          </div>

          <div class="rm-error" id="rmError3"></div>

          <div class="rm-field">
            <label class="rm-label" for="rmCep">CEP</label>
            <input class="rm-input" id="rmCep" type="text" placeholder="00000-000" inputmode="numeric" />
          </div>

          <div class="rm-actions">
            <button class="rm-btn rm-btn--ghost" id="rmBack3">Voltar</button>
            <button class="rm-btn" id="rmFinish">Finalizar</button>
          </div>
        </div>

        <!-- ── SUCCESS ── -->
        <div class="rm-step" id="rmStepSuccess">
          <div class="rm-success">
            <div class="rm-success__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p class="rm-success__title">Cadastro enviado!</p>
            <p class="rm-success__desc">
              Recebemos seus dados e nossa equipe irá avaliar seu perfil.<br />
              Você será contactado pelo e-mail informado.
            </p>

            <div class="rm-success__steps">
              <div class="rm-success__step">
                <div class="rm-success__step-num">1</div>
                <div class="rm-success__step-text"><strong>Avaliação do perfil</strong> — nosso time analisa seus dados e histórico profissional</div>
              </div>
              <div class="rm-success__step">
                <div class="rm-success__step-num">2</div>
                <div class="rm-success__step-text"><strong>Entrevista</strong> — se aprovado na triagem, agendamos uma conversa com você</div>
              </div>
              <div class="rm-success__step">
                <div class="rm-success__step-num">3</div>
                <div class="rm-success__step-text"><strong>Acesso liberado</strong> — após aprovado, você recebe acesso para contratar seu plano</div>
              </div>
            </div>

            <button class="rm-btn" id="rmDone">Fechar</button>
          </div>
        </div>

      </div><!-- /.rm-body -->
    </div><!-- /.rm-scroll -->

    <div class="rm-footer-note">
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="1" y="5" width="10" height="6" rx="1.5"/><path d="M4 5V3.5a2 2 0 014 0V5"/>
      </svg>
      Dados protegidos e criptografados
    </div>

  </div><!-- /.rm-modal -->
</div><!-- /.rm-overlay -->
`;

  /* ── State ── */
  let currentStep = 1;
  const selectedInst = new Set();
  const selectedCargo = new Set();
  const selectedCert = new Set();

  /* ── Helpers ── */
  function showError(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.classList.add('is-visible');
  }
  function clearError(id) {
    const el = document.getElementById(id);
    el.textContent = '';
    el.classList.remove('is-visible');
  }
  function emailIsValid(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function cpfDigits(v) { return v.replace(/\D/g,''); }

  /* ── Masks ── */
  function maskPhone(e) {
    let v = e.target.value.replace(/\D/g,'');
    if (v.length > 11) v = v.slice(0,11);
    if (v.length > 6) v = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
    else if (v.length > 2) v = '(' + v.slice(0,2) + ') ' + v.slice(2);
    else if (v.length > 0) v = '(' + v;
    e.target.value = v;
  }
  function maskCpf(e) {
    let v = e.target.value.replace(/\D/g,'');
    if (v.length > 11) v = v.slice(0,11);
    if (v.length > 9) v = v.slice(0,3)+'.'+v.slice(3,6)+'.'+v.slice(6,9)+'-'+v.slice(9);
    else if (v.length > 6) v = v.slice(0,3)+'.'+v.slice(3,6)+'.'+v.slice(6);
    else if (v.length > 3) v = v.slice(0,3)+'.'+v.slice(3);
    e.target.value = v;
  }
  function maskCep(e) {
    let v = e.target.value.replace(/\D/g,'');
    if (v.length > 8) v = v.slice(0,8);
    if (v.length > 5) v = v.slice(0,5)+'-'+v.slice(5);
    e.target.value = v;
  }

  /* ── Multi-select builder ── */
  function buildMultiselect(dropdownId, triggerId, items, selectedSet, outroWrapId) {
    const dropdown = document.getElementById(dropdownId);
    const trigger = document.getElementById(triggerId);
    const outroWrap = document.getElementById(outroWrapId);

    items.forEach(item => {
      const opt = document.createElement('div');
      opt.className = 'rm-multiselect__option';
      opt.setAttribute('data-value', item);
      opt.innerHTML = `
        <div class="rm-checkbox">
          <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
            <polyline points="1 5 4 8 9 2"/>
          </svg>
        </div>
        <span>${item}</span>
      `;
      opt.addEventListener('click', () => {
        const val = item;
        const isOutro = val.toLowerCase().startsWith('outro') || val.toLowerCase().startsWith('outra') || val.toLowerCase().startsWith('sem cer');
        if (selectedSet.has(val)) {
          selectedSet.delete(val);
          opt.classList.remove('is-selected');
          opt.querySelector('svg').style.display = 'none';
        } else {
          selectedSet.add(val);
          opt.classList.add('is-selected');
          opt.querySelector('svg').style.display = '';
        }
        // Toggle "outro" text field
        if (outroWrap) {
          const hasOutro = [...selectedSet].some(v =>
            v.toLowerCase().startsWith('outro') || v.toLowerCase().startsWith('outra')
          );
          outroWrap.classList.toggle('is-visible', hasOutro);
        }
        updateTriggerLabel(trigger, selectedSet);
      });
      dropdown.appendChild(opt);
    });

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('is-open');
      closeAllDropdowns();
      if (!isOpen) {
        dropdown.classList.add('is-open');
        trigger.classList.add('is-open');
      }
    });
  }

  function updateTriggerLabel(trigger, selectedSet) {
    if (selectedSet.size === 0) {
      trigger.textContent = 'Selecione as opções';
      trigger.classList.remove('has-value');
    } else {
      trigger.textContent = [...selectedSet].join(', ');
      trigger.classList.add('has-value');
    }
    // Re-add chevron
    const chevron = document.createElementNS('http://www.w3.org/2000/svg','svg');
    chevron.setAttribute('class','rm-multiselect__chevron');
    chevron.setAttribute('viewBox','0 0 16 16');
    chevron.setAttribute('fill','currentColor');
    chevron.innerHTML = '<path d="M8 10.586L2.707 5.293a1 1 0 00-1.414 1.414l6 6a1 1 0 001.414 0l6-6a1 1 0 00-1.414-1.414L8 10.586z"/>';
    if (trigger.classList.contains('is-open')) chevron.setAttribute('class','rm-multiselect__chevron');
    trigger.appendChild(chevron);
  }

  function closeAllDropdowns() {
    document.querySelectorAll('.rm-multiselect__dropdown').forEach(d => d.classList.remove('is-open'));
    document.querySelectorAll('.rm-multiselect__trigger').forEach(t => t.classList.remove('is-open'));
  }

  /* ── Navigation ── */
  function goToStep(n) {
    document.querySelectorAll('.rm-step').forEach(s => s.classList.remove('is-active'));
    const stepEl = document.getElementById('rmStep' + n) || document.getElementById('rmStepSuccess');
    if (stepEl) stepEl.classList.add('is-active');

    // Update step indicators
    for (let i = 1; i <= 3; i++) {
      const item = document.getElementById('rmStepItem' + i);
      if (!item) continue;
      item.classList.remove('is-active','is-done');
      if (i < n) item.classList.add('is-done');
      else if (i === n) item.classList.add('is-active');
    }

    currentStep = n;
    // Scroll modal to top
    const scroll = document.querySelector('.rm-scroll');
    if (scroll) scroll.scrollTop = 0;
  }

  /* ── Validation ── */
  function validateStep1() {
    clearError('rmError1');
    const nome = document.getElementById('rmNome').value.trim();
    const email = document.getElementById('rmEmail').value.trim();
    const cel = document.getElementById('rmCelular').value.replace(/\D/g,'');
    const cpf = cpfDigits(document.getElementById('rmCpf').value);

    if (!nome || nome.split(' ').length < 2) {
      showError('rmError1', 'Informe seu nome completo (nome e sobrenome).');
      return false;
    }
    if (!emailIsValid(email)) {
      showError('rmError1', 'Informe um e-mail válido.');
      return false;
    }
    if (cel.length < 10) {
      showError('rmError1', 'Informe um celular válido com DDD.');
      return false;
    }
    if (cpf.length !== 11) {
      showError('rmError1', 'Informe um CPF válido com 11 dígitos.');
      return false;
    }
    return true;
  }

  function validateStep2() {
    clearError('rmError2');
    const exp = document.querySelector('input[name="rmExp"]:checked');
    if (!exp) {
      showError('rmError2', 'Responda se você possui 5 ou mais anos de experiência.');
      return false;
    }
    if (selectedInst.size === 0) {
      showError('rmError2', 'Selecione ao menos uma instituição financeira.');
      return false;
    }
    if (selectedCargo.size === 0) {
      showError('rmError2', 'Selecione ao menos um cargo.');
      return false;
    }
    if (selectedCert.size === 0) {
      showError('rmError2', 'Selecione ao menos uma certificação (ou "Sem certificações").');
      return false;
    }
    return true;
  }

  function validateStep3() {
    clearError('rmError3');
    const cep = document.getElementById('rmCep').value.replace(/\D/g,'');
    if (cep.length !== 8) {
      showError('rmError3', 'Informe um CEP válido com 8 dígitos.');
      return false;
    }
    return true;
  }

  /* ── Open / Close ── */
  window.rmOpen = function () {
    const overlay = document.getElementById('rmOverlay');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    goToStep(1);
    // Reset fields
    ['rmNome','rmEmail','rmCelular','rmCpf','rmLinkedin','rmCep',
     'rmOutroInst','rmOutroCargo','rmOutroCert'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    selectedInst.clear(); selectedCargo.clear(); selectedCert.clear();
    // Reset triggers
    ['msTriggerInst','msTriggerCargo','msTriggerCert'].forEach(id => {
      const t = document.getElementById(id);
      if (!t) return;
      t.textContent = 'Selecione as opções';
      t.classList.remove('has-value','is-open');
      // Re-add chevron
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('class','rm-multiselect__chevron');
      svg.setAttribute('viewBox','0 0 16 16');
      svg.setAttribute('fill','currentColor');
      svg.innerHTML = '<path d="M8 10.586L2.707 5.293a1 1 0 00-1.414 1.414l6 6a1 1 0 001.414 0l6-6a1 1 0 00-1.414-1.414L8 10.586z"/>';
      t.appendChild(svg);
    });
    // Reset multi-select options
    document.querySelectorAll('.rm-multiselect__option').forEach(opt => {
      opt.classList.remove('is-selected');
      const svg = opt.querySelector('svg');
      if (svg) svg.style.display = 'none';
    });
    // Reset outro wrappers
    ['rmOutroInstWrap','rmOutroCargoWrap','rmOutroCertWrap'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('is-visible');
    });
    // Reset radio labels
    document.querySelectorAll('.rm-radio-label').forEach(l => l.classList.remove('is-checked'));
    document.querySelectorAll('input[type=radio]').forEach(r => r.checked = false);
    // Clear errors
    ['rmError1','rmError2','rmError3'].forEach(clearError);

    setTimeout(() => document.getElementById('rmNome').focus(), 100);
  };

  window.rmClose = function () {
    document.getElementById('rmOverlay').classList.remove('is-open');
    document.body.style.overflow = '';
    closeAllDropdowns();
  };

  /* ── Init ── */
  function init() {
    document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

    // Build multi-selects
    buildMultiselect('msDropdownInst','msTriggerInst', INSTITUICOES, selectedInst, 'rmOutroInstWrap');
    buildMultiselect('msDropdownCargo','msTriggerCargo', CARGOS, selectedCargo, 'rmOutroCargoWrap');
    buildMultiselect('msDropdownCert','msTriggerCert', CERTIFICACOES, selectedCert, 'rmOutroCertWrap');

    // Close on overlay click
    document.getElementById('rmOverlay').addEventListener('click', function (e) {
      if (e.target === this) window.rmClose();
    });
    document.getElementById('rmClose').addEventListener('click', window.rmClose);
    document.getElementById('rmDone').addEventListener('click', window.rmClose);

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.rm-multiselect')) closeAllDropdowns();
    });

    // Masks
    document.getElementById('rmCelular').addEventListener('input', maskPhone);
    document.getElementById('rmCpf').addEventListener('input', maskCpf);
    document.getElementById('rmCep').addEventListener('input', maskCep);

    // Radio labels
    document.querySelectorAll('.rm-radio-label').forEach(label => {
      label.addEventListener('click', function () {
        document.querySelectorAll('.rm-radio-label').forEach(l => l.classList.remove('is-checked'));
        this.classList.add('is-checked');
        const radio = this.querySelector('input[type=radio]');
        if (radio) radio.checked = true;
      });
    });

    // Step 1 → 2
    document.getElementById('rmNext1').addEventListener('click', () => {
      if (validateStep1()) goToStep(2);
    });

    // Step 2 ← / →
    document.getElementById('rmBack2').addEventListener('click', () => goToStep(1));
    document.getElementById('rmNext2').addEventListener('click', () => {
      if (validateStep2()) goToStep(3);
    });

    // Step 3 ← / Finish
    document.getElementById('rmBack3').addEventListener('click', () => goToStep(2));
    document.getElementById('rmFinish').addEventListener('click', () => {
      if (validateStep3()) {
        document.querySelectorAll('.rm-step').forEach(s => s.classList.remove('is-active'));
        document.getElementById('rmStepSuccess').classList.add('is-active');
        // Remove step items active state
        document.querySelectorAll('.rm-step-item').forEach(i => {
          i.classList.remove('is-active');
          i.classList.add('is-done');
        });
        const scroll = document.querySelector('.rm-scroll');
        if (scroll) scroll.scrollTop = 0;
      }
    });

    // Keyboard close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('rmOverlay').classList.contains('is-open')) {
        window.rmClose();
      }
    });

    // Wire trigger buttons
    wireButtons();
  }

  function wireButtons() {
    document.querySelectorAll('[data-rm-trigger]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.rmOpen();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
