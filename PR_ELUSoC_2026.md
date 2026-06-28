## ELUSoC_2026 — Remove Duplicate DOM Elements & Fix Search Input ID Mismatch

Closes #ISSUE_NUMBER

---

### Summary

Resolves 10 duplicate DOM element issues on the homepage that caused invalid HTML, accessibility regressions, broken search filtering, and visual duplication.

---

### Changes

#### `index.html` — 10 deduplication patches

| Patch | What changed |
|-------|-------------|
| 1 | Removed duplicate `<a class="skip-link">` (second instance) |
| 2 | Removed misplaced search container above hero-section |
| 3 | Merged theme-toggle and close-button into navbar; removed duplicate `#navbar` |
| 4 | Removed duplicate hero-section wrapper |
| 5 | Removed duplicate `#sm-banner` section |
| 6 | Moved orphaned products n4–n8 **into** the New Arrivals `#product1` section |
| 7 | Removed duplicate inline search script (functionality already in `app.js`) |
| 8 | Removed duplicate inline back-to-top script (functionality already in `app.js`) |
| 9 | Removed duplicate wishlist link from footer |
| 10 | Removed duplicate preconnect/dns-prefetch hints in `<head>` |

#### `app.js` — Search input ID fallback

- Changed `document.getElementById("searchInput")` to `document.getElementById("searchInput") || document.getElementById("searchBar")` so the search handler works with the HTML element `id="searchBar"`.

---

### Verification

- ✅ `<section>` open/close tags: balanced (8 each)
- ✅ Products `data-category`: 16 total (8 Featured + 8 New Arrivals)
- ✅ `id="sm-banner"`: 1 occurrence (was 2)
- ✅ `class="skip-link"`: 1 occurrence (was 2)
- ✅ `id="product1"`: 2 occurrences (expected — Featured + New Arrivals)

---

### Related

- Branch: `fix/duplicate-dom-elements`
