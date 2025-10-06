// js/core/fetchPartial.js
export async function loadPartial(selector, path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Error al cargar ${path}: ${response.status}`);
    const html = await response.text();
    document.querySelector(selector).innerHTML = html;
  } catch (err) {
    console.error("Error al cargar partial:", err);
  }
}
