// ==UserScript==
// @name         Sans Serif Accessibility Font Override
// @namespace    https://example.com/
// @version      1.1.0
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

    body *:not(code):not(pre):not(kbd):not(samp):not([data-tm-icon-font]) {
      font-family: ${sansStack} !important;
    }

    code, pre, kbd, samp {
      font-family: ${monoStack} !important;
    }
  `;

  const iconFontFamilies = [
    'font awesome',
    'material icons',
    'material symbols',
    'ionicons',
    'icomoon',
    'glyphicons',
    'bootstrap icons',
    'segoe mdl2 assets',
    'line awesome',
    'boxicons',
    'remixicon',
    'fontello',
    'typicons',
    'entypo',
    'octicons',
    'nucleo',
    'feather',
    'websymbols',
    'wingdings',
  ];

  const iconCandidateSelector = [
    'i',
    'span',
    '[class*="icon"]',
    '[class*="Icon"]',
    '[class*="fa-"]',
    '[class^="fa"]',
    '[class*="material-icons"]',
    '[class*="material-symbols"]',
    '[data-icon]',
    '[aria-hidden="true"]',
  ].join(',');

  const hasIconFontFamily = (fontFamily) => {
    if (!fontFamily) {
      return false;
    }
    const normalized = fontFamily.toLowerCase();
    return iconFontFamilies.some((name) => normalized.includes(name));
  };

  const protectIconFonts = (root) => {
    if (!root || !root.querySelectorAll) {
      return;
    }
    const candidates = new Set();
    if (root.matches && root.matches(iconCandidateSelector)) {
      candidates.add(root);
    }
    root.querySelectorAll(iconCandidateSelector).forEach((node) => {
      candidates.add(node);
    });

    candidates.forEach((element) => {
      if (element.hasAttribute('data-tm-icon-font')) {
        return;
      }
      const computed = window.getComputedStyle(element).fontFamily;
      if (hasIconFontFamily(computed)) {
        element.setAttribute('data-tm-icon-font', 'true');
        element.style.setProperty('font-family', computed, 'important');
      }
    });
  };

  if (typeof GM_addStyle === 'function') {
    GM_addStyle(style);
  } else {
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    document.documentElement.appendChild(styleEl);
  }

  const startIconObserver = () => {
    protectIconFonts(document.documentElement);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            protectIconFonts(node);
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startIconObserver, { once: true });
  } else {
    startIconObserver();
  }
})();
