import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

/**
 * The guides have no sidebar. A reader comes to a guide by a link, from a post or from the docs, and the switch under the
 * title goes to the same guide in another SDK; the guides' index is behind the name in the header. With a few guides the
 * sidebar would be a list of pages one click from the one open. A site with many guides would want it back: delete this
 * file, its `routeMiddleware` line in astro.config.mjs, and give `sidebar` its entries.
 */
export const onRequest = defineRouteMiddleware((context) =>
{
    context.locals.starlightRoute.hasSidebar = false;
});
