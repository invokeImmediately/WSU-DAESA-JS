/*!*************************************************************************************************
 *    █ ▄▀▀▄ █  █ █▀▀▀ █▀▀▄ █  █   ▄▀▀▀ ▄▀▀▀ ▄▀▀▀    █▀▀▄ ▄▀▀▄▐▀█▀▌▄▀▀▄      █ ▄▀▀▀
 * ▄  █ █  █ █  █ █▀▀  █▄▄▀ ▀▄▄█   █    ▀▀▀█ ▀▀▀█ ▀▀ █  █ █▄▄█  █  █▄▄█   ▄  █ ▀▀▀█
 * ▀▄▄█  ▀█▄  ▀▀  ▀▀▀▀ ▀  ▀▄▄▄▄▀ ▀  ▀▀▀ ▀▀▀  ▀▀▀     ▀▀▀  █  ▀  █  █  ▀ ▀ ▀▄▄█ ▀▀▀ 
 *
 * Provides an interface for interpreting CSS class names as information encodings.
 *
 * @version 1.0.0
 *
 * @author Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/master/jQuery.css-data.js
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

var CssData = ( function ($) {

var thisFile = 'jQuery.css-data.js';

/**
 * Interface for interpreting CSS class names as information encodings.
 *
 * @since 1.0.0
 *
 * @param {object} [$targetObj] - A jQuery object containing a single element representing the
 *     target within the DOM that has data encoded in one or more of its CSS class names.
 */
function CssData( $targetObj ) {
	////////////////////////////////////////////////////////////////////////////////////////////////
	// PRIVATE PROPERTIES
	var _$obj = $targetObj;
	var _classList = undefined;
	var _targetIsValid = false;
	var _targetingErrorMask;
	var _targetingErrorMsgs = [
			'I was not passed a valid jQuery object representing a target within the DOM.',
			'I was passed a valid jQuery object purportedly representing a target within the DOM, b\
ut it did not contain a single element as required.'
		];
	var _masterPrefix = 'data-';

	////////////////////////////////////////////////////////////////////////////////////////////////
	// CONSTRUCTOR EXECUTION SECTION
	_ValidateTargetingArgs();
	_LoadClassList();

	////////////////////////////////////////////////////////////////////////////////////////////////
	// PROTECTED METHODS

	/**
	 * Returns data embedded in an object's CSS class name based on an indicator prefix.
	 *
	 * @since 1.0.0
	 *
	 * @param {string} dataPrefix - String representing the prefix string that marks a CSS class as
	 *     an encoding of data (e.g., 'expires-on-').
	 *
	 * @throws {string} Parameter dataPrefix must typed as a string.
	 * @throws {string} If a valid target element within the DOM has not been supplied, errors will
	 *     be thrown via the private member function _ReportTargetingErrors.
	 * @throws {string} Of the CSS class applied to the target element in the DOM, there can be only
	 *     one class which encodes data according to the dataPrefix parameter.
	 *
	 * @return {string} Returns any data encoded within the CSS class list. If no valid data was
	 *     found, this function returns an empty string.
	 */
	this.getData = function (dataPrefix) {
		var class_i;
		var errorMsg;
		var data = '';
		var idx;
		var matchResult;
		var reObj;

		if ( _targetIsValid && typeof dataPrefix === 'string' ) {
			reObj = new RegExp( '^' + _masterPrefix + dataPrefix + '-(.*)$' );
			for ( idx = 0; !matchResult && idx < _classList.length; idx++ ) {
				class_i = _classList.item(idx);
				matchResult = reObj.exec( class_i );
			}
			if ( matchResult !== null ) {
				if (matchResult.length === 2) {
					data = matchResult[1];
				} else {
					errorMsg = 'Error in CssData.getThis: I found ' + (matchResult.length - 1)
						+ ' CSS classes that encode data associated with the prefix ' + dataPrefix
						+ '. Matching results were:';
					for ( idx = 1; idx <= matchResult.length - 1; idx++ ) {
						errorMsg += "\n" + matchResult[ idx ];
					}
					throw errorMsg;
				}
			}
		} else if ( !_targetIsValid ) {
			_ReportTargetingErrors();
		} else {
			errorMsg = 'Error in CssData.getThis: I was expecting to be passed a string for my data\
Prefix parameter; instead, I was passed something that was typeof ' + typeof dataPrefix + '.';
			throw errorMsg;
		}

		return data;
	};

	/**
	 * Sets a new target for data extraction.
	 *
	 * @since 1.0.0
	 *
	 * @param {object} $targetObj - A jQuery object containing a single element representing the
	 *     target within the DOM that has data encoded in one or more of its CSS class names.
	 */
	this.setDomTarget = function ($newObj) {
		_$obj = $newObj;
		_ValidateTargetingArgs();
		_LoadClassList();
	};

	////////////////////////////////////////////////////////////////////////////////////////////////
	// PRIVATE METHODS

	/**
	 * Get a reference to the class list for the jQuery object this instance is associated with.
	 *
	 * @since 1.0.0
	 *
	 * @access private
	 */
	function _LoadClassList() {
		if ( _targetIsValid ) {
			_classList = _$obj[0].classList;
		}
	}

	/**
	 * Provides the user with information about any errors encountered during construction of this
	 * instance.
	 *
	 * @since 1.0.0
	 *
	 * @throws {string} A single target element within the DOM was not supplied to the instance via
	 *     a valid jQuery object representing the element.
	 *
	 * @access private
	 */
	function _ReportTargetingErrors() {
		var i;
		var errorMsg;

		if ( !_targetIsValid ) {
			errorMsg = 'This is an error report from an instance of CssData. I encountered the foll\
owing problems during an attempt to extract data:';
			for ( i = 0; i < _targetingErrorMsgs.length; i++ ) {
				if ( 1 & ( _targetingErrorMask >> i ) ) {
					errorMsg += '\n' + _targetingErrorMsgs[ i ];
				}
			}
			throw errorMsg;
		}
	}

	/**
	 * Ensures the arguments passed to this instance during its construction are valid.
	 *
	 * @since 1.0.0
	 *
	 * @access private
	 */
	function _ValidateTargetingArgs() {
		var elemNumIs1;
		var valid$Obj;

		// Perform validity tests of arguments passed to the constructor.
		valid$Obj = $.isJQueryObj(_$obj);
		elemNumIs1 = valid$Obj ? _$obj.length == 1 : false;

		// Set validity flag and error mask based on testing results; report any problems.
		_targetIsValid = valid$Obj && elemNumIs1;
		_targetingErrorMask = !valid$Obj | ( ( valid$Obj && !elemNumIs1 ) << 1 );
	}
}

return CssData;

} )( jQuery );
