// ==UserScript==
// @name         eSports Refresh
// @namespace    http://tampermonkey.net/
// @version      0.2
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