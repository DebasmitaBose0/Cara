## ELUSoC_2026 — Remove Duplicate DOM Elements & Fix Search Input ID Mismatch

**Issue:** The homepage (`index.html`) contains multiple duplicate DOM elements that cause invalid HTML structure, accessibility violations, broken JavaScript event listeners, and degraded user experience.

---

### Problems Found

| # | Problem | Impact |
|---|---------|--------|
| 1 | **Duplicate skip-link** — Two `<a class="skip-link">` elements | Keyboard users tab through redundant skip links; only one is correct |
| 2 | **Duplicate search container** — Two identical search forms above the hero | Event listeners register only on the first; the second is dead UI |
| 3 | **Duplicate mobile nav** — Two `<ul id="navbar">` blocks in mobile header | Duplicate navigation links confuse screen readers and break mobile menu |
| 4 | **Duplicate hero section wrapper** — Two full hero-section `<div>` blocks | Hero content doubled visually on page load |
| 5 | **Search input ID mismatch** — HTML uses `id="searchBar"`, JS reads `document.getElementById("searchInput")` | Search filtering silently fails; users get no results |
| 6 | **Orphaned products n4–n8** — New Arrivals items sit outside their section, after banner3 | Products rendered in wrong DOM position; CSS grid layout broken |
| 7 | **Duplicate sm-banner section** — Two `#sm-banner` sections | Banner content duplicated visually |
| 8 | **Duplicate preconnect/dns-prefetch** — Three sets of resource hints in `<head>` | First-set hints ignored by browser; wasted bytes |
| 9 | **Duplicate inline scripts** — Search logic and back-to-top script duplicated at end of body | Duplicated handlers fire twice for every interaction |
| 10 | **Duplicate wishlist link in footer** — Two identical wishlist links | Confuses users and analytics tracking |

---

### Files Changed

- `index.html` — Deduplicated all elements listed above; reorganised New Arrivals section structure
- `app.js` — Updated search input selector to fallback to `#searchBar` when `#searchInput` is absent

### Checklist

- [x] Verify issue exists on upstream `main`
- [x] Checkout new branch `fix/duplicate-dom-elements`
- [x] Apply all fixes to `index.html` (10 deduplication patches)
- [x] Apply fix to `app.js` (search input ID fallback)
- [x] Validate HTML section balance: `<section>` opens/closes match, products correctly nested
- [x] Commit with descriptive message
- [x] Push branch to origin
