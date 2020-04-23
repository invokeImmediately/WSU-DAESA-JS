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

var thisFileName = 'jquery.are-you-sure.js';
var dirtyFormIndicator = 'dirty';

function assertAreYouSureLoaded() {
	if ( !$.fn.areYouSure ) {
		throw 'The Are-You-Sure jQuery plugin is missing; please verify that you included it as a build dependency.';
	}
}

// Code executed after the browser loads the DOM.
$( function() {
	var thisFuncName = 'DOM loaded';
	var thisFuncDesc = 'Code executed after the DOM has loaded';
	var $gForms;
	
	try {
		assertAreYouSureLoaded();
		$gForms = $( '.gform_wrapper > form' );
		$gForms.areYouSure( {
			dirtyClass: dirtyFormIndicator
		} );		
	} catch (errorMsg) {
		$.logError( thisFileName, thisFuncName, thisFuncDesc, errorMsg );
	}
} );

// Code executed after a gravity form is rendered.
$( document ).on( 'gform_post_render', function ( event, form_id, current_page ) {
	var thisFuncName = 'Gravity Forms post-render event handler';
	var thisFuncDesc = 'Code executed after a Gravity Forms form has rendered';
	var gFormSel = '#gform_' + form_id.toString();

	try {
		assertAreYouSureLoaded();
		var $gForm = $( gFormSel );
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
