/**
 * Single source of truth for all external asset URLs used by the lpdf-demo
 * component. All paths are resolved relative to this script at runtime using
 * import.meta.url so the demo works on any origin without configuration.
 *
 * NOTE: We compute _base via string manipulation rather than
 *   new URL('./file', import.meta.url)
 * to avoid Vite's static-asset transform, which would try to locate each file
 * in the source tree at build time (they live in src/portal/demo/, not here).
 */

const _base = import.meta.url.replace(/\/[^/]*$/, '/');

export const PDFJS_URL     = _base + 'pdf.min.mjs';
export const PDFJS_WORKER  = _base + 'pdf.worker.min.mjs';
export const LPDF_URL      = _base + 'browser.js';
export const LPDFWEB_URL   = _base + 'lpdf-web.js';
export const ASSETS_BASE   = _base + 'assets/';
export const EXAMPLES_BASE = _base + 'examples/';
