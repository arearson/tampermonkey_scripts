// ==UserScript==
// @name Channel Points Better
// @version 1.1.3.4
// @author You
// @description Automatically bet channel points.
// @match https://www.twitch.tv/*
// @match https://dashboard.twitch.tv/*
// @license MIT
// @grant none
// @namespace https://github.com/arearson/tampermonkey_scripts/
// @icon https://blog.twitch.tv/assets/uploads/1306x700-blog-header--channel-points-predictions.jpg
// ==/UserScript==
"use strict";
let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
let claiming = false;
let predictButton = '[data-test-selector="community-prediction-highlight-header__action-button"]';
let pointsButton = '[data-test-selector="balance-string"]';
if (MutationObserver) console.log('Auto betting is enabled.');

let observer = new MutationObserver(() => {
    observer.disconnect();
    let curPoints = document.querySelector(pointsButton);
    let bonus = document.querySelector(predictButton);
    if (bonus && !claiming && curPoints) {
        let curPointsValue = createIntFromSimpStr(curPoints.textContent);
        if (bonus.textContent !== 'Predict' || curPointsValue === 0) {
            observer.observe(document.body, {childList: true, subtree: true});
        } else {
            claiming = true;
            bonus.click();
            let leftValue = document.querySelector('.prediction-summary-stat__value--left');
            let rightValue = document.querySelector('.prediction-summary-stat__value--right');
            if (!leftValue || !rightValue) {
                window.location.reload();
            } else {
                // Betting Controls
                let blueBet = document.querySelector('.fixed-prediction-button--blue');
                let redBet = document.querySelector('.fixed-prediction-button--pink');
                if (redBet && blueBet) {
                    let dateNow = new Date();
                    console.log('Waiting for initial votes @', dateNow);
                    setTimeout(() => {
                        leftValue = document.querySelector('.prediction-summary-stat__value--left');
                        rightValue = document.querySelector('.prediction-summary-stat__value--right');
                        let blue = createIntFromSimpStr(leftValue ? leftValue.textContent : '0');
                        let red = createIntFromSimpStr(rightValue ? rightValue.textContent : '0');
                        curPointsValue = createIntFromSimpStr(document.querySelector(pointsButton) ? document.querySelector(pointsButton).textContent : "0");
                        bettingLogic(red, blue, redBet, blueBet, bonus, curPointsValue);
                        let dateNow = new Date();
                        console.log(curPointsValue, '@', dateNow);
                        claiming = false;
                        observer.observe(document.body, {childList: true, subtree: true});
                    }, 10 * 1000);

                } else {
                    let blue = createIntFromSimpStr(leftValue ? leftValue.textContent : '0');
                    let red = createIntFromSimpStr(rightValue ? rightValue.textContent : '0');
                    bettingLogic(red, blue, redBet, blueBet, bonus, curPointsValue);
                    setTimeout(() => {
                        let dateNow = new Date();
                        console.log(curPointsValue, '@', dateNow);
                        claiming = false;
                        observer.observe(document.body, {childList: true, subtree: true});
                    }, (Math.random() * (1.5 - .5) + .5) * 1000);
                }
            }
        }
    } else {
        observer.observe(document.body, {childList: true, subtree: true});
    }
});

observer.observe(document.body, {childList: true, subtree: true});

setInterval(function () {
    window.location.reload();
}, (Math.random() * (30 - 15) + 15) * 60000);

function createIntFromSimpStr(value) {
    if (!value) return 0;
    let last = value.charAt(value.length - 1);
    if (last === 'K') return (parseInt(value) * 1000).toFixed();
    else if (last === 'M') return (parseInt(value) * 1000000).toFixed();
    else return parseInt(value);
}

function bettingLogic(r, b, rb, bb, bo, cp) {
    if (b === r) {
    } else if (b > r && rb) {
        rb.click();
    } else if (bb && r > b) {
        bb.click();
    } else if (rb && !bb) {
        rb.click();
    } else if (!rb && bb) {
        bb.click();
    } else if (bo.textContent === 'Predict' && cp !== 0) {
        window.location.reload();
    } else {
        console.log('tits');
    }
}

// data-test-selector="prediction-checkout-active-footer__input-type-toggle"
// document.querySelectorAll('[class="ScInputBase-sc-1wz0osy-0 ScInput-sc-m6vr9t-0 fIywXv ewQTzt InjectLayout-sc-588ddc-0 iDxwbK tw-input"]')[0].value
// document.querySelectorAll('.CoreText-sc-cpl358-0.kCKrpd')