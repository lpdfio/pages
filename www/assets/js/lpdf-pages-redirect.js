"use strict";(()=>{var Lt=Object.defineProperty;var Tt=Object.getOwnPropertyDescriptor;var u=(o,t,e,s)=>{for(var r=s>1?void 0:s?Tt(t,e):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Lt(t,e,r),r};var B=globalThis,q=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,at=Symbol(),nt=new WeakMap,F=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==at)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(q&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=nt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&nt.set(e,t))}return t}toString(){return this.cssText}},lt=o=>new F(typeof o=="string"?o:o+"",void 0,at);var ct=(o,t)=>{if(q)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),r=B.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,o.appendChild(s)}},Z=q?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return lt(e)})(o):o;var{is:Mt,defineProperty:Ut,getOwnPropertyDescriptor:Rt,getOwnPropertyNames:Ot,getOwnPropertySymbols:Ht,getPrototypeOf:jt}=Object,I=globalThis,ht=I.trustedTypes,Dt=ht?ht.emptyScript:"",Nt=I.reactiveElementPolyfillSupport,T=(o,t)=>o,M={toAttribute(o,t){switch(t){case Boolean:o=o?Dt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},V=(o,t)=>!Mt(o,t),dt={attribute:!0,type:String,converter:M,reflect:!1,useDefault:!1,hasChanged:V};Symbol.metadata??=Symbol("metadata"),I.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=dt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Ut(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){let{get:r,set:i}=Rt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){let l=r?.call(this);i?.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??dt}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;let t=jt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){let e=this.properties,s=[...Ot(e),...Ht(e)];for(let r of s)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let r of s)e.unshift(Z(r))}else t!==void 0&&e.push(Z(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ct(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){let i=(s.converter?.toAttribute!==void 0?s.converter:M).toAttribute(e,s.type);this._$Em=t,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(t,e){let s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let i=s.getPropertyOptions(r),n=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:M;this._$Em=r;let l=n.fromAttribute(e,i.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(t,e,s,r=!1,i){if(t!==void 0){let n=this.constructor;if(r===!1&&(i=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??V)(i,e)||s.useDefault&&s.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:i},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),i!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,i]of this._$Ep)this[r]=i;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,i]of s){let{wrapped:n}=i,l=this[r];n!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,i,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[T("elementProperties")]=new Map,$[T("finalized")]=new Map,Nt?.({ReactiveElement:$}),(I.reactiveElementVersions??=[]).push("2.1.2");var st=globalThis,pt=o=>o,W=st.trustedTypes,ut=W?W.createPolicy("lit-html",{createHTML:o=>o}):void 0,_t="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,bt="?"+b,Bt=`<${bt}>`,S=document,R=()=>S.createComment(""),O=o=>o===null||typeof o!="object"&&typeof o!="function",rt=Array.isArray,Ft=o=>rt(o)||typeof o?.[Symbol.iterator]=="function",X=`[ 	
\f\r]`,U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,mt=/-->/g,ft=/>/g,k=RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),gt=/'/g,vt=/"/g,yt=/^(?:script|style|textarea|title)$/i,ot=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),h=ot(1),ie=ot(2),ne=ot(3),x=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),$t=new WeakMap,E=S.createTreeWalker(S,129);function At(o,t){if(!rt(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return ut!==void 0?ut.createHTML(t):t}var qt=(o,t)=>{let e=o.length-1,s=[],r,i=t===2?"<svg>":t===3?"<math>":"",n=U;for(let l=0;l<e;l++){let a=o[l],p,m,d=-1,v=0;for(;v<a.length&&(n.lastIndex=v,m=n.exec(a),m!==null);)v=n.lastIndex,n===U?m[1]==="!--"?n=mt:m[1]!==void 0?n=ft:m[2]!==void 0?(yt.test(m[2])&&(r=RegExp("</"+m[2],"g")),n=k):m[3]!==void 0&&(n=k):n===k?m[0]===">"?(n=r??U,d=-1):m[1]===void 0?d=-2:(d=n.lastIndex-m[2].length,p=m[1],n=m[3]===void 0?k:m[3]==='"'?vt:gt):n===vt||n===gt?n=k:n===mt||n===ft?n=U:(n=k,r=void 0);let _=n===k&&o[l+1].startsWith("/>")?" ":"";i+=n===U?a+Bt:d>=0?(s.push(p),a.slice(0,d)+_t+a.slice(d)+b+_):a+b+(d===-2?l:_)}return[At(o,i+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},H=class o{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let i=0,n=0,l=t.length-1,a=this.parts,[p,m]=qt(t,e);if(this.el=o.createElement(p,s),E.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=E.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let d of r.getAttributeNames())if(d.endsWith(_t)){let v=m[n++],_=r.getAttribute(d).split(b),N=/([.?@])?(.*)/.exec(v);a.push({type:1,index:i,name:N[2],strings:_,ctor:N[1]==="."?Q:N[1]==="?"?Y:N[1]==="@"?tt:L}),r.removeAttribute(d)}else d.startsWith(b)&&(a.push({type:6,index:i}),r.removeAttribute(d));if(yt.test(r.tagName)){let d=r.textContent.split(b),v=d.length-1;if(v>0){r.textContent=W?W.emptyScript:"";for(let _=0;_<v;_++)r.append(d[_],R()),E.nextNode(),a.push({type:2,index:++i});r.append(d[v],R())}}}else if(r.nodeType===8)if(r.data===bt)a.push({type:2,index:i});else{let d=-1;for(;(d=r.data.indexOf(b,d+1))!==-1;)a.push({type:7,index:i}),d+=b.length-1}i++}}static createElement(t,e){let s=S.createElement("template");return s.innerHTML=t,s}};function P(o,t,e=o,s){if(t===x)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl,i=O(t)?void 0:t._$litDirective$;return r?.constructor!==i&&(r?._$AO?.(!1),i===void 0?r=void 0:(r=new i(o),r._$AT(o,e,s)),s!==void 0?(e._$Co??=[])[s]=r:e._$Cl=r),r!==void 0&&(t=P(o,r._$AS(o,t.values),r,s)),t}var G=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??S).importNode(e,!0);E.currentNode=r;let i=E.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let p;a.type===2?p=new j(i,i.nextSibling,this,t):a.type===1?p=new a.ctor(i,a.name,a.strings,this,t):a.type===6&&(p=new et(i,this,t)),this._$AV.push(p),a=s[++l]}n!==a?.index&&(i=E.nextNode(),n++)}return E.currentNode=S,r}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},j=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=P(this,t,e),O(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==x&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ft(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(S.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=H.createElement(At(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{let i=new G(r,this),n=i.u(this.options);i.p(e),this.T(n),this._$AH=i}}_$AC(t){let e=$t.get(t.strings);return e===void 0&&$t.set(t.strings,e=new H(t)),e}k(t){rt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,r=0;for(let i of t)r===e.length?e.push(s=new o(this.O(R()),this.O(R()),this,this.options)):s=e[r],s._$AI(i),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=pt(t).nextSibling;pt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},L=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,i){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(t,e=this,s,r){let i=this.strings,n=!1;if(i===void 0)t=P(this,t,e,0),n=!O(t)||t!==this._$AH&&t!==x,n&&(this._$AH=t);else{let l=t,a,p;for(t=i[0],a=0;a<i.length-1;a++)p=P(this,l[s+a],e,a),p===x&&(p=this._$AH[a]),n||=!O(p)||p!==this._$AH[a],p===c?t=c:t!==c&&(t+=(p??"")+i[a+1]),this._$AH[a]=p}n&&!r&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Q=class extends L{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},Y=class extends L{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},tt=class extends L{constructor(t,e,s,r,i){super(t,e,s,r,i),this.type=5}_$AI(t,e=this){if((t=P(this,t,e,0)??c)===x)return;let s=this._$AH,r=t===c&&s!==c||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==c&&(s===c||r);r&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},et=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t)}};var It=st.litHtmlPolyfillSupport;It?.(H,j),(st.litHtmlVersions??=[]).push("3.3.2");var wt=(o,t,e)=>{let s=e?.renderBefore??t,r=s._$litPart$;if(r===void 0){let i=e?.renderBefore??null;s._$litPart$=r=new j(t.insertBefore(R(),i),i,void 0,e??{})}return r._$AI(o),r};var it=globalThis,y=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=wt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};y._$litElement$=!0,y.finalized=!0,it.litElementHydrateSupport?.({LitElement:y});var Vt=it.litElementPolyfillSupport;Vt?.({LitElement:y});(it.litElementVersions??=[]).push("4.2.2");var A=o=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(o,t)}):customElements.define(o,t)};var Wt={attribute:!0,type:String,converter:M,reflect:!1,hasChanged:V},zt=(o=Wt,t,e)=>{let{kind:s,metadata:r}=e,i=globalThis.litPropertyMetadata.get(r);if(i===void 0&&globalThis.litPropertyMetadata.set(r,i=new Map),s==="setter"&&((o=Object.create(o)).wrapped=!0),i.set(e.name,o),s==="accessor"){let{name:n}=e;return{set(l){let a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,o,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,o,l),l}}}if(s==="setter"){let{name:n}=e;return function(l){let a=this[n];t.call(this,l),this.requestUpdate(n,a,o,!0,l)}}throw Error("Unsupported decorator location: "+s)};function f(o){return(t,e)=>typeof e=="object"?zt(o,t,e):((s,r,i)=>{let n=r.hasOwnProperty(i);return r.constructor.createProperty(i,s),n?Object.getOwnPropertyDescriptor(r,i):void 0})(o,t,e)}function kt(o){return f({...o,state:!0,attribute:!1})}var w=class extends y{createRenderRoot(){return this.hasAttribute("data-prerendered")&&(this.replaceChildren(),this.removeAttribute("data-prerendered")),this}};function Et(){let o=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",o);try{localStorage.setItem("cs-theme",o);let t=/\.?codesense\.dev$/.test(window.location.hostname)?"; domain=.codesense.dev":"";document.cookie=`cs-theme=${o}; max-age=31536000; path=/${t}; SameSite=Lax`}catch{}}var Kt={lpdf:{slug:"lpdf",name:"Lpdf",mark:"/assets/images/lpdf-mark.svg",tagline:`PDF as Code
on every platform`,contactEmail:"license@lpdf.io",packages:{heading:"SDKs",rows:[{name:"JavaScript",href:"/docs/install/?sdk=js",registry:{label:"npm",url:"https://www.npmjs.com/package/@lpdfio/lpdf"}},{name:"Python",href:"/docs/install/?sdk=python",registry:{label:"PyPI",url:"https://pypi.org/project/lpdfio-lpdf/"}},{name:"Java",href:"/docs/install/?sdk=java",registry:{label:"Maven Central",url:"https://central.sonatype.com/artifact/io.lpdf/lpdf"}},{name:"C#",href:"/docs/install/?sdk=dotnet",registry:{label:"NuGet",url:"https://www.nuget.org/packages/Lpdfio.Lpdf"}},{name:"PHP",href:"/docs/install/?sdk=php",registry:{label:"Packagist",url:"https://packagist.org/packages/lpdfio/lpdf"}}]},tooling:{heading:"Tooling",links:[{label:"VS Code Marketplace",href:"https://marketplace.visualstudio.com/items?itemName=lpdfio.lpdf"},{label:"Open VSX",href:"https://open-vsx.org/extension/lpdfio/lpdf"}]},documentation:[{label:"Installation",href:"/docs/install/"},{label:"Layout model",href:"/docs/doc/layout/"},{label:"Layers",href:"/docs/doc/layer/"},{label:"Data binding",href:"/docs/data/binding/"},{label:"Markdown",href:"/docs/doc/markdown/"},{label:"PDF/A",href:"/docs/pdfa/"},{label:"PDF/UA",href:"/docs/pdfua/"},{label:"PDF/X",href:"/docs/pdfx/"},{label:"Factur-X",href:"/docs/facturx/"},{label:"XML schema",href:"/docs/xml/schema/"},{label:"Releases",href:"https://github.com/lpdfio/lpdf/releases"}],licensing:[{label:"Pricing",href:"/pricing/"},{label:"License",href:"/license/"},{label:"Support",href:"/support/"}],legalLinks:[{label:"License",href:"/license/"},{label:"Support",href:"/support/"}]},authstack:{slug:"authstack",name:"AuthStack",mark:"/assets/images/authstack-mark.svg",tagline:`Auth as Config
for every service`,contactEmail:"license@authstack.id",packages:{heading:"Packages",rows:[{name:"ASP.NET Core",href:"/docs/backend/setup/"},{name:"Web components",href:"/docs/frontend/setup/"}]},documentation:[{label:"Quick start",href:"/docs/start/quick-start/"},{label:"Auth flow",href:"/docs/concepts/auth-flow/"},{label:"Backend setup",href:"/docs/backend/setup/"},{label:"Frontend setup",href:"/docs/frontend/setup/"},{label:"Web components",href:"/docs/frontend/components/"},{label:"Providers",href:"/docs/providers/"}],licensing:[{label:"Pricing",href:"/pricing"},{label:"License",href:"/license"}],legalLinks:[{label:"Pricing",href:"/pricing"},{label:"License",href:"/license"}]}};function K(o){return Kt[o]}function Jt(o,t){let e=t?[{label:"Contact us",href:`mailto:${t}`}]:[];return[{label:"Customer portal",href:o},...e,{label:"Terms of Service",href:`${o}/terms`},{label:"Privacy Policy",href:`${o}/privacy`},{label:"Refund Policy",href:`${o}/refunds`}]}function St(o,t){return[{heading:"Documentation",links:o.documentation},{heading:"Licensing",links:o.licensing},{heading:"Company",links:Jt(t,o.contactEmail)}]}function xt(o){return!o.startsWith("/")}var Zt="cs-platform",Xt=[{id:"xml",label:"XML"},{id:"js",label:"JavaScript",github:"https://github.com/lpdfio/lpdf-js",registry:{label:"npm",url:"https://www.npmjs.com/package/@lpdfio/lpdf"}},{id:"python",label:"Python",github:"https://github.com/lpdfio/lpdf-python",registry:{label:"PyPI",url:"https://pypi.org/project/lpdfio-lpdf/"}},{id:"java",label:"Java",github:"https://github.com/lpdfio/lpdf-java",registry:{label:"Maven Central",url:"https://central.sonatype.com/artifact/io.lpdf/lpdf"}},{id:"dotnet",label:"C#",github:"https://github.com/lpdfio/lpdf-dotnet",registry:{label:"NuGet",url:"https://www.nuget.org/packages/Lpdfio.Lpdf"}},{id:"php",label:"PHP",github:"https://github.com/lpdfio/lpdf-php",registry:{label:"Packagist",url:"https://packagist.org/packages/lpdfio/lpdf"}}],Gt=h`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,16.37a86.4,86.4,0,0,1,16,3V212.67a86.4,86.4,0,0,1-16,3Zm32,9.26a87.81,87.81,0,0,1,16,10.54V195.83a87.81,87.81,0,0,1-16,10.54ZM40,128a88.11,88.11,0,0,1,80-87.63V215.63A88.11,88.11,0,0,1,40,128Zm160,50.54V77.46a87.82,87.82,0,0,1,0,101.08Z"></path></svg>`,g=class extends w{constructor(){super(...arguments);this.variant="home";this.authenticated=!1;this.hasPage=!1;this.product="lpdf";this.platforms=Xt;this._platform=(()=>{try{return localStorage.getItem(Zt)??"js"}catch{return"js"}})();this._onPlatform=e=>{let s=e.detail;s!==this._platform&&(this._platform=s)}}firstUpdated(){if(this._markActiveLink(),this.variant==="docs"){let e=new URLSearchParams(window.location.search).get("sdk");e&&(this._platform=e)}}connectedCallback(){super.connectedCallback(),this.variant==="docs"&&window.addEventListener("cs-platform",this._onPlatform)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("cs-platform",this._onPlatform)}_markActiveLink(){let e=window.location.pathname.replace(/\/$/,"")||"/";this.querySelectorAll(".nav-links a").forEach(s=>{let r=(s.getAttribute("href")??"").replace(/\/$/,"")||"/";s.classList.toggle("active",r!==""&&r!=="/"&&e.startsWith(r))})}_handleThemeToggle(){Et(),this.requestUpdate()}_setPlatform(e){this._platform=e,window.dispatchEvent(new CustomEvent("cs-platform",{detail:e}))}get _site(){return K(this.product)}_logo(e){return h`
            <a href="${e}" class="nav-logo">
                <img src="${this.logoMark??this._site?.mark??""}" alt="" class="nav-logo-mark" />
                <span class="nav-logo-word">${this.logoWord??this._site?.name??""}</span>
            </a>
        `}_themeBtn(){return h`
            <button class="theme-btn" @click=${this._handleThemeToggle} aria-label="Toggle theme">
                ${Gt}
            </button>
        `}_sdkDropdown(){return h`
            <div class="nav-sdk-wrap">
                <select
                    class="nav-sdk-select"
                    .value=${this._platform}
                    @change=${e=>this._setPlatform(e.target.value)}>
                    ${this.platforms.map(e=>h`
                        <option value=${e.id} ?selected=${this._platform===e.id}>${e.label}</option>
                    `)}
                </select>
            </div>
        `}_renderDocsLinks(){if(!this.hasPage)return c;let e=this.platforms.find(s=>s.id===this._platform);return!e?.github||!e.registry?c:h`
            <a target="_blank" rel="noopener noreferrer" href=${e.registry.url} class="btn btn-secondary btn-sm">${e.registry.label}</a>
            <a target="_blank" rel="noopener noreferrer" href=${e.github} class="btn btn-secondary btn-sm">GitHub</a>
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
                        ${this._site?.legalLinks.map(e=>h`
                            <a href="${e.href}">${e.label}</a>
                        `)}
                        ${this._themeBtn()}
                    </div>
                </div>
            </nav>
        `}};u([f({reflect:!0})],g.prototype,"variant",2),u([f({type:Boolean,reflect:!0})],g.prototype,"authenticated",2),u([f({type:Boolean,attribute:"has-page",reflect:!0})],g.prototype,"hasPage",2),u([f()],g.prototype,"product",2),u([f({attribute:"logo-mark"})],g.prototype,"logoMark",2),u([f({attribute:"logo-word"})],g.prototype,"logoWord",2),u([f({type:Array})],g.prototype,"platforms",2),u([kt()],g.prototype,"_platform",2),g=u([A("site-nav")],g);var Qt="__PORTAL_URL__",C=class extends w{constructor(){super(...arguments);this.product=""}render(){let e=K(this.product);return e?h`
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
                        ${this._brandColumn(e)}
                        <!-- Packages before Documentation: the quick start lives in that column, so it
                             is where a reader starts. Documentation is the reference you consult
                             once something already runs. -->
                        ${this._packageColumn(e)}
                        ${St(e,Qt).map(s=>this._column(s.heading,s.links))}
                    </div>
                </div>
                <div class="footer-baseline">
                    <p class="footer-copy">© 2026 Codesense LLC</p>
                </div>
            </footer>
        `:c}_brandColumn(e){return h`
            <div class="rl-column rl-gap-s">
                <a href="/" class="footer-logo">
                    <img src="${e.mark}" alt="" class="footer-logo-mark" />
                    <span class="footer-logo-word">${e.name}</span>
                </a>
                <p class="footer-tagline">
                    ${e.tagline.split(`
`).flatMap((s,r,i)=>r<i.length-1?[s,h`<br />`]:[s])}
                </p>
            </div>
        `}_packageColumn(e){return h`
            <div class="rl-column rl-gap-xl">
                <div class="rl-column rl-gap-s">
                    <span class="footer-heading">${e.packages.heading}</span>
                    <div class="rl-column rl-gap-m">
                        ${e.packages.rows.map(s=>h`
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
                ${e.tooling?this._column(e.tooling.heading,e.tooling.links):c}
            </div>
        `}_column(e,s){return h`
            <div class="rl-column rl-gap-s">
                <span class="footer-heading">${e}</span>
                <div class="rl-column rl-gap-m footer-links">
                    ${s.map(r=>xt(r.href)?h`<a href="${r.href}" target="_blank" rel="noopener noreferrer">${r.label}</a>`:h`<a href="${r.href}">${r.label}</a>`)}
                </div>
            </div>
        `}};u([f()],C.prototype,"product",2),C=u([A("product-footer")],C);var J=class extends C{constructor(){super(),this.product="lpdf"}};J=u([A("lpdf-footer")],J);function Ct(){location.hash||(document.body.tabIndex=-1,document.body.focus({preventScroll:!0}))}try{let o=document.cookie.split("; ").find(s=>s.startsWith("cs-theme="))?.split("=")[1],t=localStorage.getItem("cs-theme"),e=o??t;if(e&&document.documentElement.setAttribute("data-theme",e),!o&&t){let s=/\.?codesense\.dev$/.test(window.location.hostname)?"; domain=.codesense.dev":"";document.cookie=`cs-theme=${t}; max-age=31536000; path=/${s}; SameSite=Lax`}}catch{}Ct();var Pt="__PORTAL_URL__",D=class extends w{constructor(){super(...arguments);this.doc=""}connectedCallback(){super.connectedCallback(),this.doc&&window.location.replace(`${Pt}/${this.doc}`)}render(){let e=`${Pt}/${this.doc}`;return h`
            <div class="container rl-column rl-gap-m rl-padding-2xl">
                <p>This page has moved to <a href="${e}">${e}</a>.</p>
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
