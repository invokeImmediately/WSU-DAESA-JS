/*!*************************************************************************************************
 * █▀▀▄ ▄▀▀▄ █▀▀▀ ▄▀▀▀ ▄▀▀▄    ▐▀▄▀▌▄▀▀▀ █▀▀▀    █▀▀▀ ▐▀▀▄ █  █ ▄▀▀▄ ▐▀▀▄ ▄▀▀▀ █▀▀▀ █▀▀▄      █ ▄▀▀▀
 * █  █ █▄▄█ █▀▀  ▀▀▀█ █▄▄█ ▀▀ █ ▀ ▌█    █▀▀  ▀▀ █▀▀  █  ▐ █▀▀█ █▄▄█ █  ▐ █    █▀▀  █▄▄▀   ▄  █ ▀▀▀█
 * ▀▀▀  █  ▀ ▀▀▀▀ ▀▀▀  █  ▀    █   ▀ ▀▀▀ ▀▀▀▀    ▀▀▀▀ ▀  ▐ █  ▀ █  ▀ ▀  ▐  ▀▀▀ ▀▀▀▀ ▀  ▀▄▀ ▀▄▄█ ▀▀▀
 *
 * Custom JS code common to all websites of the Division of Academic Engagement and Student
 *   Achievement (DAESA) in the Office of the Provost at Washington State University (WSU).
 *
 * @version 1.0.0-alpha
 *
 * @author Daniel C. Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/main/TamperMonkey/daesa-mce-enhancer
 *   .js
 * @license MIT - Copyright (c) 2021 Washington State University
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

// ==UserScript==
// @name         WSUWP Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add UI enhancements to the WSUWP editor.
// @author       Daniel Rieck <danielcrieck@gmail.com> (https://github.com/invokeImmediately)
// @match        https://*.wsu.edu/*
// @icon         https://www.google.com/s2/favicons?domain=wsu.edu
// @grant        MIT
// ==/UserScript==

( function() {
    'use strict';

    /*****************
     * §1: Execution entry point.
     */

    // Check to see if a WSWUP editing page has been loaded.
    dispMsg( 'Looking for WSUWP pages to add enhancements.' );
    if ( document.readyState ) {
        setUpWsuWpEnhs( undefined );
    } else {
        document.addEventListener( 'DOMContentLoaded', setUpWsuWpEnhs );
    }

    /*****************
     * §2: Function declarations.
     */

    /**  *************
     * §2.1: Script messaging
     */
    function dispMsg( msg, ...subs ) {
        console.log( "TamperMonkey: " + msg, ...subs );
    }

    /**  *************
     * §2.2: Load WSUWP page editing enhancements
     */
    function setUpWsuWpEnhs( event ) {
        if ( !isWsuWpPage() ) {
            dispMsg( 'No WSUWP pages were found.' );
            return;
        }
        dispMsg( 'WSUWP page was found. Now adding enhancements.' );
        setTimeout(loadMceEditorStylesheets, 2000);
        setTimeout(listenForNewRows, 2100);
        dispMsg( 'Finished adding enhancements.' );
    }

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

    /**  *************
     * §2.3: Page editing enhancements
     */


    /****  ***********
     * §2.3.1: loadMceEditorStylesheets
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

    function handleVisualEdBtnPress( e ) {
        setTimeout( checkForMceEnhSs, 500, this );
    }

    function checkForMceEnhSs( $btn ) {
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

    /****  ***********
     * §2.3.2: listenForNewRows
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

    function handleNewRow( e ) {
        setTimeout( checkMceEditorsForSs, 1000 );
        setTimeout( checkVisualEdBtnsForListeners, 1100 );
    }

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
} )();
