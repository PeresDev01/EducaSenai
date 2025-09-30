// telaprincipal/script.js
document.addEventListener('DOMContentLoaded', () => {
    loadSidebarData();
    loadStreakData();
    setupPageInteractions();
});

async function loadSidebarData() {
    const token = sessionStorage.getItem('authToken');
    if (!token) { window.location.href = '/login/index.html'; return; }
    try {
        const response = await fetch('http://localhost:8080/api/users/me', { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error('Falha na autenticação.');
        const user = await response.json();
        document.getElementById('sidebar-username').textContent = user.name;
        document.getElementById('sidebar-role').textContent = user.role;
        const sidebarAvatar = document.getElementById('sidebar-avatar');
        if (user.avatarUrl) { sidebarAvatar.src = `http://localhost:8080${user.avatarUrl}`; } 
        else { sidebarAvatar.src = 'img/user-avatar.jpg'; }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        sessionStorage.removeItem('authToken'); 
        window.location.href = '/login/index.html';
    }
}

async function loadStreakData() {
    const token = sessionStorage.getItem('authToken');
    if (!token) return;
    try {
        const response = await fetch('http://localhost:8080/api/aluno/dashboard', { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error("Erro ao carregar dados de ofensiva.");
        const data = await response.json();
        const streakCountEl = document.getElementById('streak-count');
        const streakFlameEl = document.getElementById('streak-flame');
        if (streakCountEl) streakCountEl.textContent = data.streakCount;
        if (streakFlameEl) {
            if (data.streakCount > 0) {
                streakFlameEl.classList.add('active');
                streakFlameEl.src = './img/fogoOn.png';
            } else {
                streakFlameEl.classList.remove('active');
                streakFlameEl.src = './img/fogoOff.png';
            }
        }
    } catch (error) {
        console.error("Falha ao carregar dados de ofensiva:", error);
    }
}

function setupPageInteractions() {
    const logoutButton = document.getElementById('logout-button');
    if(logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            sessionStorage.removeItem('authToken');
            alert('Você foi desconectado.');
            window.location.href = '/TelaInicial/index.html'; 
        });
    }
    const toggleMenuButton = document.querySelector(".toggle-menu");
    const sidebar = document.querySelector(".sidebar");
    const expandSidebarButton = document.querySelector(".expand-sidebar");
    if (toggleMenuButton && sidebar && expandSidebarButton) {
        toggleMenuButton.addEventListener("click", () => {
            sidebar.classList.add("collapsed");
            expandSidebarButton.style.display = 'flex';
        });
        expandSidebarButton.addEventListener("click", () => {
            sidebar.classList.remove("collapsed");
            expandSidebarButton.style.display = 'none';
        });
    }
    const eye = document.querySelector(".eye");
    const pupil = eye ? eye.querySelector(".pupil") : null;
    if (eye && pupil) {
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        document.addEventListener("mousemove", (e) => { mouseX = e.clientX; mouseY = e.clientY; });
        function updateEye() {
            if (!eye.parentElement.offsetParent) return;
            const rect = eye.getBoundingClientRect();
            const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
            let dx = mouseX - cx, dy = mouseY - cy;
            const dist = Math.hypot(dx, dy);
            const maxMove = (rect.width - pupil.offsetWidth) / 2;
            if (dist > 0) {
               dx = (dx / dist) * Math.min(dist, maxMove);
               dy = (dy / dist) * Math.min(dist, maxMove);
            }
            pupil.style.transform = `translate(${dx}px, ${dy}px)`;
            requestAnimationFrame(updateEye);
        }
        updateEye();
    }

    
}

 /* ==========================
     Olho do golfinho (UM olho que segue o mouse)
     ========================== */
  const eye = document.querySelector(".eye");
  const pupil = eye ? eye.querySelector(".pupil") : null;
  if (eye && pupil) {
    // variável que guarda última posição do mouse (útil se quiser animar)
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // atualiza mouse global
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // também lidar com toque (para mobile)
    document.addEventListener("touchmove", (e) => {
      if (e.touches && e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    function updateEye() {
      const rect = eye.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // vetor do centro do olho até o ponteiro
      let dx = mouseX - cx;
      let dy = mouseY - cy;

      // distância real
      const dist = Math.hypot(dx, dy);

      // max movimento da pupila: deixamos um pouco dentro do branco do olho
      const maxMove = Math.max( (rect.width - pupil.offsetWidth) / 2 - 2, 2 );

      if (dist > 0) {
        // normalizar e multiplicar por maxMove (limita o movimento)
        dx = (dx / dist) * Math.min(dist, maxMove);
        dy = (dy / dist) * Math.min(dist, maxMove);
      } else {
        dx = 0; dy = 0;
      }

      // Aplicar transformação relativa ao centro da pupila
      pupil.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

      requestAnimationFrame(updateEye);
    }

    // iniciar loop
    updateEye();
  }