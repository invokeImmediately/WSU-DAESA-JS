/*!*************************************************************************************************
 *    █ ▄▀▀▄ █  █ █▀▀▀ █▀▀▄ █  █   █▀▀▀ ▄▀▀▄ █▀▀▄ ▐▀▄▀▌▄▀▀▀      █ ▄▀▀▀
 * ▄  █ █  █ █  █ █▀▀  █▄▄▀ ▀▄▄█   █▀▀▀ █  █ █▄▄▀ █ ▀ ▌▀▀▀█   ▄  █ ▀▀▀█
 * ▀▄▄█  ▀█▄  ▀▀  ▀▀▀▀ ▀  ▀▄▄▄▄▀ ▀ ▀     ▀▀  ▀  ▀▄█   ▀▀▀▀  ▀ ▀▄▄█ ▀▀▀ 
 *
 * Application of Are-You-Sure jQuery Plugin to WSU DAESA websites.
 *
 * @version 2.1.0
 *
 * @author Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/master/jQuery.are-you-sure.js
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

( function( $ ) {

// Define script's execution context
var thisFileName = 'jquery.are-you-sure.js';
var dirtyFormIndicator = 'dirty';

function checkLoadedForm( $gForm, current_page ) {
	if ( !$.isJQueryObj( $gForm ) || $gForm.hasClass( dirtyFormIndicator ) ) {
		return;
	}
	var pg1FilledFields = 0;
	if ( current_page == 1 ) {
		var $filledFields = $gForm.find( '.gfield_contains_required .gf-value-entered' );
		pg1FilledFields = $filledFields.length;
	}
	if ( current_page > 1 || pg1FilledFields > 0 ) {
		$gForm.addClass( dirtyFormIndicator );
	}
}

// Use Gravity Forms' post-rendering event as a hook for setting up form invalidation
$( document ).on( 'gform_post_render', function ( event, form_id, current_page ) {
	var thisFuncName = 'Gravity Forms post-render event handler';
	var thisFuncDesc = 'Code executed after a Gravity Forms form has rendered';
	try {

		// Make sure thejQuery plugin required for form invalidation has been loaded.
		if ( !$.fn.areYouSure ) {
			throw 'The Are-You-Sure jQuery plugin, which I am programmed to rely on as my form' +
				' invalidation mechanism, is missing. The web development team should verify that' +
				' it was included as a JS development dependency.';
		}

		// Set up automatic form invalidation on the form
		var gFormSel = '#gform_' + form_id.toString();
		var $gForm = $( gFormSel );
		$gForm.areYouSure( {
			dirtyClass: dirtyFormIndicator
		} );

		// Based on the form's state, ensure invalidation is properly handled
		checkLoadedForm( $gForm, current_page );
		setTimeout( checkLoadedForm, 5000, $gForm, current_page );
	} catch ( errorMsg ) {
		$.logError( thisFileName, thisFuncName, thisFuncDesc, errorMsg );
	}
} );

} )( jQuery );
