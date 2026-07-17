/* =========================================================
   ATYAB MOZZARELLA — app.js
   Site-wide config + navigation, header, reveal animations
   ========================================================= */

/**
 * Central place to edit contact details.
 * Change these two values and every button/link on the site updates.
 */
window.SITE_CONFIG = {
  whatsappNumber: "201225838671", // international format, no + or spaces
  phoneNumber: "+20 122 583 8671", // shown to humans
  phoneNumberDial: "+201225838671", // used in tel: links
  email: "hello@atyabmozzarella.com",
  address_ar: "6 أكتوبر، الجيزة، جمهورية مصر العربية",
  address_en: "6th of October City, Giza, Egypt",
  workingHours_ar: "السبت – الخميس: 9 صباحًا – 6 مساءً",
  workingHours_en: "Sat – Thu: 9:00 AM – 6:00 PM",
  social: {
    instagram: "https://instagram.com/atyabmozzarella",
    facebook: "https://facebook.com/atyabmozzarella",
    tiktok: "https://tiktok.com/@atyabmozzarella",
  },
};

function whatsappLink(messageAr, messageEn, lang) {
  const msg = lang === "ar" ? messageAr : messageEn;
  return `https://wa.me/${window.SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}
window.whatsappLink = whatsappLink;

document.addEventListener("DOMContentLoaded", () => {
  wireHeader();
  wireMobileNav();
  wireFloatingButtons();
  wireContactDetails();
  setActiveNav();
  setYear();
  wireReveal();
});

/* ---------- Sticky header shadow ---------- */
function wireHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () =>
    header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Mobile nav ---------- */
function wireMobileNav() {
  const toggle = document.querySelector(".hamburger");
  const nav = document.querySelector(".mobile-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }),
  );
}

/* ---------- Floating WhatsApp / Call buttons + header/footer CTA hrefs ---------- */
function wireFloatingButtons() {
  const apply = () => {
    const lang = window.ATYAB_I18N
      ? window.ATYAB_I18N.currentLang()
      : localStorage.getItem("atyab_lang") || "ar";
    const msgAr = "مرحبًا، أرغب في الاستفسار عن جبنة أطياب موتزاريلا.";
    const msgEn = "Hello, I would like to ask about Atyab Mozzarella Cheese.";

    document.querySelectorAll("[data-whatsapp-link]").forEach((el) => {
      el.href = whatsappLink(msgAr, msgEn, lang);
    });
    document.querySelectorAll("[data-call-link]").forEach((el) => {
      el.href = `tel:${window.SITE_CONFIG.phoneNumberDial}`;
    });
  };
  apply();
  document.addEventListener("atyab:langchange", apply);
}
window.wireFloatingButtons = wireFloatingButtons;

/* ---------- Fill in phone/email/address/hours/social placeholders ---------- */
function wireContactDetails() {
  const cfg = window.SITE_CONFIG;
  const applyLangFields = () => {
    const lang = window.ATYAB_I18N
      ? window.ATYAB_I18N.currentLang()
      : localStorage.getItem("atyab_lang") || "ar";
    document
      .querySelectorAll("[data-address-display]")
      .forEach(
        (el) =>
          (el.textContent = lang === "ar" ? cfg.address_ar : cfg.address_en),
      );
    document
      .querySelectorAll("[data-hours-display]")
      .forEach(
        (el) =>
          (el.textContent =
            lang === "ar" ? cfg.workingHours_ar : cfg.workingHours_en),
      );
  };

  document
    .querySelectorAll("[data-phone-display]")
    .forEach((el) => (el.textContent = cfg.phoneNumber));
  document
    .querySelectorAll("[data-email-display]")
    .forEach((el) => (el.textContent = cfg.email));
  document
    .querySelectorAll("[data-social-instagram]")
    .forEach((el) => (el.href = cfg.social.instagram));
  document
    .querySelectorAll("[data-social-facebook]")
    .forEach((el) => (el.href = cfg.social.facebook));
  document
    .querySelectorAll("[data-social-tiktok]")
    .forEach((el) => (el.href = cfg.social.tiktok));

  applyLangFields();
  document.addEventListener("atyab:langchange", applyLangFields);
}

/* ---------- Highlight current page in nav ---------- */
function setActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.setAttribute("aria-current", "page");
    }
  });
}

/* ---------- Footer year ---------- */
function setYear() {
  document
    .querySelectorAll("[data-year]")
    .forEach((el) => (el.textContent = new Date().getFullYear()));
}

/* ---------- Reveal-on-scroll ---------- */
function wireReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );
  items.forEach((el) => io.observe(el));
}
