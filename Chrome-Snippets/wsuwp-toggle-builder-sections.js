/*!*************************************************************************************************
 * ▐   ▌▄▀▀▀ █  █▐   ▌█▀▀▄   ▄▀▀▀ ▐▀▀▄ ▀█▀ █▀▀▄ █▀▀▄ █▀▀▀▐▀█▀▌▄▀▀▀ ▄
 * ▐ █ ▌▀▀▀█ █  █▐ █ ▌█▄▄▀   ▀▀▀█ █  ▐  █  █▄▄▀ █▄▄▀ █▀▀   █  ▀▀▀█ ▄
 *  ▀ ▀ ▀▀▀   ▀▀  ▀ ▀ █      ▀▀▀  ▀  ▐ ▀▀▀ █    █    ▀▀▀▀  █  ▀▀▀ 
 *     ______               __      ___       _ __   __          ____        __  _             
 *    /_  __/__  ___ ____ _/ /__   / _ )__ __(_) /__/ /__ ____  / __/__ ____/ /_(_)__  ___  ___
 *     / / / _ \/ _ `/ _ `/ / -_) / _  / // / / / _  / -_) __/ _\ \/ -_) __/ __/ / _ \/ _ \(_-<
 *    /_/  \___/\_, /\_, /_/\__/ /____/\_,_/_/_/\_,_/\__/_/   /___/\__/\__/\__/_/\___/_//_/___/
 *             /___//___/                                                                      
 *
 * Toggle the expansion or collapse of Page Builder sections when working with pages in WSUWP that
 *   were created using the Builder Template of the Spine Theme.
 *
 * @version 1.0.0
 *
 * @author Daniel C. Rieck <danielcrieck@gmail.com> (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/main/Chrome-Snippets/…
 *   …wsuwp-toggle-builder-sections.js
 * @license MIT — Copyright 2021. by Washington State University
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

( function($) {
    'use strict';

    $( '.ttfmake-section' ).each( function() {
        let $this = $( this );
        if ( !$this.hasClass( 'ttfmake-section-open' ) ) {
            let $toggle = $this.find( '.ttfmake-section-toggle' );
            $toggle.click();
        }
    } );
} )( jQuery );
