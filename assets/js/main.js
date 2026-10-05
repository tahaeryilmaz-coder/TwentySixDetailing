document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav-links");
  const scrollTopButton = document.querySelector(".scroll-top");

  const closeMenu = () => {
    navigation?.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Menü öffnen");
    if (menuButton) menuButton.textContent = "☰";
  };

  const onScroll = () => {
    header?.classList.toggle("scrolled", window.scrollY > 24);
    scrollTopButton?.classList.toggle("show", window.scrollY > 520);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  menuButton?.addEventListener("click", () => {
    const open = navigation?.classList.toggle("open") || false;
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    menuButton.textContent = open ? "×" : "☰";
  });
  navigation?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  scrollTopButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();
      closeLightbox();
    }
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
  } else {
    document.querySelectorAll(".reveal").forEach(element => element.classList.add("visible"));
  }

  document.querySelectorAll(".ba-slider").forEach(slider => {
    const range = slider.querySelector(".ba-range");
    if (!range) return;
    const update = () => slider.style.setProperty("--pos", `${range.value}%`);
    range.addEventListener("input", update);
    update();
  });

  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox?.querySelector("img");
  let lastLightboxTrigger = null;
  const closeLightbox = () => {
    if (!lightbox?.classList.contains("open")) return;
    lightbox.classList.remove("open");
    document.body.classList.remove("menu-open");
    lastLightboxTrigger?.focus();
  };
  document.querySelectorAll("[data-lightbox]").forEach(button => {
    button.addEventListener("click", () => {
      if (!lightbox || !lightboxImage) return;
      lastLightboxTrigger = button;
      lightboxImage.src = button.dataset.lightbox || "";
      lightboxImage.alt = button.querySelector("img")?.alt || "Galeriebild";
      lightbox.classList.add("open");
      document.body.classList.add("menu-open");
      lightbox.querySelector("button")?.focus();
    });
  });
  lightbox?.addEventListener("click", event => {
    if (event.target === lightbox || event.target.closest("button")) closeLightbox();
  });

  const upload = document.querySelector("input[type=file][data-max-size]");
  const uploadError = document.querySelector("[data-upload-error]");
  upload?.addEventListener("change", () => {
    const maxSize = Number(upload.dataset.maxSize || 0);
    const files = Array.from(upload.files || []);
    const tooLarge = files.some(file => file.size > maxSize);
    if (uploadError) uploadError.textContent = tooLarge ? "Mindestens eine Datei ist größer als 8 MB. Bitte verkleinere sie oder sende die Fotos per WhatsApp." : "";
    upload.setCustomValidity(tooLarge ? "Datei zu groß" : "");
  });
});
