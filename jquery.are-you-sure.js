/*!*************************************************************************************************
 * jQuery.forms.js, v2.1.0
 * -------------------------------------------------------------------------------------------------
 * PROJECT SUMMARY: Application of Are-You-Sure jQuery Plugin to WSU DAESA websites.
 *
 * AUTHOR: Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 *
 * REPOSITORY: https://github.com/invokeImmediately/WSU-UE---JS
 *
 * LICENSE: ISC - Copyright (c) 2020 Daniel C. Rieck.
 *
 *   Permission to use, copy, modify, and/or distribute this software for any purpose with or
 *   without fee is hereby granted, provided that the above copyright notice and this permission
 *   notice appear in all copies.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS" AND DANIEL RIECK DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
 *   SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL
 *   DANIEL RIECK BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY
 *   DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF
 *   CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 *   PERFORMANCE OF THIS SOFTWARE.
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
