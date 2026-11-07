# Mira Flowers | მირა ფლოვერს 🌷

A responsive, Georgian-language storefront for **Mira Flowers**, a flower shop in Kutaisi, Georgia. Built with HTML, CSS, and vanilla JavaScript; hosted on GitHub Pages.

**[Visit the live website](https://givi588.github.io/mira-flowers/)** · [Official Facebook page](https://www.facebook.com/profile.php?id=61595825237820)

## What visitors can do

- Browse bouquets and gift arrangements, with simple category filters.
- View individual flower options and indicative prices in Georgian lari (₾).
- Add products to a shopping cart, adjust quantities, and compare pickup or delivery costs.
- Keep the cart on the same device between visits using browser `localStorage`.
- Copy an order summary and contact the shop by Facebook or phone to confirm details.
- Find the physical shop in Kutaisi using the linked Google Maps location.

**This is an inquiry-based storefront, not an online payment system.** The website does not accept card payments, automatically transmit orders, or operate a customer database.

## Technical highlights

- Responsive layouts and semantic HTML.
- Accessible labels, keyboard-oriented controls, and cart dialog interactions.
- A separate, testable pricing module (`pricing.js`) using integer tetri to avoid floating-point total errors.
- A browser-only shopping cart, with no server-side account or synchronization.
- SEO basics: canonical URL, page metadata, structured `Florist` data, `sitemap.xml`, and `robots.txt`.
- Static publishing through GitHub Pages.

## Run locally

No package installation or external runtime libraries are needed for the site. In the repository root, run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

To check the JavaScript syntax and run the pricing tests (requires Node.js):

```bash
node --check pricing.js
node --check script.js
node --test tests/*.test.cjs
```

The [GitHub Actions workflow](.github/workflows/site-checks.yml) runs these checks for pushes and pull requests.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Content, catalog sections, contact information, and structured metadata |
| `styles.css` | Responsive design and component styling |
| `script.js` | Catalog interactions, cart, order summary, and UI behaviors |
| `pricing.js` | Product prices, delivery fees, and total calculation |
| `assets/` | Optimized floral images and favicon |
| `sitemap.xml`, `robots.txt` | Search-engine discovery |
| `tests/pricing.test.cjs` | Pricing, validation, and delivery-fee regression checks |

## Accuracy, privacy, and limitations

- **Product photography:** Images are illustrative; some are AI-generated and may not match an available arrangement exactly. Confirm the final flowers, appearance, and price with the shop before ordering.
- **Availability and delivery:** Displayed prices and delivery fees are indicative. Availability and delivery to a specific address must be confirmed with the shop.
- **Data:** Cart contents remain only in this browser's storage. Clearing browser data removes the saved cart; no cross-device synchronization exists.
- **Search visibility:** A sitemap and verified site ownership help Google discover the website but **do not guarantee indexing or search ranking**.
- **Security:** Do not place customer payment information or private order records into this static demo workflow.

## Publishing

GitHub Pages serves this repository from the root of `main`:

**https://givi588.github.io/mira-flowers/**

The Google Search Console verification meta tag is retained in `index.html`. Do not remove it unless ownership verification has been transferred to another method. The map button points to the shop's location; the owner can replace it with the listing's direct Google Maps Share URL when available.
