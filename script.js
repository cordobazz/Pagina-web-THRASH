/* ============================================================
   THRASH — interacciones
   Personaliza los datos de contacto en CONFIG.
   ============================================================ */
const CONFIG = {
  // Número completo con indicativo de país, sin +, espacios ni guiones.
  whatsappNumber: "573123087771",
  // Enlaces reales de THRASH (si quedan vacíos, los botones no hacen nada).
  instagramUrl: "https://www.instagram.com/thrash__studio/"
};
const PLACEHOLDER_NUMBER = "573000000000";

/* ---------- Utilidades ---------- */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const hasObserver = "IntersectionObserver" in window;
const canHover = matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches;

/* ---------- 1. Menú móvil ---------- */
const menuToggle = $(".menu-toggle");
const mainNav = $(".main-nav");
const navLinks = $$(".nav-link");

function setMenu(open) {
  menuToggle?.setAttribute("aria-expanded", String(open));
  mainNav.classList.toggle("open", open);
}
menuToggle?.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
navLinks.forEach(link => link.addEventListener("click", () => setMenu(false)));
addEventListener("resize", () => { if (innerWidth > 700) setMenu(false); });

/* ---------- 2. Enlace activo según la sección visible ---------- */
if (hasObserver) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => {
      navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  $$("main section[id]").forEach(section => sectionObserver.observe(section));
}

/* ---------- 3. Aparición progresiva (con escalonado) ---------- */
const revealItems = $$(".reveal");
revealItems.forEach(item => item.style.setProperty("--i", [...item.parentElement.children].indexOf(item) % 4));

if (hasObserver) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(({ target }) => {
      target.classList.add("is-visible");
      revealObserver.unobserve(target);
      // Libera la clase para que los efectos hover no hereden el retraso.
      setTimeout(() => target.classList.remove("reveal", "is-visible"), 1200);
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
}

/* ---------- 4. Scroll: cabecera, barra de progreso y botón "volver arriba" ---------- */
const header = $(".site-header");
const progressBar = $(".scroll-progress");
const backToTop = $("#back-to-top");

function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  header.classList.toggle("scrolled", scrollY > 40);
  progressBar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  backToTop.classList.toggle("visible", scrollY > 500);
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();
backToTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

/* ---------- 5. Efectos de cursor (solo con mouse) ---------- */
if (canHover) {
  // Parallax suave de la composición 3D y la mascota del hero.
  const hero = $(".hero");
  const heroArt = $(".hero-visual");
  hero.addEventListener("pointermove", event => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroArt.style.setProperty("--px", `${x * 28}px`);
    heroArt.style.setProperty("--py", `${y * 20}px`);
  });
  hero.addEventListener("pointerleave", () => {
    heroArt.style.setProperty("--px", "0px");
    heroArt.style.setProperty("--py", "0px");
  });

  // Brillo morado que sigue al cursor dentro de las tarjetas.
  document.addEventListener("pointermove", event => {
    const card = event.target.closest(".info-card, .service-card");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--y", `${event.clientY - rect.top}px`);
  });
}

/* ---------- 6. Equipo: si falta la foto, muestra el marcador ---------- */
$$(".team-photo img").forEach(img => {
  const showPlaceholder = () => { img.parentElement.classList.add("photo-placeholder"); img.remove(); };
  if (img.complete && img.naturalWidth === 0) showPlaceholder();
  else img.addEventListener("error", showPlaceholder, { once: true });
});

/* ---------- 7. Portafolio: imágenes, filtros y ventana modal ---------- */
const projectsGrid = $(".projects-grid");
const projectCards = $$(".project-card");
const filterButtons = $$(".filter-button");

// Si existe la imagen de la tarjeta (data-image), reemplaza el fondo provisional.
projectCards.forEach(card => {
  const probe = new Image();
  probe.onload = () => {
    const visual = $(".project-image", card);
    visual.style.backgroundImage = `url("${card.dataset.image}")`;
    visual.classList.add("has-image");
  };
  probe.src = card.dataset.image;
});

// Mantiene la cuadrícula sin huecos: si la cantidad visible es impar, la primera ocupa todo el ancho.
function layoutProjects() {
  const visible = projectCards.filter(card => !card.hidden);
  projectCards.forEach(card => card.classList.remove("is-wide"));
  if (visible.length % 2 === 1) visible[0].classList.add("is-wide");
}
layoutProjects();

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    projectsGrid.classList.add("is-filtered");
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    projectCards.forEach(card => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
    layoutProjects();
  });
});

const modal = $("#project-modal");
const modalTitle = $("#modal-title");
const modalType = $("#modal-type");
const modalDescription = $("#modal-description");
const modalMedia = $("#modal-media");
let lastFocusedElement = null;

// Crea el medio según el proyecto: data-video (spot), data-pdf (documento) o la imagen.
function buildModalMedia(card) {
  if (card.dataset.video) {
    const video = document.createElement("video");
    video.src = card.dataset.video;
    video.poster = card.dataset.image;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    return video;
  }
  if (card.dataset.pdf) {
    const frame = document.createElement("iframe");
    frame.src = `${card.dataset.pdf}#navpanes=0`;
    frame.title = card.dataset.title;
    return frame;
  }
  const image = document.createElement("img");
  image.src = card.dataset.image;
  image.alt = card.dataset.title;
  return image;
}

function openProjectModal(card) {
  lastFocusedElement = document.activeElement;
  modalTitle.textContent = card.dataset.title || "Proyecto THRASH";
  modalType.textContent = card.dataset.type || "PROYECTO";
  modalDescription.textContent = card.dataset.description || "";
  modalMedia.replaceChildren(buildModalMedia(card));
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $(".modal-close", modal).focus();
}
function closeProjectModal() {
  modalMedia.replaceChildren(); // detiene el video
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lastFocusedElement?.focus();
}
projectCards.forEach(card => card.addEventListener("click", () => openProjectModal(card)));
$$("[data-close-modal]", modal).forEach(element => element.addEventListener("click", closeProjectModal));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeProjectModal();
});

/* ---------- 8. Servicios: preseleccionan el servicio del formulario ---------- */
$$("[data-service]").forEach(link => {
  link.addEventListener("click", () => {
    const select = $('select[name="service"]');
    const match = select && [...select.options].find(option => option.text.toLowerCase().includes(link.dataset.service.toLowerCase()));
    if (match) select.value = match.value || match.text;
  });
});

/* ---------- 9. Contacto: formulario, WhatsApp y redes ---------- */
const contactForm = $("#contact-form");
const formStatus = $("#form-status");
const whatsappNumber = CONFIG.whatsappNumber.replace(/\D/g, "");
const whatsappIsSet = whatsappNumber && whatsappNumber !== PLACEHOLDER_NUMBER;

contactForm?.addEventListener("submit", event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  if (!whatsappIsSet) {
    formStatus.textContent = "Antes de usar el formulario, configura el número real de WhatsApp en script.js (CONFIG.whatsappNumber).";
    return;
  }
  const data = new FormData(contactForm);
  const message = [
    "Hola, THRASH. Quiero hablar sobre un proyecto.",
    `Nombre: ${data.get("name")}`,
    `Correo: ${data.get("email")}`,
    `Teléfono: ${data.get("phone") || "No indicado"}`,
    `Empresa: ${data.get("company") || "No indicada"}`,
    `Servicio: ${data.get("service")}`,
    `Mensaje: ${data.get("message")}`
  ].join("\n");
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  formStatus.textContent = "Se abrió WhatsApp con tu mensaje preparado. Revísalo y pulsa Enviar allí.";
});

const whatsappFloat = $("#whatsapp-float");
whatsappFloat.href = `https://wa.me/${whatsappNumber}`;
whatsappFloat.target = "_blank";
whatsappFloat.rel = "noopener noreferrer";
if (!whatsappIsSet) whatsappFloat.title = "Configura tu número real de WhatsApp en script.js";

$$("[data-social]").forEach(link => {
  const url = CONFIG[`${link.dataset.social}Url`];
  if (url) {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.addEventListener("click", event => event.preventDefault());
  }
});

/* ---------- 10. Pie de página ---------- */
$("#year").textContent = new Date().getFullYear();
