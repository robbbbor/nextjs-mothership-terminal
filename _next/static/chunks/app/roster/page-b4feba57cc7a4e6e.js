(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[736],{1399:(e,t,a)=>{"use strict";a.d(t,{A:()=>i});var s=a(5155),n=a(2115),r=a(6255),l=a(5781);function i(){let{isInfected:e,startInfection:t}=(0,r.f)(),{isGlitchActive:a,startGlitch:i,stopGlitch:c}=(0,l.l)(),[E,o]=(0,n.useState)(""),[u,N]=(0,n.useState)(["MOTHERSHIP TERMINAL v1.0.3",'TYPE "HELP" FOR AVAILABLE COMMANDS',"--------------------------------",""]),A=(0,n.useRef)(null);return(0,n.useEffect)(()=>{if(A.current){let e=A.current,t=e.scrollHeight;e.scrollTo({top:t,behavior:"smooth"})}},[u]),(0,s.jsxs)("div",{className:"terminal-section",children:[(0,s.jsxs)("div",{className:"terminal-title",children:["TERMINAL ",">"]}),(0,s.jsx)("div",{ref:A,className:"terminal-output",children:u.map((e,t)=>(0,s.jsx)("div",{className:"terminal-line",children:e},t))}),(0,s.jsxs)("div",{className:"terminal-input-container",children:[(0,s.jsx)("span",{className:"terminal-prompt",children:">"}),(0,s.jsx)("input",{type:"text",className:"terminal-input",value:E,onChange:e=>o(e.target.value),onKeyDown:s=>{if("Enter"===s.key){let s=E.trim().toLowerCase(),n=[];if("run glitch.exe"===s)a?n=["ERROR: GLITCH EFFECT ALREADY ACTIVE",""]:(n=["EXECUTING GLITCH.EXE...","INITIALIZING VISUAL DISTORTION SEQUENCE","SYSTEM ANOMALY DETECTED","GLITCH EFFECT ACTIVATED",""],i());else if("stop glitch.exe"===s)a?(n=["TERMINATING GLITCH.EXE...","VISUAL DISTORTION SEQUENCE HALTED","SYSTEM RETURNING TO NORMAL",""],c()):n=["ERROR: NO ACTIVE GLITCH EFFECT DETECTED",""];else if("run infection.exe"===s)e?n=["ERROR: INFECTION ALREADY ACTIVE",""]:(n=["EXECUTING INFECTION.EXE...","WARNING: UNAUTHORIZED ACCESS DETECTED","SYSTEM COMPROMISED","INITIATING CORRUPTION SEQUENCE...",""],t());else if("help"===s)n=["AVAILABLE COMMANDS:","- HELP: Display this help message","- STATUS: Display system status","- SCAN: Scan ship components","- CLEAR: Clear terminal output",""];else if("status"===s)n=["SYSTEM STATUS: OPERATIONAL","ALL COMPONENTS FUNCTIONING WITHIN NORMAL PARAMETERS",""];else if("scan"===s)n=["SCANNING SHIP COMPONENTS...","HULL INTEGRITY: 92%","JUMP FUEL: 78%","SYSTEM FUEL: 65%","SCAN COMPLETE",""];else if("clear"===s){N(["MOTHERSHIP TERMINAL v1.0.3",'TYPE "HELP" FOR AVAILABLE COMMANDS',"--------------------------------",""]),o("");return}else""!==s&&(n=['COMMAND NOT RECOGNIZED: "'.concat(E,'"'),'TYPE "HELP" FOR AVAILABLE COMMANDS',""]);N([...u,"> ".concat(E),...n]),o("")}},autoFocus:!0})]})]})}},1892:(e,t,a)=>{"use strict";a.d(t,{A:()=>l});var s=a(5155),n=a(2115),r=a(6255);function l(e){let{originalText:t,infectedText:a,className:l=""}=e,{isInfected:i}=(0,r.f)(),[c,E]=(0,n.useState)(0),[o,u]=(0,n.useState)(t),[N,A]=(0,n.useState)(new Set),I=(0,n.useRef)(null),[T,S]=(0,n.useState)(!1),d=(0,n.useRef)(0);(0,n.useEffect)(()=>{if(!i){u(t),E(0),A(new Set);return}let e=()=>{let e=I.current,t=document.querySelector(".scan-line");if(!e||!t)return;let a=e.getBoundingClientRect(),s=t.getBoundingClientRect(),n=a.top+a.height/2,r=40>Math.abs(s.top+s.height/2-n);r&&!T&&Date.now()-d.current>2e3?(S(!0),d.current=Date.now()):r||S(!1)},a=requestAnimationFrame(function t(){e(),requestAnimationFrame(t)});return()=>cancelAnimationFrame(a)},[i,t,T]),(0,n.useEffect)(()=>{let e,s;if(!i||!T){let e=t.split("");N.forEach(t=>{e[t]=a[t]}),u(e.join("")),E(0);return}return E(1),e=setInterval(()=>{u(Math.random()>.5?t:a)},100),s=setTimeout(()=>{E(2),clearInterval(e),e=setInterval(()=>{u(Math.random()>.3?a:t)},50),setTimeout(()=>{clearInterval(e);let s=0;for(;N.has(s)&&s<t.length;)s++;let n=[];for(let e=0;e<t.length;e++)e===s||N.has(e)||n.push(e);let r=new Set(N);if(s<t.length&&r.add(s),n.length>0){let e=Math.floor(Math.random()*n.length);r.add(n[e])}A(r);let l=t.split("");r.forEach(e=>{l[e]=a[e]}),u(l.join("")),E(0)},100)},200),()=>{clearInterval(e),clearTimeout(s)}},[i,T,t,a,N]);let m=i&&(1===c||2===c)?"".concat(1===c?"evil-glitch-1":"evil-glitch-2"):"";return(0,s.jsx)("span",{ref:I,className:"".concat(l," ").concat(m),children:i&&0!==N.size?c>0?(0,s.jsx)("span",{"data-text":o,children:o}):(0,s.jsx)(s.Fragment,{children:o.split("").map((e,t)=>N.has(t)?(0,s.jsx)("span",{className:"evil-glitch-permanent","data-text":e,children:e},t):(0,s.jsx)("span",{children:e},t))}):(0,s.jsx)("span",{children:o})})}},3208:(e,t,a)=>{Promise.resolve().then(a.bind(a,4102))},4102:(e,t,a)=>{"use strict";a.d(t,{default:()=>c});var s=a(5155);a(2115);var n=a(6046),r=a(1399),l=a(1892);let i=[{name:"ANDY THE AUTOMATON",infectedName:"ANNIHILATE ASSAULT",details:["PILOT","MECHANIC","MAY BE OBSOLETE SOON","ANDROID","ANOMALY: SMOKES CIGARETTES AND TAKES PILLS DESPITE BEING AN AUTOMATON"]},{name:"HUGO OCTAVIUS PHILLIPS",infectedName:"HURT&OPPRESS. PUNISH!",details:["FORMER CAPTAIN OF INFINITE PROFITS","MILITARY TRAINING","PET DOG","HUMAN","ANOMALY: MYSTICISM. NO ELABORATION REQUIRED"]},{name:"KAI ROE",infectedName:"KILLALL",details:["MEDIC","HAND-TO-HAND SPECIALIST","DETACHABLE PENIS","HUMAN CYBORG","ANOMALY: CRACKS BACKS AND CRACKS SKULLS"]},{name:"V3235",infectedName:"VILE!",details:["SCIENTIST","PET LAB RAT","GENDER-SHIFTING CAPABILITIES","ANDROID","ANOMALY: ONLY ACTIVATES NON-GENDERED CONFIGURATION"]}];function c(){let e=(0,n.useRouter)(),t=()=>{let e=new Audio("/click.mp3");e.volume=.8,e.play().catch(e=>console.error("Audio play failed:",e))};return(0,s.jsxs)("div",{className:"main-menu",children:[(0,s.jsx)("h1",{className:"menu-title",children:"Roster"}),(0,s.jsx)("div",{className:"separator",children:"========"}),(0,s.jsx)("div",{className:"roster-list",children:i.map((e,t)=>(0,s.jsxs)("div",{className:"roster-item",children:[(0,s.jsx)("div",{className:"roster-name",children:(0,s.jsx)(l.A,{originalText:e.name,infectedText:e.infectedName})}),(0,s.jsx)("ul",{className:"roster-details",children:e.details.map((e,t)=>(0,s.jsx)("li",{className:"roster-detail",children:e},t))})]},t))}),(0,s.jsx)("a",{href:"/main",className:"menu-item back-button",onMouseEnter:t,onClick:a=>{t(),a.preventDefault(),setTimeout(()=>{e.push("/main")},100)},children:"BACK TO MAIN MENU"}),(0,s.jsx)(r.A,{})]})}},5781:(e,t,a)=>{"use strict";a.d(t,{GlitchProvider:()=>l,l:()=>i});var s=a(5155),n=a(2115);let r=(0,n.createContext)(void 0);function l(e){let{children:t}=e,[a,l]=(0,n.useState)(!1),[i,c]=(0,n.useState)(!1);(0,n.useEffect)(()=>{if(!i){try{let e=localStorage.getItem("isGlitchActive");null!==e&&l("true"===e)}catch(e){console.error("Failed to read from localStorage:",e)}c(!0)}},[i]),(0,n.useEffect)(()=>{if(i)try{localStorage.setItem("isGlitchActive",a.toString())}catch(e){console.error("Failed to write to localStorage:",e)}},[a,i]);let E=(0,n.useCallback)(()=>{l(!0)},[]),o=(0,n.useCallback)(()=>{l(!1)},[]);return(0,s.jsx)(r.Provider,{value:{isGlitchActive:a,startGlitch:E,stopGlitch:o},children:t})}function i(){let e=(0,n.useContext)(r);if(void 0===e)throw Error("useGlitch must be used within a GlitchProvider");return e}},6046:(e,t,a)=>{"use strict";var s=a(6658);a.o(s,"usePathname")&&a.d(t,{usePathname:function(){return s.usePathname}}),a.o(s,"useRouter")&&a.d(t,{useRouter:function(){return s.useRouter}})},6255:(e,t,a)=>{"use strict";a.d(t,{InfectionProvider:()=>l,f:()=>i});var s=a(5155),n=a(2115);let r=(0,n.createContext)(void 0);function l(e){let{children:t}=e,[a,l]=(0,n.useState)(!1),i=(0,n.useCallback)(()=>{l(!0)},[]),c=(0,n.useCallback)(()=>{l(!1)},[]);return(0,s.jsx)(r.Provider,{value:{isInfected:a,startInfection:i,stopInfection:c},children:t})}function i(){let e=(0,n.useContext)(r);if(void 0===e)throw Error("useInfection must be used within an InfectionProvider");return e}}},e=>{var t=t=>e(e.s=t);e.O(0,[441,587,358],()=>t(3208)),_N_E=e.O()}]);