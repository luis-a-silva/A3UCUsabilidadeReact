import "./sidebar.css";
import { useState } from "react";

export default function Sidebar() {
  const [active, setActive] = useState(null);

  const toggleDropdown = (index) => {
    setActive(active === index ? null : index);
  };

  const dropdowns = [
    {
      title: "Plataformas",
      items: ["PC", "PlayStation", "Xbox", "Nintendo"]
    },
    {
      title: "Gêneros",
      items: ["Ação", "RPG", "Corrida", "Simulação", "Terror", "Aventura"]
    },
    {
      title: "Faixa de Preço",
      items: ["Até R$ 50", "R$ 50 - R$ 150", "R$ 150 - R$ 300", "Acima de R$ 300"]
    },
    {
      title: "Avaliações",
      items: ["★★★★★ (5 estrelas)", "★★★★☆ (4 estrelas)", "★★★☆☆ (3 estrelas)"]
    }
  ];

  return (
    <aside className="sidebar" id="sidebar">
      <h3>Categorias</h3>

      {dropdowns.map((drop, index) => (
        <div key={index} className="dropdown">
          <button
            className="dropdown-btn"
            onClick={() => toggleDropdown(index)}
          >
            {drop.title} <i className="fas fa-chevron-down"></i>
          </button>

          <ul className={`dropdown-list ${active === index ? "open" : ""}`}>
            {drop.items.map((item, i) => (
              <li key={i}>
                <a href="#">{item}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
