// ===================================================================
//              SUAS FUNÇÕES ORIGINAIS (NÃO FORAM ALTERADAS)
// ===================================================================

function marcar(elemento) {
    // alterna a classe
    elemento.classList.toggle("marcado");

    // Lógica para salvar o progresso, adaptada para ser mais robusta
    const linkDaAula = elemento.previousElementSibling;
    if (linkDaAula && linkDaAula.getAttribute('href')) {
        const lessonId = linkDaAula.getAttribute('href');
        if (elemento.classList.contains("marcado")) {
            sessionStorage.setItem(`progress_${lessonId}`, "true");
        } else {
            sessionStorage.removeItem(`progress_${lessonId}`);
        }
    }
}

function loadProgress() {
    document.querySelectorAll('.bolinha').forEach(bolinha => {
        const linkDaAula = bolinha.previousElementSibling;
        if (linkDaAula && linkDaAula.getAttribute('href')) {
            const lessonId = linkDaAula.getAttribute('href');
            if (sessionStorage.getItem(`progress_${lessonId}`) === "true") {
                bolinha.classList.add("marcado");
            }
        }
    });
}

// ===================================================================
//              CÓDIGO ADICIONADO PARA CARREGAR PERFIL
// ===================================================================
async function loadSidebarData() {
    const token = sessionStorage.getItem('authToken');
    // Se não estiver logado, não faz nada para não quebrar a página
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
        
        // Preenche os elementos que agora têm IDs
        document.getElementById('sidebar-username').textContent = user.name;
        document.getElementById('sidebar-role').textContent = user.role;
        const avatarImg = document.getElementById('sidebar-avatar');
        if (user.avatarUrl) {
            avatarImg.src = `http://localhost:8080${user.avatarUrl}`;
        } else {
            avatarImg.src = '/img/user-avatar.jpg'; // Caminho para uma imagem padrão
        }

    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        // Em caso de erro, pode redirecionar para o login
        // window.location.href = '/login/index.html';
    }
}


// ===================================================================
//          EVENT LISTENER PRINCIPAL (COM A NOVA FUNÇÃO)
// ===================================================================
document.addEventListener("DOMContentLoaded", () => {
    // --- CÓDIGO ADICIONADO ---
    // 1. Carrega os dados da foto e nome do perfil
    loadSidebarData();

    // 2. Carrega o progresso das bolinhas (sua função original)
    loadProgress();

    // 3. Configura o botão de menu (sua lógica original)
    const botaoMenu = document.getElementById("botaoMenu");
    const navLateral = document.getElementById("navLateral");

    if (botaoMenu && navLateral) {
        botaoMenu.addEventListener("click", () => {
            navLateral.classList.toggle("oculto");
        });
    }

});