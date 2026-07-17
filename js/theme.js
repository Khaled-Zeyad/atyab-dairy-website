/* =========================================================
   ATYAB MOZZARELLA — theme.js
   Dark mode toggle with Local Storage persistence.
   Applied immediately (before DOMContentLoaded) to avoid flash.
   ========================================================= */

(function applyStoredTheme() {
  const stored = localStorage.getItem("atyab_theme");
  const preferred = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", preferred);
})();

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("[data-theme-toggle]");
  if (!buttons.length) return;

  const sync = () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    buttons.forEach((btn) => btn.setAttribute("aria-pressed", String(current === "dark")));
  };
  sync();

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("atyab_theme", next);
      sync();
    });
  });
});
