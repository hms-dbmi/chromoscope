"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6074],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>f});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},v=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=p(n),v=i,f=d["".concat(l,".").concat(v)]||d[v]||u[v]||a;return n?r.createElement(f,o(o({ref:t},c),{},{components:n})):r.createElement(f,o({ref:t},c))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=v;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[d]="string"==typeof e?e:i,o[1]=s;for(var p=2;p<a;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}v.displayName="MDXCreateElement"},9071:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>a,metadata:()=>s,toc:()=>p});var r=n(7462),i=(n(7294),n(3905));const a={sidebar_position:4},o="Breakpoint View",s={unversionedId:"visualizations/breakpoint-view",id:"visualizations/breakpoint-view",title:"Breakpoint View",description:"The breakpoint view shows reads around breakpoints and highlights pairs of reads with long distances, showing evidence for structural variant calls.",source:"@site/docs/visualizations/breakpoint-view.md",sourceDirName:"visualizations",slug:"/visualizations/breakpoint-view",permalink:"/docs/visualizations/breakpoint-view",draft:!1,editUrl:"https://github.com/hms-dbmi/chromoscope/tree/master/docs/docs/visualizations/breakpoint-view.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"docsSidebar",previous:{title:"Variant View",permalink:"/docs/visualizations/variant-view"},next:{title:"Navigation",permalink:"/docs/visualizations/navigation"}},l={},p=[{value:"Colors",id:"colors",level:2},{value:"Interactions",id:"interactions",level:2}],c={toc:p},d="wrapper";function u(e){let{components:t,...a}=e;return(0,i.kt)(d,(0,r.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"breakpoint-view"},"Breakpoint View"),(0,i.kt)("p",null,"The breakpoint view shows reads around breakpoints and highlights pairs of reads with long distances, showing evidence for structural variant calls."),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},(0,i.kt)("img",{alt:"Variant View and Breakpoint View",src:n(6948).Z,width:"1324",height:"1174"})))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("strong",{parentName:"td"},"Figure.")," Upon clicking on a SV in a linear view (top), a breakpoint view (bottom) appears that shows read alignments around two corresponding breakpoints. Black vertical lines in both views represent the positions of selected breakpoints.")))),(0,i.kt)("admonition",{type:"caution"},(0,i.kt)("p",{parentName:"admonition"},"The breakpoing view only shows the sequence track if BAM files are not contained in the selected sample.")),(0,i.kt)("admonition",{type:"info"},(0,i.kt)("p",{parentName:"admonition"},"Loading the breakpoint view may take up to few minutes.")),(0,i.kt)("h2",{id:"colors"},"Colors"),(0,i.kt)("p",null,"The five colors (grey, green, blue, pink, yellow) of individual reads represent the types of SV events (translocation, duplication, deletion, tail-to-tail inversion, head-to-head inversion). If a read on the left view has a mate on the right view, these reads are encoded with one of the five colors depending on its SV type. If paired reads are not positioned within the two views, they are just represented in lightgrey. Parts of reads highlighted in different colors represent point mutations (see color legends)."),(0,i.kt)("h2",{id:"interactions"},"Interactions"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"You can move your mouse on top of a structural variant to see detailed information on a tooltip.")))}u.isMDXComponent=!0},6948:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/breakpoint-view-f098009d865baf4eea3e20f9ec74b3eb.png"}}]);