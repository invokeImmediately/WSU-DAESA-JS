/*!*****************************************************************************
 * scanLatestListOf ▐   ▌▄▀▀▀ █  █ ▐▀▄▀▌▄▀▀▄    █ ▄▀▀▄ █▀▀▄ ▄▀▀▀ · · · · · · · ·
 *  · · · · · · · · ▐ █ ▌▀▀▀█ █  █ █ ▀ ▌█▄▄█ ▄  █ █  █ █▄▄▀ ▀▀▀█  · · · · · · ·
 * · · · · · · · ·   ▀ ▀ ▀▀▀   ▀▀  █   ▀█  ▀ ▀▄▄█  ▀▀  ▀  ▀▄▀▀▀  .devTools.js  ·
 * ·············································································
 * Browser dev tools script that automatically scans the WSU admissions website for the latest official list of majors offered by the university.
 *
 * To run the script, enter it in its 
 *
 * @version 0.0.0
 *
 * @author Daniel C. Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/main/printWpPageDetails.devTools.js
 * @license MIT - Copyright (c) 2023 Washington State University
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *   The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *   THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 ******************************************************************************/

( function( iifeSettings ) {

function getCurrentScanResults() {
  let scanResults = window.sessionStorage.getItem( iifeSettings.scanResultsKey );
  if( !scanResults ) {
    scanResults = {
      currentKey: 'a',
      majors: {
        a: [],
        b: [],
        c: [],
        d: [],
        e: [],
        f: [],
        g: [],
        h: [],
        i: [],
        j: [],
        k: [],
        l: [],
        m: [],
        n: [],
        o: [],
        p: [],
        q: [],
        r: [],
        s: [],
        t: [],
        u: [],
        v: [],
        w: [],
        x: [],
        y: [],
        z: [],
      },
      minors: {
        a: [],
        b: [],
        c: [],
        d: [],
        e: [],
        f: [],
        g: [],
        h: [],
        i: [],
        j: [],
        k: [],
        l: [],
        m: [],
        n: [],
        o: [],
        p: [],
        q: [],
        r: [],
        s: [],
        t: [],
        u: [],
        v: [],
        w: [],
        x: [],
        y: [],
        z: [],
      },
    }
  } else {
    scanResults = JSON.parse( scanResults );
  }
  return scanResults;
}

function iifeMain() {
  const currentLocation = {
    url: window.location.href,
    host: window.location.hostname,
    path: window.location.pathName,
  };
  if ( !verifyBrowserIsAtAdmissionsWebsite( currentLocation ) ) {
    return;
  }
  const scanResults = getCurrentScanResults();
  if ( !verifyBrowserIsAtCorrectMajor( currentLocation, scanResults ) ) {
    return;
  }
  scanPageForMajorsAndMinors( scanResults );
}

function navigateToCorrectMajorPage( scanResults ) {
  const $majorLinks = document.querySelectorAll( iifeSettings.selectors.alphabeticalMajorLinks );
  const $correctLink = $majorLinks.item( scanResults.currentKey.codePointAt( 0 ) - 97 );
  console.log( scanResults.currentKey.codePointAt( 0 ) - 97 );
  if ( $correctLink.innerText.toLowerCase() == scanResults.currentKey ) {
    window.sessionStorage.setItem( iifeSettings.scanResultsKey, JSON.stringify( scanResults ) );
    $correctLink.click();
  } else {
    throw new Error( "Could not find a link to the page for the correct alphabetical listing of majors." );
  }
}

function navigateToNextMajor( scanResults ) {
  if( scanResults.currentKey != 'z' ) {
    scanResults.currentKey = String.fromCodePoint( scanResults.currentKey.codePointAt( 0 ) + 1 );
    console.log( 'Scan results current key updated to :' + scanResults.currentKey );
    navigateToCorrectMajorPage( scanResults );
  } else {
    printResults( scanResults );
  }
}

function printMajors( scanResults ) {
  let finalResults = '';
  for( let i = 'a'; i.codePointAt( 0 ) < ( 'z'.codePointAt( 0 ) + 1 ); i = String.fromCodePoint( i.codePointAt( 0 ) + 1 ) ) {
    for ( let j = 0; j < scanResults.majors[ i ].length; j++ ) {
      finalResults += scanResults.majors[ i ][ j ] + '\n';
    }
  }
  console.log( `Current majors at WSU:
---------------------
${finalResults}` );  
}

function printMinors( scanResults ) {
  let finalResults = '';
  for( let i = 'a'; i.codePointAt( 0 ) < ( 'z'.codePointAt( 0 ) + 1 ); i = String.fromCodePoint( i.codePointAt( 0 ) + 1 ) ) {
    for ( let j = 0; j < scanResults.minors[ i ].length; j++ ) {
      finalResults += scanResults.minors[ i ][ j ] + '\n';
    }
  }
  console.log( `Current minors at WSU:
---------------------
${finalResults}` );  
}

function printResults( scanResults ) {
  printMajors( scanResults );
  printMinors( scanResults );
}

function scanMajorsListForEntries( $majorsList, scanResults ) {
  const $majorsLinks = $majorsList.querySelectorAll( 'li a' );
  for( let i = 0; i < $majorsLinks.length; i++ ) {
    scanResults.majors[ scanResults.currentKey ].push( $majorsLinks[ i ].innerText );
  }
}

function scanMinorsListForEntries( $minorsList, scanResults ) {
  const $minorsLinks = $minorsList.querySelectorAll( 'li a' );
  for( let i = 0; i < $minorsLinks.length; i++ ) {
    scanResults.minors[ scanResults.currentKey ].push( $minorsLinks[ i ].innerText );
  }
}

function scanPageForMajorsAndMinors( scanResults ) {
  scanPageForMajors( scanResults );
  scanPageForMinors( scanResults );
  navigateToNextMajor( scanResults );
}

function scanPageForMajors( scanResults ) {
  const $majorsLists = document.querySelectorAll( iifeSettings.selectors.pagesMajorsList );
  for ( let i = 0; i < $majorsLists.length; i++ ) {
    const $navParent = $majorsLists[ i ].closest( 'nav' );
    const $headingForList = $navParent.previousElementSibling;
    if ( $headingForList !== null && $headingForList.tagName.toLowerCase() == 'h2' && $headingForList.innerText.toLowerCase() == 'majors' ) {
      scanMajorsListForEntries( $majorsLists[ i ], scanResults );
    }
  }
}

function scanPageForMinors( scanResults ) {
  const $minorsLists = document.querySelectorAll( iifeSettings.selectors.pagesMinorsList );
  for ( let i = 0; i < $minorsLists.length; i++ ) {
    const $navParent = $minorsLists[ i ].closest( 'nav' );
    const $headingForList = $navParent.previousElementSibling;
    if ( $headingForList !== null && $headingForList.tagName.toLowerCase() == 'h2' && $headingForList.innerText.toLowerCase() == 'minors' ) {
      scanMinorsListForEntries( $minorsLists[ i ], scanResults );
    }
  }
}

function verifyBrowserIsAtAdmissionsWebsite( currentLocation ) {
  if ( currentLocation.host != iifeSettings.admissionsWebsiteHost ) {
    window.location = iifeSettings.urlForMajorsList;
    return false;
  } else {
    return true;
  }
}

function verifyBrowserIsAtCorrectMajor( currentLocation, scanResults ) {
  const $heading = document.querySelector( iifeSettings.selectors.headingForMajorPage );
  if ( $heading === null || $heading.innerText.toLowerCase() != scanResults.currentKey ) {
    navigateToCorrectMajorPage( scanResults );
    return false;
  } else {
    return true;
  }
}

iifeMain();

} )( {
  admissionsWebsiteHost: 'admission.wsu.edu',
  regexNeedles: {
  },
  scanResultsKey: 'wsuMajorsList',
  selectors: {
    alphabeticalMajorLinks: '#az-wrap ul.az li a',
    headingForMajorPage: 'section.row > .column > h1',
    pagesMajorsList: 'ul.majors',
    pagesMinorsList: 'ul.minors',
  },
  urlForMajorsList: 'https://admission.wsu.edu/academics/fos/Public/index.castle',
} );
