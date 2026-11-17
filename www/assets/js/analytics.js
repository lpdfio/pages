// Counts visits with OpenPanel. The pages of lpdf.io and its docs load this one file, with the OpenPanel client id in
// data-client-id of the tag. Plain JS, served as it is: the static pages have no build step.
//
// It is a classic script, so its names are wrapped in a function and stay out of the page's global scope.

(function countVisits()
{
    // The one host that is counted. The same files go to the pre site and to prod, and lpdf.local serves them too, so
    // the check is made here, in the browser, and nothing is loaded or sent anywhere else. The prerender loads each
    // page as lpdf.io but answers a request to any other host with nothing (docs-site/scripts/prerender-pages.mjs), so
    // a build counts no visit.
    const COUNTED_HOST = 'lpdf.io';

    const OPENPANEL_SCRIPT_URL = 'https://openpanel.dev/op1.js';

    /**
     * Defines window.op as OpenPanel's install page does: a queue that holds the calls made before op1.js has
     * loaded, which op1.js then runs.
     */
    function defineQueue()
    {
        if (window.op) return;

        const queue = [];
        window.op = new Proxy(
            function (...args)
            {
                if (args.length) queue.push(args);
            },
            {
                get: (target, name) => name === 'q' ? queue : (...args) =>
                {
                    queue.push([name, ...args]);
                },
                has: (target, name) => name === 'q',
            });
    }

    /**
     * Starts OpenPanel, counting page views and clicks on links that leave the site.
     *
     * @param clientId The id of the OpenPanel project, which is public by design: it is in the page of every site
     *                 that uses OpenPanel.
     */
    function startOpenPanel(clientId)
    {
        defineQueue();
        window.op('init', {
            clientId,
            trackScreenViews: true,
            trackOutgoingLinks: true,
        });

        const script = document.createElement('script');
        script.src = OPENPANEL_SCRIPT_URL;
        script.async = true;
        document.head.append(script);
    }

    const clientId = document.currentScript?.dataset.clientId;
    if (clientId && location.hostname === COUNTED_HOST)
    {
        startOpenPanel(clientId);
    }
})();
