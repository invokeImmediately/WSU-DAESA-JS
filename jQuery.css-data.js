/*!
 * jQuery.css-data.js
 * -------------------------------------------------------------------------------------------------
 * DESCRIPTION: 
 *     ...
 *
 * AUTHOR: Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 *
 * REPOSITORY: https://github.com/invokeImmediately/WSU-UE---JS
 */

var CssData = ( function ($) {

function CssData(marker, filter, callback) {
	////////////////////////////////////////////////////////////////////////////////////////////////
	// Private properties
	var _trigger = trigger;
	var _callback = callback;
	var _needle = needle;
	var _$matches;
	var _argsAreValid = false;

	////////////////////////////////////////////////////////////////////////////////////////////////
	// Constructor execution section
	_ValidateArgs();
	_FindPossibleMatches();
	_FilterPossibleMatches();

	////////////////////////////////////////////////////////////////////////////////////////////////
	// Private methods
	function _FilterPossibleMatches() {
		// TODO: Write function
	}

	function _FindPossibleMatches() {
		// TODO: Write function
	}

	function _ValidateArgs() {
		// TODO: Write function
	}

}

} )( jQuery );