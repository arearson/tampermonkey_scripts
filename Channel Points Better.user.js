// ==UserScript==
// @name Channel Points Better
// @version 1.0.4.2
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
let button = '[data-test-selector="community-prediction-highlight-header__action-button"]';
let points = '[data-test-selector="balance-string"]';
if (MutationObserver) console.log('Auto betting is enabled.');

let observer = new MutationObserver(e => {
    let bonus = document.querySelector(button);
    if (bonus && !claiming) {
        bonus.click();
        let curPoints = document.querySelector(points);
        if (curPoints) {curPoints = converter(curPoints.textContent);}
        else return;
        let leftValue = document.querySelector('.prediction-summary-stat__value--left');
        let rightValue = document.querySelector('.prediction-summary-stat__value--right');
        if (leftValue && rightValue) {
            let blue = converter(leftValue.textContent);
            let red = converter(rightValue.textContent);
            console.log(blue, red);
// Betting Controls
            claiming = true;
            let date = new Date();
            let blueBet = document.querySelector('.fixed-prediction-button--blue');
            let redBet = document.querySelector('.fixed-prediction-button--pink');
            // let backarrow = document.querySelector('.tw-popover-header__icon-slot--left .ScCoreButton-sc-1qn4ixc-0');
            if (redBet && blueBet) {
                console.log('Waiting for intial votes@ '+ date);
                setTimeout(()=>{claiming = false;}, 5*1000);
                if(blue===red) {return;}
            }
            if (blue>red && redBet) {redBet.click();}
            else if (blueBet && red>blue) {blueBet.click();}
            else if (redBet && !blueBet) {redBet.click();}
            else if (!redBet && blueBet) {blueBet.click();}
            // else if (backarrow) {backarrow.click();}
            else {console.log('tits');points.click();}
        }
// Hold from spamming the button
        let date = new Date();
        claiming = true;
        setTimeout(() => {
            console.log(curPoints, 'pts '+ date);
            claiming = false;
            points.click();
        }, Math.random() * 1000 + 1000);
    }
});

observer.observe(document.body, {childList: true, subtree: true});

setInterval(function() {window.location.reload();}, 30*60000);

function converter(value) {
    let last = value.charAt(value.length - 1);
    if (last === 'K') return parseFloat(value)*1000;
    else if(last === 'M') return parseFloat(value)*1000000;
    else return parseFloat(value);
}