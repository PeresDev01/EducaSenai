// script.js final para o painel de reuniões do MENTOR (mentorSOP)

let allMeetings = [];
let currentDate = new Date();

document.addEventListener('DOMContentLoaded', () => {
    loadPageData(); // Carrega todos os dados necessários (sidebar e reuniões)
    setupEventListeners(); // Configura todos os botões e interações
});

const token = sessionStorage.getItem('authToken');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

// --- CARREGAMENTO DE DADOS ---

async function loadPageData() {
    if (!token) {
        window.location.href = '/login/index.html';
        return;
    }
    // Carrega os dados da sidebar e das reuniões em paralelo para mais performance
    await Promise.all([
        loadSidebarData(),
        loadMeetings()
    ]);
}

async function loadSidebarData() {
    try {
        const response = await fetch('http://localhost:8080/api/mentor/dashboard', { headers });
        if (!response.ok) throw new Error('Falha ao buscar dados do mentor.');
        
        const data = await response.json();
        const user = data.user;
        
        document.getElementById('sidebar-username').textContent = user.name;
        document.getElementById('sidebar-role').textContent = user.role;
        const sidebarAvatar = document.getElementById('sidebar-avatar');
        if (user.avatarUrl) {
            sidebarAvatar.src = `http://localhost:8080${user.avatarUrl}`;
        }
    } catch (error) {
        console.error("Erro ao carregar dados da sidebar:", error);
        sessionStorage.removeItem('authToken');
        window.location.href = '/login/index.html';
    }
}

async function loadMeetings() {
    try {
        const response = await fetch('http://localhost:8080/api/reunioes', { headers });
        if (!response.ok) throw new Error('Falha ao carregar reuniões.');
        allMeetings = await response.json();
        renderRequestList();
        renderCalendar();
    } catch (error) {
        console.error("Erro ao carregar reuniões:", error);
        document.getElementById('incoming-list').innerHTML = `<p>${error.message}</p>`;
    }
}

// --- RENDERIZAÇÃO DA INTERFACE (LISTA E CALENDÁRIO) ---

function renderRequestList() {
    const requestList = document.getElementById('incoming-list');
    requestList.innerHTML = '';
    const pendingMeetings = allMeetings.filter(m => m.status === 'PENDENTE');

    if (pendingMeetings.length === 0) {
        requestList.innerHTML = '<p>Nenhuma nova solicitação.</p>';
        return;
    }
    pendingMeetings.forEach(reuniao => {
        const item = document.createElement('div');
        item.className = 'req';
        item.innerHTML = `
            <div class="left">
                <div class="subject">${reuniao.assunto}</div>
                <div class="meta">${reuniao.aluno.name} • ${new Date(reuniao.data + 'T00:00:00').toLocaleDateString('pt-BR')}</div>
            </div>
            <div class="right">
                <div class="actions">
                    <button class="small-btn view-details-btn" data-reuniao-id="${reuniao.id}">Ver</button>
                </div>
            </div>
        `;
        requestList.appendChild(item);
    });
}

function renderCalendar() {
    const calendarEl = document.getElementById('m-calendar');
    const monthTitle = document.getElementById('m-month-title');
    calendarEl.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthTitle.textContent = new Date(year, month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) { calendarEl.appendChild(document.createElement('div')); }
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day';
        dayCell.innerHTML = `<div class="date-num">${day}</div><div class="events"></div>`;
        const isoDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const todaysMeetings = allMeetings.filter(m => m.data === isoDate && m.status === 'CONFIRMADA');
        const eventsContainer = dayCell.querySelector('.events');
        todaysMeetings.forEach(reuniao => {
            const eventEl = document.createElement('div');
            eventEl.className = 'event';
            eventEl.dataset.reuniaoId = reuniao.id;
            eventEl.innerHTML = `<div class="time">${reuniao.hora.substring(0, 5)}</div><div class="title">${reuniao.assunto}</div>`;
            eventsContainer.appendChild(eventEl);
        });
        calendarEl.appendChild(dayCell);
    }
}

// --- EVENTOS E INTERATIVIDADE (BOTÕES E MODAL) ---

function setupEventListeners() {
    // Navegação do Calendário
    document.getElementById('m-prev-month').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
    document.getElementById('m-next-month').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });

    // Abrir Modal
    document.getElementById('incoming-list').addEventListener('click', (e) => {
        const button = e.target.closest('.view-details-btn');
        if (button) openModalWithMeeting(button.dataset.reuniaoId);
    });
    document.getElementById('m-calendar').addEventListener('click', (e) => {
        const item = e.target.closest('.event');
        if (item) openModalWithMeeting(item.dataset.reuniaoId);
    });

    // Fechar e Ações do Modal
    document.getElementById('m-modal-close').addEventListener('click', () => document.getElementById('m-modal').classList.remove('show'));
    document.getElementById('m-approve').addEventListener('click', () => updateMeetingStatus('CONFIRMADA'));
    document.getElementById('m-reject').addEventListener('click', () => updateMeetingStatus('RECUSADA'));
    document.getElementById('m-cancel').addEventListener('click', () => updateMeetingStatus('CANCELADA'));

    // Logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('authToken');
            alert('Você foi desconectado.');
            window.location.href = '/TelaInicial/index.html'; // Verifique o caminho
        });
    }

    // Sidebar
    const toggleMenuButton = document.querySelector(".toggle-menu");
    const sidebar = document.querySelector(".sidebar");
    const expandSidebarButton = document.querySelector(".expand-sidebar");
    if(toggleMenuButton && sidebar && expandSidebarButton) {
        toggleMenuButton.addEventListener("click", () => sidebar.classList.add("collapsed"));
        expandSidebarButton.addEventListener("click", () => sidebar.classList.remove("collapsed"));
    }
}

function openModalWithMeeting(reuniaoId) {
    const modal = document.getElementById('m-modal');
    const reuniao = allMeetings.find(m => m.id === reuniaoId);
    if (!reuniao) return;
    modal.dataset.currentId = reuniao.id;
    document.getElementById('m-modal-subject').textContent = reuniao.assunto;
    document.getElementById('m-mdl-student').textContent = reuniao.aluno.name;
    document.getElementById('m-mdl-mentor').textContent = reuniao.mentor.name;
    document.getElementById('m-mdl-mode').textContent = reuniao.modalidade;
    document.getElementById('m-mdl-notes').textContent = reuniao.observacoes || 'Nenhuma.';
    document.getElementById('m-mdl-datetime').textContent = `${new Date(reuniao.data + 'T00:00:00').toLocaleDateString('pt-BR')} às ${reuniao.hora.substring(0, 5)}`;
    const statusBadge = document.getElementById('m-mdl-status-badge');
    statusBadge.textContent = reuniao.status;
    statusBadge.className = 'status-pill';
    if (reuniao.status === 'CONFIRMADA') statusBadge.classList.add('ok');
    else if (reuniao.status === 'RECUSADA' || reuniao.status === 'CANCELADA') statusBadge.classList.add('warn');
    else statusBadge.classList.add('neutral');
    document.getElementById('m-approve').style.display = (reuniao.status === 'PENDENTE') ? 'inline-flex' : 'none';
    document.getElementById('m-reject').style.display = (reuniao.status === 'PENDENTE') ? 'inline-flex' : 'none';
    document.getElementById('m-cancel').style.display = (reuniao.status === 'CONFIRMADA') ? 'inline-flex' : 'none';
    modal.classList.add('show');
}

async function updateMeetingStatus(newStatus) {
    const modal = document.getElementById('m-modal');
    const reuniaoId = modal.dataset.currentId;
    if (!reuniaoId || !confirm(`Alterar status para "${newStatus}"?`)) return;
    try {
        const response = await fetch(`http://localhost:8080/api/reunioes/${reuniaoId}/status`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ status: newStatus })
        });
        if (!response.ok) throw new Error(`Falha ao atualizar status.`);
        alert(`Reunião atualizada!`);
        modal.classList.remove('show');
        loadMeetings();
    } catch (error) {
        console.error("Erro:", error);
        showErrorToast(error.message);
    }
}