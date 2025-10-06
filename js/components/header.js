// js/components/header.js
import { loadPartial } from "../core/fetchPartial.js";

function setActiveNav() {
  const path = location.pathname; // ej: /pages/courses.html
  const links = document.querySelectorAll(".nav-menu a");
  links.forEach(a => {
    // marca activo si el final del href coincide con el final del path
    const href = new URL(a.href, location.origin).pathname;
    if (path === href) a.classList.add("is-active");
  });
}

function initToggle() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-menu");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

export async function initHeader(base = "/") {
  // base controla desde dónde cargar el partial (ver #3)
  await loadPartial("#header-container", `${base}partials/header.html`);
  initToggle();
  setActiveNav();
}
