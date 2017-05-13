/**
 * Created with IntelliJ IDEA.
 * User: sikkenj
 * Date: 12-4-13
 * Time: 15:46
 */

"use strict";

// from http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
var isOpera = !!(window.opera && window.opera.version);  // Opera 8.0+
var isFirefox = testCSS('MozBoxSizing');                 // FF 0.8+
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
// At least Safari 3+: "[object HTMLElementConstructor]"
var isChrome = !isSafari && testCSS('WebkitTransform');  // Chrome 1+
var isIE = /*@cc_on!@*/false || testCSS('msTransform');  // At least IE6
var isWebKit = testCSS('WebkitTransform')

function testCSS(prop) {
   return prop in document.documentElement.style;
}

