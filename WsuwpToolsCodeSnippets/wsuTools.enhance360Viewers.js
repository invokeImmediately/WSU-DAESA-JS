/*!***
 * ▓▒▒▒ wsuTools.enhance ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▓▓▓
 * ▓▒▒▒  █▀▀█ ▄▀▀▄ █▀▀█  ▐   ▌▀█▀ █▀▀▀▐   ▌█▀▀▀ █▀▀▄ ▄▀▀▀ ▒▒▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▓▓
 * ▓▓▒▒    ▀▄ █▄▄  █▄▀█   █ █  █  █▀▀ ▐ █ ▌█▀▀  █▄▄▀ ▀▀▀█ ▒▒▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▓▓
 * ▓▓▒▒  █▄▄█ ▀▄▄▀ █▄▄█    █  ▀▀▀ ▀▀▀▀ ▀ ▀ ▀▀▀▀ ▀  ▀▄▀▀▀  ▒▒▒▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▓
 * ▓▓▓▒  .mjs ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▓
 *
 * wsuTools.enhance360Viewers.js - v0.0.0
 *
 * Enhance the usability of 360 viewers by specifying additional style rules to
 *   improve the presentation of embedded 360 viewers.
 *
 * By Daniel C. Rieck (daniel.rieck@wsu.edu)
 *   [https://github.com/invokeImmediately/]
 *
 * Copyright (c) 2024 Washington State University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the “Software”), to
 *   deal in the Software without restriction, including without limitation the
 *   rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *   sell copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *   DEALINGS IN THE SOFTWARE.
 ****/

(() => {

  /**
   * Add CSS for improving the display of embedded Google Maps to the head of
   *   the document.
   */
  function addCssForGoogleMapsIframes() {
    const newStyleSheet = document.createElement('style');
    newStyleSheet.setAttribute('type', 'text/css');
    newStyleSheet.setAttribute('id', 'css-from-wsuTools-enhance360Viewers-js');

    const cssRules =
`div.googlemaps > iframe {
  aspect-ratio: auto 625/406;
  height: auto;
  width: 100%;
}`

    if (!('textContent' in newStyleSheet)) {
      return;
    }
    newStyleSheet.textContent = cssRules;

    document.getElementsByTagName('head')[0].appendChild(newStyleSheet);
  }

  /**
   * Begin IIFE execution by waiting for the DOM to load and then adding
   *   enhancements. First, 
   */
  function iifeMain() {
    document.addEventListener('DOMContentLoaded', (event) => {
      addCssForGoogleMapsIframes();
    });
  }

  iifeMain();
})();
