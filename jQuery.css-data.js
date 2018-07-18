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

/**
 * SUMMARY: Interface for interpreting CSS class names as information encodings.
 *
 * @param {object}	$obj			A jQuery object containing a single element with data encoded in
 *									one or more of its CSS class names.
 */
function CssData($obj) {
	////////////////////////////////////////////////////////////////////////////////////////////////
	// PRIVATE PROPERTIES
	var _$obj = $obj;
	var _argsAreValid = false;
	var _classPrefix = classPrefix;
	var _classList = undefined;

	////////////////////////////////////////////////////////////////////////////////////////////////
	// CONSTRUCTOR EXECUTION SECTION
	_ValidateArgs();
	_LoadClassList();

	////////////////////////////////////////////////////////////////////////////////////////////////
	// PROTECTED METHODS

	/**
	 * SUMMARY: ...
	 *
	 * @param {string}	classPrefix		RegExp object representing the prefix string that marks a
	 * 									CSS class as an encoding of data (e.g., 'expires-on-').
	 */
	this.GetData = function (classPrefix) {
		// TODO: Write function...
	}

	////////////////////////////////////////////////////////////////////////////////////////////////
	// PRIVATE METHODS
	function _LoadClassList() {
		// TODO: Write function
		// if (_argsAreValid) {
		// 	...
		// }
	}

	function _ReportConstructorErrors() {
		var i;

		if ( !_argsAreValid ) {
			console.log('This is an error report from an instance of CssData. I encountered the fol\
lowing problems during my construction:');
			for ( i = 0; i < _errorMsgs.length; i++) {
				if ( 1 & ( _constructorErrorMask >> i ) ) {
					console.log( _errorMsgs[i] );
				}
			}
		}
	}

	function _ValidateArgs() {
		var valid$Obj;
		var elemNumIs1;
		
		// Perform validity tests of arguments passed to the constructor.
		valid$Obj = $.isJQueryObj(_$obj);
		elemNumIs1 = valid$Obj ? _$obj.length == 1 : false;

		// Set validity flag and error mask based on testing results; report any problems.
		_argsAreValid = valid$Obj && elemNumIs1 && validClassPrefix;
		_constructorErrorMask = !valid$Obj | ( ( valid$Obj && !elemNumIs1 ) << 1 );
		_errorMsgs = [
			'I was not passed a valid jQuery object.',
			'I was passed a valid jQuery object, but it contained ' + _$obj.length +  ' elements ra\
ther than 1.'
		]
		_ReportConstructorErrors();
	}
}

return CssData;

} )( jQuery );
