// js/components/footer.js
import { loadPartial } from "../core/fetchPartial.js";

export async function initFooter(base = "/") {
  await loadPartial("#footer-container", `${base}partials/footer.html`);

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}
