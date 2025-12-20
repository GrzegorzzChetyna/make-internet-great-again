// ==UserScript==
// @name         Onet Referer Killer (Event Mode)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Usuwa referer w momencie kliknięcia, odporny na re-renderowanie strony
// @author       Ty
// @match        https://*.onet.pl/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Nasłuchujemy kliknięć w fazie "capture" (true), czyli ZANIM dotrą do elementów Onetu
    document.addEventListener('click', function(e) {
        // Znajdź najbliższy element <a> (bo mogłeś kliknąć w obrazek wewnątrz linku)
        const link = e.target.closest('a');

        // Sprawdź czy to link i czy prowadzi do onetu (lub jest względny)
        if (link && (link.href.includes('onet.pl') || link.getAttribute('href').startsWith('/'))) {

            // Wymuś atrybuty ukrywające źródło
            link.setAttribute('rel', 'noreferrer noopener');
            link.setAttribute('referrerpolicy', 'no-referrer');

            // Opcjonalne: Jeśli Onet używa JavaScript do przekierowań na 'onclick',
            // to powyższe może nie wystarczyć. Wtedy odkomentuj poniższy blok:
            /*
            e.preventDefault(); // Zablokuj domyślne działanie
            e.stopPropagation(); // Zablokuj skrypty Onetu
            window.open(link.href, '_self', 'noreferrer'); // Otwórz "po naszemu"
            */
        }
    }, true); // <--- Kluczowy parametr "true" (Capture Phase)

})();