/* =========================================================
   ATYAB MOZZARELLA — products.js
   Loads /data/products.json and renders product cards.
   No product markup is hardcoded in HTML.
   ========================================================= */

const ATYAB_PRODUCTS = (() => {
  let products = [];
  let loaded = false;

  async function load() {
    if (loaded) return products;
    const res = await fetch("data/products.json");
    if (!res.ok) throw new Error("Could not load products.json");
    products = await res.json();
    loaded = true;
    return products;
  }

  function icon(name) {
    const icons = {
      whatsapp:
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.29-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15-.2.29-.76.95-.93 1.14-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.76-1.44-1.71-1.6-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.08-.15-.66-1.59-.9-2.18-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.43 0 1.43 1.04 2.81 1.19 3 .15.2 2.05 3.13 4.97 4.39.69.3 1.24.48 1.66.61.7.22 1.34.19 1.84.11.56-.08 1.73-.71 1.98-1.39.24-.68.24-1.27.17-1.39-.07-.12-.27-.2-.56-.34z"/><path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.85.51 3.58 1.4 5.07L2 22l5.08-1.33A10 10 0 0012.02 22c5.5 0 10-4.48 10-10s-4.5-10-10-10zm0 18.13a8.1 8.1 0 01-4.14-1.13l-.3-.18-3.02.79.81-2.95-.2-.3A8.1 8.1 0 013.9 12c0-4.48 3.65-8.13 8.12-8.13S20.13 7.52 20.13 12s-3.64 8.13-8.11 8.13z"/></svg>',
      call:
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.7 5.1 6.5 6.5l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8z"/></svg>',
    };
    return icons[name] || "";
  }

  function money(product, lang) {
    const symbol = product.currency || "EGP";
    return lang === "ar" ? `${product.price} ${symbol}` : `${symbol} ${product.price}`;
  }

  function card(product, lang) {
    const title = lang === "ar" ? product.title_ar : product.title_en;
    const desc = lang === "ar" ? product.description_ar : product.description_en;
    const available = product.available !== false;

    const waMsgAr = `مرحبًا، أرغب في طلب ${product.title_ar}.`;
    const waMsgEn = `Hello, I would like to order ${product.title_en}.`;
    const waHref = window.whatsappLink ? window.whatsappLink(waMsgAr, waMsgEn, lang) : "#";
    const telHref = window.SITE_CONFIG ? `tel:${window.SITE_CONFIG.phoneNumberDial}` : "tel:";

    const orderLabel = lang === "ar" ? "اطلب عبر واتساب" : "Order on WhatsApp";
    const callLabel = lang === "ar" ? "اتصل بنا" : "Call us";
    const soldOutLabel = lang === "ar" ? "غير متوفر حاليًا" : "Currently unavailable";
    const featuredLabel = lang === "ar" ? "الأكثر طلبًا" : "Best seller";

    return `
      <article class="product-card reveal" data-product-id="${product.id}">
        <div class="product-media">
          ${product.featured ? `<span class="product-badge">${featuredLabel}</span>` : ""}
          ${!available ? `<span class="product-badge unavailable">${soldOutLabel}</span>` : ""}
          <img src="${product.image}" alt="${title}" loading="lazy" width="480" height="384" />
        </div>
        <div class="product-body">
          <h3>${title}</h3>
          <p>${desc}</p>
          <div class="product-price">${money(product, lang)}</div>
          <div class="product-actions">
            <a class="btn btn-whatsapp" href="${available ? waHref : "#"}" ${available ? 'target="_blank" rel="noopener"' : "aria-disabled=\"true\" tabindex=\"-1\""}>
              ${icon("whatsapp")}<span>${orderLabel}</span>
            </a>
            <a class="btn btn-call" href="${telHref}">${icon("call")}<span>${callLabel}</span></a>
          </div>
        </div>
      </article>`;
  }

  function skeletons(count) {
    return Array.from({ length: count }, () => `<div class="skeleton skeleton-card"></div>`).join("");
  }

  async function renderInto(selector, opts = {}) {
    const container = document.querySelector(selector);
    if (!container) return;
    const lang = window.ATYAB_I18N ? window.ATYAB_I18N.currentLang() : localStorage.getItem("atyab_lang") || "ar";

    container.innerHTML = skeletons(opts.limit || 6);

    try {
      const all = await load();
      let list = all.filter((p) => (opts.onlyAvailable ? p.available !== false : true));
      if (opts.onlyFeatured) list = list.filter((p) => p.featured);
      if (opts.limit) list = list.slice(0, opts.limit);

      if (!list.length) {
        const emptyAr = "لا توجد منتجات متاحة حاليًا.";
        const emptyEn = "No products available right now.";
        container.innerHTML = `<div class="empty-state">${lang === "ar" ? emptyAr : emptyEn}</div>`;
        return;
      }

      container.innerHTML = list.map((p) => card(p, lang)).join("");
      if (window.wireReveal) window.wireReveal();
      // Re-run reveal observer for freshly injected nodes
      document.querySelectorAll(`${selector} .reveal`).forEach((el) => {
        if (!("IntersectionObserver" in window)) {
          el.classList.add("in-view");
          return;
        }
        const io = new IntersectionObserver(
          (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in-view"), io.unobserve(e.target))),
          { threshold: 0.15 }
        );
        io.observe(el);
      });

      const countEl = document.querySelector("[data-products-count]");
      if (countEl) {
        countEl.textContent =
          lang === "ar" ? `${list.length} منتجًا` : `${list.length} product${list.length === 1 ? "" : "s"}`;
      }
    } catch (err) {
      const errAr = "تعذر تحميل المنتجات. حاول مرة أخرى لاحقًا.";
      const errEn = "Couldn't load products. Please try again later.";
      container.innerHTML = `<div class="error-state">${lang === "ar" ? errAr : errEn}</div>`;
      console.error(err);
    }
  }

  return { load, renderInto };
})();

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-product-list]").forEach((container) => {
    const selectorId = "#" + container.id;
    const opts = {
      onlyAvailable: container.getAttribute("data-only-available") !== "false",
      onlyFeatured: container.hasAttribute("data-only-featured"),
      limit: container.getAttribute("data-limit") ? Number(container.getAttribute("data-limit")) : undefined,
    };
    ATYAB_PRODUCTS.renderInto(selectorId, opts);

    document.addEventListener("atyab:langchange", () => ATYAB_PRODUCTS.renderInto(selectorId, opts));
  });
});
