/*!*************************************************************************************************
 * ▄▀▀▀ ▄▀▀▀ ▄▀▀▄ ▐▀▀▄ ▄▀▀▀ ▄▀▀▀ ▄▀▀▀ █▀▀▀ ▀█▀ █    █▀▀▀ ▄▀▀▀  ▄▀█
 * ▀▀▀█ █    █▄▄█ █  ▐ █    ▀▀▀█ ▀▀▀█ █▀▀▀  █  █  ▄ █▀▀  ▀▀▀█ ▐▄▄█▌
 * ▀▀▀   ▀▀▀ █  ▀ ▀  ▐  ▀▀▀ ▀▀▀  ▀▀▀  ▀    ▀▀▀ ▀▀▀  ▀▀▀▀ ▀▀▀     █
 *
 *    ▄▀▀▀ █▀▀▀ ▄▀▀▀▐▀█▀▌▄▀▀▀   ▐▀▄▀▌    █ ▄▀▀▀
 *    ▀▀▀█ █▀▀  █     █  ▀▀▀█   █ ▀ ▌ ▄  █ ▀▀▀█
 *    ▀▀▀  ▀▀▀▀  ▀▀▀  █  ▀▀▀  ▀ █   ▀ ▀▄▄█ ▀▀▀
 *
 * Node module designed for command line execution that scans CSS files that have been organized into sections by comment blocks.
 *
 * The module is designed to quickly extract file sections and compare the sections present in two files.
 *
 * @version 0.0.0
 *
 * @author Daniel C. Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/main/jQuery.daesa-custom.js
 * @license MIT - Copyright (c) 2022 Washington State University
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *   The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *   THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **************************************************************************************************/

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require( 'fs/promises' );
const proc = require( 'process' );
const moduleOptions = proc.argv.slice( 2 );

function compareCssFiles( filePath, cssCode, refPath, cssRefCode ) {
  if ( typeof cssCode == 'undefined' || typeof cssRefCode == 'undefined' ) {
    return;
  }

  // Find each file sectioning comment and also the first two lines of code following it
  const regExp = /(\/\*! —» .+? «— \*\/)\r\n(?:\r\n)?(.+\r\n.+\r\n)/g;
  const matches = cssCode.matchAll( regExp );

  // Prepare a message about the files being compared
  const msgHead = 'File present in';
  const msgMid = 'but not found in';
  const subMsg1Len = msgHead.length + filePath.length + 1;
  const subMsg2Len = msgMid.length + refPath.length + 4;
  const maxLen = subMsg1Len > subMsg2Len ? subMsg1Len : subMsg2Len;
  const seperator = '-'.repeat( maxLen );
  console.log( `${seperator}
${msgHead} ${filePath}
  ${msgMid} ${refPath}:
${seperator}` );

  // Compare the files and report results
  for ( const match of matches ) {
    if ( !cssRefCode.includes( match[2] ) ) {
      console.log( `${match[1]}
${match[2]}
` );
    }
  }
}

async function moduleMain( moduleOptions ) {
  const filePath = moduleOptions[0];
  const operatingMode = moduleOptions[1];
  const cssCode = await scanCssFile( filePath );
  switch( operatingMode ) {
  case 'compare':
    const refPath = moduleOptions[2];
    const cssRefCode = await scanCssFile( refPath );
    compareCssFiles( filePath, cssCode, refPath, cssRefCode );
    break;
  default:
    printCssFileSects( filePath, cssCode );
  }
}

function printCssFileSects( filePath, cssCode ) {
  if ( typeof cssCode == 'undefined' ) {
    return;
  }
  const regExp = /\/\*! —» .+? «— \*\//g;
  const matches = cssCode.matchAll( regExp );
  const msgHead = 'File sections found in';
  const seperator = '-'.repeat( msgHead.length + filePath.length + 2);
  console.log( `${seperator}
${msgHead} ${filePath}:
${seperator}` );
  for ( const match of matches ) {
    console.log( `${match[0]}` );
  }
}

async function scanCssFile( filePath ) {
  if ( typeof filePath === 'undefined' ) {
    console.error( new ReferenceError( 'A path to a file to scan must be supplied when invoking this script.' ) );
    return;
  }
  const cssCode = await fs.readFile( filePath, { encoding: 'utf8' } );
  return cssCode;
}

moduleMain( moduleOptions );
