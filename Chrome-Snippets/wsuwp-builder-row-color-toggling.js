/*!*************************************************************************************************
 * ▐   ▌▄▀▀▀ █  █▐   ▌█▀▀▄   ▄▀▀▀ ▐▀▀▄ ▀█▀ █▀▀▄ █▀▀▄ █▀▀▀▐▀█▀▌▄▀▀▀ ▄
 * ▐ █ ▌▀▀▀█ █  █▐ █ ▌█▄▄▀   ▀▀▀█ █  ▐  █  █▄▄▀ █▄▄▀ █▀▀   █  ▀▀▀█ ▄
 *  ▀ ▀ ▀▀▀   ▀▀  ▀ ▀ █      ▀▀▀  ▀  ▐ ▀▀▀ █    █    ▀▀▀▀  █  ▀▀▀ 
 *       ___               _____     __           ______               ___          
 *      / _ \___ _    __  / ___/__  / /__  ____  /_  __/__  ___ ____ _/ (_)__  ___ _
 *     / , _/ _ \ |/|/ / / /__/ _ \/ / _ \/ __/   / / / _ \/ _ `/ _ `/ / / _ \/ _ `/
 *    /_/|_|\___/__,__/  \___/\___/_/\___/_/     /_/  \___/\_, /\_, /_/_/_//_/\_, /
 *                                                        /___//___/         /___/
 *
 * Color-code Page Builder sections when working with pages in WSUWP that were created using the
 *   Builder Template of the Spine Theme. The script effects color-coding through applying CSS
 *   classes whose styles are injected into the WSUWP editor page via the Stylus chrome extension.
 *
 * @version 1.0.0
 *
 * @author Daniel C. Rieck <danielcrieck@gmail.com> (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/main/Chrome-Snippets/…
 *   …wsuwp-builder-row-color-toggling.js
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/main/Chrome-Snippets/…
 *   …wsuwp-builder-row-color-toggling.css
 * @link https://github.com/openstyles/stylus
 * @license MIT — Copyright 2021 by Washington State University
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 *     and associated documentation files (the "Software"), to deal in the Software without
 *     restriction, including without limitation the rights to use, copy, modify, merge, publish,
 *     distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
 *     Software is furnished to do so, subject to the following conditions:
 *   The above copyright notice and this permission notice shall be included in all copies or
 *     substantial portions of the Software.
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 *     BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 *     DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *     FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **************************************************************************************************/

// Expand all closed builder sections.
( function($) {
    'use strict';

    $( document ).on( 'click', '.ttfmake-section', function( e ) {
        let $this = $( this );
        if ( e.altKey && ! e.ctrlKey ) {
            // Cycle through the row coloring classes in sequence.
            if ( $this.hasClass( 'ttfmake-section--to-be-edited' ) ) {
                $this.removeClass( 'ttfmake-section--to-be-edited' );
                $this.addClass( 'ttfmake-section--to-be-removed' );
            } else if ( $this.hasClass( 'ttfmake-section--to-be-removed' ) ) {
                $this.removeClass( 'ttfmake-section--to-be-removed' );
                $this.addClass( 'ttfmake-section--to-be-added' );
            } else if ( $this.hasClass( 'ttfmake-section--to-be-added' ) ) {
                $this.removeClass( 'ttfmake-section--to-be-added' );
            } else {
                $this.addClass( 'ttfmake-section--to-be-edited' );
            }
        } else if ( e.altKey && e.ctrlKey ) {
            // Remove all row color classes.
            $this.removeClass(
                'ttfmake-section--to-be-edited ' +
                'ttfmake-section--to-be-removed ' +
                'ttfmake-section--to-be-added'
            );
        }
    } );
} )( jQuery );
