(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[105],{629:(e,s,t)=>{"use strict";t.d(s,{default:()=>o});var a=t(5155),l=t(2115),n=t(8173),r=t.n(n),i=t(1399),c=t(798);function o(){let[e,s]=(0,l.useState)(78),[t,n]=(0,l.useState)(21),[o,u]=(0,l.useState)(1),[d,E]=(0,l.useState)(1),[N,h]=(0,l.useState)(101.3),[m,A]=(0,l.useState)(21.5),v=()=>{let e=new Audio("/click.mp3");e.volume=.8,e.play().catch(e=>console.error("Audio play failed:",e))},x=function(e,s){let t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return Number((Math.random()*(s-e)+e).toFixed(t))},I=()=>{let e=Math.random();return e<.33?-.1:e<.66?0:.1};return(0,l.useEffect)(()=>{let a=setInterval(()=>{let a=Number((e+I()).toFixed(1)),l=Number((t+I()).toFixed(1)),r=Number((100-a-l).toFixed(1));a>=77.5&&a<=78.5&&l>=20.5&&l<=21.5&&r>=0&&r<=2&&(s(a),n(l),u(r)),E(x(.98,1.02,2)),h(x(101.1,101.5,1)),A(x(21,22,1))},2e3);return()=>clearInterval(a)},[e,t]),(0,a.jsxs)("div",{className:"main-menu",children:[(0,a.jsx)("h1",{className:"menu-title",children:(0,a.jsx)(c.A,{children:"Life Support Systems"})}),(0,a.jsx)("div",{className:"separator",children:"========"}),(0,a.jsxs)("div",{className:"life-support-grid",children:[(0,a.jsxs)("div",{className:"support-section",children:[(0,a.jsx)("h2",{className:"section-title",children:(0,a.jsx)(c.A,{children:"Atmospheric Composition"})}),(0,a.jsxs)("div",{className:"gas-levels",children:[(0,a.jsxs)("div",{className:"gas-item",children:[(0,a.jsx)("span",{className:"gas-name",children:(0,a.jsx)(c.A,{children:"Oxygen:"})}),(0,a.jsx)("span",{className:"gas-value",children:(0,a.jsxs)(c.A,{children:[e,"%"]})})]}),(0,a.jsxs)("div",{className:"gas-item",children:[(0,a.jsx)("span",{className:"gas-name",children:(0,a.jsx)(c.A,{children:"Nitrogen:"})}),(0,a.jsx)("span",{className:"gas-value",children:(0,a.jsxs)(c.A,{children:[t,"%"]})})]}),(0,a.jsxs)("div",{className:"gas-item",children:[(0,a.jsx)("span",{className:"gas-name",children:(0,a.jsx)(c.A,{children:"Other Gases:"})}),(0,a.jsx)("span",{className:"gas-value",children:(0,a.jsxs)(c.A,{children:[o,"%"]})})]})]})]}),(0,a.jsxs)("div",{className:"support-section",children:[(0,a.jsx)("h2",{className:"section-title",children:(0,a.jsx)(c.A,{children:"Environmental Controls"})}),(0,a.jsxs)("div",{className:"env-controls",children:[(0,a.jsxs)("div",{className:"env-item",children:[(0,a.jsx)("span",{className:"env-name",children:(0,a.jsx)(c.A,{children:"Gravity:"})}),(0,a.jsx)("span",{className:"env-value",children:(0,a.jsxs)(c.A,{children:[d," G"]})})]}),(0,a.jsxs)("div",{className:"env-item",children:[(0,a.jsx)("span",{className:"env-name",children:(0,a.jsx)(c.A,{children:"Pressure:"})}),(0,a.jsx)("span",{className:"env-value",children:(0,a.jsxs)(c.A,{children:[N," kPa"]})})]}),(0,a.jsxs)("div",{className:"env-item",children:[(0,a.jsx)("span",{className:"env-name",children:(0,a.jsx)(c.A,{children:"Temperature:"})}),(0,a.jsx)("span",{className:"env-value",children:(0,a.jsxs)(c.A,{children:[m,"\xb0C"]})})]})]})]})]}),(0,a.jsx)(r(),{href:"/ship-info",className:"menu-item back-button",onMouseEnter:v,onClick:v,children:(0,a.jsx)(c.A,{children:"BACK TO SHIP INFO"})}),(0,a.jsx)(i.A,{})]})}},798:(e,s,t)=>{"use strict";t.d(s,{A:()=>i});var a=t(5155),l=t(2115),n=t(5781);let r="!@#$%^&*()_+-=[]{}|;:,.<>?";function i(e){let{children:s}=e,{isGlitchActive:t}=(0,n.l)(),[i,c]=(0,l.useState)(""),o=l.Children.toArray(s).join(""),[u,d]=(0,l.useState)(!1),E=(0,l.useCallback)(()=>{if(!t){c(o);return}c(o.split("").map(e=>{if(.01>Math.random()&&" "!==e){let s=Math.random();if(s<.3)return r[Math.floor(Math.random()*r.length)];if(s<.5)return e+"̀"}return e}).join(""))},[t,o]);return(0,l.useEffect)(()=>{d(!0),c(o)},[o]),(0,l.useEffect)(()=>{if(!u)return;if(!t){c(o);return}let e=setInterval(E,100);return()=>clearInterval(e)},[t,o,u,E]),(0,a.jsx)("span",{className:t?"subtle-glitch":"",children:i||s})}},1399:(e,s,t)=>{"use strict";t.d(s,{A:()=>i});var a=t(5155),l=t(2115),n=t(6255),r=t(5781);function i(){let{isInfected:e,startInfection:s}=(0,n.f)(),{isGlitchActive:t,startGlitch:i,stopGlitch:c}=(0,r.l)(),[o,u]=(0,l.useState)(""),[d,E]=(0,l.useState)(["MOTHERSHIP TERMINAL v1.0.3",'TYPE "HELP" FOR AVAILABLE COMMANDS',"--------------------------------",""]),N=(0,l.useRef)(null);return(0,l.useEffect)(()=>{if(N.current){let e=N.current,s=e.scrollHeight;e.scrollTo({top:s,behavior:"smooth"})}},[d]),(0,a.jsxs)("div",{className:"terminal-section",children:[(0,a.jsxs)("div",{className:"terminal-title",children:["TERMINAL ",">"]}),(0,a.jsx)("div",{ref:N,className:"terminal-output",children:d.map((e,s)=>(0,a.jsx)("div",{className:"terminal-line",children:e},s))}),(0,a.jsxs)("div",{className:"terminal-input-container",children:[(0,a.jsx)("span",{className:"terminal-prompt",children:">"}),(0,a.jsx)("input",{type:"text",className:"terminal-input",value:o,onChange:e=>u(e.target.value),onKeyDown:a=>{if("Enter"===a.key){let a=o.trim().toLowerCase(),l=[];if("run glitch.exe"===a)t?l=["ERROR: GLITCH EFFECT ALREADY ACTIVE",""]:(l=["EXECUTING GLITCH.EXE...","INITIALIZING VISUAL DISTORTION SEQUENCE","SYSTEM ANOMALY DETECTED","GLITCH EFFECT ACTIVATED",""],i());else if("stop glitch.exe"===a)t?(l=["TERMINATING GLITCH.EXE...","VISUAL DISTORTION SEQUENCE HALTED","SYSTEM RETURNING TO NORMAL",""],c()):l=["ERROR: NO ACTIVE GLITCH EFFECT DETECTED",""];else if("run infection.exe"===a)e?l=["ERROR: INFECTION ALREADY ACTIVE",""]:(l=["EXECUTING INFECTION.EXE...","WARNING: UNAUTHORIZED ACCESS DETECTED","SYSTEM COMPROMISED","INITIATING CORRUPTION SEQUENCE...",""],s());else if("help"===a)l=["AVAILABLE COMMANDS:","- HELP: Display this help message","- STATUS: Display system status","- SCAN: Scan ship components","- CLEAR: Clear terminal output",""];else if("status"===a)l=["SYSTEM STATUS: OPERATIONAL","ALL COMPONENTS FUNCTIONING WITHIN NORMAL PARAMETERS",""];else if("scan"===a)l=["SCANNING SHIP COMPONENTS...","HULL INTEGRITY: 92%","JUMP FUEL: 78%","SYSTEM FUEL: 65%","SCAN COMPLETE",""];else if("clear"===a){E(["MOTHERSHIP TERMINAL v1.0.3",'TYPE "HELP" FOR AVAILABLE COMMANDS',"--------------------------------",""]),u("");return}else""!==a&&(l=['COMMAND NOT RECOGNIZED: "'.concat(o,'"'),'TYPE "HELP" FOR AVAILABLE COMMANDS',""]);E([...d,"> ".concat(o),...l]),u("")}},autoFocus:!0})]})]})}},5267:(e,s,t)=>{Promise.resolve().then(t.bind(t,629))},5781:(e,s,t)=>{"use strict";t.d(s,{GlitchProvider:()=>r,l:()=>i});var a=t(5155),l=t(2115);let n=(0,l.createContext)(void 0);function r(e){let{children:s}=e,[t,r]=(0,l.useState)(!1),[i,c]=(0,l.useState)(!1);(0,l.useEffect)(()=>{if(!i){try{let e=localStorage.getItem("isGlitchActive");null!==e&&r("true"===e)}catch(e){console.error("Failed to read from localStorage:",e)}c(!0)}},[i]),(0,l.useEffect)(()=>{if(i)try{localStorage.setItem("isGlitchActive",t.toString())}catch(e){console.error("Failed to write to localStorage:",e)}},[t,i]);let o=(0,l.useCallback)(()=>{r(!0)},[]),u=(0,l.useCallback)(()=>{r(!1)},[]);return(0,a.jsx)(n.Provider,{value:{isGlitchActive:t,startGlitch:o,stopGlitch:u},children:s})}function i(){let e=(0,l.useContext)(n);if(void 0===e)throw Error("useGlitch must be used within a GlitchProvider");return e}},6255:(e,s,t)=>{"use strict";t.d(s,{InfectionProvider:()=>r,f:()=>i});var a=t(5155),l=t(2115);let n=(0,l.createContext)(void 0);function r(e){let{children:s}=e,[t,r]=(0,l.useState)(!1),i=(0,l.useCallback)(()=>{r(!0)},[]),c=(0,l.useCallback)(()=>{r(!1)},[]);return(0,a.jsx)(n.Provider,{value:{isInfected:t,startInfection:i,stopInfection:c},children:s})}function i(){let e=(0,l.useContext)(n);if(void 0===e)throw Error("useInfection must be used within an InfectionProvider");return e}}},e=>{var s=s=>e(e.s=s);e.O(0,[441,587,358],()=>s(5267)),_N_E=e.O()}]);