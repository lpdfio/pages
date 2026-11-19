"use strict";(()=>{var Le=Object.defineProperty;var Te=Object.getOwnPropertyDescriptor;var u=(o,e,t,s)=>{for(var r=s>1?void 0:s?Te(e,t):e,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=(s?n(e,t,r):n(r))||r);return s&&r&&Le(e,t,r),r};var B=globalThis,q=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ae=Symbol(),ne=new WeakMap,F=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(q&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=ne.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&ne.set(t,e))}return e}toString(){return this.cssText}},le=o=>new F(typeof o=="string"?o:o+"",void 0,ae);var ce=(o,e)=>{if(q)o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),r=B.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,o.appendChild(s)}},J=q?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return le(t)})(o):o;var{is:Me,defineProperty:Ue,getOwnPropertyDescriptor:Re,getOwnPropertyNames:Oe,getOwnPropertySymbols:He,getPrototypeOf:je}=Object,I=globalThis,he=I.trustedTypes,De=he?he.emptyScript:"",Ne=I.reactiveElementPolyfillSupport,T=(o,e)=>o,M={toAttribute(o,e){switch(e){case Boolean:o=o?De:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},V=(o,e)=>!Me(o,e),de={attribute:!0,type:String,converter:M,reflect:!1,useDefault:!1,hasChanged:V};Symbol.metadata??=Symbol("metadata"),I.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=de){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&Ue(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){let{get:r,set:i}=Re(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:r,set(n){let l=r?.call(this);i?.call(this,n),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??de}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;let e=je(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){let t=this.properties,s=[...Oe(t),...He(t)];for(let r of s)this.createProperty(r,t[r])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let r of s)t.unshift(J(r))}else e!==void 0&&t.push(J(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ce(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){let i=(s.converter?.toAttribute!==void 0?s.converter:M).toAttribute(t,s.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let i=s.getPropertyOptions(r),n=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:M;this._$Em=r;let l=n.fromAttribute(t,i.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(e,t,s,r=!1,i){if(e!==void 0){let n=this.constructor;if(r===!1&&(i=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??V)(i,t)||s.useDefault&&s.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:r,wrapped:i},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),i!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,i]of this._$Ep)this[r]=i;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,i]of s){let{wrapped:n}=i,l=this[r];n!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,i,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[T("elementProperties")]=new Map,$[T("finalized")]=new Map,Ne?.({ReactiveElement:$}),(I.reactiveElementVersions??=[]).push("2.1.2");var se=globalThis,pe=o=>o,z=se.trustedTypes,ue=z?z.createPolicy("lit-html",{createHTML:o=>o}):void 0,_e="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,be="?"+b,Be=`<${be}>`,S=document,R=()=>S.createComment(""),O=o=>o===null||typeof o!="object"&&typeof o!="function",re=Array.isArray,Fe=o=>re(o)||typeof o?.[Symbol.iterator]=="function",X=`[ 	
\f\r]`,U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,me=/-->/g,fe=/>/g,k=RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ge=/'/g,ve=/"/g,ye=/^(?:script|style|textarea|title)$/i,oe=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),h=oe(1),it=oe(2),nt=oe(3),x=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),$e=new WeakMap,E=S.createTreeWalker(S,129);function Ae(o,e){if(!re(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return ue!==void 0?ue.createHTML(e):e}var qe=(o,e)=>{let t=o.length-1,s=[],r,i=e===2?"<svg>":e===3?"<math>":"",n=U;for(let l=0;l<t;l++){let a=o[l],p,m,d=-1,v=0;for(;v<a.length&&(n.lastIndex=v,m=n.exec(a),m!==null);)v=n.lastIndex,n===U?m[1]==="!--"?n=me:m[1]!==void 0?n=fe:m[2]!==void 0?(ye.test(m[2])&&(r=RegExp("</"+m[2],"g")),n=k):m[3]!==void 0&&(n=k):n===k?m[0]===">"?(n=r??U,d=-1):m[1]===void 0?d=-2:(d=n.lastIndex-m[2].length,p=m[1],n=m[3]===void 0?k:m[3]==='"'?ve:ge):n===ve||n===ge?n=k:n===me||n===fe?n=U:(n=k,r=void 0);let _=n===k&&o[l+1].startsWith("/>")?" ":"";i+=n===U?a+Be:d>=0?(s.push(p),a.slice(0,d)+_e+a.slice(d)+b+_):a+b+(d===-2?l:_)}return[Ae(o,i+(o[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},H=class o{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let i=0,n=0,l=e.length-1,a=this.parts,[p,m]=qe(e,t);if(this.el=o.createElement(p,s),E.currentNode=this.el.content,t===2||t===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=E.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let d of r.getAttributeNames())if(d.endsWith(_e)){let v=m[n++],_=r.getAttribute(d).split(b),N=/([.?@])?(.*)/.exec(v);a.push({type:1,index:i,name:N[2],strings:_,ctor:N[1]==="."?Q:N[1]==="?"?Y:N[1]==="@"?ee:L}),r.removeAttribute(d)}else d.startsWith(b)&&(a.push({type:6,index:i}),r.removeAttribute(d));if(ye.test(r.tagName)){let d=r.textContent.split(b),v=d.length-1;if(v>0){r.textContent=z?z.emptyScript:"";for(let _=0;_<v;_++)r.append(d[_],R()),E.nextNode(),a.push({type:2,index:++i});r.append(d[v],R())}}}else if(r.nodeType===8)if(r.data===be)a.push({type:2,index:i});else{let d=-1;for(;(d=r.data.indexOf(b,d+1))!==-1;)a.push({type:7,index:i}),d+=b.length-1}i++}}static createElement(e,t){let s=S.createElement("template");return s.innerHTML=e,s}};function P(o,e,t=o,s){if(e===x)return e;let r=s!==void 0?t._$Co?.[s]:t._$Cl,i=O(e)?void 0:e._$litDirective$;return r?.constructor!==i&&(r?._$AO?.(!1),i===void 0?r=void 0:(r=new i(o),r._$AT(o,t,s)),s!==void 0?(t._$Co??=[])[s]=r:t._$Cl=r),r!==void 0&&(e=P(o,r._$AS(o,e.values),r,s)),e}var G=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,r=(e?.creationScope??S).importNode(t,!0);E.currentNode=r;let i=E.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let p;a.type===2?p=new j(i,i.nextSibling,this,e):a.type===1?p=new a.ctor(i,a.name,a.strings,this,e):a.type===6&&(p=new te(i,this,e)),this._$AV.push(p),a=s[++l]}n!==a?.index&&(i=E.nextNode(),n++)}return E.currentNode=S,r}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},j=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,r){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=P(this,e,t),O(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==x&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Fe(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(S.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=H.createElement(Ae(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(t);else{let i=new G(r,this),n=i.u(this.options);i.p(t),this.T(n),this._$AH=i}}_$AC(e){let t=$e.get(e.strings);return t===void 0&&$e.set(e.strings,t=new H(e)),t}k(e){re(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,r=0;for(let i of e)r===t.length?t.push(s=new o(this.O(R()),this.O(R()),this,this.options)):s=t[r],s._$AI(i),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=pe(e).nextSibling;pe(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},L=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,i){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(e,t=this,s,r){let i=this.strings,n=!1;if(i===void 0)e=P(this,e,t,0),n=!O(e)||e!==this._$AH&&e!==x,n&&(this._$AH=e);else{let l=e,a,p;for(e=i[0],a=0;a<i.length-1;a++)p=P(this,l[s+a],t,a),p===x&&(p=this._$AH[a]),n||=!O(p)||p!==this._$AH[a],p===c?e=c:e!==c&&(e+=(p??"")+i[a+1]),this._$AH[a]=p}n&&!r&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Q=class extends L{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}},Y=class extends L{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}},ee=class extends L{constructor(e,t,s,r,i){super(e,t,s,r,i),this.type=5}_$AI(e,t=this){if((e=P(this,e,t,0)??c)===x)return;let s=this._$AH,r=e===c&&s!==c||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,i=e!==c&&(s===c||r);r&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},te=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){P(this,e)}};var Ie=se.litHtmlPolyfillSupport;Ie?.(H,j),(se.litHtmlVersions??=[]).push("3.3.2");var we=(o,e,t)=>{let s=t?.renderBefore??e,r=s._$litPart$;if(r===void 0){let i=t?.renderBefore??null;s._$litPart$=r=new j(e.insertBefore(R(),i),i,void 0,t??{})}return r._$AI(o),r};var ie=globalThis,y=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=we(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};y._$litElement$=!0,y.finalized=!0,ie.litElementHydrateSupport?.({LitElement:y});var Ve=ie.litElementPolyfillSupport;Ve?.({LitElement:y});(ie.litElementVersions??=[]).push("4.2.2");var A=o=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(o,e)}):customElements.define(o,e)};var ze={attribute:!0,type:String,converter:M,reflect:!1,hasChanged:V},We=(o=ze,e,t)=>{let{kind:s,metadata:r}=t,i=globalThis.litPropertyMetadata.get(r);if(i===void 0&&globalThis.litPropertyMetadata.set(r,i=new Map),s==="setter"&&((o=Object.create(o)).wrapped=!0),i.set(t.name,o),s==="accessor"){let{name:n}=t;return{set(l){let a=e.get.call(this);e.set.call(this,l),this.requestUpdate(n,a,o,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,o,l),l}}}if(s==="setter"){let{name:n}=t;return function(l){let a=this[n];e.call(this,l),this.requestUpdate(n,a,o,!0,l)}}throw Error("Unsupported decorator location: "+s)};function f(o){return(e,t)=>typeof t=="object"?We(o,e,t):((s,r,i)=>{let n=r.hasOwnProperty(i);return r.constructor.createProperty(i,s),n?Object.getOwnPropertyDescriptor(r,i):void 0})(o,e,t)}function ke(o){return f({...o,state:!0,attribute:!1})}var w=class extends y{createRenderRoot(){return this.hasAttribute("data-prerendered")&&(this.replaceChildren(),this.removeAttribute("data-prerendered")),this}};function Ee(){let o=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",o);try{localStorage.setItem("cs-theme",o);let e=/\.?codesense\.dev$/.test(window.location.hostname)?"; domain=.codesense.dev":"";document.cookie=`cs-theme=${o}; max-age=31536000; path=/${e}; SameSite=Lax`}catch{}}var Ke={lpdf:{slug:"lpdf",name:"Lpdf",mark:"/assets/images/lpdf-mark.svg",tagline:`PDF as Code
on every platform`,contactEmail:"license@lpdf.io",packages:{heading:"SDKs",rows:[{name:"JavaScript",href:"/docs/install/?sdk=js",registry:{label:"npm",url:"https://www.npmjs.com/package/@lpdfio/lpdf"}},{name:"Python",href:"/docs/install/?sdk=python",registry:{label:"PyPI",url:"https://pypi.org/project/lpdfio-lpdf/"}},{name:"Java",href:"/docs/install/?sdk=java",registry:{label:"Maven Central",url:"https://central.sonatype.com/artifact/io.lpdf/lpdf"}},{name:"C#",href:"/docs/install/?sdk=dotnet",registry:{label:"NuGet",url:"https://www.nuget.org/packages/Lpdfio.Lpdf"}},{name:"PHP",href:"/docs/install/?sdk=php",registry:{label:"Packagist",url:"https://packagist.org/packages/lpdfio/lpdf"}}]},tooling:{heading:"Tooling",links:[{label:"VS Code Marketplace",href:"https://marketplace.visualstudio.com/items?itemName=lpdfio.lpdf"},{label:"Open VSX",href:"https://open-vsx.org/extension/lpdfio/lpdf"}]},documentation:[{label:"Installation",href:"/docs/install/"},{label:"Layout model",href:"/docs/doc/layout/"},{label:"Layers",href:"/docs/doc/layer/"},{label:"Data binding",href:"/docs/data/binding/"},{label:"Markdown",href:"/docs/doc/markdown/"},{label:"PDF/A",href:"/docs/pdfa/"},{label:"PDF/UA",href:"/docs/pdfua/"},{label:"PDF/X",href:"/docs/pdfx/"},{label:"Factur-X / ZUGFeRD",href:"/docs/factur-x-zugferd/"},{label:"XML schema",href:"/docs/xml/schema/"},{label:"Releases",href:"https://github.com/lpdfio/lpdf/releases"}],licensing:[{label:"Pricing",href:"/pricing/"},{label:"License",href:"/license/"},{label:"Support",href:"/support/"}],legalLinks:[{label:"License",href:"/license/"},{label:"Support",href:"/support/"}]},authstack:{slug:"authstack",name:"AuthStack",mark:"/assets/images/authstack-mark.svg",tagline:`Auth as Config
for every service`,contactEmail:"license@authstack.id",packages:{heading:"Packages",rows:[{name:"ASP.NET Core",href:"/docs/backend/setup/"},{name:"Web components",href:"/docs/frontend/setup/"}]},documentation:[{label:"Quick start",href:"/docs/start/quick-start/"},{label:"Auth flow",href:"/docs/concepts/auth-flow/"},{label:"Backend setup",href:"/docs/backend/setup/"},{label:"Frontend setup",href:"/docs/frontend/setup/"},{label:"Web components",href:"/docs/frontend/components/"},{label:"Providers",href:"/docs/providers/"}],licensing:[{label:"Pricing",href:"/pricing"},{label:"License",href:"/license"}],legalLinks:[{label:"Pricing",href:"/pricing"},{label:"License",href:"/license"}]}};function K(o){return Ke[o]}function Ze(o,e){let t=e?[{label:"Contact us",href:`mailto:${e}`}]:[];return[{label:"Customer portal",href:o},...t,{label:"Terms of Service",href:`${o}/terms`},{label:"Privacy Policy",href:`${o}/privacy`},{label:"Refund Policy",href:`${o}/refunds`}]}function Se(o,e){return[{heading:"Documentation",links:o.documentation},{heading:"Licensing",links:o.licensing},{heading:"Company",links:Ze(e,o.contactEmail)}]}function xe(o){return!o.startsWith("/")}var Je="cs-platform",Xe=[{id:"xml",label:"XML"},{id:"js",label:"JavaScript",github:"https://github.com/lpdfio/lpdf-js",registry:{label:"npm",url:"https://www.npmjs.com/package/@lpdfio/lpdf"}},{id:"python",label:"Python",github:"https://github.com/lpdfio/lpdf-python",registry:{label:"PyPI",url:"https://pypi.org/project/lpdfio-lpdf/"}},{id:"java",label:"Java",github:"https://github.com/lpdfio/lpdf-java",registry:{label:"Maven Central",url:"https://central.sonatype.com/artifact/io.lpdf/lpdf"}},{id:"dotnet",label:"C#",github:"https://github.com/lpdfio/lpdf-dotnet",registry:{label:"NuGet",url:"https://www.nuget.org/packages/Lpdfio.Lpdf"}},{id:"php",label:"PHP",github:"https://github.com/lpdfio/lpdf-php",registry:{label:"Packagist",url:"https://packagist.org/packages/lpdfio/lpdf"}}],Ge=h`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,16.37a86.4,86.4,0,0,1,16,3V212.67a86.4,86.4,0,0,1-16,3Zm32,9.26a87.81,87.81,0,0,1,16,10.54V195.83a87.81,87.81,0,0,1-16,10.54ZM40,128a88.11,88.11,0,0,1,80-87.63V215.63A88.11,88.11,0,0,1,40,128Zm160,50.54V77.46a87.82,87.82,0,0,1,0,101.08Z"></path></svg>`,g=class extends w{constructor(){super(...arguments);this.variant="home";this.authenticated=!1;this.hasPage=!1;this.product="lpdf";this.platforms=Xe;this._platform=(()=>{try{return localStorage.getItem(Je)??"js"}catch{return"js"}})();this._onPlatform=t=>{let s=t.detail;s!==this._platform&&(this._platform=s)}}firstUpdated(){if(this._markActiveLink(),this.variant==="docs"){let t=new URLSearchParams(window.location.search).get("sdk");t&&(this._platform=t)}}connectedCallback(){super.connectedCallback(),this.variant==="docs"&&window.addEventListener("cs-platform",this._onPlatform)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("cs-platform",this._onPlatform)}_markActiveLink(){let t=window.location.pathname.replace(/\/$/,"")||"/";this.querySelectorAll(".nav-links a").forEach(s=>{let r=(s.getAttribute("href")??"").replace(/\/$/,"")||"/";s.classList.toggle("active",r!==""&&r!=="/"&&t.startsWith(r))})}_handleThemeToggle(){Ee(),this.requestUpdate()}_setPlatform(t){this._platform=t,window.dispatchEvent(new CustomEvent("cs-platform",{detail:t}))}get _site(){return K(this.product)}_logo(t){return h`
            <a href="${t}" class="nav-logo">
                <img src="${this.logoMark??this._site?.mark??""}" alt="" class="nav-logo-mark" />
                <span class="nav-logo-word">${this.logoWord??this._site?.name??""}</span>
            </a>
        `}_themeBtn(){return h`
            <button class="theme-btn" @click=${this._handleThemeToggle} aria-label="Toggle theme">
                ${Ge}
            </button>
        `}_sdkDropdown(){return h`
            <div class="nav-sdk-wrap">
                <select
                    class="nav-sdk-select"
                    .value=${this._platform}
                    @change=${t=>this._setPlatform(t.target.value)}>
                    ${this.platforms.map(t=>h`
                        <option value=${t.id} ?selected=${this._platform===t.id}>${t.label}</option>
                    `)}
                </select>
            </div>
        `}_renderDocsLinks(){if(!this.hasPage)return c;let t=this.platforms.find(s=>s.id===this._platform);return!t?.github||!t.registry?c:h`
            <a target="_blank" rel="noopener noreferrer" href=${t.registry.url} class="btn btn-secondary btn-sm">${t.registry.label}</a>
            <a target="_blank" rel="noopener noreferrer" href=${t.github} class="btn btn-secondary btn-sm">GitHub</a>
        `}render(){if(!this._site)return c;switch(this.variant){case"home":return this._renderHome();case"docs":return this._renderDocs();case"legal":return this._renderLegal();case"pricing":return this._renderPricing();case"checkout":return this._renderCheckout()}}_renderCheckout(){return h`
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
        `}_renderHome(){return h`
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
        `}_renderPricing(){return h`
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
        `}_renderDocs(){return h`
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
        `}_renderLegal(){return h`
            <nav class="nav">
                <div class="nav-inner rl-row rl-justify-between rl-align-center">
                    <div class="rl-row rl-gap-l rl-align-center">
                        ${this._logo("/")}
                        <span class="nav-section-label">Legal</span>
                    </div>
                    <div class="rl-row rl-gap-xl rl-align-center nav-links">
                        ${this._site?.legalLinks.map(t=>h`
                            <a href="${t.href}">${t.label}</a>
                        `)}
                        ${this._themeBtn()}
                    </div>
                </div>
            </nav>
        `}};u([f({reflect:!0})],g.prototype,"variant",2),u([f({type:Boolean,reflect:!0})],g.prototype,"authenticated",2),u([f({type:Boolean,attribute:"has-page",reflect:!0})],g.prototype,"hasPage",2),u([f()],g.prototype,"product",2),u([f({attribute:"logo-mark"})],g.prototype,"logoMark",2),u([f({attribute:"logo-word"})],g.prototype,"logoWord",2),u([f({type:Array})],g.prototype,"platforms",2),u([ke()],g.prototype,"_platform",2),g=u([A("site-nav")],g);var Qe="__PORTAL_URL__",C=class extends w{constructor(){super(...arguments);this.product=""}render(){let t=K(this.product);return t?h`
            <footer>
                <!-- No .container: the columns run the full width inside the same gutter as the
                     header, so the footer's first column lines up under the header's logo. -->
                <div class="footer-columns">
                    <!-- fit-m, not fit-l: five tracks at the l minimum (200px) need 1096px, so the
                         last column wrapped below a 1160px viewport — on an iPad in landscape,
                         among others. The m minimum (150px) holds all five to about 910px, and
                         nothing in these columns is wider than that. "VS Code Marketplace", the
                         longest label, measures ~135px. -->
                    <div class="rl-grid rl-grid-fit-m rl-gap-xl">
                        ${this._brandColumn(t)}
                        <!-- Packages before Documentation: the quick start lives in that column, so it
                             is where a reader starts. Documentation is the reference you consult
                             once something already runs. -->
                        ${this._packageColumn(t)}
                        ${Se(t,Qe).map(s=>this._column(s.heading,s.links))}
                    </div>
                </div>
                <div class="footer-baseline">
                    <p class="footer-copy">© 2026 Codesense LLC</p>
                </div>
            </footer>
        `:c}_brandColumn(t){return h`
            <div class="rl-column rl-gap-s">
                <a href="/" class="footer-logo">
                    <img src="${t.mark}" alt="" class="footer-logo-mark" />
                    <span class="footer-logo-word">${t.name}</span>
                </a>
                <p class="footer-tagline">
                    ${t.tagline.split(`
`).flatMap((s,r,i)=>r<i.length-1?[s,h`<br />`]:[s])}
                </p>
            </div>
        `}_packageColumn(t){return h`
            <div class="rl-column rl-gap-xl">
                <div class="rl-column rl-gap-s">
                    <span class="footer-heading">${t.packages.heading}</span>
                    <div class="rl-column rl-gap-m">
                        ${t.packages.rows.map(s=>h`
                            <div class="rl-row rl-nowrap rl-gap-m rl-align-center">
                                <a href="${s.href}" class="footer-sdk">${s.name}</a>
                                ${s.registry?h`
                                        <span class="footer-sdk-sep" aria-hidden="true">/</span>
                                        <span class="footer-links footer-sdk-links">
                                            <a href="${s.registry.url}" target="_blank" rel="noopener noreferrer">${s.registry.label}</a>
                                        </span>
                                    `:c}
                            </div>
                        `)}
                    </div>
                </div>
                ${t.tooling?this._column(t.tooling.heading,t.tooling.links):c}
            </div>
        `}_column(t,s){return h`
            <div class="rl-column rl-gap-s">
                <span class="footer-heading">${t}</span>
                <div class="rl-column rl-gap-m footer-links">
                    ${s.map(r=>xe(r.href)?h`<a href="${r.href}" target="_blank" rel="noopener noreferrer">${r.label}</a>`:h`<a href="${r.href}">${r.label}</a>`)}
                </div>
            </div>
        `}};u([f()],C.prototype,"product",2),C=u([A("product-footer")],C);var Z=class extends C{constructor(){super(),this.product="lpdf"}};Z=u([A("lpdf-footer")],Z);function Ce(){location.hash||(document.body.tabIndex=-1,document.body.focus({preventScroll:!0}))}try{let o=document.cookie.split("; ").find(s=>s.startsWith("cs-theme="))?.split("=")[1],e=localStorage.getItem("cs-theme"),t=o??e;if(t&&document.documentElement.setAttribute("data-theme",t),!o&&e){let s=/\.?codesense\.dev$/.test(window.location.hostname)?"; domain=.codesense.dev":"";document.cookie=`cs-theme=${e}; max-age=31536000; path=/${s}; SameSite=Lax`}}catch{}Ce();var Pe="__PORTAL_URL__",D=class extends w{constructor(){super(...arguments);this.doc=""}connectedCallback(){super.connectedCallback(),this.doc&&window.location.replace(`${Pe}/${this.doc}`)}render(){let t=`${Pe}/${this.doc}`;return h`
            <div class="container rl-column rl-gap-m rl-padding-2xl">
                <p>This page has moved to <a href="${t}">${t}</a>.</p>
                <p class="rl-text-s" style="color:var(--text-muted);">
                    Terms, Privacy and Refunds are Codesense-wide and now live on the portal.
                    Redirecting you now.
                </p>
            </div>
        `}};u([f()],D.prototype,"doc",2),D=u([A("legal-redirect")],D);})();
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
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
