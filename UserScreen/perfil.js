// Função principal que é executada assim que a página HTML é carregada
document.addEventListener('DOMContentLoaded', () => {
    // 1. Carrega os dados do formulário de perfil (nome, email, avatar)
    loadUserProfile();

    // 2. Carrega os dados de desempenho (notas, progresso)
    loadPerformanceData();

    // 3. Configura as interações da página
    setupSidebar();
    setupAvatarUpload();
    setupPasswordToggle();
    setupFormSubmit();
});


// ===================================================================
//              FUNÇÃO ADICIONADA PARA CARREGAR DESEMPENHO
// ===================================================================
async function loadPerformanceData() {
    const token = sessionStorage.getItem('authToken');
    if (!token) return; // Se não houver token, não faz nada

    try {
        const response = await fetch('http://localhost:8080/api/aluno/desempenho', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Falha ao buscar dados de desempenho.");
        
        const data = await response.json();

        // Atualiza a Nota
        const gradeEl = document.getElementById('grade-value');
        if (gradeEl) gradeEl.innerHTML = `<strong>${data.mediaGeral.toFixed(1)}</strong><span class="outof">/10</span>`;

        // Atualiza Atividades Concluídas
        const activitiesEl = document.getElementById('activities-completed-value');
        if (activitiesEl) activitiesEl.innerHTML = `<strong>${data.atividadesConcluidas}</strong><span class="outof">/${data.totalAtividades}</span>`;
        
        // Atualiza o Círculo de Progresso
        const progressRing = document.getElementById('progress-ring-fg');
        const progressText = document.getElementById('progress-text');
        if (progressRing && progressText) {
            const percentage = data.totalAtividades > 0 ? (data.atividadesConcluidas / data.totalAtividades) * 100 : 0;
            const radius = progressRing.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            
            const offset = circumference - (percentage / 100) * circumference;
            
            progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
            progressRing.style.strokeDashoffset = offset;

            progressText.textContent = `${Math.round(percentage)}%`;
        }
    } catch (error) {
        console.error("Erro ao carregar dados de desempenho:", error.message);
    }
}


// ===================================================================
// 
//          SUAS FUNÇÕES ORIGINAIS (AGORA COMPLETAS)
// 
// ===================================================================

/**
 * Busca o token, faz uma requisição para a API e preenche o perfil com os dados do usuário.
 */
async function loadUserProfile() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        alert('Você não está autenticado. Por favor, faça o login.');
        window.location.href = '/TelaInicial/index.html';
        return;
    }
    try {
        const response = await fetch('http://localhost:8080/api/users/me', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Falha ao carregar os dados do perfil.');
        const userData = await response.json();
        populateProfileForm(userData);
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        sessionStorage.removeItem('authToken');
        window.location.href = '/login/index.html';
    }
}

/**
 * Preenche os campos do formulário no HTML com os dados do usuário.
 */
function populateProfileForm(user) {
    document.getElementById('nome-view').textContent = user.name;
    document.getElementById('role-view').textContent = user.role;
    document.getElementById('nome').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('senha').placeholder = 'Digite uma nova senha para alterar';
    document.getElementById('senha').value = '';
    const avatarImg = document.getElementById('avatar-img');
    if (user.avatarUrl) {
        avatarImg.src = `http://localhost:8080${user.avatarUrl}`;
    }
}

/**
 * Configura o envio do formulário para salvar as alterações do perfil.
 */
function setupFormSubmit() {
    const form = document.getElementById("perfil-form");
    const nomeView = document.getElementById("nome-view");
    form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('authToken');
        if (!token) { alert('Sessão expirada. Faça o login novamente.'); return; }

        const updateData = {
            name: document.getElementById("nome").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("senha").value.trim() || null
        };

        try {
            const response = await fetch('http://localhost:8080/api/users/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) throw new Error(await response.text());
            
            if (updateData.name) nomeView.textContent = updateData.name;
            document.getElementById("senha").value = '';
            
            Swal.fire({ icon: 'success', title: 'Sucesso!', text: 'Perfil atualizado.' });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Oops...', text: `Erro ao salvar: ${error.message}` });
        }
    });
}

/**
 * Configura a pré-visualização e o upload da imagem de avatar.
 */
function setupAvatarUpload() {
    const fileInput = document.getElementById("avatar-input");
    const avatarImg = document.getElementById("avatar-img");

    fileInput?.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        avatarImg.src = URL.createObjectURL(file);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8080/api/users/me/avatar', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${sessionStorage.getItem('authToken')}` },
                body: formData
            });
            if (!response.ok) throw new Error(await response.text());
            Swal.fire({ icon: 'success', title: 'Sucesso!', text: 'Foto de perfil atualizada.' });
        } catch (error) {
             Swal.fire({ icon: 'error', title: 'Oops...', text: `Erro no upload: ${error.message}` });
        }
    });
}

/**
 * Configura os botões de abrir e fechar a sidebar.
 */
function setupSidebar() {
    const toggleMenuButton = document.querySelector(".toggle-menu");
    const sidebar = document.querySelector(".sidebar");
    const expandSidebarButton = document.querySelector(".expand-sidebar");
    const body = document.body;

    toggleMenuButton?.addEventListener("click", () => {
        sidebar.classList.add("collapsed");
        expandSidebarButton.classList.add("show");
        body.classList.add("menu-collapsed");
    });

    expandSidebarButton?.addEventListener("click", () => {
        sidebar.classList.remove("collapsed");
        expandSidebarButton.classList.remove("show");
        body.classList.remove("menu-collapsed");
    });
}

/**
 * Configura o botão de mostrar/ocultar senha.
 */
function setupPasswordToggle() {
    const togglePass = document.getElementById("toggle-pass");
    const senhaInput = document.getElementById("senha");
    togglePass?.addEventListener("click", () => {
        const isText = senhaInput.type === "text";
        senhaInput.type = isText ? "password" : "text";
        togglePass.textContent = isText ? "Mostrar" : "Ocultar";
    });
}