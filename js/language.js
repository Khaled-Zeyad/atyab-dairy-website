/* =========================================================
   ATYAB MOZZARELLA — language.js
   Loads /data/locales/{ar,en}.json and applies translations
   instantly (no reload). Persists choice in Local Storage.
   ========================================================= */

const ATYAB_I18N = (() => {
  let dict = {};
  let lang = "ar";
  const cache = {};

  function getValue(obj, path) {
    return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  }

  async function loadLocale(code) {
    if (cache[code]) return cache[code];
    const res = await fetch(`data/locales/${code}.json`);
    if (!res.ok) throw new Error(`Could not load locale: ${code}`);
    const json = await res.json();
    cache[code] = json;
    return json;
  }

  function applyDom() {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const val = getValue(dict, el.getAttribute("data-i18n"));
      if (val !== undefined) el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const val = getValue(dict, el.getAttribute("data-i18n-placeholder"));
      if (val !== undefined) el.setAttribute("placeholder", val);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const val = getValue(dict, el.getAttribute("data-i18n-aria"));
      if (val !== undefined) el.setAttribute("aria-label", val);
    });

    document.querySelectorAll("[data-i18n-content]").forEach((el) => {
      const val = getValue(dict, el.getAttribute("data-i18n-content"));
      if (val !== undefined) el.setAttribute("content", val);
    });

    const titleVal = getValue(dict, "meta.title");
    if (titleVal) document.title = titleVal;

    document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang-switch") === lang));
    });
  }

  async function setLanguage(code) {
    lang = code === "en" ? "en" : "ar";
    dict = await loadLocale(lang);
    localStorage.setItem("atyab_lang", lang);
    applyDom();
    document.dispatchEvent(new CustomEvent("atyab:langchange", { detail: { lang, dict } }));
  }

  function currentLang() {
    return lang;
  }
  function t(path) {
    return getValue(dict, path);
  }

  async function init() {
    const stored = localStorage.getItem("atyab_lang");
    const browserPrefersEnglish = (navigator.language || "ar").toLowerCase().startsWith("en");
    const initial = stored || (browserPrefersEnglish ? "en" : "ar");
    await setLanguage(initial);

    document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
      btn.addEventListener("click", () => setLanguage(btn.getAttribute("data-lang-switch")));
    });
  }

  return { init, setLanguage, currentLang, t };
})();

window.ATYAB_I18N = ATYAB_I18N;

document.addEventListener("DOMContentLoaded", () => {
  ATYAB_I18N.init();
});
