"use strict";(()=>{var Ct=Object.defineProperty;var Pt=Object.getOwnPropertyDescriptor;var m=(i,t,e,s)=>{for(var r=s>1?void 0:s?Pt(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Ct(t,e,r),r};var D=globalThis,q=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,nt=Symbol(),ot=new WeakMap,B=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==nt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(q&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=ot.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ot.set(e,t))}return t}toString(){return this.cssText}},at=i=>new B(typeof i=="string"?i:i+"",void 0,nt);var lt=(i,t)=>{if(q)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),r=D.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Z=q?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return at(e)})(i):i;var{is:Lt,defineProperty:Tt,getOwnPropertyDescriptor:Mt,getOwnPropertyNames:Rt,getOwnPropertySymbols:Ut,getPrototypeOf:Ht}=Object,I=globalThis,ct=I.trustedTypes,Ot=ct?ct.emptyScript:"",Nt=I.reactiveElementPolyfillSupport,T=(i,t)=>i,M={toAttribute(i,t){switch(t){case Boolean:i=i?Ot:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},F=(i,t)=>!Lt(i,t),ht={attribute:!0,type:String,converter:M,reflect:!1,useDefault:!1,hasChanged:F};Symbol.metadata??=Symbol("metadata"),I.litPropertyMetadata??=new WeakMap;var v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ht){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Tt(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){let{get:r,set:o}=Mt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){let l=r?.call(this);o?.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ht}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;let t=Ht(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){let e=this.properties,s=[...Rt(e),...Ut(e)];for(let r of s)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let r of s)e.unshift(Z(r))}else t!==void 0&&e.push(Z(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return lt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:M).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let o=s.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:M;this._$Em=r;let l=n.fromAttribute(e,o.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(t,e,s,r=!1,o){if(t!==void 0){let n=this.constructor;if(r===!1&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??F)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,o]of s){let{wrapped:n}=o,l=this[r];n!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,o,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[T("elementProperties")]=new Map,v[T("finalized")]=new Map,Nt?.({ReactiveElement:v}),(I.reactiveElementVersions??=[]).push("2.1.2");var et=globalThis,dt=i=>i,V=et.trustedTypes,pt=V?V.createPolicy("lit-html",{createHTML:i=>i}):void 0,vt="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,_t="?"+b,jt=`<${_t}>`,w=document,U=()=>w.createComment(""),H=i=>i===null||typeof i!="object"&&typeof i!="function",st=Array.isArray,Dt=i=>st(i)||typeof i?.[Symbol.iterator]=="function",G=`[ 	
\f\r]`,R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ut=/-->/g,mt=/>/g,A=RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ft=/'/g,gt=/"/g,bt=/^(?:script|style|textarea|title)$/i,rt=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),h=rt(1),re=rt(2),ie=rt(3),S=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),$t=new WeakMap,E=w.createTreeWalker(w,129);function yt(i,t){if(!st(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return pt!==void 0?pt.createHTML(t):t}var Bt=(i,t)=>{let e=i.length-1,s=[],r,o=t===2?"<svg>":t===3?"<math>":"",n=R;for(let l=0;l<e;l++){let a=i[l],p,u,d=-1,$=0;for(;$<a.length&&(n.lastIndex=$,u=n.exec(a),u!==null);)$=n.lastIndex,n===R?u[1]==="!--"?n=ut:u[1]!==void 0?n=mt:u[2]!==void 0?(bt.test(u[2])&&(r=RegExp("</"+u[2],"g")),n=A):u[3]!==void 0&&(n=A):n===A?u[0]===">"?(n=r??R,d=-1):u[1]===void 0?d=-2:(d=n.lastIndex-u[2].length,p=u[1],n=u[3]===void 0?A:u[3]==='"'?gt:ft):n===gt||n===ft?n=A:n===ut||n===mt?n=R:(n=A,r=void 0);let _=n===A&&i[l+1].startsWith("/>")?" ":"";o+=n===R?a+jt:d>=0?(s.push(p),a.slice(0,d)+vt+a.slice(d)+b+_):a+b+(d===-2?l:_)}return[yt(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},O=class i{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0,l=t.length-1,a=this.parts,[p,u]=Bt(t,e);if(this.el=i.createElement(p,s),E.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=E.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let d of r.getAttributeNames())if(d.endsWith(vt)){let $=u[n++],_=r.getAttribute(d).split(b),j=/([.?@])?(.*)/.exec($);a.push({type:1,index:o,name:j[2],strings:_,ctor:j[1]==="."?X:j[1]==="?"?Q:j[1]==="@"?Y:C}),r.removeAttribute(d)}else d.startsWith(b)&&(a.push({type:6,index:o}),r.removeAttribute(d));if(bt.test(r.tagName)){let d=r.textContent.split(b),$=d.length-1;if($>0){r.textContent=V?V.emptyScript:"";for(let _=0;_<$;_++)r.append(d[_],U()),E.nextNode(),a.push({type:2,index:++o});r.append(d[$],U())}}}else if(r.nodeType===8)if(r.data===_t)a.push({type:2,index:o});else{let d=-1;for(;(d=r.data.indexOf(b,d+1))!==-1;)a.push({type:7,index:o}),d+=b.length-1}o++}}static createElement(t,e){let s=w.createElement("template");return s.innerHTML=t,s}};function x(i,t,e=i,s){if(t===S)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl,o=H(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=r:e._$Cl=r),r!==void 0&&(t=x(i,r._$AS(i,t.values),r,s)),t}var J=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??w).importNode(e,!0);E.currentNode=r;let o=E.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let p;a.type===2?p=new N(o,o.nextSibling,this,t):a.type===1?p=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(p=new tt(o,this,t)),this._$AV.push(p),a=s[++l]}n!==a?.index&&(o=E.nextNode(),n++)}return E.currentNode=w,r}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},N=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=x(this,t,e),H(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==S&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Dt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(w.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=O.createElement(yt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{let o=new J(r,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=$t.get(t.strings);return e===void 0&&$t.set(t.strings,e=new O(t)),e}k(t){st(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,r=0;for(let o of t)r===e.length?e.push(s=new i(this.O(U()),this.O(U()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=dt(t).nextSibling;dt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(t,e=this,s,r){let o=this.strings,n=!1;if(o===void 0)t=x(this,t,e,0),n=!H(t)||t!==this._$AH&&t!==S,n&&(this._$AH=t);else{let l=t,a,p;for(t=o[0],a=0;a<o.length-1;a++)p=x(this,l[s+a],e,a),p===S&&(p=this._$AH[a]),n||=!H(p)||p!==this._$AH[a],p===c?t=c:t!==c&&(t+=(p??"")+o[a+1]),this._$AH[a]=p}n&&!r&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},X=class extends C{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},Q=class extends C{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},Y=class extends C{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=x(this,t,e,0)??c)===S)return;let s=this._$AH,r=t===c&&s!==c||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==c&&(s===c||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},tt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){x(this,t)}};var qt=et.litHtmlPolyfillSupport;qt?.(O,N),(et.litHtmlVersions??=[]).push("3.3.2");var At=(i,t,e)=>{let s=e?.renderBefore??t,r=s._$litPart$;if(r===void 0){let o=e?.renderBefore??null;s._$litPart$=r=new N(t.insertBefore(U(),o),o,void 0,e??{})}return r._$AI(i),r};var it=globalThis,y=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=At(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};y._$litElement$=!0,y.finalized=!0,it.litElementHydrateSupport?.({LitElement:y});var It=it.litElementPolyfillSupport;It?.({LitElement:y});(it.litElementVersions??=[]).push("4.2.2");var P=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};var Ft={attribute:!0,type:String,converter:M,reflect:!1,hasChanged:F},Vt=(i=Ft,t,e)=>{let{kind:s,metadata:r}=e,o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),s==="accessor"){let{name:n}=e;return{set(l){let a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,i,l),l}}}if(s==="setter"){let{name:n}=e;return function(l){let a=this[n];t.call(this,l),this.requestUpdate(n,a,i,!0,l)}}throw Error("Unsupported decorator location: "+s)};function f(i){return(t,e)=>typeof e=="object"?Vt(i,t,e):((s,r,o)=>{let n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}function Et(i){return f({...i,state:!0,attribute:!1})}var L=class extends y{createRenderRoot(){return this.hasAttribute("data-prerendered")&&(this.replaceChildren(),this.removeAttribute("data-prerendered")),this}};function wt(){let i=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",i);try{localStorage.setItem("cs-theme",i);let t=/\.?codesense\.dev$/.test(window.location.hostname)?"; domain=.codesense.dev":"";document.cookie=`cs-theme=${i}; max-age=31536000; path=/${t}; SameSite=Lax`}catch{}}var Wt={lpdf:{slug:"lpdf",name:"Lpdf",mark:"/assets/images/lpdf-mark.svg",tagline:`PDF as Code
on every platform`,contactEmail:"license@lpdf.io",packages:{heading:"SDKs",rows:[{name:"JS / Node",href:"/docs/install/?sdk=js",github:"https://github.com/lpdfio/lpdf-js",registry:{label:"npm",url:"https://www.npmjs.com/package/@lpdfio/lpdf"}},{name:".NET",href:"/docs/install/?sdk=dotnet",github:"https://github.com/lpdfio/lpdf-dotnet",registry:{label:"NuGet",url:"https://www.nuget.org/packages/Lpdfio.Lpdf"}},{name:"PHP",href:"/docs/install/?sdk=php",github:"https://github.com/lpdfio/lpdf-php",registry:{label:"Packagist",url:"https://packagist.org/packages/lpdfio/lpdf"}},{name:"Python",href:"/docs/install/?sdk=python",github:"https://github.com/lpdfio/lpdf-python",registry:{label:"PyPI",url:"https://pypi.org/project/lpdfio-lpdf/"}}]},documentation:[{label:"Installation",href:"/docs/install/"},{label:"Layout model",href:"/docs/doc/layout/"},{label:"Layers",href:"/docs/doc/layer/"},{label:"Data binding",href:"/docs/data/binding/"},{label:"XML schema",href:"/docs/xml/schema/"},{label:"VS Code extension",href:"https://marketplace.visualstudio.com/items?itemName=lpdfio.lpdf"},{label:"Releases",href:"https://github.com/lpdfio/lpdf/releases"}],licensing:[{label:"Pricing",href:"/pricing/"},{label:"License",href:"/license/"},{label:"Support",href:"/support/"}],legalLinks:[{label:"License",href:"/license/"},{label:"Support",href:"/support/"}]},authstack:{slug:"authstack",name:"AuthStack",mark:"/assets/images/authstack-mark.svg",tagline:`Auth as Config
for every service`,contactEmail:"license@authstack.id",packages:{heading:"Packages",rows:[{name:"ASP.NET Core",href:"/docs/backend/setup/"},{name:"Web components",href:"/docs/frontend/setup/"}]},documentation:[{label:"Quick start",href:"/docs/start/quick-start/"},{label:"Auth flow",href:"/docs/concepts/auth-flow/"},{label:"Backend setup",href:"/docs/backend/setup/"},{label:"Frontend setup",href:"/docs/frontend/setup/"},{label:"Web components",href:"/docs/frontend/components/"},{label:"Providers",href:"/docs/providers/"}],licensing:[{label:"Pricing",href:"/pricing"},{label:"License",href:"/license"}],legalLinks:[{label:"Pricing",href:"/pricing"},{label:"License",href:"/license"}]}};function z(i){return Wt[i]}function zt(i,t){let e=t?[{label:"Contact us",href:`mailto:${t}`}]:[];return[{label:"Customer portal",href:i},...e,{label:"Terms of Service",href:`${i}/terms`},{label:"Privacy Policy",href:`${i}/privacy`},{label:"Refund Policy",href:`${i}/refunds`}]}function St(i,t){return[{heading:"Documentation",links:i.documentation},{heading:"Licensing",links:i.licensing},{heading:"Company",links:zt(t,i.contactEmail)}]}function kt(i){return!i.startsWith("/")}var Kt="cs-platform",Zt=[{id:"xml",label:"XML"},{id:"js",label:"Node.js",github:"https://github.com/lpdfio/lpdf-js",registry:{label:"npm",url:"https://www.npmjs.com/package/@lpdfio/lpdf"}},{id:"php",label:"PHP",github:"https://github.com/lpdfio/lpdf-php",registry:{label:"Packagist",url:"https://packagist.org/packages/lpdfio/lpdf"}},{id:"python",label:"Python",github:"https://github.com/lpdfio/lpdf-python",registry:{label:"PyPI",url:"https://pypi.org/project/lpdfio-lpdf/"}},{id:"dotnet",label:".NET",github:"https://github.com/lpdfio/lpdf-dotnet",registry:{label:"NuGet",url:"https://www.nuget.org/packages/Lpdfio.Lpdf"}}],Gt=h`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,16.37a86.4,86.4,0,0,1,16,3V212.67a86.4,86.4,0,0,1-16,3Zm32,9.26a87.81,87.81,0,0,1,16,10.54V195.83a87.81,87.81,0,0,1-16,10.54ZM40,128a88.11,88.11,0,0,1,80-87.63V215.63A88.11,88.11,0,0,1,40,128Zm160,50.54V77.46a87.82,87.82,0,0,1,0,101.08Z"></path></svg>`,g=class extends L{constructor(){super(...arguments);this.variant="home";this.authenticated=!1;this.hasPage=!1;this.product="lpdf";this.platforms=Zt;this._platform=(()=>{try{return localStorage.getItem(Kt)??"js"}catch{return"js"}})();this._onPlatform=e=>{let s=e.detail;s!==this._platform&&(this._platform=s)}}firstUpdated(){if(this._markActiveLink(),this.variant==="docs"){let e=new URLSearchParams(window.location.search).get("sdk");e&&(this._platform=e)}}connectedCallback(){super.connectedCallback(),this.variant==="docs"&&window.addEventListener("cs-platform",this._onPlatform)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("cs-platform",this._onPlatform)}_markActiveLink(){let e=window.location.pathname.replace(/\/$/,"")||"/";this.querySelectorAll(".nav-links a").forEach(s=>{let r=(s.getAttribute("href")??"").replace(/\/$/,"")||"/";s.classList.toggle("active",r!==""&&r!=="/"&&e.startsWith(r))})}_handleThemeToggle(){wt(),this.requestUpdate()}_setPlatform(e){this._platform=e,window.dispatchEvent(new CustomEvent("cs-platform",{detail:e}))}get _site(){return z(this.product)}_logo(e){return h`
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
        `}};m([f({reflect:!0})],g.prototype,"variant",2),m([f({type:Boolean,reflect:!0})],g.prototype,"authenticated",2),m([f({type:Boolean,attribute:"has-page",reflect:!0})],g.prototype,"hasPage",2),m([f()],g.prototype,"product",2),m([f({attribute:"logo-mark"})],g.prototype,"logoMark",2),m([f({attribute:"logo-word"})],g.prototype,"logoWord",2),m([f({type:Array})],g.prototype,"platforms",2),m([Et()],g.prototype,"_platform",2),g=m([P("site-nav")],g);var Jt="__PORTAL_URL__",k=class extends L{constructor(){super(...arguments);this.product=""}render(){let e=z(this.product);return e?h`
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
                        ${this._brandColumn(e)}
                        <!-- Packages before Documentation: the quick start lives in that column, so it
                             is where a reader starts. Documentation is the reference you consult
                             once something already runs. -->
                        ${this._packageColumn(e)}
                        ${St(e,Jt).map(s=>this._column(s.heading,s.links))}
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
`).flatMap((s,r,o)=>r<o.length-1?[s,h`<br />`]:[s])}
                </p>
            </div>
        `}_packageColumn(e){return h`
            <div class="rl-column rl-gap-s">
                <span class="footer-heading">${e.packages.heading}</span>
                <div class="rl-column rl-gap-m">
                    ${e.packages.rows.map(s=>h`
                        <div class="rl-column rl-gap-xs">
                            <a href="${s.href}" class="footer-sdk">${s.name}</a>
                            ${s.github||s.registry?h`
                                    <div class="rl-row rl-gap-m footer-links footer-sdk-links">
                                        ${s.github?h`<a href="${s.github}" target="_blank" rel="noopener noreferrer">GitHub</a>`:c}
                                        ${s.registry?h`<a href="${s.registry.url}" target="_blank" rel="noopener noreferrer">${s.registry.label}</a>`:c}
                                    </div>
                                `:c}
                        </div>
                    `)}
                </div>
            </div>
        `}_column(e,s){return h`
            <div class="rl-column rl-gap-s">
                <span class="footer-heading">${e}</span>
                <div class="rl-column rl-gap-m footer-links">
                    ${s.map(r=>kt(r.href)?h`<a href="${r.href}" target="_blank" rel="noopener noreferrer">${r.label}</a>`:h`<a href="${r.href}">${r.label}</a>`)}
                </div>
            </div>
        `}};m([f()],k.prototype,"product",2),k=m([P("product-footer")],k);var K=class extends k{constructor(){super(),this.product="lpdf"}};K=m([P("lpdf-footer")],K);function xt(){location.hash||(document.body.tabIndex=-1,document.body.focus({preventScroll:!0}))}try{let i=document.cookie.split("; ").find(s=>s.startsWith("cs-theme="))?.split("=")[1],t=localStorage.getItem("cs-theme"),e=i??t;if(e&&document.documentElement.setAttribute("data-theme",e),!i&&t){let s=/\.?codesense\.dev$/.test(window.location.hostname)?"; domain=.codesense.dev":"";document.cookie=`cs-theme=${t}; max-age=31536000; path=/${s}; SameSite=Lax`}}catch{}xt();})();
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
