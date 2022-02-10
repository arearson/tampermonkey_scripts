// ==UserScript==
// @name Channel Points Better
// @version 1.1.1.0
// @author You
// @description Automatically bet channel points.
// @match https://www.twitch.tv/*
// @match https://dashboard.twitch.tv/*
// @license MIT
// @grant none
// @namespace http://tampermonkey.net/
// @icon https://blog.twitch.tv/assets/uploads/1306x700-blog-header--channel-points-predictions.jpg
// ==/UserScript==

let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
let claiming = false;
let predictButton = '[data-test-selector="community-prediction-highlight-header__action-button"]';
let pointsButton = '[data-test-selector="balance-string"]';
if (MutationObserver) console.log('Auto betting is enabled.');

let observer = new MutationObserver(() => {
    observer.disconnect()
    let curPoints = document.querySelector(pointsButton);
    if (curPoints) {
        curPoints = converter(curPoints.textContent);
        if (curPoints === 0) {
            observer.observe(document.body, {childList: true, subtree: true});
            return;
        }
    } else {
        observer.observe(document.body, {childList: true, subtree: true});
        return;
    }

    let bonus = document.querySelector(predictButton);
    if (bonus && !claiming) {

        claiming = true;
        if (bonus.textContent !== 'Predict') {
            claiming = false;
            observer.observe(document.body, {childList: true, subtree: true});
            return;
        }
        bonus.click();
        let leftValue = document.querySelector('.prediction-summary-stat__value--left');
        let rightValue = document.querySelector('.prediction-summary-stat__value--right');
        if (!leftValue || !rightValue) {
            window.location.reload();
        }
        let blue = converter(leftValue.textContent);
        let red = converter(rightValue.textContent);
        // console.log(blue, red);
        let dateNow = new Date();
        // Betting Controls
        let blueBet = document.querySelector('.fixed-prediction-button--blue');
        let redBet = document.querySelector('.fixed-prediction-button--pink');
        if (redBet && blueBet) {
            console.log('Waiting for initial votes @', dateNow);
            setTimeout(() => {
                bettingLogic(red, blue, redBet, blueBet, bonus, curPoints);
            }, 20 * 1000);
        } else {
            bettingLogic(red, blue, redBet, blueBet, bonus, curPoints);
        }

        // Hold from spamming the button
        setTimeout(() => {
            dateNow = new Date();
            console.log(curPoints, '@', dateNow);
            claiming = false;
            observer.observe(document.body, {childList: true, subtree: true});
        }, (Math.random() * (.5 - 2) + .5) * 1000);
    }
});

observer.observe(document.body, {childList: true, subtree: true});

setInterval(function () {
    window.location.reload();
}, (Math.random() * (30 - 15) + 15) * 60000);

function converter(value) {
    let last = value.charAt(value.length - 1);
    if (last === 'K') return (parseInt(value) * 1000).toFixed();
    else if (last === 'M') return (parseInt(value) * 1000000).toFixed();
    else return parseInt(value);
}

function bettingLogic(red, blue, redBet, blueBet, bonus, curPoints) {
    if (blue === red) {
    } else if (blue > red && redBet) {
        redBet.click();
    } else if (blueBet && red > blue) {
        blueBet.click();
    } else if (redBet && !blueBet) {
        redBet.click();
    } else if (!redBet && blueBet) {
        blueBet.click();
    } else if (bonus.textContent === 'Predict' && curPoints !== 0) {
        window.location.reload();
    } else {
        console.log('tits');
    }
}

// data-test-selector="prediction-checkout-active-footer__input-type-toggle"
// document.querySelectorAll('[class="ScInputBase-sc-1wz0osy-0 ScInput-sc-m6vr9t-0 fIywXv ewQTzt InjectLayout-sc-588ddc-0 iDxwbK tw-input"]')[0].value
// document.querySelectorAll('.CoreText-sc-cpl358-0.kCKrpd')