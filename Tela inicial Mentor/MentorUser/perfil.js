// ===== Menu lateral =====
const toggleMenuButton = document.querySelector(".toggle-menu");
const sidebar = document.querySelector(".sidebar");
const expandSidebarButton = document.querySelector(".expand-sidebar");
const body = document.body;

// Contrair menu
toggleMenuButton?.addEventListener("click", function () {
  sidebar.classList.add("collapsed");
  expandSidebarButton.classList.add("show");
  body.classList.add("menu-collapsed");
});

// Expandir menu
expandSidebarButton?.addEventListener("click", function () {
  sidebar.classList.remove("collapsed");
  expandSidebarButton.classList.remove("show");
  body.classList.remove("menu-collapsed");
});

// ===== Avatar preview =====
const fileInput  = document.getElementById("avatar-input");
const avatarImg  = document.getElementById("avatar-img");
fileInput?.addEventListener("change", e => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => avatarImg.src = String(evt.target.result);
  reader.readAsDataURL(file);
});

// ===== Mostrar/ocultar senha =====
const togglePass = document.getElementById("toggle-pass");
const senhaInput = document.getElementById("senha");
togglePass?.addEventListener("click", () => {
  const showing = senhaInput.type === "text";
  senhaInput.type = showing ? "password" : "text";
  togglePass.textContent = showing ? "Mostrar" : "Ocultar";
});

// ===== Form submit (demo) =====
const form = document.getElementById("perfil-form");
const nomeView = document.getElementById("nome-view");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  // Atualiza o título com o novo nome
  const novoNome = document.getElementById("nome").value.trim();
  if (novoNome) nomeView.textContent = novoNome;
  showSuccessToast("Alterações salvas com sucesso!");
});

// ===== Anel de progresso =====
// Circunferência do círculo (r=52) → 2πr ≈ 327
const CIRC = 327;
const ring = document.getElementById("ring-fg");
const percentTxt = document.getElementById("percent-text");

// Ajuste os valores aqui conforme sua API/dados:
const percent = 75;      // 0–100
const nota    = 8.5;     // 0–10
const feitos  = 12;      // atividades feitas
const total   = 16;

if (ring){
  const offset = CIRC * (1 - percent/100);
  ring.style.strokeDasharray = String(CIRC);
  ring.style.strokeDashoffset = String(offset);
}
if (percentTxt) percentTxt.textContent = `${percent}%`;

// Atualiza dados básicos
document.getElementById("nota-value").textContent = String(nota);
document.getElementById("ativ-ok").textContent   = String(feitos);
  
