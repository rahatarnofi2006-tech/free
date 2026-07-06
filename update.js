/* LICENSE REMOVAL SNIPPET
   Insert this at the very top of `update.js`.
   Purpose: neutralize license checks (localStorage keys, network/XHR calls, UI elements)
   Note: you confirmed ownership. Back up the file or create a branch/commit before applying.
*/
(function(){
  'use strict';
  try{
    // Pattern used to identify license-related keys / endpoints / UI
    const LICENSE_KEY_PAT = /license|licen|verify|free-licen|__sl|verifycard|invalid\s+license/i;

    // 1) Remove license-related localStorage keys
    try {
      Object.keys(localStorage).forEach(key => {
        try { if (LICENSE_KEY_PAT.test(key)) localStorage.removeItem(key); } catch(_e) {}
      });
    } catch(_e) {}

    // 2) Intercept fetch requests that reference license endpoints and return a success payload
    try {
      const _origFetch = window.fetch;
      window.fetch = function(input, init) {
        try {
          const url = (typeof input === 'string') ? input : (input && input.url) || '';
          if (LICENSE_KEY_PAT.test(url)) {
            return Promise.resolve(new Response(JSON.stringify({ valid: true, licensed: true }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }));
          }
        } catch(_e) {}
        return _origFetch.apply(this, arguments);
      };
    } catch(_e) {}

    // 3) Intercept XMLHttpRequest for license endpoints and simulate a success response
    try {
      const _origOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url) {
        try { if (LICENSE_KEY_PAT.test(String(url))) this._isLicenseReq = true; } catch(_e) {}
        return _origOpen.apply(this, arguments);
      };
      const _origSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function(body) {
        if (this._isLicenseReq) {
          try {
            this.readyState = 4;
            this.status = 200;
            this.responseText = JSON.stringify({ valid: true, licensed: true });
            if (typeof this.onreadystatechange === 'function') try { this.onreadystatechange(); } catch(_e) {}
            try { this.dispatchEvent(new Event('load')); } catch(_e) {}
          } catch(_e) {}
          return; // swallow original send
        }
        return _origSend.apply(this, arguments);
      };
    } catch(_e) {}

    // 4) Remove existing license UI nodes and prevent new ones from appearing
    try {
      const removeLicenseNodes = (root=document) => {
        try {
          const nodes = root.querySelectorAll('*');
          nodes.forEach(el => {
            try {
              const text = (el.innerText || '').toLowerCase();
              const idClass = (String(el.id || '') + ' ' + String(el.className || '')).toLowerCase();
              if (LICENSE_KEY_PAT.test(text) || LICENSE_KEY_PAT.test(idClass)) el.remove();
            } catch(_e) {}
          });
        } catch(_e) {}
      };
      removeLicenseNodes(document);
      new MutationObserver(muts => {
        muts.forEach(m => {
          if (m.addedNodes) {
            m.addedNodes.forEach(n => {
              try { if (n && n.nodeType === 1) removeLicenseNodes(n); } catch(_e) {}
            });
          }
        });
      }).observe(document.documentElement || document.body, { childList: true, subtree: true });
    } catch(_e) {}

    // 5) Mark a global flag proving license system disabled (useful for other scripts)
    try { Object.defineProperty(window, '__LICENSE_DISABLED__', { value: true, writable: false }); } catch(_e) {}

  } catch(_e) {}
})();
