/**
 * demo.ts
 *
 * Live interactive demo component for lpdf.io home page.
 * - Lit 3 LitElement with light DOM (no shadow DOM)
 * - Redux Toolkit for state management
 * - the PDF viewer of the VS Code extension, in an iframe (viewer/index.html), for PDF display
 *
 * Lit, Redux Toolkit, and CodeMirror are bundled by Vite.
 * The lpdf WASM and the viewer are loaded at runtime as external assets
 * co-located with this script in the lpdf-demo/ folder.
 *
 * The examples are the seven in examples/ of the lpdf repository, copied here by its
 * scripts/sync-examples.mjs: examples/index.json lists them, and each has a folder with its
 * document.xml, its document.json if it has data, and the fonts and images it names.
 */

import { LitElement, html, nothing } from 'lit';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { EditorView, lineNumbers } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting, StreamLanguage } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { xml as xmlLang } from '@codemirror/lang-xml';
import { javascript as jsLang } from '@codemirror/lang-javascript';
import { python as pythonLang } from '@codemirror/lang-python';
import { php as phpLang } from '@codemirror/lang-php';
import { csharp } from '@codemirror/legacy-modes/mode/clike';

import {
    LPDF_URL, LPDFWEB_URL,
    VIEWER_URL, EXAMPLES_BASE,
} from './demo/assets';

// ── Mode list ────────────────────────────────────────────────────────────────
const MODES = [
    { id: 'js',     label: 'Node/JS',  icon: 'fa-brands fa-node-js' },
    { id: 'dotnet', label: '.NET/C#',  icon: 'fa-solid fa-hashtag' },
    { id: 'php',    label: 'PHP',      icon: 'fa-brands fa-php' },
    { id: 'python', label: 'Python',   icon: 'fa-brands fa-python' },
    { id: 'xml',    label: 'XML',      icon: 'fa-solid fa-code' },
];
/** The tab that shows document.json, offered only for an example that has data. */
const DATA_MODE = { id: 'json', label: 'JSON data', icon: 'fa-solid fa-database' };

// ── Example list ─────────────────────────────────────────────────────────────
// Read from examples/index.json at boot, so a new example needs no change here.
interface ExampleEntry {
    id: string;
    label: string;
    description: string;
    /** document.xml, relative to examples/. */
    xml: string;
    /** document.json, relative to examples/, or null for a document with no data. */
    data: string | null;
}
let EXAMPLES: ExampleEntry[] = [];

// ── CodeMirror themes & highlight styles ─────────────────────────────────────

const CM_BASE_THEME = EditorView.theme({
    '&':                    { fontSize: '12px', fontFamily: '"Cascadia Code", "Fira Code", "JetBrains Mono", Consolas, monospace', height: '100%' },
    '&.cm-focused':         { outline: 'none' },
    '.cm-scroller':         { overflow: 'auto', lineHeight: '1.7' },
    '.cm-content':          { padding: '14px' },
    '.cm-line':             { padding: '0' },
    '.cm-cursor':           { display: 'none' },
    '.cm-activeLine':       { background: 'transparent' },
    '.cm-gutters':          { border: 'none', paddingRight: '4px', minWidth: '2.8em', userSelect: 'none' },
    '.cm-lineNumbers .cm-gutterElement': { padding: '0 8px 0 4px', minWidth: '2.4em', textAlign: 'right', fontSize: '11px', opacity: '0.5' },
});

const CM_DARK_THEME = EditorView.theme({
    '&':                                                        { background: '#1e1e1e', color: '#d4d4d4' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': { background: '#264f78' },
    '.cm-gutters':                                              { background: '#1e1e1e', color: '#858585' },
}, { dark: true });

const CM_LIGHT_THEME = EditorView.theme({
    '&':                                                        { background: 'var(--bg-elev)', color: 'var(--text)' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': { background: '#add6ff' },
    '.cm-gutters':                                              { background: 'var(--bg-elev)', color: '#aaaaaa' },
});

const DARK_HIGHLIGHT = syntaxHighlighting(HighlightStyle.define([
    { tag: tags.keyword,                         color: '#569cd6' },
    { tag: tags.controlKeyword,                  color: '#c586c0' },
    { tag: tags.definitionKeyword,               color: '#569cd6' },
    { tag: tags.string,                          color: '#ce9178' },
    { tag: tags.number,                          color: '#b5cea8' },
    { tag: tags.bool,                            color: '#569cd6' },
    { tag: tags.null,                            color: '#569cd6' },
    { tag: tags.comment,                         color: '#6a9955', fontStyle: 'italic' },
    { tag: tags.tagName,                         color: '#4ec9b0' },
    { tag: tags.attributeName,                   color: '#9cdcfe' },
    { tag: tags.attributeValue,                  color: '#ce9178' },
    { tag: tags.angleBracket,                    color: '#808080' },
    { tag: tags.operator,                        color: '#d4d4d4' },
    { tag: tags.typeName,                        color: '#4ec9b0' },
    { tag: tags.className,                       color: '#4ec9b0' },
    { tag: tags.function(tags.variableName),     color: '#dcdcaa' },
    { tag: tags.variableName,                    color: '#9cdcfe' },
    { tag: tags.meta,                            color: '#d7ba7d' },
    { tag: tags.namespace,                       color: '#d7ba7d' },
    { tag: tags.processingInstruction,           color: '#d7ba7d' },
    { tag: tags.punctuation,                     color: '#808080' },
]));

const LIGHT_HIGHLIGHT = syntaxHighlighting(HighlightStyle.define([
    { tag: tags.keyword,                         color: '#0000ff' },
    { tag: tags.controlKeyword,                  color: '#af00db' },
    { tag: tags.definitionKeyword,               color: '#0000ff' },
    { tag: tags.string,                          color: '#a31515' },
    { tag: tags.number,                          color: '#098658' },
    { tag: tags.bool,                            color: '#0000ff' },
    { tag: tags.null,                            color: '#0000ff' },
    { tag: tags.comment,                         color: '#008000', fontStyle: 'italic' },
    { tag: tags.tagName,                         color: '#800000' },
    { tag: tags.attributeName,                   color: '#e50000' },
    { tag: tags.attributeValue,                  color: '#0000ff' },
    { tag: tags.angleBracket,                    color: '#555555' },
    { tag: tags.operator,                        color: '#000000' },
    { tag: tags.typeName,                        color: '#267f99' },
    { tag: tags.className,                       color: '#267f99' },
    { tag: tags.function(tags.variableName),     color: '#795e26' },
    { tag: tags.variableName,                    color: '#001080' },
    { tag: tags.meta,                            color: '#0070c1' },
    { tag: tags.namespace,                       color: '#0070c1' },
    { tag: tags.processingInstruction,           color: '#0070c1' },
    { tag: tags.punctuation,                     color: '#555555' },
]));

function langExtForMode(mode: string) {
    switch (mode) {
        case 'xml':    return xmlLang();
        case 'js':     return jsLang();
        case 'json':   return jsLang();
        case 'python': return pythonLang();
        case 'php':    return phpLang({ plain: true });
        case 'dotnet': return StreamLanguage.define(csharp);
        default:       return xmlLang();
    }
}

// ── Module-level non-serializable state ──────────────────────────────────────
// Kept outside Redux because Uint8Array objects are not serialisable.
let lpdfEngine: any      = null;
let currentPdfBytes: any = null;
/** Each font and image registered with the engine, by kind and name, with the address it was loaded from. */
const loadedAssets       = new Map<string, string>();

// ── Redux slices ─────────────────────────────────────────────────────────────

const engineSlice = createSlice({
    name: 'engine',
    initialState: { status: 'loading', error: '' },
    reducers: {
        engineLoaded: state => { state.status = 'ready'; },
        engineFailed: (state, { payload }: { payload: string }) => { state.status = 'error'; state.error = payload; },
    },
});

const editorSlice = createSlice({
    name: 'editor',
    initialState: { selectedId: '' },
    reducers: {
        exampleSelected: (state, { payload }: { payload: string }) => { state.selectedId = payload; },
    },
});

const renderSlice = createSlice({
    name: 'render',
    initialState: { status: 'idle', error: '', byteSize: 0 },
    reducers: {
        renderStarted: state => { state.status = 'rendering'; state.error = ''; },
        renderDone: (state, { payload }: { payload: { byteSize: number } }) => {
            state.status   = 'done';
            state.byteSize = payload.byteSize;
        },
        renderFailed: (state, { payload }: { payload: string }) => { state.status = 'error'; state.error = payload; },
        renderReset:  state => { state.status = 'idle'; state.error = ''; state.byteSize = 0; },
    },
});

const modeSlice = createSlice({
    name: 'mode',
    initialState: { selected: 'xml' },
    reducers: {
        modeSelected: (state, { payload }: { payload: string }) => { state.selected = payload; },
    },
});

const store = configureStore({
    reducer: {
        engine: engineSlice.reducer,
        editor: editorSlice.reducer,
        render: renderSlice.reducer,
        mode:   modeSlice.reducer,
    },
    middleware: gDM => gDM({ serializableCheck: false }),
});

type RootState = ReturnType<typeof store.getState>;

const { engineLoaded, engineFailed }                           = engineSlice.actions;
const { exampleSelected }                                      = editorSlice.actions;
const { renderStarted, renderDone, renderFailed, renderReset } = renderSlice.actions;
const { modeSelected }                                         = modeSlice.actions;

// ── Asset helpers ─────────────────────────────────────────────────────────────

function extractAssetSrcs(xml: string, tag: string) {
    const result = new Map<string, string>();
    const re     = tag === 'font' ? /<font\b[\s\S]*?>/g : /<image\b[\s\S]*?>/g;
    // An <image> or <font> inside a comment is text about the format, not an asset the document uses.
    for (const match of xml.replace(/<!--[\s\S]*?-->/g, '').matchAll(re)) {
        const t    = match[0];
        const name = /\bname=["']([^"']*)["']/.exec(t)?.[1];
        const ref  = /\bref=["']([^"']*)["']/.exec(t)?.[1];
        const src  = /\bsrc=["']([^"']*)["']/.exec(t)?.[1];
        const key  = ref ?? name;
        if (key && src) result.set(key, src);
    }
    return result;
}

/**
 * Registers the fonts and images a document names with the engine. An asset's `src` is relative to
 * the document, as it is on disk, so it is fetched from the folder of the example. Examples reuse
 * names (two of them have a font called `body`), so an asset is loaded again when the address
 * behind its name changes.
 * @param xml The document.
 * @param base The address of the document, which its `src` values are relative to.
 */
async function loadAssetsFromXml(xml: string, base: string) {
    if (!lpdfEngine) return;
    const kinds = [
        { tag: 'font',  register: (key: string, bytes: Uint8Array) => lpdfEngine.loadFont(key, bytes) },
        { tag: 'image', register: (key: string, bytes: Uint8Array) => lpdfEngine.loadImage(key, bytes) },
    ];
    for (const { tag, register } of kinds) {
        for (const [key, src] of extractAssetSrcs(xml, tag)) {
            const url = new URL(src, base).href;
            if (loadedAssets.get(`${tag}:${key}`) === url) continue;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`${src}: ${res.status} ${res.statusText}`);
            register(key, new Uint8Array(await res.arrayBuffer()));
            loadedAssets.set(`${tag}:${key}`, url);
        }
    }
}

/** A string of bytes as base64, which is how the viewer is sent a PDF. */
function bytesToBase64(bytes: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return btoa(binary);
}

/** The bytes of a base64 string. */
function base64ToBytes(text: string): Uint8Array {
    const binary = atob(text);
    const bytes  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

// ── Lit component ─────────────────────────────────────────────────────────────

class LpdfDemo extends LitElement {

    // Light DOM: Lit renders directly into the element, external CSS applies.
    createRenderRoot() { return this; }

    static properties = {
        _s: { state: true },
    };

    _s: RootState;
    _unsub: (() => void) | null        = null;
    _debounce: ReturnType<typeof setTimeout> | null = null;
    _currentXml: string                = '';
    /** The address of the document being shown: its fonts and images are relative to it. */
    _currentBase: string               = '';
    /** The document's data, parsed, and as the file has it for the data tab. */
    _currentData: unknown              = null;
    _currentDataText: string           = '';
    _viewerReady: boolean              = false;
    _pendingViewerMessage: { type: string; [key: string]: unknown } | null = null;
    _pendingText: string | null        = null;
    _pendingLang: string | null        = null;
    _cmView: EditorView | null         = null;
    _langComp: Compartment             = new Compartment();
    _themeComp: Compartment            = new Compartment();
    _themeObs: MutationObserver | null = null;

    constructor() {
        super();
        this._s = store.getState();
    }

    connectedCallback() {
        super.connectedCallback();
        this._unsub = store.subscribe(() => {
            this._s = { ...store.getState() };
        });
        window.addEventListener('message', this._onViewerMessage);
        this._boot();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._unsub?.();
        window.removeEventListener('message', this._onViewerMessage);
        if (this._debounce) clearTimeout(this._debounce);
        this._themeObs?.disconnect();
        this._cmView?.destroy();
        this._cmView = null;
    }

    updated() {
        const wrap = this.querySelector('.lpdf-cm-wrap');
        if (wrap && !this._cmView) {
            this._initCm(wrap as HTMLElement);
        }
        if (this._pendingText !== null) {
            this._setCmContent(this._pendingText, this._pendingLang ?? 'xml');
            this._pendingText = null;
            this._pendingLang = null;
        }
    }

    // ── CodeMirror setup ──────────────────────────────────────────────────────

    _isDark() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    _initCm(container: HTMLElement) {
        const dark = this._isDark();
        this._cmView = new EditorView({
            state: EditorState.create({
                doc: '',
                extensions: [
                    EditorView.editable.of(false),
                    lineNumbers(),
                    this._langComp.of(xmlLang()),
                    this._themeComp.of([dark ? CM_DARK_THEME : CM_LIGHT_THEME, dark ? DARK_HIGHLIGHT : LIGHT_HIGHLIGHT]),
                    CM_BASE_THEME,
                ],
            }),
            parent: container,
        });
        this._themeObs = new MutationObserver(() => {
            const d = this._isDark();
            this._cmView?.dispatch({
                effects: this._themeComp.reconfigure([d ? CM_DARK_THEME : CM_LIGHT_THEME, d ? DARK_HIGHLIGHT : LIGHT_HIGHLIGHT]),
            });
        });
        this._themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    _setCmContent(text: string, lang: string) {
        if (!this._cmView) {
            this._pendingText = text;
            this._pendingLang = lang;
            return;
        }
        this._cmView.dispatch({
            changes: { from: 0, to: this._cmView.state.doc.length, insert: text },
            effects: this._langComp.reconfigure(langExtForMode(lang)),
        });
    }

    // ── Boot ─────────────────────────────────────────────────────────────────

    async _boot() {
        try {
            const { initLpdf }                          = await import(/* @vite-ignore */ LPDF_URL);
            const { default: initLpdfWeb, codegen_wasm } = await import(/* @vite-ignore */ LPDFWEB_URL);

            lpdfEngine = await initLpdf();
            await initLpdfWeb();

            // Store codegen on the instance so _generateCode can use it.
            (this as any)._codegen = codegen_wasm;

            const index = await fetch(new URL('index.json', EXAMPLES_BASE));
            if (!index.ok) throw new Error(`examples/index.json: ${index.status} ${index.statusText}`);
            EXAMPLES = (await index.json()).examples as ExampleEntry[];
            if (EXAMPLES.length === 0) throw new Error('examples/index.json lists no examples');

            store.dispatch(engineLoaded());
            // ?example=invoice opens that example, which is how the docs link to one.
            const asked = new URLSearchParams(location.search).get('example');
            await this._loadExample(EXAMPLES.find(example => example.id === asked)?.id ?? EXAMPLES[0].id);
            this._scheduleRender();
        } catch (err: any) {
            store.dispatch(engineFailed(err.message));
        }
    }

    // ── Example loading ───────────────────────────────────────────────────────

    async _loadExample(id: string) {
        const example = EXAMPLES.find(candidate => candidate.id === id);
        if (!example) throw new Error(`There is no example ${id}`);
        store.dispatch(exampleSelected(id));

        const xmlUrl = new URL(example.xml, EXAMPLES_BASE).href;
        const res    = await fetch(xmlUrl);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const xml    = await res.text();

        // The data is parsed here, so a bad file fails now and not in the engine.
        let data: unknown = null;
        let dataText      = '';
        if (example.data) {
            const dataRes = await fetch(new URL(example.data, EXAMPLES_BASE));
            if (!dataRes.ok) throw new Error(`${example.data}: ${dataRes.status} ${dataRes.statusText}`);
            dataText = await dataRes.text();
            data     = JSON.parse(dataText);
        }

        this._currentXml     = xml;
        this._currentBase    = xmlUrl;
        this._currentData    = data;
        this._currentDataText = dataText;

        // A tab for the data is offered only when the example has some; without it, show the XML.
        let { mode } = store.getState();
        if (mode.selected === DATA_MODE.id && !example.data) {
            store.dispatch(modeSelected('xml'));
            mode = store.getState().mode;
        }
        this._pendingText = this._textForMode(mode.selected);
        this._pendingLang = mode.selected;

        // Keep the address shareable: the page opens on this example when it is loaded again.
        const url = new URL(location.href);
        url.searchParams.set('example', id);
        history.replaceState(null, '', url);
        return xml;
    }

    // ── Render scheduling ─────────────────────────────────────────────────────

    _scheduleRender() {
        if (this._debounce) clearTimeout(this._debounce);
        this._debounce = setTimeout(() => this._doRender(), 600);
    }

    async _doRender() {
        if (!lpdfEngine || !this._currentXml.trim()) return;
        store.dispatch(renderStarted());
        this._postToViewer({ type: 'showLoading' });
        try {
            await loadAssetsFromXml(this._currentXml, this._currentBase);
            const bytes = await lpdfEngine.render(this._currentXml, this._currentData != null ? { data: this._currentData } : {});
            currentPdfBytes = bytes.slice();
            store.dispatch(renderDone({ byteSize: currentPdfBytes.length }));
            // A document that has not been shown before starts at the top, fitted to the width.
            this._postToViewer({ type: 'updatePdf', pdfBase64: bytesToBase64(currentPdfBytes), filename: 'document.pdf', zoom: 'fit' });
        } catch (err: any) {
            store.dispatch(renderFailed(err.message));
            this._postToViewer({ type: 'showError', message: err.message });
        }
    }

    // ── The viewer ────────────────────────────────────────────────────────────
    // The viewer is the page the VS Code extension shows PDFs in (viewer/index.html). It takes the
    // same messages: it says `ready` when it can receive, and is sent `updatePdf` with the PDF.

    _viewerFrame(): HTMLIFrameElement | null {
        return this.querySelector('.lpdf-viewer-frame');
    }

    /** Sends a message to the viewer, now if it is ready, else when it says it is. Only the last PDF waits. */
    _postToViewer(message: { type: string; [key: string]: unknown }) {
        if (this._viewerReady) {
            this._viewerFrame()?.contentWindow?.postMessage(message, location.origin);
        } else if (message.type === 'updatePdf' || message.type === 'showError') {
            this._pendingViewerMessage = message;
        }
    }

    _onViewerMessage = (event: MessageEvent) => {
        const frame = this._viewerFrame();
        if (!frame || event.source !== frame.contentWindow || event.origin !== location.origin) return;
        const message = event.data;
        if (message?.type === 'ready') {
            this._viewerReady = true;
            if (this._pendingViewerMessage) {
                const pending = this._pendingViewerMessage;
                this._pendingViewerMessage = null;
                this._postToViewer(pending);
            }
        } else if (message?.type === 'download' && typeof message.pdfBase64 === 'string') {
            // The viewer's own Save button: the PDF as shown, with anything typed into its form fields.
            this._saveBytes(base64ToBytes(message.pdfBase64), message.filename || 'document.pdf');
        }
    };

    // ── Codegen ───────────────────────────────────────────────────────────────

    _generateCode(xml: string, target: string) {
        try {
            return (this as any)._codegen(xml, JSON.stringify({ target, indent: 4 }));
        } catch (e: any) {
            return `// codegen error: ${e.message}`;
        }
    }

    /** What the editor shows for a tab: the XML, the data, or the code that builds the document. */
    _textForMode(mode: string) {
        if (mode === 'xml')            return this._currentXml;
        if (mode === DATA_MODE.id)     return this._currentDataText;
        return this._generateCode(this._currentXml, mode);
    }

    // ── Event handlers ────────────────────────────────────────────────────────

    _onModeChange(mode: string) {
        store.dispatch(modeSelected(mode));
        this._setCmContent(this._textForMode(mode), mode);
    }

    async _onExampleChange(e: Event) {
        const id = (e.target as HTMLSelectElement).value;
        store.dispatch(renderReset());
        currentPdfBytes = null;
        try {
            await this._loadExample(id);
        } catch (err: any) {
            store.dispatch(renderFailed(`Failed to load: ${err.message}`));
            return;
        }
        this._scheduleRender();
    }

    _saveBytes(bytes: Uint8Array, filename: string) {
        const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // ── Engine status indicator ───────────────────────────────────────────────

    _renderEngineStatus() {
        const { engine, render } = this._s;
        if (engine.status === 'loading')
            return html`<span class="lpdf-spinner"></span><span class="lpdf-engine-label"></span>`;
        if (engine.status === 'error')
            return html`<span class="lpdf-engine-dot lpdf-dot-error"></span><span class="lpdf-engine-label"></span>`;
        if (render.status === 'rendering')
            return html`<span class="lpdf-spinner"></span><span class="lpdf-engine-label"></span>`;
        return html`<span class="lpdf-engine-dot lpdf-dot-ok"></span><span class="lpdf-engine-label"></span>`;
    }

    // ── Render ────────────────────────────────────────────────────────────────

    render() {
        const { engine, editor, mode } = this._s;
        const engineReady   = engine.status === 'ready';
        const example       = EXAMPLES.find(candidate => candidate.id === editor.selectedId);
        // The data tab is there only for an example that has data.
        const modes         = example?.data ? [...MODES, DATA_MODE] : MODES;

        return html`
            <div class="lpdf-shell">

                <!-- ── Toolbar ── -->
                <div class="lpdf-toolbar">
                    <div class="lpdf-toolbar-wing">
                        <div class="lpdf-status">${this._renderEngineStatus()}</div>
                    </div>
                    <div class="lpdf-toolbar-center">
                        <span class="lpdf-demo-label"></span>
                        <select id="lpdf-select"
                                class="lpdf-select"
                                ?disabled=${!engineReady}
                                @change=${this._onExampleChange}>
                            ${EXAMPLES.map(ex => html`
                                <option value=${ex.id}
                                        ?selected=${editor.selectedId === ex.id}>
                                    Example - ${ex.label}
                                </option>
                            `)}
                        </select>
                    </div>
                    <div class="lpdf-toolbar-wing">
                    </div>
                </div>

                <!-- ── Panes ── -->
                <div class="lpdf-panes">

                    <!-- Left: editor pane -->
                    <div class="lpdf-editor-pane">
                        <div class="lpdf-editor-header">
                            <div class="lpdf-mode-cluster">
                                ${modes.map(m => html`
                                    <button class="lpdf-mode-btn"
                                            aria-pressed=${mode.selected === m.id}
                                            ?disabled=${!engineReady}
                                            @click=${() => this._onModeChange(m.id)}>
                                        ${m.label}
                                    </button>
                                `)}
                            </div>
                        </div>
                        <div class="lpdf-cm-wrap" aria-label="lpdf source"></div>
                    </div>

                    <!-- Right: PDF preview, in the viewer of the VS Code extension -->
                    <div class="lpdf-preview-pane">
                        <div class="lpdf-preview-inner">
                            <iframe class="lpdf-viewer-frame"
                                    title="PDF preview"
                                    src=${VIEWER_URL}
                                    loading="lazy"></iframe>
                            ${engine.status === 'error' ? html`
                                <div class="lpdf-placeholder lpdf-placeholder--error">
                                    <span>${engine.error}</span>
                                </div>
                            ` : nothing}
                        </div>
                    </div>

                </div>

            </div>
        `;
    }
}

customElements.define('lpdf-demo', LpdfDemo);
