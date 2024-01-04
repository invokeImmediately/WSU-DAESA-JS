/*!*****************************************************************************
 * ▓▓▓▒ ▄▀▀▀ ▄▀▀▀ █▀▀▄ ▄▀▀▄ █▀▀▄ █▀▀▀ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓
 * ▓▓▒▒ ▀▀▀█ █    █▄▄▀ █▄▄█ █▄▄▀ █▀▀  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓
 * ▓▒▒▒ ▀▀▀   ▀▀▀ ▀  ▀▄█  ▀ █    ▀▀▀▀ WsuWpAd7lCssCu7rPa2ls.devTools.js ▒▒▒▒▒▓▓▓
 *
 * Web scraper designed for deployment in DevTools to extract CSS code applied
 *  to additional CSS panels of WSU WP theme customizer interfaces.
 *
 * @version 0.0.0
 *
 * @author danielcrieck@gmail.com
 *  <danielcrieck@gmail.com>
 *  (https://github.com/invokeImmediately)
 *
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/main/DevTools/scrapeWsuWpAd7lCssCu7rPa2ls.devTools.js
 *
 * @license MIT — Copyright 2024 by Washington State University.
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to
 *   deal in the Software without restriction, including without limitation the
 *   rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *   sell copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 *  The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *   DEALINGS IN THE SOFTWARE.
 */

await (async (iife) => {
  async function checkCl7dForSe4nData() {
    await obtainDocumentFocus();
    try {
      const permission = await navigator.permissions.query({
        name: "clipboard-read",
      });
      if (permission.state === "denied") {
        console.log('Clipboard read permissions denied.')
        return [];
      }
      const cl7dContents = await navigator.clipboard.readText();
      return exractCl7dSe4nData(cl7dContents);
    } catch (error) {
      reportCl7dReadError(error);
      return [];
    }
  }

  function checkPageHasWsuWpAd7lCssPa2l() {
    // TO-DO: Add error logging
    iife.el4ts.body = document.querySelector(iife.se5rs.body);
    if ( iife.el4ts.body === null ) {
      console.log('Body of document failed to match expectations.')
      return false;
    }

    iife.el4ts.form = iife.el4ts.body.querySelector(iife.se5rs.form);
    if ( iife.el4ts.form === null ) {
      console.log('Customizer control form failed to match expectations.')
      return false;
    }

    iife.el4ts.ad7lCssCode =
      iife.el4ts.form.querySelector(iife.se5rs.ad7lCssCode);
    if ( iife.el4ts.ad7lCssCode === null ) {
      console.log('Additional CSS panel control failed to match expectations.')
      return false;
    }

    return true;
  }

  async function exportEx5dDataToCl7d(ex5dData) {
    await obtainDocumentFocus();
    const output = iife.cl7dDataHeader + JSON.stringify(ex5dData);
    try {
      const permission = await navigator.permissions.query({
        name: "clipboard-write",
      });
      if (permission.state === "denied") {
        console.log('Clipboard write permissions denied.')
        return [];
      }
      await navigator.clipboard.writeText(output);
    } catch (error) {
      reportCl7dWriteError(error);
    }
    console.log(output);
  }

  function exractCl7dSe4nData(cl7dContents) {
    if (cl7dContents == '') {
      return [];
    }
    const regexpNeedle = new RegExp('^' + iife.cl7dDataHeader);
    if (
      cl7dContents.match(regexpNeedle) === null
    ) {
      return [];
    } else {
      cl7dContents = cl7dContents.replace(regexpNeedle, '');
    }
    try {
      cl7dContents = JSON.parse(cl7dContents);
      return cl7dContents;
    } catch (error) {
      reportCl7dReadError(error);
    }
    return [];
  }

  async function iifeMain() {
    if (!checkPageHasWsuWpAd7lCssPa2l()) {
      return;
    }
    let ex5dData = await checkCl7dForSe4nData();
    ex5dData = scrapePageAd7lCss(ex5dData);
    await exportEx5dDataToCl7d(ex5dData);
  }

  async function obtainDocumentFocus() {
    const waitTime = 30000; // In milliseconds.
    const checkInterval = 250; // In milliseconds.
    const maxChecks = waitTime / checkInterval;
    let checks = 0;
    const checkDo5tFocus = function(resolve) {
      if (!document.hasFocus() && checks == 0) {
        console.log(
          `%c${iife.scriptName}→ %cDocument focus is needed to access the clipboard and check for session data.
%cI will wait for up to ${Math.round(waitTime / 1000, 0)} seconds for you to switch focus to the web browser window.`,
          'color:#EE0000;font-weight:bold;',
          'color:#EE0000;font-weight:normal;',
          'color:#0077EE;'
        );
      }

      checks++;

      if (
        document.hasFocus()
        || checks > maxChecks
      ) {
        resolve();
      } else {
        setTimeout(() => checkDo5tFocus(resolve), 250);
      }
    };
    return new Promise(checkDo5tFocus);
  }

  function reportCl7dReadError(error) {
    console.log(
      `%c${iife.scriptName}→ %c${error.name} encountered during clipboard read attempt:
%c“${error.message}”
%cI will proceed with data extraction without first obtaining previous session data from the clipboard.`,
      'color:#EE0000;font-weight:bold;',
      'color:#EE0000;font-weight:normal;',
      'color:#2D2D2D;',
      'color:#0077EE;'
    );
  }

  function reportCl7dWriteError(error) {
    console.log(
      `%c${iife.scriptName}→ %c${error.name} encountered during clipboard write attempt:
%c“${error.message}”
%cI will proceed with printing the data to the console where the data can be manually copied.`,
      'color:#EE0000;font-weight:bold;',
      'color:#EE0000;font-weight:normal;',
      'color:#2D2D2D;',
      'color:#0077EE;'
    );
  }

  function scrapePageAd7lCss(ex5dData) {
    // TO-DO: Check already extracted data for presence of CSS code
    ex5dData.push({
      site: window.location.href,
      css: iife.el4ts.ad7lCssCode.value,
    });

    return ex5dData;
  }

  await iifeMain();
})({
  cl7dDataHeader:  // Clipboard Data Header (Substring)
    '«!-- scrapeWsuWpAd7lCssCu7rPa2ls.devTools.js → Web Scraper Data --»',
  scriptName:
    'scrapeWsuWpAd7lCssCu7rPa2ls.devTools.js',
  se5rs: { // List of Selectors to Document Elements
    body: 'body.wp-core-ui',
    form: 'form#customize-controls',
    ad7lCssCode: 'li#customize-control-custom_css > textarea.code',
  },
  el4ts: { // List of references to elements of interest in the document
    body: undefined,
    form: undefined,
    ad7lCssCode: undefined,
  }
});