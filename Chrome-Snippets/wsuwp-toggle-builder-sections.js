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
 * @version 1.0.0-rc0.1.0
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

( function( $ ) {

  /////////////
  // Snippet §1: Proceed in strict mode

  'use strict';

  /////////////
  // Snippet §2: Messaging

  const scriptName = 'Chrome Snippet wsuwp-add-page-header.js';

  function logMsg( msg ) {
    if ( typeof msg !== 'string' ) {
      throw new TypeError( 'I was called with a message argument that was not typed as a string.' );
    }
    console.log( scriptName + ': ' + msg );
  }

  /////////////
  // Snippet §3: Interfaces

  class RowToggler {

    //////////////////
    //// RowToggler §1: Constructor

    constructor( msgLogger ) {
      this.msgLogger = msgLogger;
      this.sels = {
        body: 'body.wp-admin.ttfmake-builder-active',
        row: '.ttfmake-section',
        accordionToggle: '.ttfmake-section-toggle'
      };
      this.classes = {
        open: 'ttfmake-section-open'
      };
      this.hasJQuery = this.isJQueryPresent();
      this.hasPBIntf = this.isPageBuilder();
    }

    //////////////////
    //// RowToggler §2: Page status checks

    isJQueryPresent() {
      const hasJQuery = window.jQuery;
      if ( !hasJQuery ) {
        this.msgLogger( 'I am aborting because I found that jQuery has not been loaded.' );
      }
      return hasJQuery;
    }

    isPageBuilder() {
      if ( !this.hasJQuery ) {
        return;
      }
      this.$body = $( this.sels.body );
      const passesCheck = this.$body.length === 1;
      if ( !passesCheck ) {
        this.msgLogger( 'I am aborting because the page is not a WSUWP page editor that is utilizing the Builder Template.' );
      }
      return passesCheck;
    }

    //////////////////
    //// RowToggler §3: Page modifications

    toggleRows() {
      if ( !this.hasJQuery || !this.hasPBIntf ) {
        return;
      }
      const rowsAllOpened = this.areAllRowsOpen();
      if ( !rowsAllOpened ) {
        this.expandAllRows();
      } else {
        this.collapseAllRows();
      }
    }

    areAllRowsOpen() {
      let rowsAllOpened = true;
      const inst = this;
      $( this.sels.row ).each( function() {
        if ( rowsAllOpened ) {
          let $this = $( this );
          rowsAllOpened = $this.hasClass( inst.classes.open );
        }
      } );
      return rowsAllOpened;
    }

    expandAllRows() {
      const inst = this;
      $( this.sels.row ).each( function() {
        let $this = $( this );
        if ( !$this.hasClass( inst.classes.open ) ) {
          let $toggle = $this.find( inst.sels.accordionToggle );
          $toggle.click();
        }
      } );
    }

    collapseAllRows() {
       const inst = this;
     $( this.sels.row ).each( function() {
        let $this = $( this );
        if ( $this.hasClass( inst.classes.open ) ) {
          let $toggle = $this.find( inst.sels.accordionToggle );
          $toggle.click();
        }
      } );
    }
  }

  /////////////
  // Snippet §4: Execution entry point

  const rowToggler = new RowToggler( logMsg );
  rowToggler.toggleRows();

} )( jQuery );
