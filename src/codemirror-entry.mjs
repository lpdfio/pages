// Re-exports the CodeMirror 6 symbols needed by lpdf-demo.js.
// Bundled by build-codemirror.mjs → pages/assets/js/codemirror.min.js

export { EditorView, lineNumbers }             from '@codemirror/view';
export { EditorState, Compartment }            from '@codemirror/state';
export { HighlightStyle, syntaxHighlighting, StreamLanguage } from '@codemirror/language';
export { tags }                                from '@lezer/highlight';
export { xml }                                 from '@codemirror/lang-xml';
export { javascript }                          from '@codemirror/lang-javascript';
export { python }                              from '@codemirror/lang-python';
export { php }                                 from '@codemirror/lang-php';
export { csharp }                              from '@codemirror/legacy-modes/mode/clike';
