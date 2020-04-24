/*!
 * jQuery.are-you-sure.js: Application of Are-You-Sure jQuery Plugin to WSU OUE websites. Please see
 *     https://github.com/codedance/jquery.AreYouSure/ for more details.
 * Author:  Daniel Rieck (danielcrieck@gmail.com) [https://github.com/invokeImmediately]
 * Version: 2.1.0
 *
 * Published under the MIT license.
 * https://opensource.org/licenses/MIT
 */
( function( $ ) {

// Define script's execution context
var thisFileName = 'jquery.are-you-sure.js';
var dirtyFormIndicator = 'dirty';

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

		// Analyze the interaction state of form
		var gFormSel = '#gform_' + form_id.toString();
		var $gForm = $( gFormSel );
		$gForm.areYouSure( {
			dirtyClass: dirtyFormIndicator
		} );

		// Based on the form's state, ensure invalidation is properly handled
		var pg1FilledFields = 0;
		if ( current_page == 1 ) {
			var $filledFields = $gForm.find( '.gfield_contains_required .gf-value-entered' );
			pg1FilledFields = $filledFields.length;
		}
		if ( current_page > 1 || pg1FilledFields > 0 ) {
			$gForm.addClass( dirtyFormIndicator );
		}
	} catch ( errorMsg ) {
		$.logError( thisFileName, thisFuncName, thisFuncDesc, errorMsg );
	}
} );

} )( jQuery );
