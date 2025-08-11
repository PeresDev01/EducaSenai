document.addEventListener("DOMContentLoaded", function() {
    const subjects = document.querySelectorAll(".subject");
    const semesterSelect = document.querySelector(".semester-select");
    const btnContinuar = document.getElementById("btn-continuar");
  
    // Dados das matérias por semestre (ajuste os caminhos das imagens)
    const materiasPorSemestre = {
      "1": [
        { nome: "IOT", img: "./img/iot.png" },
        { nome: "Sistema Operacionais", img: "./img/sistemas.png" },
        { nome: "Levantamento de Requisitos", img: "./img/levantamento.png" }
      ],
      "2": [
        { nome: "BackEnd", img: "img/BackEnd.png" },
        { nome: "Banco de Dados", img: "img/BancoDeDados.png" },
        { nome: "Front End", img: "img/FrontEnd.png" }
      ]
    };
  
    // Armazena seleção por semestre (índices)
    const selecaoPorSemestre = {
      "1": new Set(),
      "2": new Set()
    };
  
    // Atualiza matérias (imagem, texto e seleção)
    function atualizarMaterias(semestre) {
      const materias = materiasPorSemestre[semestre] || [];
      subjects.forEach((subject, i) => {
        const img = subject.querySelector("img");
        const p = subject.querySelector("p");
        if (materias[i]) {
          img.src = materias[i].img;
          img.alt = materias[i].nome;
          p.textContent = materias[i].nome;
        } else {
          img.src = "";
          p.textContent = "";
        }
  
        if (selecaoPorSemestre[semestre].has(i)) {
          subject.classList.add("selecionada");
        } else {
          subject.classList.remove("selecionada");
        }
      });
    }
  
    // Função para verificar se há pelo menos uma matéria selecionada em qualquer semestre
    function temSelecao() {
      return Object.values(selecaoPorSemestre).some(set => set.size > 0);
    }
  
    // Atualiza estado do botão continuar (habilita/desabilita)
    function atualizarBotaoContinuar() {
      if (temSelecao()) {
        btnContinuar.classList.remove("disabled");
        btnContinuar.setAttribute("tabindex", "0");
        btnContinuar.setAttribute("aria-disabled", "false");
      } else {
        btnContinuar.classList.add("disabled");
        btnContinuar.setAttribute("tabindex", "-1");
        btnContinuar.setAttribute("aria-disabled", "true");
      }
    }
  
    // Clique para selecionar/deselecionar matéria
    subjects.forEach((subject, i) => {
      subject.addEventListener("click", () => {
        const semestreAtual = semesterSelect.value;
        if (!semestreAtual) {
          alert("Por favor, selecione um semestre primeiro.");
          return;
        }
  
        if (subject.classList.contains("selecionada")) {
          subject.classList.remove("selecionada");
          selecaoPorSemestre[semestreAtual].delete(i);
        } else {
          subject.classList.add("selecionada");
          selecaoPorSemestre[semestreAtual].add(i);
        }
  
        atualizarBotaoContinuar();
      });
    });
  
    // Quando o semestre mudar, atualiza as matérias e o botão continuar
    semesterSelect.addEventListener("change", () => {
      const semestreSelecionado = semesterSelect.value;
      if (semestreSelecionado) {
        atualizarMaterias(semestreSelecionado);
      } else {
        // Limpa tudo se nenhum semestre selecionado
        subjects.forEach(subject => {
          subject.classList.remove("selecionada");
          subject.querySelector("img").src = "";
          subject.querySelector("p").textContent = "";
        });
      }
      atualizarBotaoContinuar();
    });
  
    // Inicializa botão continuar desabilitado
    atualizarBotaoContinuar();
  });
  