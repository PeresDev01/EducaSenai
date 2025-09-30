// app.js (Tela de Alunos do Mentor - Conectado à API)

const token = sessionStorage.getItem('authToken');
const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

// A lista de alunos agora virá da API
let currentStudents = []; 

const studentListEl = document.getElementById("studentList");
const expandedPanel = document.getElementById("expandedPanel");
const expandedContent = document.getElementById("expandedContent");
const closeBtn = document.getElementById("closeExpanded");

document.addEventListener("DOMContentLoaded", () => {
    if (!token) {
        window.location.href = '/login/index.html'; // Proteção de rota
        return;
    }
    loadStudentsFromAPI();
    setupStaticEventListeners();
});

// --- FUNÇÃO DE API ---

async function loadStudentsFromAPI() {
    studentListEl.innerHTML = `<p>Carregando alunos...</p>`;
    try {
        // Chama o endpoint que busca apenas os alunos do mentor logado
        const response = await fetch('http://localhost:8080/api/mentor/alunos', { headers });
        if (!response.ok) throw new Error('Falha ao carregar a lista de alunos.');
        
        currentStudents = await response.json();
        renderStudentList();
    } catch (error) {
        console.error("Erro ao carregar alunos:", error);
        studentListEl.innerHTML = `<li class="student-item error">${error.message}</li>`;
    }
}

// --- LÓGICA DE RENDERIZAÇÃO E UI ---

function renderStudentList() {
    studentListEl.innerHTML = "";
    if (currentStudents.length === 0) {
        studentListEl.innerHTML = `<li class="student-item">Nenhum aluno associado. Peça para um aluno agendar uma reunião para criar o vínculo.</li>`;
        return;
    }

    // A lista já vem ordenada por nota do back-end
    const highestScore = currentStudents.length > 0 ? currentStudents[0].score : 0;

    currentStudents.forEach(student => {
        const li = document.createElement("li");
        li.className = "student-item";
        li.dataset.id = student.id;

        if (student.score === highestScore && student.score > 0) {
            li.classList.add("top-student");
        }

        li.innerHTML = `
            <div class="student-left">
                <div class="student-score">${String(student.score).replace(".", ",")}</div>
                <div class="student-name" tabindex="0">${student.name}</div>
            </div>
            <div class="student-actions"></div>
        `;
        
        li.addEventListener("dblclick", () => openExpandedPanel(student.id));
        li.addEventListener("keydown", (e) => { 
            if (e.key === "Enter") openExpandedPanel(student.id); 
        });

        studentListEl.appendChild(li);
    });
}

function openExpandedPanel(id) {
    const student = currentStudents.find(st => st.id === id);
    if (!student) return;

    expandedContent.innerHTML = "";

    const header = document.createElement("div");
    header.className = "panel-header";
    header.innerHTML = `
        <div class="student-name-large">${student.name}</div>
        <div class="student-score-large">${String(student.score).replace(".", ",")}</div>
    `;
    expandedContent.appendChild(header);

    // Como os dados de progresso e concluídas não vêm da API,
    // exibiremos placeholders ou dados estáticos por enquanto.
    const row = document.createElement("div");
    row.className = "progress-row";
    row.innerHTML = `
        <div class="progress-slot">
            <div class="img-placeholder"><img src="progresso.svg" alt="Progresso"></div>
            <div class="slot-label">Progresso</div>
            <div class="slot-sub">N/D</div>
        </div>
        <div class="progress-slot">
            <div class="img-placeholder"><img src="nota.svg" alt="Nota"></div>
            <div class="slot-label">Nota Média</div>
            <div class="slot-sub">${String(student.score).replace(".", ",")}</div>
        </div>
        <div class="progress-slot">
            <div class="img-placeholder"><img src="concluidos.svg" alt="Concluídas"></div>
            <div class="slot-label">Concluídas</div>
            <div class="slot-sub">N/D</div>
        </div>
    `;
    expandedContent.appendChild(row);

    expandedPanel.classList.remove("hide");
    expandedPanel.style.display = "flex";
    expandedPanel.setAttribute("aria-hidden", "false");
    document.getElementById("listContainer").scrollTop = 0;
}

function closeExpandedPanel() {
    expandedPanel.classList.add("hide");
    expandedPanel.setAttribute("aria-hidden", "true");
    const OUT_DURATION = 320;
    setTimeout(() => {
        expandedPanel.style.display = "none";
        expandedPanel.classList.remove("hide");
        expandedContent.innerHTML = "";
    }, OUT_DURATION);
}

function setupStaticEventListeners() {
    closeBtn.addEventListener("click", closeExpandedPanel);

    // Lógica da sidebar
    const toggleMenuButton = document.querySelector(".toggle-menu");
    const sidebar = document.querySelector(".sidebar");
    const expandSidebarButton = document.querySelector(".expand-sidebar");
    const body = document.body;
    if (toggleMenuButton && sidebar && expandSidebarButton) {
        toggleMenuButton.addEventListener("click", () => {
            sidebar.classList.add("collapsed");
            expandSidebarButton.classList.add("show");
            body.classList.add("menu-collapsed");
        });
        expandSidebarButton.addEventListener("click", () => {
            sidebar.classList.remove("collapsed");
            expandSidebarButton.classList.remove("show");
            body.classList.remove("menu-collapsed");
        });
    }
}