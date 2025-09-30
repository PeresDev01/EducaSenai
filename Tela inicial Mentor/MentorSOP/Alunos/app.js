// app.js (Tela de Alunos do Mentor SOP - Conectado à API)

const token = sessionStorage.getItem('authToken');
const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

let currentStudents = []; 

const studentListEl = document.getElementById("studentList");
const expandedPanel = document.getElementById("expandedPanel");
const expandedContent = document.getElementById("expandedContent");
const closeBtn = document.getElementById("closeExpanded");

// --- INICIALIZAÇÃO ---
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
    studentListEl.innerHTML = `<li class="student-item info">Carregando alunos...</li>`;
    try {
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
        studentListEl.innerHTML = `<li class="student-item info">Nenhum aluno associado.</li>`;
        return;
    }

    // A lista já vem ordenada por nota do back-end
    const highestScore = currentStudents.length > 0 ? currentStudents[0].score : 0;

    currentStudents.forEach(student => {
        const li = document.createElement("li");
        li.className = "student-item";
        li.dataset.id = student.id;
        li.setAttribute('role', 'button');
        li.setAttribute('tabindex', '0');

        if (student.score === highestScore && student.score > 0) {
            li.classList.add("top-student");
        }

        li.innerHTML = `
            <div class="student-left">
                <div class="student-score">${String(student.score || 0).replace(".", ",")}</div>
                <div class="student-name">${student.name}</div>
            </div>
            <div class="student-actions"></div>
        `;
        
        li.addEventListener("click", () => openExpandedPanel(student.id));
        li.addEventListener("keydown", (e) => { 
            if (e.key === "Enter" || e.key === " ") openExpandedPanel(student.id); 
        });

        studentListEl.appendChild(li);
    });
}

function openExpandedPanel(id) {
    const student = currentStudents.find(st => st.id === id);
    if (!student) return;

    expandedContent.innerHTML = `
        <div class="panel-header">
            <div class="student-name-large">${student.name}</div>
            <div class="student-score-large">${String(student.score || 0).replace(".", ",")}</div>
        </div>
        <div class="progress-row">
            <div class="progress-slot">
                <div class="img-placeholder"><img src="progresso.svg" alt="Progresso"></div>
                <div class="slot-label">Progresso</div>
                <div class="slot-sub">N/D</div>
            </div>
            <div class="progress-slot">
                <div class="img-placeholder"><img src="nota.svg" alt="Nota"></div>
                <div class="slot-label">Nota Média</div>
                <div class="slot-sub">${String(student.score || 0).replace(".", ",")}</div>
            </div>
            <div class="progress-slot">
                <div class="img-placeholder"><img src="concluidos.svg" alt="Concluídas"></div>
                <div class="slot-label">Concluídas</div>
                <div class="slot-sub">N/D</div>
            </div>
        </div>
    `;

    expandedPanel.style.display = "flex";
    expandedPanel.setAttribute("aria-hidden", "false");
    document.getElementById("listContainer").scrollTop = 0;
}

function closeExpandedPanel() {
    expandedPanel.setAttribute("aria-hidden", "true");
    expandedPanel.style.display = "none";
    expandedContent.innerHTML = "";
}

function setupStaticEventListeners() {
    closeBtn.addEventListener("click", closeExpandedPanel);
}