const token = sessionStorage.getItem('authToken');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

let currentStudents = []; 
let selectedStudent = null; 

const studentListEl = document.getElementById("studentList");
const expandedPanel = document.getElementById("expandedPanel");
const expandedContent = document.getElementById("expandedContent");
const closeBtn = document.getElementById("closeExpanded");

// --- INICIALIZAÇÃO ---
document.addEventListener("DOMContentLoaded", () => {
    if (!token) {
        window.location.href = '/login/index.html';
        return;
    }
    loadStudentsFromAPI();
    setupStaticEventListeners();
});

// --- FUNÇÕES DE API ---

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

async function sendFeedbackToAPI(studentId, feedbackText) {
    try {
        const response = await fetch('http://localhost:8080/api/mentor/feedbacks', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                alunoId: studentId,
                texto: feedbackText
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao enviar feedback.');
        }
        
        showSuccessToast("Feedback enviado com sucesso!");
        closeExpandedPanel();
    } catch (error) {
        showErrorToast(error.message);
        console.error("Erro ao enviar feedback:", error);
    }
}

// --- LÓGICA DE RENDERIZAÇÃO E UI ---

function renderStudentList() {
    studentListEl.innerHTML = "";
    if (currentStudents.length === 0) {
        studentListEl.innerHTML = `<li class="student-item info">Nenhum aluno encontrado.</li>`;
        return;
    }
    const sortedStudents = [...currentStudents].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedStudents.forEach(student => {
        const li = document.createElement("li");
        li.className = "student-item";
        li.dataset.id = student.id;
        li.setAttribute('role', 'button');
        li.setAttribute('tabindex', '0');
        
        li.innerHTML = `
            <div class="student-left">
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

function openExpandedPanel(studentId) {
    selectedStudent = currentStudents.find(s => s.id === studentId);
    if (!selectedStudent) return;

    expandedContent.innerHTML = `
        <div class="panel-header">
            <div class="student-name-large">${selectedStudent.name}</div>
        </div>
        <div class="feedback-form">
            <textarea id="feedbackText" placeholder="Escreva um feedback construtivo para ${selectedStudent.name}..."></textarea>
            <div class="feedback-actions">
                <button class="clear-btn" id="feedbackClear">Limpar</button>
                <button class="send-btn" id="feedbackSend">Enviar Feedback</button>
            </div>
        </div>
    `;
    
    expandedPanel.style.display = "flex";
    expandedPanel.setAttribute("aria-hidden", "false");
    document.getElementById("feedbackText").focus();

    document.getElementById("feedbackClear").addEventListener("click", () => {
        document.getElementById("feedbackText").value = "";
    });

    document.getElementById("feedbackSend").addEventListener("click", () => {
        const text = document.getElementById("feedbackText").value.trim();
        if (!text) {
            showErrorToast("O campo de feedback não pode estar vazio.");
            return;
        }
        sendFeedbackToAPI(selectedStudent.id, text);
    });
}

function closeExpandedPanel() {
    expandedPanel.setAttribute("aria-hidden", "true");
    expandedPanel.style.display = "none";
    expandedContent.innerHTML = "";
    selectedStudent = null;
}

function setupStaticEventListeners() {
    closeBtn.addEventListener("click", closeExpandedPanel);
}