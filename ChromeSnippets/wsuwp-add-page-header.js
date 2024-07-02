/*!*************************************************************************************************
 * ▐   ▌▄▀▀▀ █  █▐   ▌█▀▀▄   ▄▀▀▀ ▐▀▀▄ ▀█▀ █▀▀▄ █▀▀▄ █▀▀▀▐▀█▀▌▄▀▀▀ ▄
 * ▐ █ ▌▀▀▀█ █  █▐ █ ▌█▄▄▀   ▀▀▀█ █  ▐  █  █▄▄▀ █▄▄▀ █▀▀   █  ▀▀▀█ ▄
 *  ▀ ▀ ▀▀▀   ▀▀  ▀ ▀ █      ▀▀▀  ▀  ▐ ▀▀▀ █    █    ▀▀▀▀  █  ▀▀▀ 
 *       ___     __   __  ___                  __ __            __       
 *      / _ |___/ /__/ / / _ \___ ____ ____   / // /__ ___ ____/ /__ ____
 *     / __ / _  / _  / / ___/ _ `/ _ `/ -_) / _  / -_) _ `/ _  / -_) __/
 *    /_/ |_\_,_/\_,_/ /_/   \_,_/\_, /\__/ /_//_/\__/\_,_/\_,_/\__/_/
 *                               /___/
 *
 * When working in WSUWP to maintain pages created using the Builder Template of the Spine Theme,
 *   rapidly add a single section to the stack of sections and set it up as a page header.
 *
 * @version 1.0.0
 *
 * @author Daniel C. Rieck <danielcrieck@gmail.com> (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/main/Chrome-Snippets/…
 *   …wsuwp-add-page-header.js
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

  class PageHeaderAdder {

    ///////////////////////
    //// PageHeaderAdder §1: Constructor

    constructor( msgLogger ) {
      this.sels = {
        body: 'body.wp-admin.ttfmake-builder-active',
        pageTitle: '#title',
        newSignleBtn: '#ttfmake-menu-list-item-link-wsuwpsingle',
        singleRows: '.ttfmake-section-wsuwpsingle',
        rowClassConfig: '.wsuwp-builder-section-classes',
        rowLabel: '.wsuwp-builder-section-label',
        htmlEditBtn: 'button.switch-html',
        colTxtArea: 'textarea.wp-editor-area'
      };
      this.msgLogger = msgLogger;
      this.hasJQuery = this.isJQueryPresent();
      this.hasPBIntf = this.isPageBuilder();
    }

    ///////////////////////
    //// PageHeaderAdder §2: Page status checks

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
      return this.$body.length === 1;
    }

    ///////////////////////
    //// PageHeaderAdder §2: Page status checks

    async wait( msDelay ) {
      return new Promise( resolve => {
        setTimeout( () => { resolve(); }, msDelay );
      } );
    }

    ///////////////////////
    //// PageHeaderAdder §3: Page modifications

    async addPageHeader() {
      if ( !this.hasJQuery || !this.hasPBIntf ) {
        return;
      }
      this.$newSignleBtn = this.$body.find( this.sels.newSignleBtn );
      if ( this.$newSignleBtn.length !== 1 ) {
        return;
      }
      this.$newSignleBtn.trigger( 'click' );
      await this.wait( 1000 );
      this.$pageHdr = this.findPageHeaderRow();
      this.setUpPageHeader();
    }

    async setUpPageHeader() {
      if ( !this.hasJQuery || !this.hasPBIntf ) {
        return;
      }
      // Get the page's title value.
      this.$titleInp = this.$body.find( this.sels.pageTitle );
      this.pageTitle = this.$titleInp.val();

      // Configure the row's settings.
      this.$pageHdr.find( this.sels.rowClassConfig ).val( 'article-header' );
      this.$pageHdr.find( this.sels.rowLabel ).first()
        .val( '(PAGE HEADER: ' + this.pageTitle + ')' );

      // Ensure that text panel editing is activate.
      this.$pageHdr.find( this.sels.htmlEditBtn ).trigger( 'click' );

      // Set the contents of the text area.
      this.$pageHdr.find( this.sels.colTxtArea ).val(
        '<div class="wrapper">\n' +
        '\t<ol class="breadcrumb-list">\n' +
        '\t\t<li class="breadcrumb-list__breadcrumb"><a class="breadcrumb-list__link" href="/">Home</a></li>\n' +
        '\t</ol>\n' +
        '\t<h1>' + this.pageTitle + '</h1>\n' +
        '</div>'
      );
    }

    findPageHeaderRow() {
      if ( !this.hasJQuery || !this.hasPBIntf ) {
        return;
      }
      this.$singleRows = this.$body.find( this.sels.singleRows );
      return this.$singleRows.last();
    }
  }

  /////////////
  // Snippet §4: Execution entry point

  const headerAdder = new PageHeaderAdder( logMsg );
  headerAdder.addPageHeader();
} )( jQuery );
