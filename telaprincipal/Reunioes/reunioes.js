// reunioes.js (Visão do Aluno - CORRIGIDO)

let allMeetings = [];
let currentDate = new Date();

document.addEventListener('DOMContentLoaded', () => {
    loadInitialData();
    setupEventListeners();
});

const token = sessionStorage.getItem('authToken');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

async function loadInitialData() {
    await loadMentors();
    await loadMeetings();
}

async function loadMentors() {
    const mentorSelect = document.getElementById('mentor-select');
    try {
        const response = await fetch('http://localhost:8080/api/mentores', { headers });
        if (!response.ok) throw new Error('Falha ao buscar mentores.');
        
        const mentores = await response.json();
        mentorSelect.innerHTML = '<option value="">Escolher mentor...</option>';
        mentores.forEach(mentor => {
            const option = document.createElement('option');
            option.value = mentor.id;
            option.textContent = mentor.name;
            mentorSelect.appendChild(option);
        });
    } catch (error) {
        showErrorNotification("Erro", "Não foi possível carregar os mentores.");
    }
}

async function loadMeetings() {
    try {
        const response = await fetch('http://localhost:8080/api/reunioes', { headers });
        if (!response.ok) throw new Error('Falha ao buscar agendamentos.');

        allMeetings = await response.json();
        renderRequestsList();
        renderCalendar();
    } catch (error) {
        showErrorNotification("Erro", "Não foi possível carregar suas solicitações.");
    }
}

function renderRequestsList() {
    const requestsList = document.getElementById('requests-list');
    requestsList.innerHTML = '';

    if (allMeetings.length === 0) {
        requestsList.innerHTML = `<div class="req"><div class="left"><div class="subject">Nenhuma solicitação encontrada.</div></div></div>`;
        return;
    }

    const sortedMeetings = allMeetings.sort((a, b) => new Date(b.data) - new Date(a.data));
    sortedMeetings.forEach(reuniao => {
        const item = document.createElement('div');
        item.className = 'req';
        item.dataset.id = reuniao.id;
        item.innerHTML = `
            <div class="left">
                <div class="subject">${reuniao.assunto}</div>
                <div class="meta">${reuniao.mentor.name} • ${new Date(reuniao.data + 'T00:00:00').toLocaleDateString('pt-BR')} às ${reuniao.hora.substring(0,5)}</div>
            </div>
            <div class="right">
                <div class="badge ${reuniao.status}">${reuniao.status}</div>
            </div>
        `;
        requestsList.appendChild(item);
    });
}

function renderCalendar() {
    const calendarEl = document.getElementById('calendar');
    const monthTitle = document.getElementById('month-title');
    calendarEl.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    monthTitle.textContent = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarEl.insertAdjacentHTML('beforeend', `<div class="day empty"></div>`);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isoDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const todaysMeetings = allMeetings.filter(m => m.data === isoDate && m.status === 'CONFIRMADA');
        const eventsHTML = todaysMeetings.map(reuniao => `
            <div class="event" data-id="${reuniao.id}" title="${reuniao.assunto} - ${reuniao.mentor.name}">
                <span class="time">${reuniao.hora.substring(0, 5)}</span>
            </div>
        `).join('');
        const dayCellHTML = `
            <div class="day" data-date="${isoDate}">
                <div class="date-num">${day}</div>
                <div class="events">${eventsHTML}</div>
            </div>
        `;
        calendarEl.insertAdjacentHTML('beforeend', dayCellHTML);
    }
}

function setupSidebarToggle() {
    const sidebar = document.querySelector(".sidebar");
    const toggleMenuButton = document.querySelector(".toggle-menu");
    const expandSidebarButton = document.querySelector(".expand-sidebar");
    const body = document.body;

    if (toggleMenuButton && sidebar && expandSidebarButton) {
        toggleMenuButton.addEventListener("click", function () {
            sidebar.classList.add("collapsed");
            body.classList.add("menu-collapsed");
        });
        expandSidebarButton.addEventListener("click", function () {
            sidebar.classList.remove("collapsed");
            body.classList.remove("menu-collapsed");
        });
    }
}

function setupModeToggle() {
    const toggleGroup = document.querySelector(".toggle-group");
    if (!toggleGroup) return;

    const toggles = toggleGroup.querySelectorAll('.toggle');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
        });
    });
}

function openMeetingModal(reuniaoId) {
    const reuniao = allMeetings.find(r => r.id === reuniaoId);
    if (!reuniao) return;

    document.getElementById('modal-subject').textContent = reuniao.assunto;
    document.getElementById('modal-mentor').textContent = reuniao.mentor.name;
    document.getElementById('modal-date').textContent = `${new Date(reuniao.data + 'T00:00:00').toLocaleDateString('pt-BR')} às ${reuniao.hora.substring(0, 5)}`;
    document.getElementById('modal-modality').textContent = reuniao.modalidade;
    document.getElementById('modal-notes').textContent = reuniao.observacoes || 'Nenhuma observação adicionada.';
    
    const statusEl = document.getElementById('modal-status');
    statusEl.textContent = reuniao.status;
    statusEl.className = `status-pill ${reuniao.status}`;
    
    document.getElementById('meeting-modal').classList.add('show');
}

function setupModalEventListeners() {
    const modal = document.getElementById('meeting-modal');
    const closeBtn = document.getElementById('modal-close');

    if (modal && closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
}

/**
 * Configura TODOS os eventos da página em um ÚNICO LUGAR.
 */
function setupEventListeners() {
    // Lógica da Sidebar
    setupSidebarToggle();
    
    // Lógica do seletor de modalidade (Online/Presencial)
    setupModeToggle();

    // Lógica para fechar o modal de detalhes da reunião
    setupModalEventListeners();

    // Lógica para ABRIR o modal ao clicar em uma reunião (na lista ou calendário)
    document.getElementById('requests-list').addEventListener('click', (event) => {
        const meetingElement = event.target.closest('.req');
        if (meetingElement && meetingElement.dataset.id) {
            openMeetingModal(meetingElement.dataset.id);
        }
    });

    document.getElementById('calendar').addEventListener('click', (event) => {
        const eventElement = event.target.closest('.event');
        if (eventElement && eventElement.dataset.id) {
            openMeetingModal(eventElement.dataset.id);
        }
    });

    // Lógica de navegação do calendário
    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Lógica de envio do formulário de solicitação
    const form = document.getElementById('request-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const requestData = {
            mentorId: document.getElementById('mentor-select').value,
            data: document.getElementById('date-input').value,
            hora: document.getElementById('time-input').value,
            modalidade: document.querySelector('input[name="modalidade"]:checked').value,
            assunto: document.getElementById('subject-input').value,
            observacoes: document.getElementById('notes-input').value,
        };

        if (!requestData.mentorId || !requestData.data || !requestData.hora || !requestData.assunto) {
            showErrorNotification("Erro", "Preencha todos os campos obrigatórios.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/reunioes', {
                method: 'POST',
                headers,
                body: JSON.stringify(requestData)
            });
            if (!response.ok) throw new Error("Falha ao solicitar reunião.");
            showSuccessNotification("Sucesso!", "Sua solicitação de reunião foi enviada.");
            form.reset();
            
            const onlineToggle = document.querySelector('.toggle[data-value="Online"]');
            const presencialToggle = document.querySelector('.toggle[data-value="Presencial"]');
            if (onlineToggle) onlineToggle.classList.add('active');
            if (presencialToggle) presencialToggle.classList.remove('active');
            
            loadMeetings();
        } catch (error) {
            showErrorNotification("Erro", error.message);
        }
    });

    // Lógica do botão de Logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('authToken');
            alert('Você foi desconectado.');
            setTimeout(() => {
                window.location.href = '/TelaInicial/index.html'; 
            }, 1500);
        });
    }
}