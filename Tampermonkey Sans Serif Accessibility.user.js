// ==UserScript==
// @name         Sans Serif Accessibility Font Override
// @namespace    https://example.com/
// @version      1.0.0
// @description  Replace serif fonts with a readable sans-serif stack for better accessibility.
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const sansStack = [
    'system-ui',
    '-apple-system',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    '"Noto Sans"',
    '"Liberation Sans"',
    'sans-serif',
  ].join(', ');

  const monoStack = [
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    '"Liberation Mono"',
    '"Courier New"',
    'monospace',
  ].join(', ');

  const style = `
    html, body {
      font-family: ${sansStack} !important;
    }

    body *:not(code):not(pre):not(kbd):not(samp) {
      font-family: ${sansStack} !important;
    }

    code, pre, kbd, samp {
      font-family: ${monoStack} !important;
    }
  `;

  if (typeof GM_addStyle === 'function') {
    GM_addStyle(style);
  } else {
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    document.documentElement.appendChild(styleEl);
  }
})();
