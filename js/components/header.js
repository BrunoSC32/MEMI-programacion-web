// js/components/header.js
import { loadPartial } from "../core/fetchPartial.js";

function setActiveNav() {
  const path = location.pathname;
  // Marca activo en el nav de escritorio
  document.querySelectorAll(".desktop-nav a").forEach(a => {
    const href = new URL(a.href, location.origin).pathname;
    if (path === href) a.classList.add("is-active");
  });
  // Marca activo también en el panel persiana (por si está visible)
  document.querySelectorAll("#nav-panel a").forEach(a => {
    const href = new URL(a.href, location.origin).pathname;
    if (path === href) a.classList.add("is-active");
  });
}

/* ---------- Panel persiana ---------- */

function measureAndOpen(panel, toggleBtn) {
  panel.hidden = false;                     // ya es accesible
  // Forzamos cálculo y aplicamos altura para animar
  const target = panel.scrollHeight;
  panel.style.maxHeight = target + "px";
  panel.classList.add("is-open");
  toggleBtn.setAttribute("aria-expanded", "true");

  // Enfocar primer link
  const firstLink = panel.querySelector("a, button");
  if (firstLink) firstLink.focus();
}

function closePanel(panel, toggleBtn) {
  panel.style.maxHeight = "0px";
  panel.classList.remove("is-open");
  toggleBtn.setAttribute("aria-expanded", "false");
  // Esperamos fin de transición para ocultar a lectores
  panel.addEventListener(
    "transitionend",
    () => { if (!panel.classList.contains("is-open")) panel.hidden = true; },
    { once: true }
  );
}

function togglePanel(panel, toggleBtn) {
  const open = toggleBtn.getAttribute("aria-expanded") === "true";
  if (open) {
    closePanel(panel, toggleBtn);
  } else {
    measureAndOpen(panel, toggleBtn);
  }
}

/* ---------- Submenú Acerca de ---------- */

function initSubmenu() {
  const btn = document.querySelector(".submenu-toggle");
  const list = document.getElementById("submenu-about");
  if (!btn || !list) return;

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", expanded ? "false" : "true");
    list.hidden = expanded; // alterna hidden
  });

  // Cerrar submenú con ESC
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      btn.setAttribute("aria-expanded", "false");
      list.hidden = true;
      btn.focus();
    }
  });
}

/* ---------- Cierres por UX ---------- */

function initGlobalClosers(panel, toggleBtn) {
  // Click fuera cierra
  document.addEventListener("click", (e) => {
    const isInside =
      panel.contains(e.target) ||
      toggleBtn.contains(e.target);
    const open = toggleBtn.getAttribute("aria-expanded") === "true";
    if (open && !isInside) closePanel(panel, toggleBtn);
  });

  // ESC cierra
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const open = toggleBtn.getAttribute("aria-expanded") === "true";
      if (open) closePanel(panel, toggleBtn);
    }
  });

  // Al pasar a desktop (>=768px) cierra y limpia estados
  const mq = window.matchMedia("(min-width: 768px)");
  const handleMQ = () => {
    if (mq.matches) {
      panel.style.maxHeight = "0px";
      panel.hidden = true;
      panel.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  };
  mq.addEventListener("change", handleMQ);
}

/* ---------- Inicialización principal del header ---------- */

export async function initHeader(base = "/") {
  await loadPartial("#header-container", `${base}partials/header.html`);

  const toggleBtn = document.querySelector(".menu-toggle");
  const panel = document.getElementById("nav-panel");

  if (toggleBtn && panel) {
    // Sincroniza aria-controls
    toggleBtn.setAttribute("aria-controls", "nav-panel");

    // Estado inicial accesible
    toggleBtn.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    panel.style.maxHeight = "0px";

    // Toggle
    toggleBtn.addEventListener("click", () => togglePanel(panel, toggleBtn));

    initSubmenu();
    initGlobalClosers(panel, toggleBtn);
  }

  setActiveNav();
}
