document.addEventListener("DOMContentLoaded", () => {
  const options = document.querySelectorAll(".option");
  const continueBtn = document.querySelector(".continue-btn");

  // Começa desabilitado
  continueBtn.classList.add("disabled");
  continueBtn.setAttribute("aria-disabled", "true");
  continueBtn.setAttribute("tabindex", "-1");

  options.forEach(option => {
    option.addEventListener("click", () => {
      if (option.classList.contains("selected")) {
        // Se já estava selecionada, desmarca
        option.classList.remove("selected");
        // Verifica se alguma opção está selecionada
        const anySelected = Array.from(options).some(opt => opt.classList.contains("selected"));
        if (!anySelected) {
          continueBtn.classList.add("disabled");
          continueBtn.setAttribute("aria-disabled", "true");
          continueBtn.setAttribute("tabindex", "-1");
        }
      } else {
        // Remove seleção anterior
        options.forEach(opt => opt.classList.remove("selected"));
        // Marca a opção clicada como selecionada
        option.classList.add("selected");

        // Habilita o link
        continueBtn.classList.remove("disabled");
        continueBtn.setAttribute("aria-disabled", "false");
        continueBtn.setAttribute("tabindex", "0");
      }
    });
  });

  continueBtn.addEventListener("click", (event) => {
    if (continueBtn.classList.contains("disabled")) {
      event.preventDefault();
      alert("Por favor, selecione uma opção antes de continuar.");
    }
  });
});
