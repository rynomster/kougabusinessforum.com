## 2026-07-08 - [Optimize image loading with native lazy-loading]
**Learning:** Legacy JavaScript-based lazy loading (IntersectionObserver with data-src) is often redundant in modern browsers and can be replaced with the native `loading="lazy"` attribute, which is more efficient and easier to maintain.
**Action:** Always check for legacy lazy-loading scripts when optimizing image loading. Use native `loading="lazy"` for all images that are likely to be below the fold, but avoid it for hero images or elements above the fold to protect LCP.
