import { initHeader } from "../components/header.js";
import { initFooter } from "../components/footer.js";
import { initCarousel } from "../components/carousel.js";

document.addEventListener("DOMContentLoaded", () => {
  initHeader("/");
  initFooter("/");
  initCarousel("#carousel-container", "/");
});

