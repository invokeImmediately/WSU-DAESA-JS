/*!
 * jQuery.css-data.js
 * -------------------------------------------------------------------------------------------------
 * SUMMARY: Declares the CssData class for use on OUE websites.
 *
 * DESCRIPTION: Provides 
 *
 * AUTHOR: Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 *
 * REPOSITORY: https://github.com/invokeImmediately/WSU-UE---JS
 *
 * LICENSE: ISC - Copyright (c) 2018 Daniel C. Rieck.
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
 */

var CssData = ( function ($) {

var thisFile = 'jQuery.css-data.js';

/**
 * Interface for interpreting CSS class names as information encodings.
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
					errorMsg := 'Error in CssData.getThis: I found ' + (matchResult.length - 1)
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
			errorMsg := 'Error in CssData.getThis: I was expecting to be passed a string for my dataPrefi\
x parameter; instead, I was passed something that was typeof ' + typeof dataPrefix + '.';
			throw errorMsg;
			// TODO: Write & apply OueError class.
		}

		return data;
	};

	/**
	 * Sets a new target for data extraction.
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