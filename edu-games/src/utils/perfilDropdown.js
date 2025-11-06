export function inicializarDropdownPerfil() {
  const btnPerfil = document.getElementById("btnPerfil");
  const perfilDropdown = document.querySelector(".perfil-dropdown");

  if (!btnPerfil || !perfilDropdown) return;

  btnPerfil.addEventListener("click", () => {
    perfilDropdown.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!perfilDropdown.contains(e.target) && e.target !== btnPerfil) {
      perfilDropdown.classList.remove("open");
    }
  });
}
