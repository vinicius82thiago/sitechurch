 // MENU MOBILE
    const menuButton = document.getElementById("menuButton");
    const menu = document.getElementById("menu");

    menuButton.addEventListener("click", () => {
      menu.classList.toggle("active");
    });


    // FECHA MENU AO CLICAR
    document.querySelectorAll(".menu a").forEach(link => {

      link.addEventListener("click", () => {
        menu.classList.remove("active");
      });

    });


    // FORMULÁRIO
    const form = document.getElementById("contactForm");

    form.addEventListener("submit", function(e) {

      e.preventDefault();

      alert(
        "Obrigado pela sua mensagem! " +
        "Em uma versão conectada a um servidor, " +
        "os dados seriam enviados aqui."
      );

      form.reset();

    });