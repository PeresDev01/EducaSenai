// Executado quando a página HTML é totalmente carregada
document.addEventListener("DOMContentLoaded", () => {
    // 1. Carrega os dados do usuário (foto, nome, etc.) na sidebar
    loadSidebarData();

    // 2. Configura a lógica dos círculos da trilha
    setupTrilhaAprendizado();

    // 3. Configura a lógica do botão de menu antigo (para abrir/fechar a sidebar)
    setupMenuToggle();
});


/**
 * Busca os dados do usuário no back-end e preenche a sidebar.
 */
async function loadSidebarData() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        console.warn("Nenhum token de autenticação encontrado.");
        // Redireciona para o login se não houver token
        // window.location.href = '/login/index.html'; 
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Falha na autenticação.');
        
        const user = await response.json();
        
        // Preenche os elementos que agora têm IDs
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
    const circulos = document.querySelectorAll(".circulo");
    const botaoReiniciar = document.getElementById("botaoReiniciar");
    const efeitoOnda = document.getElementById("efeitoOnda");
    const somBolha = document.getElementById("somBolha");

    if (!circulos.length) return; // Se não houver círculos, não faz nada

    if (somBolha) {
        somBolha.volume = 0.5;
    }

    const caminhos = {
        "1": "/IOT/Aula01IOT/TabelaConteudo/index.html",
        "2": "/FRONT/Aula02FRONT/OutraPagina/index.html",
        "3": "/FRONT/Aula03FRONT/OutraPagina2/index.html",
        "4": "/FRONT/Aula04FRONT/OutraPagina3/index.html",
        "5": "/FRONT/Aula05FRONT/OutraPagina4/index.html",
        "6": "/FRONT/Aula06FRONT/OutraPagina5/index.html",
        "7": "/FRONT/Aula07FRONT/OutraPagina6/index.html"
    };

    function atualizarEstado() {
        let todasMarcadas = true;
        circulos.forEach((circulo, index) => {
            const numero = circulo.getAttribute("data-numero");
            const marcado = sessionStorage.getItem("circulo_" + numero) === "marcado";

            if (marcado) {
                circulo.classList.add("marcado");
                circulo.textContent = "";
            } else {
                circulo.classList.remove("marcado");
                circulo.textContent = numero;
            }

            if (index > 0) {
                const anteriorMarcada = sessionStorage.getItem("circulo_" + circulos[index - 1].getAttribute("data-numero")) === "marcado";
                circulo.style.pointerEvents = anteriorMarcada ? "auto" : "none";
                circulo.style.opacity = anteriorMarcada ? "1" : "0.5";
            } else {
                circulo.style.pointerEvents = "auto";
                circulo.style.opacity = "1";
            }
            if (!marcado) {
                todasMarcadas = false;
            }
        });
        if (botaoReiniciar) {
            botaoReiniciar.disabled = !todasMarcadas;
            botaoReiniciar.style.cursor = todasMarcadas ? "pointer" : "not-allowed";
        }
    }

    circulos.forEach(circulo => {
        circulo.addEventListener("click", () => {
            if (circulo.style.pointerEvents === "none") return;
            const numero = circulo.getAttribute("data-numero");
            sessionStorage.setItem("circulo_" + numero, "marcado");
            atualizarEstado();
            const destino = caminhos[numero] || "/index.html";
            window.location.href = destino;
        });
    });

    if (botaoReiniciar) {
        botaoReiniciar.addEventListener("click", () => {
            if (botaoReiniciar.disabled) return;
            if (somBolha) {
                somBolha.currentTime = 0;
                somBolha.play();
            }
            if (efeitoOnda) efeitoOnda.classList.add("active");
            setTimeout(() => {
                circulos.forEach(circulo => {
                    sessionStorage.removeItem("circulo_" + circulo.getAttribute("data-numero"));
                });
                atualizarEstado();
                if (efeitoOnda) efeitoOnda.classList.remove("active");
            }, 1500);
        });
    }

    atualizarEstado(); // Chama a função para carregar o estado inicial
}

/**
 * Configura o botão de menu para abrir e fechar a barra lateral.
 */
function setupMenuToggle() {
    const botaoMenu = document.getElementById("botaoMenu");
    const navLateral = document.getElementById("navLateral");

    if (botaoMenu && navLateral) {
        botaoMenu.addEventListener("click", () => {
            navLateral.classList.toggle("oculto");
        });
    }
}