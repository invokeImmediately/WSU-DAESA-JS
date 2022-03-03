// ==UserScript==
// @name         WSUWP Editor Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Add UI enhancements to the WSUWP editor.
// @author       Daniel Rieck <danielcrieck@gmail.com> (https://github.com/invokeImmediately)
// @match        https://*.wsu.edu/*
// @icon         https://www.google.com/s2/favicons?domain=wsu.edu
// ==/UserScript==

/*!*************************************************************************************************
 * ▐   ▌▄▀▀▀ █  █▐   ▌█▀▀▄    █▀▀▀ █▀▀▄ ▀█▀▐▀█▀▌▄▀▀▄ █▀▀▄
 * ▐ █ ▌▀▀▀█ █  █▐ █ ▌█▄▄▀ ▀▀ █▀▀  █  █  █   █  █  █ █▄▄▀ ▀▀
 *  ▀ ▀ ▀▀▀   ▀▀  ▀ ▀ █       ▀▀▀▀ ▀▀▀  ▀▀▀  █   ▀▀  ▀  ▀▄
 *
 *    █▀▀▀ ▐▀▀▄ █  █ ▄▀▀▄ ▐▀▀▄ ▄▀▀▀ █▀▀▀ ▐▀▄▀▌█▀▀▀ ▐▀▀▄▐▀█▀▌▄▀▀▀      █ ▄▀▀▀
 *    █▀▀  █  ▐ █▀▀█ █▄▄█ █  ▐ █    █▀▀  █ ▀ ▌█▀▀  █  ▐  █  ▀▀▀█   ▄  █ ▀▀▀█
 *    ▀▀▀▀ ▀  ▐ █  ▀ █  ▀ ▀  ▐  ▀▀▀ ▀▀▀▀ █   ▀▀▀▀▀ ▀  ▐  █  ▀▀▀  ▀ ▀▄▄█ ▀▀▀
 *
 * JavaScript for contextually adding enhancements to the WSUWP dashboard interface.
 *
 * @version 0.3.1
 *
 * @author Daniel C. Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/main/TamperMonkey/wsuwp-editor-enhan
 *   cements.js
 * @license MIT - Copyright (c) 2022 Washington State University
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 *     and associated documentation files (the “Software”), to deal in the Software without
 *     restriction, including without limitation the rights to use, copy, modify, merge, publish,
 *     distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
 *     Software is furnished to do so, subject to the following conditions:
 *   The above copyright notice and this permission notice shall be included in all copies or
 *     substantial portions of the Software.
 *   THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 *     BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 *     DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *     FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **************************************************************************************************/

////////////////////////////////////////////////////////////////////////////////////////////////////
// TABLE OF CONTENTS
// ----------------------------------------------------------------------------------------------
// §1: Invoke a function expression for enhancing WSUWP editor interface.......................71
//   §1.1: Declare IIFE's behaviors............................................................78
//     §1.1.1: Script messaging................................................................82
//     §1.1.2: General loading of WSUWP page editing enhancements..............................89
//       §1.1.2.1: loadEnhSsOnMceEd............................................................93
//       §1.1.2.2: loadEnhSsOnMceEd...........................................................109
//       §1.1.2.3: loadMceEditorStylesheets...................................................126
//       §1.1.2.4: loadEnhSsOnMceEd...........................................................143
//     §1.1.3: Event-based loading of page editing enhancements...............................163
//       §1.1.3.1: listenForRowSorts..........................................................167
//       §1.1.3.2: handleRowSorted............................................................185
//       §1.1.3.3: checkForMceEnhSsAfterRS....................................................194
//       §1.1.3.4: listenForColSorts..........................................................218
//       §1.1.3.5: handleColSorted............................................................236
//       §1.1.3.6: checkForMceEnhSsAfterCS....................................................245
//       §1.1.3.7: listenForVisualEditors.....................................................269
//       §1.1.3.8: handleVisualEdBtnPress.....................................................288
//       §1.1.3.9: handleVisualEdBtnPress.....................................................296
//       §1.1.3.10: listenForNewRows..........................................................325
//       §1.1.3.11: listenForNewRows..........................................................340
//       §1.1.3.12: checkMceEditorsForSs......................................................349
//       §1.1.3.13: checkMceEditorsForSs......................................................364
//   §1.2: Begin execution of IIFE behaviors..................................................383
////////////////////////////////////////////////////////////////////////////////////////////////////

/*****************
 * §1: Invoke a function expression for enhancing WSUWP editor interface.
 */

( function() {
  'use strict';

  /** ************ *
   * §1.1: Declare IIFE's behaviors.
   */

  /*** *********** * *
   * §1.1.1: Script messaging
   */
  function dispMsg( msg, ...subs ) {
    console.log( "TamperMonkey: " + msg, ...subs );
  }

  /*** *********** * *
   * §1.1.2: General loading of WSUWP page editing enhancements
   */

  /**** ********** * * *
   * §1.1.2.1: loadEnhSsOnMceEd
   */
  function setUpWsuWpEnhs( event ) {
    if ( !isWsuWpPage() ) {
      dispMsg( 'No WSUWP pages were found.' );
      return;
    }
    dispMsg( 'WSUWP page was found. Now adding enhancements.' );
    setTimeout(loadMceEditorStylesheets, 2000);
    setTimeout(listenForNewRows, 2100);
    setTimeout(listenForRowSorts, 2200);
    setTimeout(listenForColSorts, 2300);
    dispMsg( 'Finished adding enhancements.' );
  }

  /**** ********** * * *
   * §1.1.2.2: loadEnhSsOnMceEd
   */

  function isWsuWpPage() {
    let wsuwpFound = false;
    const elems = document.getElementsByTagName( 'body' );
    const bodyTg = elems.length === 1 ?
         elems.item(0) :
         null;
    if ( bodyTg ) {
      const clList = bodyTg.classList;
      wsuwpFound = clList.contains( 'wp-admin' );
    }
    return wsuwpFound;
  }

  /**** ********** * * *
   * §1.1.2.3: loadMceEditorStylesheets
   */
  function loadMceEditorStylesheets() {
    const $elems = document.getElementsByClassName( 'mce-edit-area' );
    dispMsg( 'Looking for loaded MCE editors. ' + $elems.length + ' were found.' );
    for(
      let i = 0;
      i < $elems.length;
      i++
    ) {
      loadEnhSsOnMceEd( $elems[ i ] );
      dispMsg( 'Found an MCE iframe. Loading stylesheet for visual enhancements of MCEs.' );
    }
    listenForVisualEditors();
  }

  /**** ********** * * *
   * §1.1.2.4: loadEnhSsOnMceEd
   */

  function loadEnhSsOnMceEd( $ed ) {
    if( !$ed.classList.contains( 'mce-is-daesa-enhanced' ) ) {
      $ed.classList.add( 'mce-is-daesa-enhanced' );
      const $if = ( $ed.getElementsByTagName( 'iframe' ) )[ 0 ];
      const $mceDoc = $if.contentWindow.document;
      const $mceHead = $mceDoc.getElementsByTagName( 'head' )[0];
      const $cssLink = $mceDoc.createElement('link');
      $cssLink.id = 'daesa-mce-enhancer-css';
      $cssLink.rel = 'stylesheet';
      $cssLink.type = 'text/css';
      $cssLink.href= 'https://daesa.wsu.edu/documents/2021/09/daesa-mce-enhancer.css?v=1.0.0-alpha-rc2';
      $cssLink.media = 'all';
      $mceHead.appendChild( $cssLink );
    }
  }

  /*** *********** * *
   * §1.1.3: Event-based loading of page editing enhancements
   */

  /**** ********** * * *
   * §1.1.3.1: listenForRowSorts
   */

  function listenForRowSorts() {
    const $sorters = document.querySelectorAll( '.ttfmake-section .ttfmake-section-header' );
    dispMsg( 'Listening for Make Stage Builder row sorting events; ' + $sorters.length + ' rows are being monitored.' );
    for(
      let i = 0,
      $sorter = undefined;
      i < $sorters.length;
      i++
    ) {
      $sorter = $sorters[i];
      $sorter.addEventListener( 'mouseup', handleRowSorted );
    }
  }

  /**** ********** * * *
   * §1.1.3.2: handleRowSorted
   */

  function handleRowSorted( e ) {
    dispMsg( 'TamperMonkey: Make Stage Builder possible row sorting event detected.' );
    setTimeout( checkForMceEnhSsAfterRS, 500, this );
  }

  /**** ********** * * *
   * §1.1.3.3: checkForMceEnhSsAfterRS
   */

  function checkForMceEnhSsAfterRS( $sorter ) {
    // Find the editor interface through DOM tree traversal.
    let $curElem = $sorter.parentElement;
    if ( !$curElem.classList.contains( 'ttfmake-section' ) ) {
      return;
    }
    $curElem = $curElem.getElementsByClassName( 'mce-edit-area' );

    // Load the enhancement stylesheet as needed on each editor area.
    for(
      let i = 0,
      $edArea = undefined;
      i < $curElem.length;
      i++
    ) {
      $edArea = $curElem[i];
      loadEnhSsOnMceEd( $edArea );
    }
  }

  /**** ********** * * *
   * §1.1.3.4: listenForColSorts
   */

  function listenForColSorts() {
    const $sorters = document.querySelectorAll( '.wsuwp-spine-builder-column .ttfmake-sortable-handle' );
    dispMsg( 'Listening for Make Stage Builder column sorting events; ' + $sorters.length + ' columns are being monitored.' );
    for(
      let i = 0,
      $sorter = undefined;
      i < $sorters.length;
      i++
    ) {
      $sorter = $sorters[i];
      $sorter.addEventListener( 'mouseup', handleColSorted );
    }
  }

  /**** ********** * * *
   * §1.1.3.5: handleColSorted
   */

  function handleColSorted( e ) {
    dispMsg( 'TamperMonkey: Make Stage Builder possible column sorting event detected.' );
    setTimeout( checkForMceEnhSsAfterCS, 500, this );
  }

  /**** ********** * * *
   * §1.1.3.6: checkForMceEnhSsAfterCS
   */

  function checkForMceEnhSsAfterCS( $sorter ) {
    // Find the editor interface through DOM tree traversal.
    let $curElem = $sorter.parentElement;
    if ( !$curElem.classList.contains( 'wsuwp-spine-builder-column' ) ) {
      return;
    }
    $curElem = $curElem.getElementsByClassName( 'mce-edit-area' );

    // Load the enhancement stylesheet as needed on each editor area.
    for(
      let i = 0,
      $edArea = undefined;
      i < $curElem.length;
      i++
    ) {
      $edArea = $curElem[i];
      loadEnhSsOnMceEd( $edArea );
    }
  }

  /**** ********** * * *
   * §1.1.3.7: listenForVisualEditors
   */

  function listenForVisualEditors() {
    const $elems = document.getElementsByClassName( 'wp-switch-editor switch-tmce' );
    dispMsg( 'Listening for MCE editor activations; ' + $elems.length + ' buttons are being monitored.' );
    for(
      let i = 0,
      $btn = undefined;
      i < $elems.length;
      i++
    ) {
      $btn = $elems[i];
      $btn.classList.add( 'daesa-mce-enhr-is-listening' );
      $btn.addEventListener( 'click', handleVisualEdBtnPress );
    }
  }

  /**** ********** * * *
   * §1.1.3.8: handleVisualEdBtnPress
   */

  function handleVisualEdBtnPress( e ) {
    setTimeout( checkForMceEnhSsAfterVEBP, 500, this );
  }

  /**** ********** * * *
   * §1.1.3.9: handleVisualEdBtnPress
   */

  function checkForMceEnhSsAfterVEBP( $btn ) {
    // Find the editor interface through DOM tree traversal.
    let $curElem = $btn.parentElement;
    if ( !$curElem.classList.contains( 'wp-editor-tabs' ) ) {
      return;
    } else {
      $curElem = $curElem.parentElement;
    }
    dispMsg( 'Checking for editor tools.' );
    if ( !$curElem.classList.contains( 'wp-editor-tools' ) ) {
      return;
    } else {
      $curElem = $curElem.nextElementSibling;
    }
    dispMsg( 'Checking for editor container.' );
    if ( !$curElem.classList.contains( 'wp-editor-container' ) ) {
      return;
    } else {
      $curElem = $curElem.getElementsByClassName( 'mce-edit-area' )[0];
    }

    // Call loadEnhSsOnMceEd if needed.
    loadEnhSsOnMceEd( $curElem );
  }

  /**** ********** * * *
   * §1.1.3.10: listenForNewRows
   */
  function listenForNewRows() {
    const $btns = document.getElementsByClassName( 'ttfmake-menu-list-item-link' );
    dispMsg( 'Listening for new page builder rows.' );
    for(
      let i = 0;
      i < $btns.length;
      i++
    ) {
      $btns[ i ].addEventListener( 'click', handleNewRow );
    }
  }

  /**** ********** * * *
   * §1.1.3.11: listenForNewRows
   */

  function handleNewRow( e ) {
    setTimeout( checkMceEditorsForSs, 1000 );
    setTimeout( checkVisualEdBtnsForListeners, 1100 );
  }

  /**** ********** * * *
   * §1.1.3.12: checkMceEditorsForSs
   */

  function checkMceEditorsForSs() {
    const $elems = document.getElementsByClassName( 'mce-edit-area' );
    for(
      let i = 0;
      i < $elems.length;
      i++
    ) {
      loadEnhSsOnMceEd( $elems[ i ] );
    }
  }

  /**** ********** * * *
   * §1.1.3.13: checkMceEditorsForSs
   */

  function checkVisualEdBtnsForListeners() {
    const $elems = document.getElementsByClassName( 'wp-switch-editor switch-tmce' );
    for(
      let i = 0,
      $btn = undefined;
      i < $elems.length;
      i++
    ) {
      $btn = $elems[i];
      if( !$btn.classList.contains( 'daesa-mce-enhr-is-listening' ) ){
        $btn.addEventListener( 'click', handleVisualEdBtnPress );
      }
    }
  }

  /** ************ *
   * §1.2: Begin execution of IIFE behaviors.
   */

  // Check to see if a WSWUP editing page has been loaded.
  dispMsg( 'Looking for WSUWP pages to add enhancements.' );

  if ( document.readyState ) {
    setUpWsuWpEnhs( undefined );
  } else {
    document.addEventListener( 'DOMContentLoaded', setUpWsuWpEnhs );
  }

} )();
