## 2026-07-08 - [Optimize image loading with native lazy-loading]
**Learning:** Legacy JavaScript-based lazy loading (IntersectionObserver with data-src) is often redundant in modern browsers and can be replaced with the native `loading="lazy"` attribute, which is more efficient and easier to maintain.
**Action:** Always check for legacy lazy-loading scripts when optimizing image loading. Use native `loading="lazy"` for all images that are likely to be below the fold, but avoid it for hero images or elements above the fold to protect LCP.

## 2026-07-20 - [Debounce client-side dynamic search inputs]
**Learning:** In client-side filtered directory and list grids (like directory.js and events.js), rendering elements and calling layout-recalculating scripts like `lucide.createIcons()` on every keystroke causes serious typing lag and CPU bottlenecks, especially on lower-end mobile devices.
**Action:** Always debounce text search input handlers with a ~250ms delay to batch keystroke events and execute DOM reconstruction/layout-sensitive operations only after the user stops typing.
