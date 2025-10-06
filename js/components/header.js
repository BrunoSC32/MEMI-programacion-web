// js/components/header.js
import { loadPartial } from "../core/fetchPartial.js";

export async function initHeader() {
  await loadPartial("#header-container", "partials/header.html");

  // Aquí podrás añadir la lógica del menú cuando se cargue el header
  const toggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (toggle && navMenu) {
    toggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }
}
