import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

/**
 * A guide has a page for each SDK but one entry in the sidebar, which links to one of them. Starlight marks an entry as
 * the current one only on the page it links to, so on the Python page the guide would show as no entry at all. A page
 * and its guide share a folder (`factur-x-zugferd/python`), so the entry that links into that folder is the current one.
 */
export const onRequest = defineRouteMiddleware((context) =>
{
    const { starlightRoute } = context.locals;
    const guide = starlightRoute.id.split('/')[0];

    for (const entry of starlightRoute.sidebar)
    {
        if (entry.type === 'link' && entry.href.split('/').includes(guide)) entry.isCurrent = true;
    }
});
