// Stands in, for the viewer page of the demo on lpdf.io, for what VS Code gives a webview. Written by
// scripts/build-demo-viewer.mjs of the lpdf repository; do not edit it here.
//
// lpdf-host.mjs talks to the extension host through acquireVsCodeApi(). Here the page is in an iframe of the
// demo, so its messages go to the page that holds it, which answers with the same ones the extension host sends.
//
// The page can also show a PDF by itself: index.html?pdf=/docs/examples/invoice/document.pdf fetches that file, from this
// site only, and shows it when the viewer is ready, and its Save button saves it. The docs use this for their examples.
(function () {
    var parentWindow = window.parent;
    var pdfPath = new URLSearchParams(location.search).get('pdf');
    // A path on this site, and not an address that another one could be reached by.
    var standalone = pdfPath && pdfPath.charAt(0) === '/' && pdfPath.charAt(1) !== '/' && pdfPath.indexOf('\\') < 0 ? pdfPath : null;

    function toBase64(bytes) {
        var binary = '';
        for (var i = 0; i < bytes.length; i += 0x8000) { binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); }
        return btoa(binary);
    }
    function showStandalonePdf() {
        fetch(standalone).then(function (response) {
            if (!response.ok) { throw new Error(response.status + ' ' + response.statusText); }
            return response.arrayBuffer();
        }).then(function (buffer) {
            window.postMessage({ type: 'updatePdf', pdfBase64: toBase64(new Uint8Array(buffer)), filename: standalone.split('/').pop(), zoom: 'fit' }, location.origin);
        }).catch(function (error) {
            window.postMessage({ type: 'showError', message: 'Could not load ' + standalone + ': ' + error.message }, location.origin);
        });
    }
    function saveStandalonePdf(message) {
        var binary = atob(message.pdfBase64), bytes = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) { bytes[i] = binary.charCodeAt(i); }
        var link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
        link.download = message.filename || 'document.pdf';
        link.click();
        URL.revokeObjectURL(link.href);
    }

    window.acquireVsCodeApi = function () {
        return {
            postMessage: function (message) {
                if (standalone && message && message.type === 'ready') { showStandalonePdf(); }
                else if (standalone && message && message.type === 'download') { saveStandalonePdf(message); }
                parentWindow.postMessage(message, location.origin);
            },
            getState: function () { return undefined; },
            setState: function () {},
        };
    };

    // VS Code puts vscode-light or vscode-dark on the body, and lpdf-host.mjs reads it to pick the viewer's colours.
    // Here the demo's own theme, the data-theme of its <html>, says which.
    function demoIsDark() {
        try { return parentWindow.document.documentElement.getAttribute('data-theme') === 'dark'; } catch (e) { return false; }
    }
    function applyTheme() {
        var dark = demoIsDark();
        document.body.classList.toggle('vscode-dark', dark);
        document.body.classList.toggle('vscode-light', !dark);
    }
    document.addEventListener('DOMContentLoaded', function () {
        applyTheme();
        try {
            new MutationObserver(applyTheme).observe(parentWindow.document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        } catch (e) { /* a parent from another origin cannot be watched; the theme stays as it was */ }
    });
})();
