// Executado quando a página HTML é totalmente carregada
document.addEventListener("DOMContentLoaded", () => {
    // 1. Carrega os dados do usuário (foto, nome, etc.) na sidebar
    loadSidebarData();

    // 2. Configura a lógica dos círculos da trilha (seu código original)
    setupTrilhaAprendizado();

    // 3. Configura a lógica do botão de menu (seu código original)
    setupMenuToggle();
    
    // 4. Configura o botão de logout
    setupLogoutButton();
});


/**
 * Busca os dados do usuário no back-end e preenche a sidebar.
 */
async function loadSidebarData() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        console.warn("Nenhum token de autenticação encontrado.");
        return;
    }
    try {
        const response = await fetch('http://localhost:8080/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Falha na autenticação.');
        
        const user = await response.json();
        
        const usernameEl = document.getElementById('sidebar-username');
        const roleEl = document.getElementById('sidebar-role');
        const avatarEl = document.getElementById('sidebar-avatar');

        if (usernameEl) usernameEl.textContent = user.name;
        if (roleEl) roleEl.textContent = user.role;
        if (avatarEl) {
            if (user.avatarUrl) {
                avatarEl.src = `http://localhost:8080${user.avatarUrl}`;
            } else {
                avatarEl.src = '/img/user-avatar.jpg'; // Imagem padrão
            }
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
}


/**
 * Configura toda a lógica de funcionamento da Trilha de Aprendizado.
 */
function setupTrilhaAprendizado() {
    const bolinhas = document.querySelectorAll(".bnco-bolinha");
    const btnReset = document.getElementById("bnco-btnReset");
    const waveEffect = document.getElementById("bnco-waveEffect");
    const bubbleSound = document.getElementById("bnco-bubbleSound");

    if (!bolinhas.length) return;

    if (bubbleSound) {
        bubbleSound.volume = 0.5;
    }
    const caminhos = {
        "1": "/BANCO/Aula01BANCO/TabelaDeConteudobanco/index.html",
        "2": "FRONT/Aula02FRONT/OutraPagina/index.html",
        "3": "FRONT/Aula03FRONT/OutraPagina2/index.html",
        "4": "FRONT/Aula04FRONT/OutraPagina3/index.html",
        "5": "FRONT/Aula05FRONT/OutraPagina4/index.html",
        "6": "FRONT/Aula06FRONT/OutraPagina5/index.html",
        "7": "FRONT/Aula07FRONT/OutraPagina6/index.html"
    };
    function atualizarEstado() {
        let todasMarcadas = true;
        bolinhas.forEach((bolinha, index) => {
            const numero = bolinha.getAttribute("data-numero");
            const marcado = sessionStorage.getItem("bnco_bolinha_" + numero) === "marcado";
            if (marcado) {
                bolinha.classList.add("bnco-marcado");
                bolinha.textContent = "";
            } else {
                bolinha.classList.remove("bnco-marcado");
                bolinha.textContent = numero;
            }
            if (index > 0) {
                const anteriorMarcada = sessionStorage.getItem("bnco_bolinha_" + bolinhas[index - 1].getAttribute("data-numero")) === "marcado";
                bolinha.style.pointerEvents = anteriorMarcada ? "auto" : "none";
                bolinha.style.opacity = anteriorMarcada ? "1" : "0.5";
            } else {
                bolinha.style.pointerEvents = "auto";
                bolinha.style.opacity = "1";
            }
            if (!marcado) {
                todasMarcadas = false;
            }
        });
        if (btnReset) {
            btnReset.disabled = !todasMarcadas;
            btnReset.style.cursor = todasMarcadas ? "pointer" : "not-allowed";
        }
    }
    bolinhas.forEach(bolinha => {
        bolinha.addEventListener("click", () => {
            if (bolinha.style.pointerEvents === "none") return;
            const numero = bolinha.getAttribute("data-numero");
            sessionStorage.setItem("bnco_bolinha_" + numero, "marcado");
            atualizarEstado();
            const destino = caminhos[numero] || "/index.html";
            window.location.href = destino;
        });
    });
    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if (btnReset.disabled) return;
            if (bubbleSound) {
                bubbleSound.currentTime = 0;
                bubbleSound.play();
            }
            if (waveEffect) waveEffect.classList.add("bnco-active");
            setTimeout(() => {
                bolinhas.forEach(bolinha => {
                    sessionStorage.removeItem("bnco_bolinha_" + bolinha.getAttribute("data-numero"));
                });
                atualizarEstado();
                if (waveEffect) waveEffect.classList.remove("bnco-active");
            }, 1500);
        });
    }
    atualizarEstado();
}

/**
 * Configura o botão de menu para abrir e fechar a barra lateral.
 */
function setupMenuToggle() {
    const menuBtn = document.getElementById("bnco-menuBtn");
    const sideNav = document.getElementById("bnco-sideNav");
    if (menuBtn && sideNav) {
        menuBtn.addEventListener("click", () => {
            sideNav.classList.toggle("bnco-hidden");
        });
    }
}

/**
 * Adiciona a funcionalidade de logout ao botão com id="logout-button".
 */
function setupLogoutButton() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            sessionStorage.removeItem('authToken');
            alert('Você foi desconectado.');
            window.location.href = '/login/index.html'; // Ajuste se necessário
        });
    }
}