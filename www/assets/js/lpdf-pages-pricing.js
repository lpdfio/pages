"use strict";(()=>{var Ue=Object.defineProperty;var Oe=Object.getOwnPropertyDescriptor;var h=(i,e,t,r)=>{for(var s=r>1?void 0:r?Oe(e,t):e,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=(r?n(e,t,s):n(s))||s);return r&&s&&Ue(e,t,s),s};var F=globalThis,q=F.ShadowRoot&&(F.ShadyCSS===void 0||F.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ce=Symbol(),le=new WeakMap,I=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==ce)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(q&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=le.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&le.set(t,e))}return e}toString(){return this.cssText}},pe=i=>new I(typeof i=="string"?i:i+"",void 0,ce);var de=(i,e)=>{if(q)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let r=document.createElement("style"),s=F.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=t.cssText,i.appendChild(r)}},J=q?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return pe(t)})(i):i;var{is:De,defineProperty:je,getOwnPropertyDescriptor:Be,getOwnPropertyNames:Fe,getOwnPropertySymbols:Ie,getPrototypeOf:qe}=Object,z=globalThis,he=z.trustedTypes,ze=he?he.emptyScript:"",Ve=z.reactiveElementPolyfillSupport,N=(i,e)=>i,R={toAttribute(i,e){switch(e){case Boolean:i=i?ze:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},V=(i,e)=>!De(i,e),ue={attribute:!0,type:String,converter:R,reflect:!1,useDefault:!1,hasChanged:V};Symbol.metadata??=Symbol("metadata"),z.litPropertyMetadata??=new WeakMap;var b=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ue){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(e,r,t);s!==void 0&&je(this.prototype,e,s)}}static getPropertyDescriptor(e,t,r){let{get:s,set:o}=Be(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:s,set(n){let p=s?.call(this);o?.call(this,n),this.requestUpdate(e,p,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ue}static _$Ei(){if(this.hasOwnProperty(N("elementProperties")))return;let e=qe(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(N("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(N("properties"))){let t=this.properties,r=[...Fe(t),...Ie(t)];for(let s of r)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[r,s]of t)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let s=this._$Eu(t,r);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let s of r)t.unshift(J(s))}else e!==void 0&&t.push(J(e));return t}static _$Eu(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return de(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){let r=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,r);if(s!==void 0&&r.reflect===!0){let o=(r.converter?.toAttribute!==void 0?r.converter:R).toAttribute(t,r.type);this._$Em=e,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){let r=this.constructor,s=r._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let o=r.getPropertyOptions(s),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:R;this._$Em=s;let p=n.fromAttribute(t,o.type);this[s]=p??this._$Ej?.get(s)??p,this._$Em=null}}requestUpdate(e,t,r,s=!1,o){if(e!==void 0){let n=this.constructor;if(s===!1&&(o=this[e]),r??=n.getPropertyOptions(e),!((r.hasChanged??V)(o,t)||r.useDefault&&r.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:s,wrapped:o},n){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),o!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,o]of r){let{wrapped:n}=o,p=this[s];n!==!0||this._$AL.has(s)||p===void 0||this.C(s,void 0,o,p)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[N("elementProperties")]=new Map,b[N("finalized")]=new Map,Ve?.({ReactiveElement:b}),(z.reactiveElementVersions??=[]).push("2.1.2");var se=globalThis,me=i=>i,W=se.trustedTypes,fe=W?W.createPolicy("lit-html",{createHTML:i=>i}):void 0,_e="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,Ae="?"+A,We=`<${Ae}>`,S=document,U=()=>S.createComment(""),O=i=>i===null||typeof i!="object"&&typeof i!="function",ie=Array.isArray,Ke=i=>ie(i)||typeof i?.[Symbol.iterator]=="function",Q=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ge=/-->/g,ve=/>/g,x=RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),$e=/'/g,ye=/"/g,Ee=/^(?:script|style|textarea|title)$/i,oe=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),l=oe(1),ht=oe(2),ut=oe(3),k=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),be=new WeakMap,w=S.createTreeWalker(S,129);function xe(i,e){if(!ie(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return fe!==void 0?fe.createHTML(e):e}var Ge=(i,e)=>{let t=i.length-1,r=[],s,o=e===2?"<svg>":e===3?"<math>":"",n=H;for(let p=0;p<t;p++){let a=i[p],m,f,d=-1,y=0;for(;y<a.length&&(n.lastIndex=y,f=n.exec(a),f!==null);)y=n.lastIndex,n===H?f[1]==="!--"?n=ge:f[1]!==void 0?n=ve:f[2]!==void 0?(Ee.test(f[2])&&(s=RegExp("</"+f[2],"g")),n=x):f[3]!==void 0&&(n=x):n===x?f[0]===">"?(n=s??H,d=-1):f[1]===void 0?d=-2:(d=n.lastIndex-f[2].length,m=f[1],n=f[3]===void 0?x:f[3]==='"'?ye:$e):n===ye||n===$e?n=x:n===ge||n===ve?n=H:(n=x,s=void 0);let _=n===x&&i[p+1].startsWith("/>")?" ":"";o+=n===H?a+We:d>=0?(r.push(m),a.slice(0,d)+_e+a.slice(d)+A+_):a+A+(d===-2?p:_)}return[xe(i,o+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},D=class i{constructor({strings:e,_$litType$:t},r){let s;this.parts=[];let o=0,n=0,p=e.length-1,a=this.parts,[m,f]=Ge(e,t);if(this.el=i.createElement(m,r),w.currentNode=this.el.content,t===2||t===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=w.nextNode())!==null&&a.length<p;){if(s.nodeType===1){if(s.hasAttributes())for(let d of s.getAttributeNames())if(d.endsWith(_e)){let y=f[n++],_=s.getAttribute(d).split(A),B=/([.?@])?(.*)/.exec(y);a.push({type:1,index:o,name:B[2],strings:_,ctor:B[1]==="."?X:B[1]==="?"?ee:B[1]==="@"?te:M}),s.removeAttribute(d)}else d.startsWith(A)&&(a.push({type:6,index:o}),s.removeAttribute(d));if(Ee.test(s.tagName)){let d=s.textContent.split(A),y=d.length-1;if(y>0){s.textContent=W?W.emptyScript:"";for(let _=0;_<y;_++)s.append(d[_],U()),w.nextNode(),a.push({type:2,index:++o});s.append(d[y],U())}}}else if(s.nodeType===8)if(s.data===Ae)a.push({type:2,index:o});else{let d=-1;for(;(d=s.data.indexOf(A,d+1))!==-1;)a.push({type:7,index:o}),d+=A.length-1}o++}}static createElement(e,t){let r=S.createElement("template");return r.innerHTML=e,r}};function L(i,e,t=i,r){if(e===k)return e;let s=r!==void 0?t._$Co?.[r]:t._$Cl,o=O(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(i),s._$AT(i,t,r)),r!==void 0?(t._$Co??=[])[r]=s:t._$Cl=s),s!==void 0&&(e=L(i,s._$AS(i,e.values),s,r)),e}var Y=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:r}=this._$AD,s=(e?.creationScope??S).importNode(t,!0);w.currentNode=s;let o=w.nextNode(),n=0,p=0,a=r[0];for(;a!==void 0;){if(n===a.index){let m;a.type===2?m=new j(o,o.nextSibling,this,e):a.type===1?m=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(m=new re(o,this,e)),this._$AV.push(m),a=r[++p]}n!==a?.index&&(o=w.nextNode(),n++)}return w.currentNode=S,s}p(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},j=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=L(this,e,t),O(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==k&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ke(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(S.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:r}=e,s=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=D.createElement(xe(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(t);else{let o=new Y(s,this),n=o.u(this.options);o.p(t),this.T(n),this._$AH=o}}_$AC(e){let t=be.get(e.strings);return t===void 0&&be.set(e.strings,t=new D(e)),t}k(e){ie(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,s=0;for(let o of e)s===t.length?t.push(r=new i(this.O(U()),this.O(U()),this,this.options)):r=t[s],r._$AI(o),s++;s<t.length&&(this._$AR(r&&r._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let r=me(e).nextSibling;me(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,s,o){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=c}_$AI(e,t=this,r,s){let o=this.strings,n=!1;if(o===void 0)e=L(this,e,t,0),n=!O(e)||e!==this._$AH&&e!==k,n&&(this._$AH=e);else{let p=e,a,m;for(e=o[0],a=0;a<o.length-1;a++)m=L(this,p[r+a],t,a),m===k&&(m=this._$AH[a]),n||=!O(m)||m!==this._$AH[a],m===c?e=c:e!==c&&(e+=(m??"")+o[a+1]),this._$AH[a]=m}n&&!s&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},X=class extends M{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}},ee=class extends M{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}},te=class extends M{constructor(e,t,r,s,o){super(e,t,r,s,o),this.type=5}_$AI(e,t=this){if((e=L(this,e,t,0)??c)===k)return;let r=this._$AH,s=e===c&&r!==c||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,o=e!==c&&(r===c||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},re=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){L(this,e)}};var Ze=se.litHtmlPolyfillSupport;Ze?.(D,j),(se.litHtmlVersions??=[]).push("3.3.2");var we=(i,e,t)=>{let r=t?.renderBefore??e,s=r._$litPart$;if(s===void 0){let o=t?.renderBefore??null;r._$litPart$=s=new j(e.insertBefore(U(),o),o,void 0,t??{})}return s._$AI(i),s};var ne=globalThis,E=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=we(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return k}};E._$litElement$=!0,E.finalized=!0,ne.litElementHydrateSupport?.({LitElement:E});var Je=ne.litElementPolyfillSupport;Je?.({LitElement:E});(ne.litElementVersions??=[]).push("4.2.2");var v=i=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(i,e)}):customElements.define(i,e)};var Qe={attribute:!0,type:String,converter:R,reflect:!1,hasChanged:V},Ye=(i=Qe,e,t)=>{let{kind:r,metadata:s}=t,o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(t.name,i),r==="accessor"){let{name:n}=t;return{set(p){let a=e.get.call(this);e.set.call(this,p),this.requestUpdate(n,a,i,!0,p)},init(p){return p!==void 0&&this.C(n,void 0,i,p),p}}}if(r==="setter"){let{name:n}=t;return function(p){let a=this[n];e.call(this,p),this.requestUpdate(n,a,i,!0,p)}}throw Error("Unsupported decorator location: "+r)};function u(i){return(e,t)=>typeof t=="object"?Ye(i,e,t):((r,s,o)=>{let n=s.hasOwnProperty(o);return s.constructor.createProperty(o,r),n?Object.getOwnPropertyDescriptor(s,o):void 0})(i,e,t)}function Se(i){return u({...i,state:!0,attribute:!1})}var $=class extends E{createRenderRoot(){return this.hasAttribute("data-prerendered")&&(this.replaceChildren(),this.removeAttribute("data-prerendered")),this}};function ke(){let i=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",i);try{localStorage.setItem("cs-theme",i);let e=/\.?codesense\.dev$/.test(window.location.hostname)?"; domain=.codesense.dev":"";document.cookie=`cs-theme=${i}; max-age=31536000; path=/${e}; SameSite=Lax`}catch{}}var Xe={lpdf:{slug:"lpdf",name:"Lpdf",mark:"/assets/images/lpdf-mark.svg",tagline:`PDF as Code
on every platform`,contactEmail:"license@lpdf.io",packages:{heading:"SDKs",rows:[{name:"JS / Node",href:"/docs/install/?sdk=js",github:"https://github.com/lpdfio/lpdf-js",registry:{label:"npm",url:"https://www.npmjs.com/package/@lpdfio/lpdf"}},{name:".NET",href:"/docs/install/?sdk=dotnet",github:"https://github.com/lpdfio/lpdf-dotnet",registry:{label:"NuGet",url:"https://www.nuget.org/packages/Lpdfio.Lpdf"}},{name:"PHP",href:"/docs/install/?sdk=php",github:"https://github.com/lpdfio/lpdf-php",registry:{label:"Packagist",url:"https://packagist.org/packages/lpdfio/lpdf"}},{name:"Python",href:"/docs/install/?sdk=python",github:"https://github.com/lpdfio/lpdf-python",registry:{label:"PyPI",url:"https://pypi.org/project/lpdfio-lpdf/"}}]},documentation:[{label:"Installation",href:"/docs/install/"},{label:"Layout model",href:"/docs/doc/layout/"},{label:"Layers",href:"/docs/doc/layer/"},{label:"Data binding",href:"/docs/data/binding/"},{label:"XML schema",href:"/docs/xml/schema/"},{label:"VS Code extension",href:"https://marketplace.visualstudio.com/items?itemName=lpdfio.lpdf"},{label:"Releases",href:"https://github.com/lpdfio/lpdf/releases"}],licensing:[{label:"Pricing",href:"/pricing/"},{label:"License",href:"/license/"},{label:"Support",href:"/support/"}],legalLinks:[{label:"License",href:"/license/"},{label:"Support",href:"/support/"}]},authstack:{slug:"authstack",name:"AuthStack",mark:"/assets/images/authstack-mark.svg",tagline:`Auth as Config
for every service`,contactEmail:"license@authstack.id",packages:{heading:"Packages",rows:[{name:"ASP.NET Core",href:"/docs/backend/setup/"},{name:"Web components",href:"/docs/frontend/setup/"}]},documentation:[{label:"Quick start",href:"/docs/start/quick-start/"},{label:"Auth flow",href:"/docs/concepts/auth-flow/"},{label:"Backend setup",href:"/docs/backend/setup/"},{label:"Frontend setup",href:"/docs/frontend/setup/"},{label:"Web components",href:"/docs/frontend/components/"},{label:"Providers",href:"/docs/providers/"}],licensing:[{label:"Pricing",href:"/pricing"},{label:"License",href:"/license"}],legalLinks:[{label:"Pricing",href:"/pricing"},{label:"License",href:"/license"}]}};function G(i){return Xe[i]}function et(i,e){let t=e?[{label:"Contact us",href:`mailto:${e}`}]:[];return[{label:"Customer portal",href:i},...t,{label:"Terms of Service",href:`${i}/terms`},{label:"Privacy Policy",href:`${i}/privacy`},{label:"Refund Policy",href:`${i}/refunds`}]}function Ce(i,e){return[{heading:"Documentation",links:i.documentation},{heading:"Licensing",links:i.licensing},{heading:"Company",links:et(e,i.contactEmail)}]}function Pe(i){return!i.startsWith("/")}var tt="cs-platform",rt=[{id:"xml",label:"XML"},{id:"js",label:"Node.js",github:"https://github.com/lpdfio/lpdf-js",registry:{label:"npm",url:"https://www.npmjs.com/package/@lpdfio/lpdf"}},{id:"php",label:"PHP",github:"https://github.com/lpdfio/lpdf-php",registry:{label:"Packagist",url:"https://packagist.org/packages/lpdfio/lpdf"}},{id:"python",label:"Python",github:"https://github.com/lpdfio/lpdf-python",registry:{label:"PyPI",url:"https://pypi.org/project/lpdfio-lpdf/"}},{id:"dotnet",label:".NET",github:"https://github.com/lpdfio/lpdf-dotnet",registry:{label:"NuGet",url:"https://www.nuget.org/packages/Lpdfio.Lpdf"}}],st=l`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,16.37a86.4,86.4,0,0,1,16,3V212.67a86.4,86.4,0,0,1-16,3Zm32,9.26a87.81,87.81,0,0,1,16,10.54V195.83a87.81,87.81,0,0,1-16,10.54ZM40,128a88.11,88.11,0,0,1,80-87.63V215.63A88.11,88.11,0,0,1,40,128Zm160,50.54V77.46a87.82,87.82,0,0,1,0,101.08Z"></path></svg>`,g=class extends ${constructor(){super(...arguments);this.variant="home";this.authenticated=!1;this.hasPage=!1;this.product="lpdf";this.platforms=rt;this._platform=(()=>{try{return localStorage.getItem(tt)??"js"}catch{return"js"}})();this._onPlatform=t=>{let r=t.detail;r!==this._platform&&(this._platform=r)}}firstUpdated(){if(this._markActiveLink(),this.variant==="docs"){let t=new URLSearchParams(window.location.search).get("sdk");t&&(this._platform=t)}}connectedCallback(){super.connectedCallback(),this.variant==="docs"&&window.addEventListener("cs-platform",this._onPlatform)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("cs-platform",this._onPlatform)}_markActiveLink(){let t=window.location.pathname.replace(/\/$/,"")||"/";this.querySelectorAll(".nav-links a").forEach(r=>{let s=(r.getAttribute("href")??"").replace(/\/$/,"")||"/";r.classList.toggle("active",s!==""&&s!=="/"&&t.startsWith(s))})}_handleThemeToggle(){ke(),this.requestUpdate()}_setPlatform(t){this._platform=t,window.dispatchEvent(new CustomEvent("cs-platform",{detail:t}))}get _site(){return G(this.product)}_logo(t){return l`
            <a href="${t}" class="nav-logo">
                <img src="${this.logoMark??this._site?.mark??""}" alt="" class="nav-logo-mark" />
                <span class="nav-logo-word">${this.logoWord??this._site?.name??""}</span>
            </a>
        `}_themeBtn(){return l`
            <button class="theme-btn" @click=${this._handleThemeToggle} aria-label="Toggle theme">
                ${st}
            </button>
        `}_sdkDropdown(){return l`
            <div class="nav-sdk-wrap">
                <select
                    class="nav-sdk-select"
                    .value=${this._platform}
                    @change=${t=>this._setPlatform(t.target.value)}>
                    ${this.platforms.map(t=>l`
                        <option value=${t.id} ?selected=${this._platform===t.id}>${t.label}</option>
                    `)}
                </select>
            </div>
        `}_renderDocsLinks(){if(!this.hasPage)return c;let t=this.platforms.find(r=>r.id===this._platform);return!t?.github||!t.registry?c:l`
            <a target="_blank" rel="noopener noreferrer" href=${t.registry.url} class="btn btn-secondary btn-sm">${t.registry.label}</a>
            <a target="_blank" rel="noopener noreferrer" href=${t.github} class="btn btn-secondary btn-sm">GitHub</a>
        `}render(){if(!this._site)return c;switch(this.variant){case"home":return this._renderHome();case"docs":return this._renderDocs();case"legal":return this._renderLegal();case"pricing":return this._renderPricing();case"checkout":return this._renderCheckout()}}_renderCheckout(){return l`
            <nav class="nav">
                <div class="nav-inner rl-row rl-justify-between rl-align-center">
                    <div class="rl-row rl-gap-2xl rl-align-center">
                        ${this._logo("/")}
                    </div>
                    <div class="rl-row rl-gap-l rl-align-center">
                        ${this._themeBtn()}
                    </div>
                </div>
            </nav>
        `}_renderHome(){return l`
            <nav class="nav">
                <div class="nav-inner rl-row rl-justify-between rl-align-center">
                    <div class="rl-row rl-gap-2xl rl-align-center">
                        ${this._logo("/")}
                    </div>
                    <div class="rl-row rl-gap-l rl-align-center">
                        ${this._themeBtn()}
                    </div>
                </div>
            </nav>
        `}_renderPricing(){return l`
            <nav class="nav">
                <div class="nav-inner rl-row rl-justify-between rl-align-center">
                    <div class="rl-row rl-gap-l rl-align-center">
                        ${this._logo("/")}
                        <span class="nav-section-label">Pricing</span>
                    </div>
                    <div class="rl-row rl-gap-l rl-align-center">
                        ${this._themeBtn()}
                    </div>
                </div>
            </nav>
        `}_renderDocs(){return l`
            <nav class="nav">
                <div class="nav-inner rl-row rl-justify-between rl-align-center">
                    <div class="rl-row rl-gap-l rl-align-center">
                        ${this._logo("/")}
                        <div class="rl-row rl-gap-xl">
                            <span class="nav-section-label">Docs</span>
                            ${this.hasPage?this._sdkDropdown():c}
                        </div>
                    </div>
                    <div class="rl-row rl-gap-l rl-align-center">
                        ${this._renderDocsLinks()}
                        ${this._themeBtn()}
                    </div>
                </div>
            </nav>
        `}_renderLegal(){return l`
            <nav class="nav">
                <div class="nav-inner rl-row rl-justify-between rl-align-center">
                    <div class="rl-row rl-gap-l rl-align-center">
                        ${this._logo("/")}
                        <span class="nav-section-label">Legal</span>
                    </div>
                    <div class="rl-row rl-gap-xl rl-align-center nav-links">
                        ${this._site?.legalLinks.map(t=>l`
                            <a href="${t.href}">${t.label}</a>
                        `)}
                        ${this._themeBtn()}
                    </div>
                </div>
            </nav>
        `}};h([u({reflect:!0})],g.prototype,"variant",2),h([u({type:Boolean,reflect:!0})],g.prototype,"authenticated",2),h([u({type:Boolean,attribute:"has-page",reflect:!0})],g.prototype,"hasPage",2),h([u()],g.prototype,"product",2),h([u({attribute:"logo-mark"})],g.prototype,"logoMark",2),h([u({attribute:"logo-word"})],g.prototype,"logoWord",2),h([u({type:Array})],g.prototype,"platforms",2),h([Se()],g.prototype,"_platform",2),g=h([v("site-nav")],g);var it="__PORTAL_URL__",C=class extends ${constructor(){super(...arguments);this.product=""}render(){let t=G(this.product);return t?l`
            <footer>
                <!-- No .container: the columns run the full width inside the same gutter as the
                     header, so the footer's first column lines up under the header's logo. -->
                <div class="footer-columns">
                    <!-- fit-m, not fit-l: five tracks at the l minimum (200px) need 1096px, so the
                         last column wrapped below a 1160px viewport — on an iPad in landscape,
                         among others. The m minimum (150px) holds all five to about 910px, and
                         nothing in these columns is wider than that. "VS Code extension", the
                         longest label, measures ~120px. -->
                    <div class="rl-grid rl-grid-fit-m rl-gap-xl">
                        ${this._brandColumn(t)}
                        <!-- Packages before Documentation: the quick start lives in that column, so it
                             is where a reader starts. Documentation is the reference you consult
                             once something already runs. -->
                        ${this._packageColumn(t)}
                        ${Ce(t,it).map(r=>this._column(r.heading,r.links))}
                    </div>
                </div>
                <div class="footer-baseline">
                    <p class="footer-copy">© 2026 Codesense LLC</p>
                </div>
            </footer>
        `:c}_brandColumn(t){return l`
            <div class="rl-column rl-gap-s">
                <a href="/" class="footer-logo">
                    <img src="${t.mark}" alt="" class="footer-logo-mark" />
                    <span class="footer-logo-word">${t.name}</span>
                </a>
                <p class="footer-tagline">
                    ${t.tagline.split(`
`).flatMap((r,s,o)=>s<o.length-1?[r,l`<br />`]:[r])}
                </p>
            </div>
        `}_packageColumn(t){return l`
            <div class="rl-column rl-gap-s">
                <span class="footer-heading">${t.packages.heading}</span>
                <div class="rl-column rl-gap-m">
                    ${t.packages.rows.map(r=>l`
                        <div class="rl-column rl-gap-xs">
                            <a href="${r.href}" class="footer-sdk">${r.name}</a>
                            ${r.github||r.registry?l`
                                    <div class="rl-row rl-gap-m footer-links footer-sdk-links">
                                        ${r.github?l`<a href="${r.github}" target="_blank" rel="noopener noreferrer">GitHub</a>`:c}
                                        ${r.registry?l`<a href="${r.registry.url}" target="_blank" rel="noopener noreferrer">${r.registry.label}</a>`:c}
                                    </div>
                                `:c}
                        </div>
                    `)}
                </div>
            </div>
        `}_column(t,r){return l`
            <div class="rl-column rl-gap-s">
                <span class="footer-heading">${t}</span>
                <div class="rl-column rl-gap-m footer-links">
                    ${r.map(s=>Pe(s.href)?l`<a href="${s.href}" target="_blank" rel="noopener noreferrer">${s.label}</a>`:l`<a href="${s.href}">${s.label}</a>`)}
                </div>
            </div>
        `}};h([u()],C.prototype,"product",2),C=h([v("product-footer")],C);var Z=class extends C{constructor(){super(),this.product="lpdf"}};Z=h([v("lpdf-footer")],Z);function Le(){location.hash||(document.body.tabIndex=-1,document.body.focus({preventScroll:!0}))}try{let i=document.cookie.split("; ").find(r=>r.startsWith("cs-theme="))?.split("=")[1],e=localStorage.getItem("cs-theme"),t=i??e;if(t&&document.documentElement.setAttribute("data-theme",t),!i&&e){let r=/\.?codesense\.dev$/.test(window.location.hostname)?"; domain=.codesense.dev":"";document.cookie=`cs-theme=${e}; max-age=31536000; path=/${r}; SameSite=Lax`}}catch{}Le();var T=class extends ${constructor(){super(...arguments);this.href="";this.label=""}render(){return l`
            <a href="${this.href}"
                class="tier-cta"
            >${this.label}</a>`}};h([u()],T.prototype,"href",2),h([u()],T.prototype,"label",2),T=h([v("checkout-link")],T);function Me(i,e,t){return i?e(i):t?.(i)}var Te=[];var ae={lpdf:{earlyAccess:!0,tiers:{community:{id:"community",label:"Community",price:"Free",priceNote:"/ production system / year",topBadge:"No card needed",target:"For anyone under $1M annual revenue \u2014 individuals, open-source, startups, non-profits, and education. Commercial use included.",cta:"Start Free",ctaConfirm:"Get Free Community License",hasSystemName:!1,extras:["GitHub community support"]},professional:{id:"professional",label:"Professional",price:"$299",priceNote:"/ production system / year",target:"For companies with $1M\u2013$10M annual revenue. All features with full SDKs and tooling included \u2014 adds commercial licensing and priority support.",cta:"Coming soon",ctaConfirm:"Checkout",ctaDisabled:!0,hasSystemName:!0,extras:["Priority email support","Annual commercial license"]},enterprise:{id:"enterprise",label:"Enterprise",price:"Quote",priceNote:"/ production system / year",target:"For companies above $10M annual revenue. Everything in Professional, plus contractual guarantees and enterprise-grade coverage.",cta:"Coming soon",ctaConfirm:"Checkout",ctaHref:"mailto:enterprise@lpdf.io?subject=Enterprise%20license",ctaDisabled:!0,hasSystemName:!0,extras:["Dedicated support & SLA","Custom invoicing & MSA","Subsidiaries covered"]}}},authstack:{earlyAccess:!0,tiers:{community:{id:"community",label:"Community",price:"Free",priceNote:"/ production app / year",topBadge:"No card needed",target:"For individuals, open-source projects, non-profits, and companies under $1M annual revenue. Commercial use included.",cta:"Coming soon",ctaConfirm:"Get Free Community License",ctaDisabled:!0,hasSystemName:!1,extras:["The same library on every tier","Admin area included","Key renews free each year"]},professional:{id:"professional",label:"Professional",price:"$299",priceNote:"/ production app / year",target:"For companies with $1M\u2013$10M annual revenue. The same library as Community, adding a commercial license and email support.",cta:"Coming soon",ctaConfirm:"Checkout",ctaDisabled:!0,hasSystemName:!0,extras:["Email support, 3 business day target","Annual license, key valid one year"]},enterprise:{id:"enterprise",label:"Enterprise",price:"Quote",priceNote:"/ production app / year",target:"For companies above $10M annual revenue, or anyone who prefers Enterprise terms. Everything in Professional, plus contract and support terms for larger organizations.",cta:"Coming soon",ctaConfirm:"Checkout",ctaHref:"mailto:license@authstack.id?subject=Enterprise%20license",ctaDisabled:!0,hasSystemName:!0,extras:["Priority support","MSA and invoice billing on request","Subsidiary personnel covered","Keys locked to a major version, no expiry date"]}}}},Ne=ae.lpdf?.earlyAccess??!1;function Re(i,e){return`/${e}/${i==="community"?"get":"buy"}/${i}`}var ot="__PORTAL_URL__",He=l`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink:0; margin-top:0.2em;"><polyline points="20 6 9 17 4 12"/></svg>`,P=class extends ${constructor(){super(...arguments);this.product="lpdf";this.tier="";this.showCta=!1}render(){let t=ae[this.product]?.tiers[this.tier];return t?l`
            <div class="tier-card-wrap">
                ${t.topBadge?l`
                    <div class="tier-card__top-badge">
                        <span class="tier-top-pill tier-top-pill--${t.id}">${t.topBadge}</span>
                    </div>
                `:c}
                <div class="tier-card tier-card--${t.id}">
                    <span class="tier-label tier-label--${t.id}">${t.label}</span>

                    <div style="display:flex; flex-direction:column; gap:0.2rem;">
                        <span class="tier-price">${t.price.startsWith("$")?l`<span class="tier-currency">$</span>${t.price.slice(1)}`:t.price}</span>
                        <span style="font-size:0.8125rem; color:var(--text-muted);">${t.priceNote}</span>
                    </div>

                    <p style="margin:0; font-size:0.875rem; color:var(--text-muted); line-height:1.55;">${t.target}</p>

                    <hr style="border:none; border-top:1px solid var(--border); margin:0;">

                    <ul style="list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:0.5rem; flex:1;">
                        ${Te.map(r=>l`
                            <li style="display:flex; align-items:flex-start; gap:0.5rem; font-size:0.9rem; color:var(--text-muted);">
                                ${He}
                                <span>${r}</span>
                            </li>
                        `)}
                        ${t.extras.map(r=>l`
                            <li style="display:flex; align-items:flex-start; gap:0.5rem; font-size:0.9rem; color:var(--text-muted);">
                                ${He}
                                <span>${r}</span>
                            </li>
                        `)}
                    </ul>

                    ${Me(this.showCta,()=>t.ctaDisabled?l`<span class="tier-card__cta tier-card__cta--disabled">${t.cta}</span>`:l`<a href="${t.ctaHref??ot+Re(t.id,this.product)}" class="tier-card__cta">${t.cta}</a>`)}
                </div>
            </div>
        `:c}};h([u()],P.prototype,"product",2),h([u()],P.prototype,"tier",2),h([u({type:Boolean,attribute:"show-cta"})],P.prototype,"showCta",2),P=h([v("tier-card")],P);Ne||document.getElementById("early-access-note")?.remove();})();
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
lit-html/directives/when.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
