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

export const LPDF_URL      = _base + 'browser.js';
export const LPDFWEB_URL   = _base + 'lpdf-web.js';
/** The PDF viewer page: the viewer of the VS Code extension, in an iframe. */
export const VIEWER_URL    = _base + 'viewer/index.html';
/** The examples: index.json, and a folder for each example with its document.xml, document.json and assets. */
export const EXAMPLES_BASE = _base + 'examples/';
