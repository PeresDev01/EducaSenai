document.addEventListener("DOMContentLoaded", function () {
  const toggleMenuButton = document.querySelector(".toggle-menu");
  const sidebar = document.querySelector(".sidebar");
  const expandSidebarButton = document.querySelector(".expand-sidebar");
  const body = document.body;

  // Contrair menu
  toggleMenuButton.addEventListener("click", function () {
    sidebar.classList.add("collapsed");
    expandSidebarButton.classList.add("show");
    body.classList.add("menu-collapsed");
  });

  // Expandir menu
  expandSidebarButton.addEventListener("click", function () {
    sidebar.classList.remove("collapsed");
    expandSidebarButton.classList.remove("show");
    body.classList.remove("menu-collapsed");
  });

  /* ===== Rotação de palavras no título ===== */
  (function rotateWords(){
    const el = document.querySelector('.mentor-cta__rotate');
    if(!el) return;
    const words = JSON.parse(el.dataset.words || '["mentor"]');
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      el.style.opacity = '0';
      setTimeout(()=>{
        el.textContent = words[i];
        el.style.opacity = '1';
      }, 180);
    }, 1800);
  })();

  /* ===== Dica dinâmica curta ===== */
  (function tipOfTheMoment(){
    const tips = [
      "Dica: acompanhe o progresso de cada aluno regularmente.",
      "Sugestão: use os feedbacks para reforçar pontos fortes e corrigir fraquezas.",
      "Pro atalho: registre insights das reuniões para revisitar depois.",
      "Combine: defina pequenos objetivos com os alunos e revise semanalmente."
    ];
    const el = document.getElementById('mentorTip');
    if(!el) return;
    el.textContent = tips[Math.floor(Math.random()*tips.length)];
  })();

  /* ===== Tilt/parallax pelo mouse + faíscas sutis no hover ===== */
  (function fancyHover(){
    const card = document.querySelector('.mentor-cta');
    if(!card) return;

    const strength = 10; // intensidade do tilt
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = (e.clientX - cx) / (r.width/2);
      const dy = (e.clientY - cy) / (r.height/2);
      card.style.transform =
        `perspective(900px) rotateX(${(-dy*strength)}deg) rotateY(${(dx*strength)}deg) translateY(-2px)`;
      
      // faíscas ocasionais
      if(Math.random() < 0.08){
        const s = document.createElement('span');
        s.className = 'spark';
        s.style.left = (e.clientX - r.left - 4) + 'px';
        s.style.top  = (e.clientY - r.top - 4) + 'px';
        card.appendChild(s);
        setTimeout(()=> s.remove(), 800);
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  })();
});
