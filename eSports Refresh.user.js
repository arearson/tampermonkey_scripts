// ==UserScript==
// @name         eSports Refresh
// @namespace    https://github.com/arearson/tampermonkey_scripts/
// @version      0.3
// @description  refreshes LOLesports website to maximize rewards
// @author       You
// @match        https://lolesports.com/*
// @icon         https://www.google.com/s2/favicons?domain=lolesports.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{window.location.href = 'https://lolesports.com/live';}, Math.random()*10000 + 3069420);
})();