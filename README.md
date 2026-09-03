## Performance & Accessibility

Audited using Chrome DevTools Lighthouse (Mobile, Samsung Galaxy S8+ simulation).

| Category       | Score   |
|-----------------|---------|
| Performance      | 98/100  |
| Accessibility    | 100/100 |
| Best Practices   | 100/100 |
| SEO              | 100/100 |


**Accessibility (100/100):** Achieved through semantic HTML, an explicit `<label htmlFor>` on the ingredients textarea, `aria-describedby` linking the textarea to its helper text, and `role="alert"` on error messages so screen readers announce validation failures immediately.

**Performance audit finding:** Lighthouse flagged an "unused JavaScript" opportunity (~30 KiB) in a Next.js framework chunk (`chunks/1wnr2qrjg48_z.js`). This item is marked **"Unscored"** by Lighthouse — meaning it doesn't count against the Performance score — and investigation confirmed it's core Next.js/React runtime code (hydration, routing), not application code. Given the small scope of this app, further micro-optimizing framework-level bundling wasn't a good use of time versus its actual impact. Documented here as a conscious trade-off rather than an unaddressed issue.