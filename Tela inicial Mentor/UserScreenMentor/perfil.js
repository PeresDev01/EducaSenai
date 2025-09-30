document.addEventListener('DOMContentLoaded', () => {
    // Carrega os dados do perfil ao iniciar
    loadUserProfile();

    // Configura todos os eventos da página
    setupEventListeners();
});

/**
 * Função principal que agrupa a configuração de todos os eventos.
 */
function setupEventListeners() {
    setupSidebarToggle();
    setupAvatarUpload();
    setupFormSubmit();
    setupLogoutButton();
    setupPasswordToggle();
}

// ===================================================================
//              FUNÇÃO DE ABRIR/FECHAR O MENU (VERSÃO CORRIGIDA E SIMPLIFICADA)
// ===================================================================
/**
 * Configura os botões para abrir e fechar a sidebar.
 */
function setupSidebarToggle() {
    const sidebar = document.querySelector(".sidebar");
    const toggleMenuButton = document.querySelector(".toggle-menu"); // Botão de fechar
    const expandSidebarButton = document.querySelector(".expand-sidebar"); // Botão de abrir
    const body = document.body;

    // Garante que todos os elementos necessários existem
    if (sidebar && toggleMenuButton && expandSidebarButton && body) {
        
        // Evento para FECHAR o menu
        toggleMenuButton.addEventListener("click", () => {
            sidebar.classList.add("collapsed");
            body.classList.add("menu-collapsed");
        });

        // Evento para ABRIR o menu
        expandSidebarButton.addEventListener("click", () => {
            sidebar.classList.remove("collapsed");
            body.classList.remove("menu-collapsed");
        });
    }
}

// ===================================================================
//              RESTANTE DO CÓDIGO (ORIGINAL)
// ===================================================================

async function loadUserProfile() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login/index.html';
        return;
    }
    try {
        const response = await fetch('http://localhost:8080/api/users/me', { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error('Falha ao carregar perfil.');
        const userData = await response.json();
        populateProfileData(userData);
    } catch (error) {
        console.error('Erro:', error);
        sessionStorage.removeItem('authToken');
        window.location.href = '/login/index.html';
    }
}

function populateProfileData(user) {
    document.getElementById('nome-view').textContent = user.name;
    document.getElementById('nome').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('role-view').textContent = user.role;
    document.getElementById('sidebar-username').textContent = user.name;
    document.getElementById('sidebar-role').textContent = user.role;
    
    const avatarImg = document.getElementById('avatar-img');
    const sidebarAvatar = document.getElementById('sidebar-avatar');
    if (user.avatarUrl) {
        const fullUrl = `http://localhost:8080${user.avatarUrl}`;
        if(avatarImg) avatarImg.src = fullUrl;
        if(sidebarAvatar) sidebarAvatar.src = fullUrl;
    }
}

function setupAvatarUpload() {
    const fileInput = document.getElementById("avatar-input");
    const avatarImg = document.getElementById("avatar-img");
    fileInput?.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        avatarImg.src = URL.createObjectURL(file);
        const token = sessionStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('http://localhost:8080/api/users/me/avatar', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
            if (!response.ok) throw new Error(await response.text());
            const data = await response.json();
            const sidebarAvatar = document.getElementById('sidebar-avatar');
            if (sidebarAvatar) sidebarAvatar.src = `http://localhost:8080${data.avatarUrl}`;
            alert("Foto de perfil atualizada com sucesso!");
        } catch (error) {
            console.error('Erro no upload da imagem:', error);
            alert(error.message);
        }
    });
}

function setupFormSubmit() {
    const form = document.getElementById("perfil-form");
    const nomeView = document.getElementById("nome-view");
    form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('authToken');
        const novoNome = document.getElementById("nome").value.trim();
        const novoEmail = document.getElementById("email").value.trim();
        const novaSenha = document.getElementById("senha").value.trim();
        const updateData = { name: novoNome, email: novoEmail, password: novaSenha ? novaSenha : null };
        try {
            const response = await fetch('http://localhost:8080/api/users/me', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(updateData) });
            if (!response.ok) throw new Error(await response.text());
            if (novoNome) {
                nomeView.textContent = novoNome;
                const sidebarUsername = document.getElementById('sidebar-username');
                if (sidebarUsername) sidebarUsername.textContent = novoNome;
            }
            document.getElementById("senha").value = '';
            alert("Alterações salvas com sucesso!");
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            alert(error.message);
        }
    });
}

function setupLogoutButton() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('authToken');
            window.location.href = '/TelaInicial/index.html';
        });
    }
}

function setupPasswordToggle() {
    const togglePassButton = document.getElementById("toggle-pass");
    const senhaInput = document.getElementById("senha");
    if (togglePassButton && senhaInput) {
        togglePassButton.addEventListener("click", () => {
            const isPasswordVisible = senhaInput.type === "text";
            senhaInput.type = isPasswordVisible ? "password" : "text";
            togglePassButton.textContent = isPasswordVisible ? "Mostrar" : "Ocultar";
        });
    }
}