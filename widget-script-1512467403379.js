!function(e){if(window.bibleTagsWidget)return;const n="http://localhost:3000/index.html",t={};let o={},i=1;const s=function(n,t){const o=e.createElement(n);for(let e in t)o[e]=t[e];return o},a=e=>{let n;try{n=e.uiLanguageCode||localStorage.getItem(`uiLang-${e.versions[0].versionCode}`)||"eng"}catch(e){n="eng"}return n},d=e=>{if(!t[e])return;const{containerEl:n,iframeElEvent:o}=t[e];n.remove(),window.removeEventListener("message",o),delete t[e]},l="\n    visibility: hidden;\n    width: 1px;\n    height: 1px;\n    position: absolute;\n    top: 0;\n    left: 0;\n  ",c=e.createElement("style");c.innerHTML="",e.head.appendChild(c),window.bibleTagsWidget={setup:function(e){o=e;let t=s("iframe",{src:n.replace("{{LANG}}","eng"),style:l});document.body.appendChild(t),setTimeout(()=>t.remove(),3e4)},preload:function(e){const t=a(e);let i=s("iframe",{src:n.replace("{{LANG}}",t),style:l});i.onload=(()=>{i.contentWindow.postMessage({action:"preload",payload:{settings:o,options:e}},"*")});const d=e=>{const{data:n,source:t,origin:o}=e;if(t==i.contentWindow)switch(n.action){case"close":c()}},c=()=>{i&&(i.remove(),window.removeEventListener("message",d),i=null)};window.addEventListener("message",d),document.body.appendChild(i),setTimeout(c,3e4)},show:function(e){const l=i++,c=a(e);let r=s("div",{style:"\n          position: absolute;\n          top: 50px;\n          left: 50px;\n          width: 400px;\n          max-height: 600px;\n        "}),p=s("div",{style:"\n          position: absolute;\n          width: 16px;\n          height: 16px;\n          border: 1px solid #333;\n        "});const h=s("iframe",{src:n.replace("{{LANG}}",c),style:"\n          visibility: hidden;\n          width: 100px;\n          height: 100px;\n          position: absolute;\n          top: 0;\n          left: 0;\n        "});r.appendChild(p),r.appendChild(h),(e.containerEl||document.body).appendChild(r),h.onload=(()=>{h.contentWindow.postMessage({action:"show",payload:{settings:o,options:e}},"*")});const u=e=>{const{data:n,source:t,origin:o}=e;if(t==h.contentWindow)switch(n.action){case"close":d(l)}};return window.addEventListener("message",u),t[l]={containerEl:r,iframeElEvent:u},l},hide:function(e){e?d(e):Object.keys(t).forEach(e=>d(e))}}}(document);