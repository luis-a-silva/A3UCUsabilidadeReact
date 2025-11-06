export function inicializarMenuLateral() {
  const menuButton = document.getElementById("btn-menu");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (menuButton && sidebar && overlay) {
    const toggleMenu = () => {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("open");

      const isExpanded = sidebar.classList.contains("open");
      menuButton.setAttribute("aria-expanded", isExpanded);
    };

    menuButton.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", toggleMenu);
  }
}
