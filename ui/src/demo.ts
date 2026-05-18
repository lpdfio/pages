/**
 * demo.ts
 *
 * Live interactive demo component for lpdf.io home page.
 * - Lit 3 LitElement with light DOM (no shadow DOM)
 * - Redux Toolkit for state management
 * - pdfjs-dist for PDF rendering
 *
 * Lit, Redux Toolkit, and CodeMirror are bundled by Vite.
 * pdfjs and lpdf WASM are loaded at runtime as external assets
 * co-located with this script in the lpdf-demo/ folder.
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
    PDFJS_URL, PDFJS_WORKER,
    LPDF_URL, LPDFWEB_URL,
    ASSETS_BASE, EXAMPLES_BASE,
} from './demo/assets';

// ── Zoom presets ─────────────────────────────────────────────────────────────
const ZOOM_PRESETS = [
    { value: 'fit',  label: 'Fill'  },
    { value: '0.25', label: '25%'  },
    { value: '0.5',  label: '50%'  },
    { value: '0.75', label: '75%'  },
    { value: '1.25', label: '125%' },
    { value: '1.5',  label: '150%' },
    { value: '2',    label: '200%' },
    { value: '3',    label: '300%' },
    { value: '4',    label: '400%' },
];
const ZOOM_PRESET_VALS = new Set(ZOOM_PRESETS.filter(p => p.value !== 'fit').map(p => p.value));

// ── Mode list ────────────────────────────────────────────────────────────────
const MODES = [
    { id: 'js',     label: 'Node/JS',  icon: 'fa-brands fa-node-js' },
    { id: 'dotnet', label: '.NET/C#',  icon: 'fa-solid fa-hashtag' },
    { id: 'php',    label: 'PHP',      icon: 'fa-brands fa-php' },
    { id: 'python', label: 'Python',   icon: 'fa-brands fa-python' },
    { id: 'xml',    label: 'XML',      icon: 'fa-solid fa-code' },
];

// ── Curated example list ─────────────────────────────────────────────────────
const EXAMPLES = [
    { label: 'Invoice',          file: 'example3.xml' },
    { label: 'Résumé / CV',      file: 'example2.xml' },
    { label: 'Certificate',      file: 'example4.xml' },
    { label: 'Contract',         file: 'example-contract.xml' },
    { label: 'Shipping label',   file: 'example7.xml' },
    { label: 'Table showcase',   file: 'showcase-table.xml' },
    { label: 'Barcode showcase', file: 'showcase-barcode.xml' },
    { label: 'Grid showcase',    file: 'showcase-grid.xml' },
];

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
        case 'python': return pythonLang();
        case 'php':    return phpLang({ plain: true });
        case 'dotnet': return StreamLanguage.define(csharp);
        default:       return xmlLang();
    }
}

// ── Module-level non-serializable state ──────────────────────────────────────
// Kept outside Redux because Uint8Array / pdfjs objects are not serialisable.
let lpdfEngine: any      = null;
let currentPdfDoc: any   = null;
let currentPdfBytes: any = null;
const loadedAssets       = new Set<string>();

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
    initialState: { selectedFile: EXAMPLES[0].file },
    reducers: {
        fileSelected: (state, { payload }: { payload: string }) => { state.selectedFile = payload; },
    },
});

const renderSlice = createSlice({
    name: 'render',
    initialState: { status: 'idle', error: '', pageCount: 0, byteSize: 0 },
    reducers: {
        renderStarted: state => { state.status = 'rendering'; state.error = ''; },
        renderDone: (state, { payload }: { payload: { pageCount: number; byteSize: number } }) => {
            state.status    = 'done';
            state.pageCount = payload.pageCount;
            state.byteSize  = payload.byteSize;
        },
        renderFailed: (state, { payload }: { payload: string }) => { state.status = 'error'; state.error = payload; },
        renderReset:  state => { state.status = 'idle'; state.error = ''; state.pageCount = 0; state.byteSize = 0; },
    },
});

const viewerSlice = createSlice({
    name: 'viewer',
    initialState: { zoomFactor: 1.0 },
    reducers: {
        zoomIn:    state => { state.zoomFactor = Math.min(4.0,  +(state.zoomFactor * 1.25).toFixed(4)); },
        zoomOut:   state => { state.zoomFactor = Math.max(0.25, +(state.zoomFactor / 1.25).toFixed(4)); },
        zoomReset: state => { state.zoomFactor = 1.0; },
        zoomSet:   (state, { payload }: { payload: number }) => { state.zoomFactor = Math.min(4.0, Math.max(0.25, payload)); },
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
        viewer: viewerSlice.reducer,
        mode:   modeSlice.reducer,
    },
    middleware: gDM => gDM({ serializableCheck: false }),
});

type RootState = ReturnType<typeof store.getState>;

const { engineLoaded, engineFailed }                           = engineSlice.actions;
const { fileSelected }                                         = editorSlice.actions;
const { renderStarted, renderDone, renderFailed, renderReset } = renderSlice.actions;
const { zoomIn, zoomOut, zoomReset, zoomSet }                  = viewerSlice.actions;
const { modeSelected }                                         = modeSlice.actions;

// ── Asset helpers ─────────────────────────────────────────────────────────────

function extractAssetSrcs(xml: string, tag: string) {
    const result = new Map<string, string>();
    const re     = tag === 'font' ? /<font\b[\s\S]*?>/g : /<image\b[\s\S]*?>/g;
    for (const match of xml.matchAll(re)) {
        const t    = match[0];
        const name = /\bname=["']([^"']*)["']/.exec(t)?.[1];
        const ref  = /\bref=["']([^"']*)["']/.exec(t)?.[1];
        const src  = /\bsrc=["']([^"']*)["']/.exec(t)?.[1];
        const key  = ref ?? name;
        if (key && src) result.set(key, src);
    }
    return result;
}

async function loadAssetsFromXml(xml: string) {
    if (!lpdfEngine) return;
    for (const [key, src] of extractAssetSrcs(xml, 'font')) {
        if (loadedAssets.has(`font:${key}`)) continue;
        try {
            const res = await fetch(new URL(src, ASSETS_BASE));
            if (res.ok) {
                lpdfEngine.loadFont(key, new Uint8Array(await res.arrayBuffer()));
                loadedAssets.add(`font:${key}`);
            }
        } catch { /* ignore unfetchable assets */ }
    }
    for (const [key, src] of extractAssetSrcs(xml, 'image')) {
        if (loadedAssets.has(`image:${key}`)) continue;
        try {
            const res = await fetch(new URL(src, ASSETS_BASE));
            if (res.ok) {
                lpdfEngine.loadImage(key, new Uint8Array(await res.arrayBuffer()));
                loadedAssets.add(`image:${key}`);
            }
        } catch { /* ignore unfetchable assets */ }
    }
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
        this._boot();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._unsub?.();
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
            const pdfjsLib                               = await import(/* @vite-ignore */ PDFJS_URL);
            pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;

            lpdfEngine = await initLpdf();
            await initLpdfWeb();

            // Store codegen on the instance so _generateCode can use it.
            (this as any)._codegen = codegen_wasm;

            store.dispatch(engineLoaded());
            await this._loadExample(EXAMPLES[0].file);
            this._scheduleRender();
        } catch (err: any) {
            store.dispatch(engineFailed(err.message));
        }
    }

    // ── Example loading ───────────────────────────────────────────────────────

    async _loadExample(file: string) {
        store.dispatch(fileSelected(file));
        const url = new URL(file, EXAMPLES_BASE).href;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const xml         = await res.text();
        this._currentXml  = xml;
        const { mode }    = store.getState();
        const text        = mode.selected === 'xml'
            ? xml
            : this._generateCode(xml, mode.selected);
        this._pendingText = text;
        this._pendingLang = mode.selected;
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
        const pdfjsLib = await import(/* @vite-ignore */ PDFJS_URL);
        try {
            await loadAssetsFromXml(this._currentXml);
            const bytes      = await lpdfEngine.render(this._currentXml);
            currentPdfBytes  = bytes.slice();
            currentPdfDoc    = await pdfjsLib.getDocument({ data: bytes }).promise;
            store.dispatch(renderDone({
                pageCount: currentPdfDoc.numPages,
                byteSize:  currentPdfBytes.length,
            }));
            store.dispatch(zoomReset());
            await this._drawPages();
        } catch (err: any) {
            store.dispatch(renderFailed(err.message));
        }
    }

    // ── Page rendering ────────────────────────────────────────────────────────

    _getFitScale(page: any) {
        const el = this.querySelector('.lpdf-preview-pages');
        if (!el) return 1;
        const vp = page.getViewport({ scale: 1 });
        const W  = (el as HTMLElement).clientWidth - 48;
        return W / vp.width;
    }

    async _drawPages() {
        if (!currentPdfDoc) return;
        const container = this.querySelector('.lpdf-preview-pages');
        if (!container) return;
        (container as HTMLElement).innerHTML = '';

        const { zoomFactor } = store.getState().viewer;
        const firstPage = await currentPdfDoc.getPage(1);
        const fitScale  = this._getFitScale(firstPage);
        const scale     = fitScale * zoomFactor;

        for (let p = 1; p <= currentPdfDoc.numPages; p++) {
            const page     = p === 1 ? firstPage : await currentPdfDoc.getPage(p);
            const viewport = page.getViewport({ scale });
            const canvas   = document.createElement('canvas');
            canvas.width   = viewport.width;
            canvas.height  = viewport.height;
            container.appendChild(canvas);
            await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        }
    }

    // ── Codegen ───────────────────────────────────────────────────────────────

    _generateCode(xml: string, target: string) {
        try {
            return (this as any)._codegen(xml, JSON.stringify({ target, indent: 4 }));
        } catch (e: any) {
            return `// codegen error: ${e.message}`;
        }
    }

    // ── Event handlers ────────────────────────────────────────────────────────

    _onModeChange(mode: string) {
        store.dispatch(modeSelected(mode));
        const text = mode === 'xml'
            ? this._currentXml
            : this._generateCode(this._currentXml, mode);
        this._setCmContent(text, mode);
    }

    async _onExampleChange(e: Event) {
        const file = (e.target as HTMLSelectElement).value;
        store.dispatch(renderReset());
        currentPdfDoc   = null;
        currentPdfBytes = null;
        const pages = this.querySelector('.lpdf-preview-pages');
        if (pages) (pages as HTMLElement).innerHTML = '';
        try {
            await this._loadExample(file);
        } catch (err: any) {
            store.dispatch(renderFailed(`Failed to load: ${err.message}`));
            return;
        }
        this._scheduleRender();
    }

    _onZoomIn()    { store.dispatch(zoomIn());    this._drawPages(); }
    _onZoomOut()   { store.dispatch(zoomOut());   this._drawPages(); }
    _onZoomReset() { store.dispatch(zoomReset()); this._drawPages(); }

    _onZoomSelect(e: Event) {
        const v = (e.target as HTMLSelectElement).value;
        if (v === 'fit') {
            store.dispatch(zoomReset());
        } else {
            store.dispatch(zoomSet(parseFloat(v)));
        }
        this._drawPages();
    }

    _onDownload() {
        if (!currentPdfBytes) return;
        const blob = new Blob([currentPdfBytes], { type: 'application/pdf' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = 'document.pdf';
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
        const { engine, editor, render, viewer, mode } = this._s;
        const engineReady   = engine.status === 'ready';
        const hasPdf        = render.status === 'done';
        const zoomPct       = Math.round(viewer.zoomFactor * 100);
        const isFit         = viewer.zoomFactor === 1.0;
        const zoomSelectVal = isFit ? 'fit' : String(viewer.zoomFactor);
        const isPreset      = isFit || ZOOM_PRESET_VALS.has(zoomSelectVal);

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
                                <option value=${ex.file}
                                        ?selected=${editor.selectedFile === ex.file}>
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
                                ${MODES.map(m => html`
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

                    <!-- Right: PDF preview -->
                    <div class="lpdf-preview-pane">
                        <div class="lpdf-preview-toolbar">
                            <div class="lpdf-preview-wing"></div>
                            <div class="lpdf-zoom-cluster">
                                <button class="lpdf-zoom-btn"
                                        title="Zoom out"
                                        ?disabled=${!hasPdf || viewer.zoomFactor <= 0.25}
                                        @click=${this._onZoomOut}>−</button>
                                <select class="lpdf-zoom-select"
                                        .value=${isPreset ? zoomSelectVal : ''}
                                        ?disabled=${!hasPdf}
                                        @change=${this._onZoomSelect}>
                                    ${!isPreset ? html`<option value="" disabled hidden>${zoomPct}%</option>` : nothing}
                                    ${ZOOM_PRESETS.map(p => html`<option value=${p.value}>${p.label}</option>`)}
                                </select>
                                <button class="lpdf-zoom-btn"
                                        title="Zoom in"
                                        ?disabled=${!hasPdf || viewer.zoomFactor >= 4.0}
                                        @click=${this._onZoomIn}>+</button>
                            </div>
                            <div class="lpdf-preview-wing lpdf-preview-wing--end">
                                ${hasPdf ? html`<span class="lpdf-page-count">${render.pageCount} page${render.pageCount !== 1 ? 's' : ''}</span>` : nothing}
                                ${hasPdf ? html`<span class="lpdf-pdf-size">${(render.byteSize / 1024).toFixed(1)} KB</span>` : nothing}
                                ${hasPdf ? html`<span class="lpdf-preview-sep" aria-hidden="true"></span>` : nothing}
                                ${hasPdf ? html`<button class="lpdf-download-link" @click=${this._onDownload}>↓ Download</button>` : nothing}
                            </div>
                        </div>
                        <div class="lpdf-preview-inner">
                            ${!hasPdf && render.status !== 'rendering' ? html`
                                <div class="lpdf-placeholder">
                                    <span class="lpdf-placeholder-icon">⬚</span>
                                    <span>PDF preview will appear here</span>
                                </div>
                            ` : nothing}
                            <div class="lpdf-preview-pages"></div>
                        </div>
                    </div>

                </div>

            </div>
        `;
    }
}

customElements.define('lpdf-demo', LpdfDemo);
