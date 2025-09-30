document.addEventListener("DOMContentLoaded", function () {
    
    loadSidebarData();
    setupEventListeners();
    
    async function loadSidebarData() {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            window.location.href = '/login/index.html'; // ATENÇÃO: Verifique o caminho
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Sessão expirada.');
            const user = await response.json();
            
            document.getElementById('sidebar-username').textContent = user.name;
            document.getElementById('sidebar-role').textContent = user.role;
            const sidebarAvatar = document.getElementById('sidebar-avatar');
            if (user.avatarUrl) {
                sidebarAvatar.src = `http://localhost:8080${user.avatarUrl}`;
            }
        } catch (error) {
            console.error('Erro:', error);
            sessionStorage.removeItem('authToken');
            window.location.href = '/login/index.html'; // ATENÇÃO: Verifique o caminho
        }
    }

    function setupEventListeners() {
        const toggleMenuButton = document.querySelector(".toggle-menu");
        const sidebar = document.querySelector(".sidebar");
        const expandSidebarButton = document.querySelector(".expand-sidebar");

        if (toggleMenuButton && sidebar && expandSidebarButton) {
            toggleMenuButton.addEventListener("click", () => { sidebar.classList.add("collapsed"); expandSidebarButton.classList.add("show"); });
            expandSidebarButton.addEventListener("click", () => { sidebar.classList.remove("collapsed"); expandSidebarButton.classList.remove("show"); });
        }

        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('authToken');
                window.location.href = '/TelaInicial/index.html'; // ATENÇÃO: Verifique o caminho
            });
        }
        
        window.addEventListener('storage', (event) => {
            if (event.key === 'avatar_updated_signal') {
                const newAvatarUrl = event.newValue;
                if (newAvatarUrl) {
                    const sidebarAvatar = document.getElementById('sidebar-avatar');
                    if (sidebarAvatar) {
                        sidebarAvatar.src = `http://localhost:8080${newAvatarUrl}`;
                    }
                }
            }
        });

        const splash = document.getElementById("splash-screen");
        if (splash) {
            setTimeout(() => {
                splash.style.opacity = '0';
                setTimeout(() => splash.style.display = "none", 1000);
            }, 3000);
        }
    }
});