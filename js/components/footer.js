// js/components/footer.js
import { loadPartial } from "../core/fetchPartial.js";

export async function initFooter() {
  await loadPartial("#footer-container", "partials/footer.html");
}
