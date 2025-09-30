// Executado quando a página HTML é totalmente carregada
document.addEventListener("DOMContentLoaded", () => {
    // 1. Carrega os dados do usuário (foto, nome, etc.) na sidebar
    loadSidebarData();

    // 2. Configura a lógica do botão de menu (sua função original)
    setupMenuToggle();
    
    // 3. Configura o botão de logout
    setupLogoutButton();
});

/**
 * Função para marcar/desmarcar as "bolinhas" de progresso.
 * Esta é a sua função original.
 */
function marcar(elemento) {
    elemento.classList.toggle("marcado");
}

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
 * Configura o botão de menu para abrir e fechar a barra lateral.
 * Esta é a sua lógica original.
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
            window.location.href = '/login/index.html'; // Ajuste o link se necessário
        });
    }
}