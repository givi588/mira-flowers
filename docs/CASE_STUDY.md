# Case Study — Mira Flowers Storefront

**Project:** Mira Flowers, a flower shop in Kutaisi, Georgia  
**Website:** https://givi588.github.io/mira-flowers/  
**Type:** Real small-business website / inquiry-based storefront  
**Stack:** HTML, CSS, vanilla JavaScript, GitHub Pages

## 1. The challenge

A new local flower shop needed a simple online destination where prospective customers could discover its offerings, check indicative prices, understand pickup and delivery options, find the shop, and contact the team. A complex e-commerce checkout would have introduced unnecessary infrastructure and responsibilities for an operation that confirms orders personally.

The site is written in Georgian for its intended local audience.

## 2. The solution

I built a responsive, publicly accessible storefront that makes the key customer journey straightforward:

1. **Browse** bouquets, gift arrangements and individual flower options.
2. **Filter** catalog items by category.
3. **Plan an order** using a browser-based cart, editable quantities, and pickup/delivery selections.
4. **Review** an estimated total in Georgian lari, with the delivery charge included.
5. **Copy an order summary** and contact the shop by Facebook or telephone to confirm the actual arrangement, availability, price and delivery details.
6. **Find the shop** using the address and linked map location.

The cart does **not** send an order automatically; the shop confirms the details directly with the customer.

## 3. Implementation choices

| Decision | Reason |
| --- | --- |
| Static HTML/CSS/JavaScript and GitHub Pages | Simple to host, with no application server or account infrastructure |
| Georgian interface and mobile layouts | Designed around local visitors and common mobile browsing |
| Browser-only cart in `localStorage` | Retains a draft selection on one browser without storing customer records on a server |
| Pricing in integer *tetri* in `pricing.js` | Avoids floating-point rounding mistakes in cart totals |
| Separate, testable pricing module | Makes quantities, delivery costs, and invalid inputs easier to check |
| Canonical URL, meta tags, `Florist` structured data, sitemap and robots file | Provides a clear foundation for search engines to discover and describe the website |
| Links to Facebook, phone and shop location | Makes the next step visible without a payment gateway |

### Verified code evidence

- [Markup and metadata](../index.html)
- [Cart and interface behavior](../script.js)
- [Pricing calculations](../pricing.js)
- [Automated pricing tests](../tests/pricing.test.cjs)
- [GitHub Actions checks](../.github/workflows/site-checks.yml)

## 4. What was delivered

- A published, branded website for a real flower shop.
- A product browsing and order-planning flow.
- Shop contact, location and pickup/delivery information in one place.
- Responsive layouts and keyboard-oriented controls.
- Automated checks for the pricing logic.

These are **delivered capabilities**, not claims about measured sales, customer growth, conversion, or Google ranking. Those outcomes have not been independently measured here.

## 5. Boundaries and considerations

- Prices, product composition and delivery availability are indicative and should be confirmed with the shop.
- Some visual assets are illustrative or AI-generated, not guaranteed photographs of the exact arrangements currently in stock.
- There is no online payment, customer account, order database or automatic fulfillment.
- The cart persists only in the same browser and can be lost when site storage is cleared.
- SEO metadata and site ownership verification do not guarantee indexing or prominent placement in Google Search/Maps.
- The public storefront should not be used to submit or store confidential customer/payment information.

## 6. Lessons and next steps

This project shows how a small-business website can prioritize an understandable customer journey over unnecessary complexity: catalog → selection → contact → human confirmation.

Potential future improvements include owner-verified product photography, regularly reviewed prices, monitored broken links, more comprehensive accessibility testing, and analytics **only if the shop deliberately chooses a privacy-appropriate solution**.

---

[Open the storefront](https://givi588.github.io/mira-flowers/) · [Return to the repository README](../README.md) · [Developer portfolio](https://givi588.github.io/givi-portfolio/#case-study)
