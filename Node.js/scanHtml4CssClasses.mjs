/*!*************************************************************************************************
 * ▄▀▀▀ ▄▀▀▀ ▄▀▀▄ ▐▀▀▄ █  █▐▀█▀▌▐▀▄▀▌█     ▄▀█ ▄▀▀▀ ▄▀▀▀ ▄▀▀▀ ▄▀▀▀ █    ▄▀▀▄ ▄▀▀▀ ▄▀▀▀ █▀▀▀ ▄▀▀▀
 * ▀▀▀█ █    █▄▄█ █  ▐ █▀▀█  █  █ ▀ ▌█  ▄ ▐▄▄█▌█    ▀▀▀█ ▀▀▀█ █    █  ▄ █▄▄█ ▀▀▀█ ▀▀▀█ █▀▀  ▀▀▀█
 * ▀▀▀   ▀▀▀ █  ▀ ▀  ▐ █  ▀  █  █   ▀▀▀▀     █  ▀▀▀ ▀▀▀  ▀▀▀   ▀▀▀ ▀▀▀  █  ▀ ▀▀▀  ▀▀▀  ▀▀▀▀ ▀▀▀
 *
 *      ▐▀▄▀▌   █ ▄▀▀▀
 *      █ ▀ ▌▄  █ ▀▀▀█
 *    ▀ █   ▀▀▄▄█ ▀▀▀
 *
 * Node module designed for command line execution that scans HTML for the CSS classes that are in use within the file.
 *
 * @version 0.0.0
 *
 * @author Daniel C. Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/main/Node.js/scanHtml4CssClasses.mjs
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

async function findTagsInHtml( htmlCode ) {
  const regExp = /<(?!!)(?!\/)([^ >]+?).*?>/g;
  // TODO: Finish writing
}

async function findCssClassesUsedInHtml( htmlCode, existingSetOfClassesInUse ) {
  const regExp = /<(?!!)(?!\/)([^ >.]+?)[^>.]*?class="([^"]+)".*?>/g;
  const matches = htmlCode.matchAll( regExp );
  const setOfClassesInUse = typeof existingSetOfClassesInUse === 'undefined' ? new Set() : existingSetOfClassesInUse;
  for ( const match of matches ) {
    const classList = match[ 2 ];
    const classes = classList.split( " " );
    for ( const cssClass of classes ) {
      if ( cssClass != '' ) {
        setOfClassesInUse.add( cssClass );
      }
    }
  }
  return setOfClassesInUse;
}

async function moduleMain( moduleOptions ) {
  let filePath = moduleOptions[0];
  let htmlCode = await scanHtmlFile( filePath );
  let cssClassesInUse = await findCssClassesUsedInHtml( htmlCode );
  let nextFileIdx = 1;
  const filePaths = [ filePath ];
  while( typeof moduleOptions[ nextFileIdx ] !== 'undefined' ) {
    filePath = moduleOptions[ nextFileIdx ];
    htmlCode = await scanHtmlFile( filePath );
    cssClassesInUse = await findCssClassesUsedInHtml( htmlCode, cssClassesInUse );
    filePaths.push( filePath );
    nextFileIdx++;
  }
  printCssClassesInUse( filePaths, cssClassesInUse );
}

function printCssClassesInUse( filePaths, setOfClassesInUse ) {
  if ( typeof setOfClassesInUse == 'undefined' ) {
    return;
  }
  const classArray = Array.from( setOfClassesInUse );
  classArray.sort();
  const msgHead = 'Classes found in in the following files:';
  let maxStrLen = msgHead.length;
  for ( const filePath of filePaths ) {
    maxStrLen = filePath.length > maxStrLen ? filePath.length : maxStrLen;
  }
  const seperator = '-'.repeat( maxStrLen );
  const filePathList = filePaths.join( '\n' );
  console.log( `${seperator}
${msgHead}
${filePathList}
${seperator}` );
  for ( const cssClass of classArray ) {
    console.log( cssClass );
  }
}

async function scanHtmlFile( filePath ) {
  if ( typeof filePath === 'undefined' ) {
    console.error( new ReferenceError( 'A path to a file to scan must be supplied when invoking this script.' ) );
    return;
  }
  console.log( `Now scanning ${filePath}.` )
  const htmlCode = await fs.readFile( filePath, { encoding: 'utf8' } );
  return htmlCode;
}

moduleMain( moduleOptions );
