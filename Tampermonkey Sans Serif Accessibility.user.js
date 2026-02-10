// ==UserScript==
// @name         Sans Serif Accessibility Font Override
// @namespace    https://example.com/
// @version      1.2.0
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

  const materialClassMappings = [
    {
      pattern: /(^|\s)material-icons-outlined(\s|$)/i,
      family: 'Material Icons Outlined',
    },
    {
      pattern: /(^|\s)material-icons-round(\s|$)/i,
      family: 'Material Icons Round',
    },
    {
      pattern: /(^|\s)material-icons-sharp(\s|$)/i,
      family: 'Material Icons Sharp',
    },
    {
      pattern: /(^|\s)material-icons-two-tone(\s|$)/i,
      family: 'Material Icons Two Tone',
    },
    {
      pattern: /(^|\s)material-icons(\s|$)/i,
      family: 'Material Icons',
    },
    {
      pattern: /(^|\s)material-symbols-outlined(\s|$)/i,
      family: 'Material Symbols Outlined',
    },
    {
      pattern: /(^|\s)material-symbols-rounded(\s|$)/i,
      family: 'Material Symbols Rounded',
    },
    {
      pattern: /(^|\s)material-symbols-sharp(\s|$)/i,
      family: 'Material Symbols Sharp',
    },
    {
      pattern: /(^|\s)material-symbols(\s|$)/i,
      family: 'Material Symbols Outlined',
    },
  ];

  const getMaterialFamilyFromClass = (className) => {
    if (!className) {
      return null;
    }
    const classString = typeof className === 'string' ? className : className.baseVal || '';
    const match = materialClassMappings.find((entry) => entry.pattern.test(classString));
    return match ? match.family : null;
  };

  const hasIconFontFamily = (fontFamily) => {
    if (!fontFamily) {
      return false;
    }
    const normalized = fontFamily.toLowerCase();
    return iconFontFamilies.some((name) => normalized.includes(name));
  };

  const serifFontFamilies = [
    'serif',
    'times new roman',
    'times',
    'georgia',
    'garamond',
    'baskerville',
    'cambria',
    'palatino',
  ];

  const hasSerifFontFamily = (fontFamily) => {
    if (!fontFamily) {
      return false;
    }
    const normalized = fontFamily.toLowerCase();
    return serifFontFamilies.some((name) => normalized.includes(name));
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
      const materialFamily = getMaterialFamilyFromClass(element.className);
      if (materialFamily) {
        element.setAttribute('data-tm-icon-font', 'true');
        element.style.setProperty('font-family', materialFamily, 'important');
        return;
      }
      const computed = window.getComputedStyle(element).fontFamily;
      if (hasIconFontFamily(computed)) {
        element.setAttribute('data-tm-icon-font', 'true');
        element.style.setProperty('font-family', computed, 'important');
      }
    });
  };

  const applySansToSerif = (root) => {
    if (!root || !root.querySelectorAll) {
      return;
    }
    const elements = new Set();
    if (root.matches && root.matches('*')) {
      elements.add(root);
    }
    root.querySelectorAll('*').forEach((node) => {
      elements.add(node);
    });

    elements.forEach((element) => {
      if (element.hasAttribute('data-tm-icon-font')) {
        return;
      }
      const tagName = element.tagName ? element.tagName.toLowerCase() : '';
      if (['code', 'pre', 'kbd', 'samp'].includes(tagName)) {
        return;
      }
      const computed = window.getComputedStyle(element).fontFamily;
      if (hasIconFontFamily(computed)) {
        return;
      }
      if (hasSerifFontFamily(computed)) {
        element.style.setProperty('font-family', sansStack, 'important');
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
    applySansToSerif(document.documentElement);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            protectIconFonts(node);
            applySansToSerif(node);
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  };

  startIconObserver();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      protectIconFonts(document.documentElement);
      applySansToSerif(document.documentElement);
    }, { once: true });
  }
})();
