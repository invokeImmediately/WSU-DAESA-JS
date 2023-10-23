/*!*****************************************************************************
 * ▓▓▓▒ █▀▀▀▐▄ ▄▌▐▀█▀▌█▀▀▄ ▄▀▀▄ ▄▀▀▀▐▀█▀▌▐   ▌█▀▀▄ ▄▀▀▀ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
 * ▓▓▒▒ █▀▀   █    █  █▄▄▀ █▄▄█ █     █  ▐ █ ▌█  █ ▀▀▀█ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
 * ▓▒▒▒ ▀▀▀▀▐▀ ▀▌  █  ▀  ▀▄█  ▀  ▀▀▀  █   ▀ ▀ ▀▀▀  ▀▀▀   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓
 * ▒▒▒▒▒                                                  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓
 * ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ConstituentsFromGH.js ▒▒▒▒▒▒▒▒▒▓▓▓
 *
 * Web browser DevTools code snippet that automatically collects the latest
 *  lists of WSU Web Design System elements, components, and modules from the
 *  project's repository on GitHub.
 *
 * @version 0.1.0
 *
 * @author danielcrieck@gmail.com
 *  <danielcrieck@gmail.com>
 *  (https://github.com/invokeImmediately)
 *
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS…
 *  …/blob/main/Chrome-Snippets/github-extract-wds-constituents.js
 *
 * @license MIT — Copyright 2021. by Washington State University
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

( function () {
  'use strict';
  
  const wdsGhUrls = {
    elements:   'https://github.com/wsuwebteam/web-design-system/tree/main/sr' +
      'c/elements',
    components: 'https://github.com/wsuwebteam/web-design-system/tree/main/sr' +
      'c/components',
    modules:    'https://github.com/wsuwebteam/web-design-system/tree/main/sr' +
      'c/modules',
  };

  const ghDomainDest6n = 'https://github.com/wsuwebteam/';

  async function checkDomainIsOnGitHub() {
    const curLocation = window.location.href;
    const onGitHub = curLocation.match( /https:\/\/github.com/ );
    if( !onGitHub ) {
      console.log( 'Navigating to the GitHub domain for data extraction.' );
      await waitForTime( 667 );
      window.location = ghDomainDest6n;
    }
    return onGitHub;
  }

  async function extractWdsConstituents() {
    let wdsConstituents = '';
    wdsConstituents = await extractWdsCon7tFromGhRepo(
      'Elements', wdsGhUrls.elements, wdsConstituents
    );
    wdsConstituents = await extractWdsCon7tFromGhRepo(
      'Components', wdsGhUrls.components, wdsConstituents
    );
    wdsConstituents = await extractWdsCon7tFromGhRepo(
      'Modules', wdsGhUrls.modules, wdsConstituents
    );
    return wdsConstituents;
  }

  async function extractWdsCon7tFromGhRepo( con7tType, con7tUrl, wdsCon7ts ) {
    const finalResponse = await fetchUrl( con7tUrl );
    const ghData = JSON.parse( finalResponse );
    const numItems = ghData.payload.tree.items.length;
    let treeChar = '├';
    if ( wdsCon7ts != '' ) {
      wdsCon7ts += '\n';
    }
    wdsCon7ts += `${con7tType} (×${numItems})\n`;
    ghData.payload.tree.items.forEach( ( item, index ) => {
      if ( index == numItems - 1 ) {
        treeChar = '└'
      }
      wdsCon7ts += `  ${treeChar}─${item.name}\n`;
    } );
    return wdsCon7ts;
  }

  async function fetchUrl( url ) {
    let finalResponse = null;
    await fetch( url )
      .then( ( response ) => {
        if ( !response.ok ) {
          throw new Error( `Unable to access resource « ${url} ».` );
        }
        return response.text();
      } )
      .then( ( response ) => {
        finalResponse = response;
      } );
    return finalResponse;
  }

  async function main() {
    try {
      if ( !( await checkDomainIsOnGitHub() ) ) {
        return;
      }
      const wdsConstituents = await extractWdsConstituents();
      outputWdsConstituents( wdsConstituents );
    } catch( error ) {
      console.error( error );
    }
  }

  async function outputWdsConstituents( wdsConstituents ) {
    console.log(
`Ready to write output to clipboard. Please close DevTools and focus on the
document when you are ready.`
    );
    await waitForDoc4tFocus();
    wdsConstituents =
`Constituents of @github/wsuwebteam/web-design-system as of ${Date()}:\n\n`
      + wdsConstituents;
    await navigator.clipboard.writeText( wdsConstituents );

    window.alert(
`Constituents of @github/wsuwebteam/web-design-system have
 been extracted and output to the clipboard. Check the JS
 console for more information.`
    );

    console.log(
`The following output was stored to clipboard via the [Clipboard API]
 (https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API):
─────────────────────────────────────────────────────────────────\n
${wdsConstituents}`
    );
  }

  async function waitForDoc4tFocus() {
    const checkDoc4tFocus = ( resolve ) => {
      if ( document.hasFocus() ) {
        resolve();
      } else {
        setTimeout( () => checkDoc4tFocus( resolve ), 250 );
      }
    }
    return new Promise( checkDoc4tFocus );
  }

  function waitForTime( timeInMs ) {
    return new Promise( ( resolve ) => {
      setTimeout( () => {
        resolve( '' );
      }, timeInMs );
    } );
  }

  main();
} )();
