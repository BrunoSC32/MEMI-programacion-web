// js/components/carousel.js
import { loadPartial } from "../core/fetchPartial.js";

function setupDots(root, slides, goTo) {
  const dots = root.querySelector(".carousel-dots");
  dots.innerHTML = "";
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dot";
    b.setAttribute("aria-label", `Ir al slide ${i + 1}`);
    b.addEventListener("click", () => goTo(i, true));
    dots.appendChild(b);
  });
}

export async function initCarousel(mountSelector = "#carousel-container", base = "/") {
  const mount = document.querySelector(mountSelector);
  if (!mount) return;

  await loadPartial(mountSelector, `${base}partials/carousel.html`);

  const root = mount.querySelector(".carousel");
  if (!root) return;


  const track  = root.querySelector(".carousel-track");
  const slides = Array.from(root.querySelectorAll(".carousel-slide"));
  const prev   = root.querySelector(".carousel-btn.prev");
  const next   = root.querySelector(".carousel-btn.next");
  const interval = Number(root.dataset.interval || 30000);

  let index = slides.findIndex(s => s.classList.contains("is-active"));
  if (index < 0) index = 0;

  const updateUI = () => {
    slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
    // translateX por índice
    track.style.transform = `translateX(${index * -100}%)`;
    // dots
    root.querySelectorAll(".carousel-dots .dot").forEach((d, i) => {
      d.classList.toggle("is-active", i === index);
    });
  };

  const goTo = (i, user = false) => {
    index = (i + slides.length) % slides.length;
    updateUI();
    if (user) restartAutoplay();
  };

  const goNext = () => goTo(index + 1);
  const goPrev = () => goTo(index - 1);

  // Controles
  prev.addEventListener("click", () => goPrev());
  next.addEventListener("click", () => goNext());

  // Teclado (izq/dcha)
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  });
  root.tabIndex = 0; // para poder enfocarlo y usar teclas

  // Autoplay
  let timer = null;
  const startAutoplay = () => { timer = setInterval(goNext, interval); };
  const stopAutoplay  = () => { if (timer) clearInterval(timer); timer = null; };
  const restartAutoplay = () => { stopAutoplay(); startAutoplay(); };

  // Pausa en hover o al enfocarse
  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", stopAutoplay);
  root.addEventListener("focusout", startAutoplay);

  // Resize: asegura ancho correcto
  window.addEventListener("resize", () => updateUI());

  // Dots
  setupDots(root, slides, goTo);

  // Init
  updateUI();
  startAutoplay();
}

