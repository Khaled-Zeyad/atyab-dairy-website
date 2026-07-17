# Atyab Mozzarella — Website

A premium, multilingual (Arabic/English), dark-mode-ready business website for **Atyab Mozzarella**. It's a fully static site — plain HTML, CSS, and JavaScript, no backend, no database — built to run on **GitHub + Cloudflare Pages** and managed day-to-day through **Pages CMS**.

This README is written for a non-technical business owner. If a step mentions a tool you've never used, follow the instructions literally — you don't need to know how to code.

---

## 1. What's in this project

```
website/
├── index.html            → Homepage
├── products.html          → Full product catalog
├── about.html              → About Us page
├── contact.html            → Contact page (form + map)
├── 404.html                 → "Page not found" page
├── css/
│   ├── style.css            → Main design (colors, fonts, layout, components)
│   └── responsive.css       → Rules for tablets & phones
├── js/
│   ├── app.js                → Site-wide behavior (menu, header, contact numbers)
│   ├── theme.js               → Dark mode switch
│   ├── language.js            → Arabic/English switch
│   └── products.js            → Loads and displays products from JSON
├── images/
│   ├── logo/                  → Site logo
│   ├── products/               → Product photos (managed via Pages CMS)
│   └── icons/                    → Spare icon assets
├── data/
│   ├── products.json            → All product data (edited via Pages CMS, not by hand)
│   └── locales/
│       ├── ar.json               → All Arabic text on the site
│       └── en.json               → All English text on the site
├── .pages.yml                    → Pages CMS configuration (do not delete)
├── robots.txt                     → Tells search engines how to crawl the site
├── sitemap.xml                     → List of pages for search engines
└── README.md                        → This file
```

Nothing on this site needs a server, a database, or a login system. The whole website is just files, and Cloudflare Pages serves those files to visitors.

---

## 2. GitHub setup

1. Create a free account at [github.com](https://github.com) if you don't already have one.
2. Create a **new repository** (e.g. `atyab-mozzarella-website`). Keep it **Public** or **Private** — both work with Cloudflare Pages.
3. Upload the entire `website` folder's contents to the repository:
   - Easiest way: on the repository page, click **Add file → Upload files**, then drag every file and folder in.
   - Alternatively, if you're comfortable with git: `git init`, `git add .`, `git commit -m "Initial site"`, `git remote add origin <your-repo-url>`, `git push -u origin main`.
4. Confirm the files are visible in GitHub before moving to the next step.

---

## 3. Deploying on Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign in (create a free account if needed).
2. In the sidebar, choose **Workers & Pages → Create → Pages → Connect to Git**.
3. Authorize Cloudflare to access your GitHub account, then select your website repository.
4. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/` (the repository root, since this is a plain static site)
5. Click **Save and Deploy**. Cloudflare will give you a URL like `atyab-mozzarella.pages.dev` within a minute or two.
6. **Every time you (or Pages CMS) push a new commit to GitHub, Cloudflare Pages automatically rebuilds and redeploys the site.** You never need to click "deploy" manually again.
7. Optional — connect your own domain (e.g. `atyabmozzarella.com`): in the Pages project, go to **Custom domains → Set up a custom domain** and follow the instructions to point your DNS to Cloudflare.

---

## 4. Setting up Pages CMS (your admin panel)

Pages CMS is a free tool that gives you a friendly dashboard to add, edit, and delete products — without ever touching code or JSON files directly. It talks to GitHub for you.

1. Go to **[app.pagescms.org](https://app.pagescms.org)** and sign in with your GitHub account.
2. Click **Install the GitHub App**, then choose the repository that holds your website (you can grant access to just this one repository).
3. Back in Pages CMS, select your repository. It will automatically detect the `.pages.yml` file already included in this project — that file tells Pages CMS exactly how to present the "Products" editor.
4. You'll now see a **Products** section in the left sidebar. That's your product manager.

You do **not** need to create or edit `.pages.yml` yourself — it's already configured for this site.

---

## 5. Adding a product

1. In Pages CMS, click **Products → Add entry**.
2. Fill in the fields:
   - **ID** — a unique number that no other product uses (e.g. if your highest ID so far is 6, use 7 next).
   - **Title (Arabic)** and **Title (English)**
   - **Description (Arabic)** and **Description (English)**
   - **Price** — just the number, e.g. `180`
   - **Currency** — defaults to `EGP`, change if needed
   - **Product Image** — click to upload a photo from your computer (JPG, PNG, or WebP; WebP loads fastest)
   - **Featured Product** — turn this on if you want it to appear in the "Featured Products" section on the homepage
   - **Available** — turn this off temporarily if the product is out of stock (it will show "Currently unavailable" and hide the order buttons)
3. Click **Save** / **Commit**. Pages CMS commits the change to GitHub automatically.
4. Within a minute or two, Cloudflare Pages rebuilds the site and your new product appears live — no extra steps needed.

## 6. Editing a product

1. In Pages CMS, click **Products**, then click the product you want to change.
2. Update any field (price, description, image, availability, etc.).
3. Click **Save** / **Commit**. The live site updates automatically after Cloudflare Pages redeploys.

## 7. Deleting a product

1. In Pages CMS, open the **Products** list.
2. Select the product and choose **Delete**.
3. Confirm. The product disappears from the site after the next automatic redeploy.

---

## 8. Changing your contact number, WhatsApp number, and email

All contact details live in one place: **`js/app.js`**, at the very top, inside `window.SITE_CONFIG`.

```js
window.SITE_CONFIG = {
  whatsappNumber: "201000000000",   // international format, digits only, no + and no spaces
  phoneNumber: "+20 100 000 0000",  // how the number is displayed to visitors
  phoneNumberDial: "+201000000000", // used when someone taps the Call button
  email: "hello@atyabmozzarella.com",
  address_ar: "...",
  address_en: "...",
  workingHours_ar: "...",
  workingHours_en: "...",
  social: {
    instagram: "https://instagram.com/yourhandle",
    facebook: "https://facebook.com/yourhandle",
    tiktok: "https://tiktok.com/@yourhandle"
  }
};
```

To edit this file without any coding tools:

1. On GitHub, open `js/app.js`.
2. Click the pencil (✏️) icon to edit.
3. Update the values between the quotation marks only — don't remove the quotes or commas.
4. Scroll down and click **Commit changes**.

Every WhatsApp button, call button, and floating button on the whole site reads from this one file, so you only ever need to change it in this one spot.

---

## 9. Changing your logo

1. Prepare your new logo as an SVG (preferred) or PNG, ideally square.
2. On GitHub, go to `images/logo/` and upload your new file, or replace `logo.svg` with a file of the same name.
3. If you use a different filename, also update the `src="images/logo/logo.svg"` references inside each HTML page (`index.html`, `products.html`, `about.html`, `contact.html`, `404.html`) and the `<link rel="icon">` line in each page's `<head>`.

---

## 10. Changing your colors

All colors are defined once, at the top of **`css/style.css`**, inside `:root { ... }` (for light mode) and `[data-theme="dark"] { ... }` (for dark mode). For example:

```css
--gold:        #C08A2E;   /* primary accent color */
--basil:       #3E5233;   /* secondary accent color */
```

Change the hex code after any variable, save, and commit — every button, link, and highlight using that variable updates automatically across the whole site.

---

## 11. Changing your company information (About page, hero text, etc.)

All visible text on the site lives in two files:

- `data/locales/ar.json` — every piece of Arabic text
- `data/locales/en.json` — every piece of English text

Both files share the same structure — the section/field names are identical, only the text differs. For example, to change the homepage headline, edit `hero.titleLine1`, `hero.titleEm`, and `hero.titleLine2` in both files.

**To edit:** open the file on GitHub, click the pencil icon, change the text between the quotation marks (never remove a quotation mark, comma, or curly bracket), then commit. If a comma or bracket goes missing, the site may stop loading text correctly — if that happens, undo your change from the file's history on GitHub ("History" button) and try again.

---

## 12. Adding a new language

The site currently supports Arabic and English. To add a third language (example: French):

1. Duplicate `data/locales/en.json` and rename the copy `fr.json`, translating every value.
2. In `js/language.js`, update the `setLanguage` function so `lang = code === "en" ? "en" : code === "fr" ? "fr" : "ar";` (adjust the logic to accept `"fr"`).
3. In every HTML page, add a third button to each `.lang-switch` group: `<button type="button" data-lang-switch="fr">FR</button>`.
4. This is a code change — if you're not comfortable making it yourself, ask a developer for an hour of help.

---

## 13. Updating social media links

Open `js/app.js` and edit the `social` object inside `window.SITE_CONFIG` (see Section 8 above) with your Instagram, Facebook, and TikTok URLs. All footer icons read from these three lines.

---

## 14. Deploying updates

You never need to manually "deploy" anything:

- **Product changes** made in Pages CMS commit straight to GitHub, and Cloudflare Pages redeploys automatically, usually within 1–2 minutes.
- **Text, color, or contact-info changes** made by editing a file on GitHub also trigger an automatic redeploy the moment you click **Commit changes**.
- You can watch a deployment's progress under **Workers & Pages → your project → Deployments** in the Cloudflare dashboard.

---

## 15. Technical notes (for developers)

- Pure HTML5 / CSS3 / vanilla JavaScript — no build step, no frameworks, no npm install required.
- Products are rendered client-side by `js/products.js`, which fetches `data/products.json` and injects cards into any element with `data-product-list`. Use `data-only-featured` and `data-limit="N"` attributes to control what a given container shows (see the homepage's featured grid vs. the full products page).
- Translations are applied by `js/language.js` via `data-i18n`, `data-i18n-placeholder`, `data-i18n-aria`, and `data-i18n-content` attributes; language choice persists in `localStorage` under `atyab_lang`.
- Dark mode persists in `localStorage` under `atyab_theme` and is applied before first paint to avoid a flash of the wrong theme.
- Product images shipped with this starter kit are placeholder SVG illustrations — replace them with real product photography via Pages CMS whenever you're ready. WebP is recommended for photographs.
- Update `https://atyabmozzarella.com` in `sitemap.xml`, `robots.txt`, and each page's `<link rel="canonical">` / Open Graph tags once your final domain is live.
