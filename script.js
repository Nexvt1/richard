// Voltar ao topo ao clicar em PV / 2026 ou qualquer link #topo
document.querySelectorAll('a[href="#topo"]').forEach((topLink) => {
  topLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// Menu Mobile
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// Explorador de Evidências (Seção 02)
const explorerTabs = document.querySelectorAll('.explorer-tab');
const explorerPanes = document.querySelectorAll('.explorer-pane');

explorerTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-tab');

    explorerTabs.forEach((t) => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    explorerPanes.forEach((p) => p.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const activePane = document.getElementById(`tab-${target}`);
    if (activePane) {
      activePane.classList.add('active');
    }
  });
});

// Monitor de Vinhetas de Intervalo (Seção 03)
const monitorButtons = document.querySelectorAll('.monitor-btn');
const tvSubtitle = document.getElementById('tvSubtitle');
const vinhetaIndexLabel = document.getElementById('vinhetaIndexLabel');

monitorButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    monitorButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const quote = btn.getAttribute('data-quote');
    const idx = btn.getAttribute('data-index');

    if (tvSubtitle && quote) {
      tvSubtitle.textContent = quote;
    }
    if (vinhetaIndexLabel && idx) {
      vinhetaIndexLabel.textContent = `VINHETA ${idx}`;
    }
  });
});

// Copiar Link do Canva
const copyCanvaLinkBtn = document.getElementById('copyCanvaLinkBtn');
if (copyCanvaLinkBtn) {
  copyCanvaLinkBtn.addEventListener('click', async () => {
    const link = copyCanvaLinkBtn.getAttribute('data-link');
    try {
      await navigator.clipboard.writeText(link);
      const originalText = copyCanvaLinkBtn.textContent;
      copyCanvaLinkBtn.textContent = 'Link copiado';
      setTimeout(() => {
        copyCanvaLinkBtn.textContent = originalText;
      }, 2000);
    } catch {
      window.open(link, '_blank');
    }
  });
}

// Quiz de Fixação (Seção 05)
const quizQuestions = [
  {
    question: 'O que caracteriza o Tabagismo Passivo?',
    options: [
      'A. Fumar apenas ocasionalmente em eventos sociais.',
      'B. A inalação involuntária da fumaça de derivados do tabaco ou fumígenos por pessoas que não fumam.',
      'C. Sentir o odor residual de cigarro apagado em tecidos.',
      'D. O consumo exclusivo de cigarros com filtro em locais fechados.'
    ],
    correctIndex: 1,
    explanation: 'O tabagismo passivo ocorre quando não fumantes inalam involuntariamente a fumaça presente no mesmo ambiente.'
  },
  {
    question: 'Como e onde ocorre o Tabagismo Passivo?',
    options: [
      'A. Exclusivamente em salas sem janelas.',
      'B. Apenas dentro de veículos fechados.',
      'C. Quando um não fumante inala involuntariamente a fumaça presente tanto em ambientes fechados quanto abertos.',
      'D. Deixa de ocorrer se houver ventilador ligado no recinto.'
    ],
    correctIndex: 2,
    explanation: 'Tanto em locais fechados quanto em ambientes abertos próximos a fumantes, a fumaça se espalha e é inalada por quem está ao redor.'
  },
  {
    question: 'Qual é a proposta central do projeto "O Mundo de Richard"?',
    options: [
      'A. Produzir animações didáticas contra o tabagismo passivo inspiradas nas propagandas educativas dos intervalos da Globo.',
      'B. Publicar um relatório técnico restrito a profissionais de saúde.',
      'C. Desenvolver uma campanha apenas em texto impresso.',
      'D. Abordar somente fumantes ativos de longa data.'
    ],
    correctIndex: 0,
    explanation: 'O projeto utiliza animações curtas e didáticas baseadas no formato clássico de intervalo comercial educativo da TV.'
  },
  {
    question: 'Em relação à fumaça liberada no ambiente, é correto afirmar que:',
    options: [
      'A. Dissolve-se imediatamente no ar sem oferecer risco.',
      'B. Contém milhares de substâncias tóxicas e dezenas de compostos cancerígenos.',
      'C. Afeta apenas quem realiza a tragada direta.',
      'D. É filtrada integralmente antes de sair pela ponta acesa.'
    ],
    correctIndex: 1,
    explanation: 'A fumaça liberada no ambiente carrega mais de 4.700 substâncias tóxicas e mais de 50 compostos cancerígenos.'
  }
];

let currentQuestionIndex = 0;
let quizScore = 0;

const quizQuestionCounter = document.getElementById('quizQuestionCounter');
const quizProgressFill = document.getElementById('quizProgressFill');
const quizQuestionText = document.getElementById('quizQuestionText');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const quizFeedbackText = document.getElementById('quizFeedbackText');
const quizNextBtn = document.getElementById('quizNextBtn');

function renderQuestion() {
  const q = quizQuestions[currentQuestionIndex];
  const numStr = String(currentQuestionIndex + 1).padStart(2, '0');
  const totalStr = String(quizQuestions.length).padStart(2, '0');

  quizQuestionCounter.textContent = `QUESTÃO ${numStr} / ${totalStr}`;
  quizProgressFill.style.width = `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`;
  quizQuestionText.textContent = q.question;
  quizOptions.innerHTML = '';
  quizFeedback.hidden = true;

  q.options.forEach((optText, index) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.textContent = optText;
    btn.addEventListener('click', () => handleAnswer(index, btn));
    quizOptions.appendChild(btn);
  });
}

function handleAnswer(selectedIndex, clickedBtn) {
  const q = quizQuestions[currentQuestionIndex];
  const allBtns = quizOptions.querySelectorAll('.quiz-option-btn');

  allBtns.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.correctIndex) {
      btn.classList.add('correct');
    }
  });

  if (selectedIndex === q.correctIndex) {
    quizScore++;
    quizFeedbackText.innerHTML = `<strong>Resposta correta.</strong> ${q.explanation}`;
  } else {
    clickedBtn.classList.add('wrong');
    quizFeedbackText.innerHTML = `<strong>Resposta incorreta.</strong> ${q.explanation}`;
  }

  quizNextBtn.textContent =
    currentQuestionIndex < quizQuestions.length - 1 ? 'Próxima questão →' : 'Ver resultado final →';
  quizFeedback.hidden = false;
}

if (quizNextBtn) {
  quizNextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      renderQuestion();
    } else {
      showQuizSummary();
    }
  });
}

function showQuizSummary() {
  quizQuestionCounter.textContent = 'RESULTADO FINAL';
  quizProgressFill.style.width = '100%';
  quizQuestionText.textContent = `Pontuação: ${quizScore} de ${quizQuestions.length} questões corretas.`;
  quizOptions.innerHTML = `
    <div style="padding: 1.25rem; border: 1.5px solid #0d0f12; background: #f6f5f0; font-size: 0.95rem;">
      Revisão concluída. O objetivo do projeto <strong>O Mundo de Richard</strong> é tornar esses dados acessíveis a todos através da animação.
    </div>
  `;
  quizFeedbackText.textContent = 'Deseja reiniciar o questionário?';
  quizNextBtn.textContent = 'Reiniciar teste ↺';
  quizNextBtn.onclick = () => {
    currentQuestionIndex = 0;
    quizScore = 0;
    quizNextBtn.onclick = null;
    renderQuestion();
  };
}

renderQuestion();

// Edição da Ficha Técnica (Seção 06)
const toggleEditTeamBtn = document.getElementById('toggleEditTeamBtn');
const editableMembers = document.querySelectorAll('.editable-member, .editable-role');
let isEditingTeam = false;

editableMembers.forEach((el, idx) => {
  const saved = localStorage.getItem(`richard_team_field_${idx}`);
  if (saved) {
    el.textContent = saved;
  }
});

if (toggleEditTeamBtn) {
  toggleEditTeamBtn.addEventListener('click', () => {
    isEditingTeam = !isEditingTeam;
    editableMembers.forEach((el, idx) => {
      el.setAttribute('contenteditable', String(isEditingTeam));
      if (!isEditingTeam) {
        localStorage.setItem(`richard_team_field_${idx}`, el.textContent.trim());
      }
    });

    toggleEditTeamBtn.textContent = isEditingTeam
      ? 'Salvar alterações'
      : 'Editar integrantes';
  });
}
