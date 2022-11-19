/*!*************************************************************************************************
 * █▀▀▄▐   ▌▐▀▀▄ █    █▀▀▄▐   ▌█▀▀▄ ▐▀▄▀▌█▀▀▀ █▀▀▄ ▀█▀ ▄▀▀▄ █    ▀█▀ █▀▀▄    
 * █  █▐ █ ▌█  ▐ █  ▄ █  █▐ █ ▌█▄▄▀ █ ▀ ▌█▀▀  █  █  █  █▄▄█ █  ▄  █  █▀▀▄ ▀▀ 
 * ▀▀▀  ▀ ▀ ▀  ▐ ▀▀▀  ▀▀▀  ▀ ▀ █    █   ▀▀▀▀▀ ▀▀▀  ▀▀▀ █  ▀ ▀▀▀  ▀▀▀ ▀▀▀     
 *
 *    ▄▀▀▄ ▄▀▀▀ ▄▀▀▀ █▀▀▀▐▀█▀▌▄▀▀▀      █ ▄▀▀▀
 *    █▄▄█ ▀▀▀█ ▀▀▀█ █▀▀   █  ▀▀▀█   ▄  █ ▀▀▀█
 *    █  ▀ ▀▀▀  ▀▀▀  ▀▀▀▀  █  ▀▀▀  ▀ ▀▄▄█ ▀▀▀
 *
 * Browser dev tools script for extracting URLs to media library assets.
 *
 * @version 0.0.0
 *
 * @author Daniel C. Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/main/jQuery.daesa-custom.js
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

( function( $ ) {
  function findMediaTiles( slctr ) {
    if ( typeof slctr !== 'string' ) {
      throw new TypeError( `I was expecting a string for the selector used to find the media tiles in the DOM but received a parameter of type ${typeof slctr}.` );
    }
    return $( slctr );
  }

  async function printUrlsForTiles( $tiles ) {
    for( let idx = 0; idx < $tiles.length; idx++ ) {
      await activateModal4Tile( $tiles.eq( idx ) );
      const $modal = $( '.media-modal .media-modal-content' );
      console.log( `URL to media file #${idx + 1} of ${$tiles.length}: ${$modal.find( '#attachment-details-two-column-copy-link' ).val()}` );
      await closeModal( $modal );
    }
  }

  async function activateModal4Tile( $tile ) {
      $tile.trigger( 'click' );
      await wait4Modal2Act( 333 );
  }

  async function wait4Modal2Act( waitTime ) {
    return new Promise( resolve => {
      setTimeout( () => { resolve() }, waitTime );
    } );
  }

  async function closeModal( $modal ) {
      $modal.find( '.media-modal-close' ).trigger( 'click' );
      await wait4Modal2Act( 333 );
  }

  async function iifeMain() {
    const $tiles = findMediaTiles( 'ul.attachments li.attachment' );
    await printUrlsForTiles( $tiles );
    console.log( `All ${$tiles.length} media files have now been processed.` );
  }

  iifeMain();
} )( jQuery );
