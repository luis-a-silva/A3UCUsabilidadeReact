export function alternarModos() {
  const body = document.body;
  const btnWhite = document.getElementById("whiteMode");
  const btnDark = document.getElementById("darkMode");

  const aplicarTema = (tema) => {
    if (tema === "light") {
      body.setAttribute("data-theme", "light");
      if (btnWhite && btnDark) {
        btnWhite.style.display = "none";
        btnDark.style.display = "inline-flex";
      }
      localStorage.setItem("tema", "light");
    } else {
      body.removeAttribute("data-theme");
      if (btnWhite && btnDark) {
        btnWhite.style.display = "inline-flex";
        btnDark.style.display = "none";
      }
      localStorage.setItem("tema", "dark");
    }
  };

  // aplica tema salvo
  const temaSalvo = localStorage.getItem("tema") || "dark";
  aplicarTema(temaSalvo);

  // eventos
  btnWhite?.addEventListener("click", () => aplicarTema("light"));
  btnDark?.addEventListener("click", () => aplicarTema("dark"));
}
