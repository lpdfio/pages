import{LitElement as U,html as r,nothing as f}from"./lit.min.js";import{configureStore as X,createSlice as b}from"./redux-toolkit.min.js";import*as $ from"./pdfjs/pdf.min.mjs";import{initLpdf as Z}from"./lpdf/browser.js";import j,{codegen_wasm as G}from"./lpdf/lpdf-web.js";import{EditorView as w,EditorState as K,Compartment as E,HighlightStyle as L,syntaxHighlighting as z,StreamLanguage as W,tags as a,lineNumbers as q,xml as S,javascript as J,python as Q,php as Y,csharp as ee}from"./codemirror.min.js";$.GlobalWorkerOptions.workerSrc=new URL("./pdfjs/pdf.worker.min.mjs",import.meta.url).href;const te=new URL("/demo/examples/",import.meta.url).href,F=new URL("/demo/assets/",import.meta.url).href,R=[{value:"fit",label:"Fill"},{value:"0.25",label:"25%"},{value:"0.5",label:"50%"},{value:"0.75",label:"75%"},{value:"1.25",label:"125%"},{value:"1.5",label:"150%"},{value:"2",label:"200%"},{value:"3",label:"300%"},{value:"4",label:"400%"}],ae=new Set(R.filter(t=>t.value!=="fit").map(t=>t.value)),oe=[{id:"js",label:"Node/JS",icon:"fa-brands fa-node-js"},{id:"dotnet",label:".NET/C#",icon:"fa-solid fa-hashtag"},{id:"php",label:"PHP",icon:"fa-brands fa-php"},{id:"python",label:"Python",icon:"fa-brands fa-python"},{id:"xml",label:"XML",icon:"fa-solid fa-code"}],x=[{label:"Invoice",file:"example3.xml"},{label:"R\xE9sum\xE9 / CV",file:"example2.xml"},{label:"Certificate",file:"example4.xml"},{label:"Contract",file:"example-contract.xml"},{label:"Shipping label",file:"example7.xml"},{label:"Table showcase",file:"showcase-table.xml"},{label:"Barcode showcase",file:"showcase-barcode.xml"},{label:"Grid showcase",file:"showcase-grid.xml"}],ne=w.theme({"&":{fontSize:"12px",fontFamily:'"Cascadia Code", "Fira Code", "JetBrains Mono", Consolas, monospace',height:"100%"},"&.cm-focused":{outline:"none"},".cm-scroller":{overflow:"auto",lineHeight:"1.7"},".cm-content":{padding:"14px"},".cm-line":{padding:"0"},".cm-cursor":{display:"none"},".cm-activeLine":{background:"transparent"},".cm-gutters":{border:"none",paddingRight:"4px",minWidth:"2.8em",userSelect:"none"},".cm-lineNumbers .cm-gutterElement":{padding:"0 8px 0 4px",minWidth:"2.4em",textAlign:"right",fontSize:"11px",opacity:"0.5"}}),P=w.theme({"&":{background:"#1e1e1e",color:"#d4d4d4"},"&.cm-focused .cm-selectionBackground, .cm-selectionBackground":{background:"#264f78"},".cm-gutters":{background:"#1e1e1e",color:"#858585"}},{dark:!0}),M=w.theme({"&":{background:"var(--bg-elev)",color:"var(--text)"},"&.cm-focused .cm-selectionBackground, .cm-selectionBackground":{background:"#add6ff"},".cm-gutters":{background:"var(--bg-elev)",color:"#aaaaaa"}}),T=z(L.define([{tag:a.keyword,color:"#569cd6"},{tag:a.controlKeyword,color:"#c586c0"},{tag:a.definitionKeyword,color:"#569cd6"},{tag:a.string,color:"#ce9178"},{tag:a.number,color:"#b5cea8"},{tag:a.bool,color:"#569cd6"},{tag:a.null,color:"#569cd6"},{tag:a.comment,color:"#6a9955",fontStyle:"italic"},{tag:a.tagName,color:"#4ec9b0"},{tag:a.attributeName,color:"#9cdcfe"},{tag:a.attributeValue,color:"#ce9178"},{tag:a.angleBracket,color:"#808080"},{tag:a.operator,color:"#d4d4d4"},{tag:a.typeName,color:"#4ec9b0"},{tag:a.className,color:"#4ec9b0"},{tag:a.function(a.variableName),color:"#dcdcaa"},{tag:a.variableName,color:"#9cdcfe"},{tag:a.meta,color:"#d7ba7d"},{tag:a.namespace,color:"#d7ba7d"},{tag:a.processingInstruction,color:"#d7ba7d"},{tag:a.punctuation,color:"#808080"}])),O=z(L.define([{tag:a.keyword,color:"#0000ff"},{tag:a.controlKeyword,color:"#af00db"},{tag:a.definitionKeyword,color:"#0000ff"},{tag:a.string,color:"#a31515"},{tag:a.number,color:"#098658"},{tag:a.bool,color:"#0000ff"},{tag:a.null,color:"#0000ff"},{tag:a.comment,color:"#008000",fontStyle:"italic"},{tag:a.tagName,color:"#800000"},{tag:a.attributeName,color:"#e50000"},{tag:a.attributeValue,color:"#0000ff"},{tag:a.angleBracket,color:"#555555"},{tag:a.operator,color:"#000000"},{tag:a.typeName,color:"#267f99"},{tag:a.className,color:"#267f99"},{tag:a.function(a.variableName),color:"#795e26"},{tag:a.variableName,color:"#001080"},{tag:a.meta,color:"#0070c1"},{tag:a.namespace,color:"#0070c1"},{tag:a.processingInstruction,color:"#0070c1"},{tag:a.punctuation,color:"#555555"}]));function se(t){switch(t){case"xml":return S();case"js":return J();case"python":return Q();case"php":return Y({plain:!0});case"dotnet":return W.define(ee);default:return S()}}let h=null,g=null,_=null;const v=new Set,A=b({name:"engine",initialState:{status:"loading",error:""},reducers:{engineLoaded:t=>{t.status="ready"},engineFailed:(t,{payload:e})=>{t.status="error",t.error=e}}}),H=b({name:"editor",initialState:{selectedFile:x[0].file},reducers:{fileSelected:(t,{payload:e})=>{t.selectedFile=e}}}),N=b({name:"render",initialState:{status:"idle",error:"",pageCount:0,byteSize:0},reducers:{renderStarted:t=>{t.status="rendering",t.error=""},renderDone:(t,{payload:e})=>{t.status="done",t.pageCount=e.pageCount,t.byteSize=e.byteSize},renderFailed:(t,{payload:e})=>{t.status="error",t.error=e},renderReset:t=>{t.status="idle",t.error="",t.pageCount=0,t.byteSize=0}}}),V=b({name:"viewer",initialState:{zoomFactor:1},reducers:{zoomIn:t=>{t.zoomFactor=Math.min(4,+(t.zoomFactor*1.25).toFixed(4))},zoomOut:t=>{t.zoomFactor=Math.max(.25,+(t.zoomFactor/1.25).toFixed(4))},zoomReset:t=>{t.zoomFactor=1},zoomSet:(t,{payload:e})=>{t.zoomFactor=Math.min(4,Math.max(.25,e))}}}),B=b({name:"mode",initialState:{selected:"xml"},reducers:{modeSelected:(t,{payload:e})=>{t.selected=e}}}),s=X({reducer:{engine:A.reducer,editor:H.reducer,render:N.reducer,viewer:V.reducer,mode:B.reducer},middleware:t=>t({serializableCheck:!1})}),{engineLoaded:ie,engineFailed:re}=A.actions,{fileSelected:le}=H.actions,{renderStarted:ce,renderDone:de,renderFailed:D,renderReset:pe}=N.actions,{zoomIn:me,zoomOut:ue,zoomReset:y,zoomSet:ge}=V.actions,{modeSelected:fe}=B.actions;function I(t,e){const o=new Map,n=e==="font"?/<font\b[\s\S]*?>/g:/<image\b[\s\S]*?>/g;for(const i of t.matchAll(n)){const c=i[0],d=/\bname=["']([^"']*)["']/.exec(c)?.[1],l=/\bref=["']([^"']*)["']/.exec(c)?.[1],u=/\bsrc=["']([^"']*)["']/.exec(c)?.[1],p=l??d;p&&u&&o.set(p,u)}return o}async function he(t){if(h){for(const[e,o]of I(t,"font"))if(!v.has(`font:${e}`))try{const n=await fetch(new URL(o,F));n.ok&&(h.loadFont(e,new Uint8Array(await n.arrayBuffer())),v.add(`font:${e}`))}catch{}for(const[e,o]of I(t,"image"))if(!v.has(`image:${e}`))try{const n=await fetch(new URL(o,F));n.ok&&(h.loadImage(e,new Uint8Array(await n.arrayBuffer())),v.add(`image:${e}`))}catch{}}}class be extends U{createRenderRoot(){return this}static properties={_s:{state:!0}};constructor(){super(),this._s=s.getState(),this._unsub=null,this._debounce=null,this._currentXml="",this._pendingText=null,this._pendingLang=null,this._cmView=null,this._langComp=new E,this._themeComp=new E,this._themeObs=null}connectedCallback(){super.connectedCallback(),this._unsub=s.subscribe(()=>{this._s={...s.getState()}}),this._boot()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),clearTimeout(this._debounce),this._themeObs?.disconnect(),this._cmView?.destroy(),this._cmView=null}updated(){const e=this.querySelector(".lpdf-cm-wrap");e&&!this._cmView&&this._initCm(e),this._pendingText!==null&&(this._setCmContent(this._pendingText,this._pendingLang??"xml"),this._pendingText=null,this._pendingLang=null)}_isDark(){return document.documentElement.getAttribute("data-theme")==="dark"}_initCm(e){const o=this._isDark();this._cmView=new w({state:K.create({doc:"",extensions:[w.editable.of(!1),q(),this._langComp.of(S()),this._themeComp.of([o?P:M,o?T:O]),ne]}),parent:e}),this._themeObs=new MutationObserver(()=>{const n=this._isDark();this._cmView?.dispatch({effects:this._themeComp.reconfigure([n?P:M,n?T:O])})}),this._themeObs.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}_setCmContent(e,o){if(!this._cmView){this._pendingText=e,this._pendingLang=o;return}this._cmView.dispatch({changes:{from:0,to:this._cmView.state.doc.length,insert:e},effects:this._langComp.reconfigure(se(o))})}async _boot(){try{h=await Z(),await j(),s.dispatch(ie()),await this._loadExample(x[0].file),this._scheduleRender()}catch(e){s.dispatch(re(e.message))}}async _loadExample(e){s.dispatch(le(e));const o=new URL(e,te).href,n=await fetch(o);if(!n.ok)throw new Error(`${n.status} ${n.statusText}`);const i=await n.text();this._currentXml=i;const{mode:c}=s.getState(),d=c.selected==="xml"?i:this._generateCode(i,c.selected);return this._pendingText=d,this._pendingLang=c.selected,i}_scheduleRender(){clearTimeout(this._debounce),this._debounce=setTimeout(()=>this._doRender(),600)}async _doRender(){if(!(!h||!this._currentXml.trim())){s.dispatch(ce());try{await he(this._currentXml);const e=await h.render(this._currentXml);_=e.slice(),g=await $.getDocument({data:e}).promise,s.dispatch(de({pageCount:g.numPages,byteSize:_.length})),s.dispatch(y()),await this._drawPages()}catch(e){s.dispatch(D(e.message))}}}_getFitScale(e){const o=this.querySelector(".lpdf-preview-pages");if(!o)return 1;const n=e.getViewport({scale:1});return(o.clientWidth-48)/n.width}async _drawPages(){if(!g)return;const e=this.querySelector(".lpdf-preview-pages");if(!e)return;e.innerHTML="";const{zoomFactor:o}=s.getState().viewer,n=await g.getPage(1),c=this._getFitScale(n)*o;for(let d=1;d<=g.numPages;d++){const l=d===1?n:await g.getPage(d),u=l.getViewport({scale:c}),p=document.createElement("canvas");p.width=u.width,p.height=u.height,e.appendChild(p),await l.render({canvasContext:p.getContext("2d"),viewport:u}).promise}}_generateCode(e,o){try{return G(e,JSON.stringify({target:o,indent:4}))}catch(n){return`// codegen error: ${n.message}`}}_onModeChange(e){s.dispatch(fe(e));const o=e==="xml"?this._currentXml:this._generateCode(this._currentXml,e);this._setCmContent(o,e)}async _onExampleChange(e){const o=e.target.value;s.dispatch(pe()),g=null,_=null;const n=this.querySelector(".lpdf-preview-pages");n&&(n.innerHTML="");try{await this._loadExample(o)}catch(i){s.dispatch(D(`Failed to load: ${i.message}`));return}this._scheduleRender()}_onZoomIn(){s.dispatch(me()),this._drawPages()}_onZoomOut(){s.dispatch(ue()),this._drawPages()}_onZoomReset(){s.dispatch(y()),this._drawPages()}_onZoomSelect(e){const o=e.target.value;o==="fit"?s.dispatch(y()):s.dispatch(ge(parseFloat(o))),this._drawPages()}_onDownload(){if(!_)return;const e=new Blob([_],{type:"application/pdf"}),o=URL.createObjectURL(e),n=document.createElement("a");n.href=o,n.download="document.pdf",n.click(),URL.revokeObjectURL(o)}_renderEngineStatus(){const{engine:e,render:o}=this._s;return e.status==="loading"?r`<span class="lpdf-spinner"></span><span class="lpdf-engine-label"></span>`:e.status==="error"?r`<span class="lpdf-engine-dot lpdf-dot-error"></span><span class="lpdf-engine-label"></span>`:o.status==="rendering"?r`<span class="lpdf-spinner"></span><span class="lpdf-engine-label"></span>`:r`<span class="lpdf-engine-dot lpdf-dot-ok"></span><span class="lpdf-engine-label"></span>`}render(){const{engine:e,editor:o,render:n,viewer:i,mode:c}=this._s,d=e.status==="ready",l=n.status==="done",u=Math.round(i.zoomFactor*100),p=i.zoomFactor===1,C=p?"fit":String(i.zoomFactor),k=p||ae.has(C);return r`
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
                                ?disabled=${!d}
                                @change=${this._onExampleChange}>
                            ${x.map(m=>r`
                                <option value=${m.file}
                                        ?selected=${o.selectedFile===m.file}>
                                    Example - ${m.label}
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
                                ${oe.map(m=>r`
                                    <button class="lpdf-mode-btn"
                                            aria-pressed=${c.selected===m.id}
                                            ?disabled=${!d}
                                            @click=${()=>this._onModeChange(m.id)}>
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
                                        ?disabled=${!l||i.zoomFactor<=.25}
                                        @click=${this._onZoomOut}>−</button>
                                <select class="lpdf-zoom-select"
                                        .value=${k?C:""}
                                        ?disabled=${!l}
                                        @change=${this._onZoomSelect}>
                                    ${k?f:r`<option value="" disabled hidden>${u}%</option>`}
                                    ${R.map(m=>r`<option value=${m.value}>${m.label}</option>`)}
                                </select>
                                <button class="lpdf-zoom-btn"
                                        title="Zoom in"
                                        ?disabled=${!l||i.zoomFactor>=4}
                                        @click=${this._onZoomIn}>+</button>
                            </div>
                            <div class="lpdf-preview-wing lpdf-preview-wing--end">
                                ${l?r`<span class="lpdf-page-count">${n.pageCount} page${n.pageCount!==1?"s":""}</span>`:f}
                                ${l?r`<span class="lpdf-pdf-size">${(n.byteSize/1024).toFixed(1)} KB</span>`:f}
                                ${l?r`<span class="lpdf-preview-sep" aria-hidden="true"></span>`:f}
                                ${l?r`<button class="lpdf-download-link" @click=${this._onDownload}>↓ Download</button>`:f}
                            </div>
                        </div>
                        <div class="lpdf-preview-inner">
                            ${!l&&n.status!=="rendering"?r`
                                <div class="lpdf-placeholder">
                                    <span class="lpdf-placeholder-icon">⬚</span>
                                    <span>PDF preview will appear here</span>
                                </div>
                            `:f}
                            <div class="lpdf-preview-pages"></div>
                        </div>
                    </div>

                </div>

            </div>
        `}}customElements.define("lpdf-demo",be);
