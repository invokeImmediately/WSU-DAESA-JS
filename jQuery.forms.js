/**
 * jQuery.forms.js
 * -------------------------------------------------------------------------------------------------
 * SUMMARY: Enhancements, intended for OUE websites, mediated by jQuery to dynamic behavior of
 * Gravity Forms.
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


////////////////////////////////////////////////////////////////////////////////////////////////////
// TABLE OF CONTENTS
// -----------------
// §1: OUE-Wide Gravity Forms Enhancements......................................................55
//     §1.1: Document ready bindings............................................................61
//     §1.2: Binding of Handlers to Window Load.................................................86
//     §1.3: Window Load Event Bindings.........................................................98
//     §1.4: Function declarations.............................................................105
// §2: Optional Gravity Forms Enhancements.....................................................419
//     §2.1: GfCheckboxValidators class........................................................423
//         §2.1.1: Private properties..........................................................438
//         §2.1.2: Public properties...........................................................443
//         §2.1.3: Privileged methods..........................................................448
//         §2.1.4: Constructor's main execution section........................................464
//         §2.1.5: Public methods..............................................................470
//     §2.2: OueGFs class......................................................................598
//         §2.2.1: Private properties..........................................................614
//         §2.2.2: Private methods.............................................................624
//         §2.2.3: Protected methods...........................................................639
//         §2.2.4: Constructor's main execution section........................................655
//     §2.3: WsuIdInputs class.................................................................668
//         §2.3.1: Private properties..........................................................686
//         §2.3.2: Private methods.............................................................710
//         §2.3.3: Protected methods...........................................................765
//         §2.3.4: Constructor's main execution section........................................779
////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////
// §1: OUE-Wide Gravity Forms Enhancements

( function ( $ ) {
	"use strict";

	////////////////////////////////////////////////////////////////////////////////////////////////
	// §1.1: Document ready bindings

	$( function () {
		var $requiredFields;
		var oueGfs;

		oueGfs = new OueGFs();
		oueGfs.init();
		if ( $( '.gform_body' ).length > 0 ) {
			setupActvtrChckbxs( '.oue-gf-actvtr-checkbox' );
			setupActvtrChain( '.oue-gf-actvtr-chain' );
			setupUploadChain( '.oue-gf-upload-chain' );
			
			// TODO: streamline functions by querying all ul.gform_fields li.gfield, then determine
			//   how to handle object by finding div children with gfield_container_class. Best to
			//   implement as a class.
			$requiredFields =  $( 'li.gfield_contains_required' );
			hghlghtRqrdInpts( $requiredFields.find( 'input' ) );
			hghlghtRqrdChckbxs( $requiredFields.find( 'ul.gfield_checkbox, ul.gfield_radio' ) );
			hghlghtRqrdTxtAreas( $requiredFields.find( 'textarea' ) );
			hghlghtRqrdSelects( $requiredFields.find( 'select' ) );
		}
	} );

	////////////////////////////////////////////////////////////////////////////////////////////////
	// §1.2: Binding of Handlers to Window Load

	$( document ).on( 'gform_post_render', function () {
		var $requiredFields =  $( 'li.gfield_contains_required' );

		checkRqrdInpts( $requiredFields.find( 'input' ) );
		checkRqrdChckbxs( $requiredFields.find( 'ul.gfield_checkbox, ul.gfield_radio' ) );
		checkRqrdTxtAreas( $requiredFields.find( 'textarea' ) );
	} );


	////////////////////////////////////////////////////////////////////////////////////////////////
	// §1.3: Window Load Event Bindings

	$( window ).load( function () {
		hghlghtRqrdRchTxtEdtrs( $( '.gfield_contains_required.uses-rich-editor' ) );
	} );

	////////////////////////////////////////////////////////////////////////////////////////////////
	// §1.4: Function declarations

	/**
	 * Check each input element within a required gravity form field to determine if an entry has
	 * already made by the user and highlight the input if not.
	 *
	 * @param {jQuery} $inputs - The set of input elements contained in required gravity form
	 *     fields.
	 */
	function checkRqrdInpts ( $inputs ) {
		if ( $.isJQueryObj( $inputs ) ) {
			$inputs.each( function () {
				var $thisInput = $( this );
				if ( $thisInput.val() == '' ) {
					$thisInput.removeClass( 'gf-value-entered' );
				} else {
					$thisInput.addClass( 'gf-value-entered' );
				}
			} );
		}
	}
	
	/**
	 * Highlight input elements within required gravity form fields until a value has been properly
	 * entered by the user.
	 *
	 * @param {jQuery} $inputs - The set of input elements contained in required gravity form
	 *     fields.
	 */
	function hghlghtRqrdInpts ( $inputs ) {
		if ( $.isJQueryObj( $inputs ) ) {
			$inputs.each( function () {
				var $thisInput = $( this );
				$thisInput.blur( function () {
					if ( $thisInput.val() == '' ) {
						$thisInput.removeClass( 'gf-value-entered' );
					} else {
						$thisInput.addClass( 'gf-value-entered' );
					}
				} );
			} );
		}
	}

	/**
	 * Check each checkbox list within required gravity form checkbox fields to determine if at
	 * least one checkbox has already been checked by the user and highlight the list if not.
	 *
	 * @param {jQuery} $lists - The set of list elements wrapping checkbox inputs and contained in
	 *     required gravity form fields.
	 */
	function checkRqrdChckbxs ( $lists ) {
		if ( $.isJQueryObj( $lists ) ) {
			$lists.each(function () {
				var $this = $( this );
				var $inputs = $this.find( 'input' );
				var inputReady = false;
				$inputs.each( function () {
					if ( $( this ).prop( 'checked' ) == true && !inputReady ) {
						inputReady = true;
					}
				} );
				if ( inputReady ) {
					$this.addClass( 'gf-value-entered' );
				} else {
					$this.removeClass( 'gf-value-entered' );
				}
			} );
		}
	}

	/**
	 * Highlight required gravity form fields containing checkbox elements until at least one box is
	 * checked by the user.
	 *
	 * @param {jQuery} $lists - The set of list elements wrapping checkbox inputs and contained in
	 *     required gravity form fields.
	 */
	function hghlghtRqrdChckbxs ( $lists ) {
		if ( $.isJQueryObj( $lists ) ) {
			$lists.each( function () {
				var $inputs;
				var $this;

				$this = $( this );
				$inputs = $this.find( 'input' );
				$inputs.each( function () {
					var $thisChild = $( this );
					$thisChild.change( function () {
						var $parentsInputs;
						var $thisParent;
						var inputReady = false;

						$thisParent = $thisChild.parents( 'ul.gfield_checkbox, ul.gfield_radio' );
						$parentsInputs = $thisParent.find( 'input' );
						$parentsInputs.each(function () {
							if ( $( this ).prop( 'checked' ) == true && !inputReady ) {
								inputReady = true;
							}
						} );
						if ( inputReady ) {
							$thisParent.addClass( 'gf-value-entered' );
						} else {
							$thisParent.removeClass( 'gf-value-entered' );
						}
					} );
				} );
			} );
		}
	}

	/**
	 * Check each text area element within a required gravity form field to determine if an entry
	 * has already made by the user and highlight the element if not.
	 *
	 * @param {jQuery} $textAreas - The set of text area elements contained in required gravity form
	 *     fields.
	 */
	function checkRqrdTxtAreas ( $textAreas ) {
		checkRqrdInpts( $textAreas );
	}

	/**
	 * Highlight text area elements within required gravity form fields until a value has been
	 * entered by the user.
	 *
	 * @param {jQuery} $textAreas - The set of text arewa elements contained in required gravity
	 *     form fields.
	 */
	function hghlghtRqrdTxtAreas ( $textAreas ) {
		hghlghtRqrdInpts( $textAreas );
	}

	/**
	 * Highlight rich text editors within required gravity form fields until a value has been
	 * entered by the user.
	 *
	 * @param {jQuery} $fields - The set of rich text editor fields that are also required gravity
	 *     form fields.
	 */
	function hghlghtRqrdRchTxtEdtrs( $fields ) {
		if ( $.isJQueryObj( $fields ) && $fields.length > 0 ) {
			$fields.each( function () {
				var $editorForm = $( this ).find( 'iframe' );
				$editorForm.each( function () {
					var $editorBody = $( this ).contents().find( '#tinymce' );
					$editorBody.css( {
						 backgroundColor: 'rgba(255,0,0,0.1)',
						 fontFamily: '"Open sans", sans-serif'
					} );
					$editorBody.focus( function () {
						$( this ).css( 'background-color', 'rgba(255,255,255,1)' );
					} );
					$editorBody.blur( function () {
						var $this = $( this );
						if ( $this.text().replace( /\n|\uFEFF/g, '' ) == '' ) {
							$this.css( 'background-color', 'rgba(255,0,0,0.1)' );
						}
					} );
				} );
			} );
		}
	}

	/**
	 * Highlight select elements within required gravity form fields until a value has been selected
	 * by the user.
	 *
	 * @param {jQuery} $selects - The set of text arewa elements contained in required gravity
	 *     form fields.
	 */
	function hghlghtRqrdSelects ( $selects ) {
		if ( $.isJQueryObj( $selects ) ) {
			$selects.each( function () {
				var $thisInput = $( this );
				var $childSlctdOptn = $thisInput.find( 'option:selected' );
				var optionVal = $childSlctdOptn.text();
				if ( optionVal != '' ) {
					$thisInput.addClass( 'gf-value-entered' );
				} else {
					$thisInput.removeClass( 'gf-value-entered' );
				}
				$thisInput.change( function () {
					$childSlctdOptn = $thisInput.find( 'option:selected' );
					optionVal = $childSlctdOptn.text();
					if ( optionVal != '' ) {
						$thisInput.addClass( 'gf-value-entered' );
					} else {
						$thisInput.removeClass( 'gf-value-entered' );
					}
				} );
			} );
		}
	}

	/**
	 * Set up activator checkboxes that disappear once one is selected.
	 *
	 * @param {string} selector - String for selecting from the DOM gravity form fields designated
	 *     as activator checkboxes.
	 */
	function setupActvtrChckbxs ( selector ) {
		if ( $.type( selector ) === 'string' ) {
			$( '.gform_body' ).on( 'change', selector + ' input', function () {
				var $thisChild = $( this );
				var $thisParent = $thisChild.parents( selector );
				$thisParent.addClass( 'gf-activated' );
			} );
		}
	}

	/**
	 * Setup a chain of activator checkboxes, wherein once a checkbox is activated/deactivated, only
	 * its closest previous sibling is hidden/shown.
	 *
	 * @param {string} selector - String for selecting gravity form fields from the DOM that are
	 *     designated as chained activator checkboxes.
	 */
	function setupActvtrChain ( selector ) {
		if ( $.type( selector ) === 'string' ) {
			$( '.gform_body' ).on( 'change', selector + ' input', function () {
				var $thisChild = $( this );
				var $thisParent = $thisChild.parents( selector );
				var $parentPrevSblngs = $thisParent.prevAll( selector );
				if ( $thisChild.prop( 'checked' ) ) {
					$parentPrevSblngs.first().addClass( 'gf-hidden' );
				} else {
					$parentPrevSblngs.first().removeClass( 'gf-hidden' );
				}
			} );
		}
	}

	/**
	 * Setup a chain of file uploading inputs, wherein only the left-most input in the tree is
	 * visible. As the user uploads files in sequence, the next nearest neighbor is unveiled.
	 *
	 * @param {string} selector - String for selecting gravity form fields from the DOM that are
	 *     designated as part of an upload chain.
	 */
	function setupUploadChain ( selector ) {
		if ( $.type( selector ) === 'string' ) {

			// TODO: CHECK IF UPLOADS ALREADY EXIST:
			//  It is possible to arrive at this point in execution after the user has submitted a
			//  form containing errors that also already contains transcripts uploaded to input
			//  fields that will be hidden by default. The following blocks of code resolve this
			//  situation by showing such fields, as well as their nearest neighbors.
			var $inputs = $( selector + " input[type='file']" );
			$inputs.each( function () {
				var $thisInput = $( this );
				var $nextDiv = $thisInput.nextAll( 'div[id]' ).first();
				if ( $nextDiv.length > 0 ) {
					$thisInput.addClass( 'gf-value-entered' );
					var $parentOfInput = $thisInput.parents( selector ).first();
					$parentOfInput.removeClass( 'gf-hidden' );
					var $parentNextSblngs = $parentOfInput.nextAll( selector ).first();
					$parentNextSblngs.removeClass( 'gf-hidden' );
				}
			} );

			// TODO: Break up this long, complicated execution sequence  into additional functions.
			$( '.gform_body' ).on( 'change', selector + " input[type='file']", function () {
				var $thisInput = $( this );
				if ( $thisInput.prop( 'files' ) != null && $thisInput.prop( 'files' ).length > 0 ) {
					var valuePassed = true;
					var $parentOfInput = $thisInput.parents( selector ).first();
					var $parentNextSblngs = $parentOfInput.nextAll( selector );
					var $parentPrevSblngs = $parentOfInput.prevAll( selector );
					if ( $parentNextSblngs.length != 0 || $parentPrevSblngs.length != 0 ) {
						var originalFileName = $thisInput.prop( 'files' ).item( 0 ).name;
						$parentPrevSblngs.each( function () {
							if ( valuePassed ) {
								var $thisSblng = $( this );
								var $thisSblngInput =
									$thisSblng.find( "input[type='file']" ).first();
								if ( $thisSblngInput.prop( 'files' ) != null &&
										$thisSblngInput.prop( 'files' ).length > 0 ) {
									var thisFileName = $thisSblngInput.prop( 'files' ).item( 0 ).name;
									valuePassed = originalFileName != thisFileName;
								}
							}
						} );
						$parentNextSblngs.each( function () {
							if ( valuePassed ) {
								var $thisSblng = $( this );
								var $thisSblngInput = $thisSblng.find( "input[type='file']" ).first();
								if ( $thisSblngInput.prop( 'files' ) != null &&
										$thisSblngInput.prop( 'files' ).length > 0) {
									var thisFileName = $thisSblngInput.prop( 'files' ).item(0).name;
									valuePassed = originalFileName != thisFileName;
								}
							}
						});
					}
					if ( valuePassed ) {
						$thisInput.addClass( 'gf-value-entered' );
						$parentNextSblngs.first().removeClass( 'gf-hidden' );
					} else {
						alert('A file with the same name has already been uploaded; please choose a\
 different file.');
						$thisInput.get(0).value = '';
					}
				} else {
					$thisChild.removeClass( 'gf-value-entered' );
				}
			} );
		}
	}
	
 } )( jQuery );


////////////////////////////////////////////////////////////////////////////////////////////////////
// §2: Optional Gravity Forms Enhancements


////////////////////////////////////////////////////////////////////////////////////////////////
// §2.1: GfCheckboxValidators

/**
 * Gravity Form Checkbox Validators interface.
 *
 * An interface for linking the state of a gravity forms checkbox field to a subsequent (and ideally
 * hidden) validator field. Currently, all of the checkboxes must be selected for the field to be
 * validated.
 *
 * @class
 */
var GfCheckboxValidators = ( function( $ ) {
	function GfCheckboxValidators( sels ) {

		////////////////////////////////////////////////////////////////////////////////////////////
		// §2.1.1: Private properties

		var _$form;

		////////////////////////////////////////////////////////////////////////////////////////////
		// §2.1.2: Public properties

		this.sels = sels;

		////////////////////////////////////////////////////////////////////////////////////////////
		// §2.1.3: Privileged methods

		this.get$form = function () {
			return _$form;
		}

		this.findForm = function () {
			if ( this.IsObjValid() ) {
				_$form = $ ( this.sels.formContainer )
			} else {
				console.log( "Object wasn't valid." );
				_$form = $( [] );
			}
		}

		////////////////////////////////////////////////////////////////////////////////////////////
		// §2.1.4: Constructor's main execution section

		this.findForm();
	}

	////////////////////////////////////////////////////////////////////////////////////////////
	// §2.1.5: Public methods

	/**
	 * Finish the process of hiding validator fields from the user.
	 *
	 * Removes tab indexing from the field so that JavaScript can safely automate population of the
	 * validator field with input based on the state of the preceding checkbox field.
	 *
	 * @access public
	 *
	 * @memberof GfCheckboxValidators
	 */
	GfCheckboxValidators.prototype.finishHidingValidators = function () {
		var $form;
		var $field;
		var $validator;
		var $validator_input;

		$form = this.get$form();
		if ( this.IsObjValid() && $form.length) {
			// Isolate validator and its target field in the DOM.
			$field = $form.find( this.sels.validatedField );
			$validator = $field.next( this.sels.validator );

			// Disable tab indexing to form validators.
			if ( $field.length && $validator.length ) {
				$validator_input = $validator.find( "input" );
				$validator_input.attr( 'tabindex', '-1' );
			}
		}
	};

	/**
	 * Initialize validation of validated checkbox fields by their subsequent validator fields.
	 *
	 * The validator's input element will be set to "validated" if all checkboxes are checked,
	 * otherwise it will be set to an empty string.
	 *
	 * @access public
	 *
	 * @memberof GfCheckboxValidators
	 *
	 * @throws {Error} Member function IsObjValid will automatically be called and must return true.
	 * @throws {Error} The specified validated and validator fields must be found within the form,
	 *     and each validated field must be followed by a validator field as a sibling.
	 * @throws {Error} Validated fields must contain checkbox input elements, and validator fields
	 *     must contain a single input element.
	 */
	GfCheckboxValidators.prototype.initValidation = function() {
		var $form;
		var sels = this.sels;
		var stillValid;

		stillValid = this.IsObjValid();
		if ( !stillValid ) {
			throw Error( "Object properties did not pass validity check." );
		} else {
			// Find the form appropriate fields within the form.
			$form = this.get$form();
			$form.on('change', sels.validatedField + " :checkbox", function () {
				var $checkBoxes;
				var $parentField;
				var $this;
				var $validator_input;
				var allChecked = true;
				var stillValid = true;

				$this = $( this );
				$parentField = $this.parents( sels.validatedField );
				$checkBoxes = $parentField.find( " :checkbox" );
				$validator_input = $parentField.next( sels.validator ).find( "input" );
				stillValid = $validator_input.length === 1;
				try {
					if ( !stillValid ) {
						throw Error( "Found a validated field in the DOM that was not followed by a\
 matching, properly formed validator sibling; checkbox state cannot be properly validated." );
					} else {
						// Check the state of all the checkbox inputs within the validated field.
						$checkBoxes.each( function () {
							if ( allChecked && !this.checked) {
								allChecked = false;
							}
						} );

						// Appropriately set the state of the validator's input element.
						if ( allChecked && $validator_input.val() != "validated" ) {
							$validator_input.val( "validated" );
						} else if ( $validator_input.val() != "" ) {
							$validator_input.val( "" );
						}
					}
				} catch ( err ) {
					console.log(err.name + ": " + err.message);
				}
			} );
		}
	}

	/**
	 * Check the validity of the instance based on the types and values of its members.
	 *
	 * @return {boolean} Returns true if members are properly typed and their values conform to
	 *     expectations. Returns false otherwise.
	 */
	GfCheckboxValidators.prototype.IsObjValid = function() {
		var stillValid = true;
		var selsProps;

		if ( !( typeof this.sels === 'object' ) ) {
			stillValid = false
		} else if ( stillValid ) {
			selsProps = Object.getOwnPropertyNames( this.sels );
		}
		if ( stillValid && !( selsProps.length === 3 &&
				selsProps.find( function( elem ) { return elem === 'formContainer'; } ) &&
				selsProps.find( function( elem ) { return elem === 'validatedField'; } ) &&
				selsProps.find( function( elem ) { return elem === 'validator'; } ) ) ) {
			stillValid = false;
		}
		// TODO: Check for properly formed selector strings.

		return stillValid;
	};

	return GfCheckboxValidators;
} )( jQuery );

////////////////////////////////////////////////////////////////////////////////////////////
// §2.2: OueGFs

/**
 * Interface for adding enhancements to Gravity Forms found on OUE websites.
 *
 * @class
 */

var OueGFs = ( function( $ ) {

	/**
	 * Constructor for OueGFs.
	 */
	function OueGFs() {

		////////////////////////////////////////////////////////////////////////////////////////////
		// §2.2.1: Public properties

		/**
		 * Collection of selectors used to find form elements in the DOM.
		 *
		 * @public
		 */
		this.selectors = {
			gforms: '.gform_wrapper',
			wsuIds: '.gf-is-wsu-id'
		};

		/**
		 * Interface to form inputs that accept WSU ID numbers.
		 *
		 * @public
		 */
		this.wsuIds = null;
	}

	////////////////////////////////////////////////////////////////////////////////////////////
	// §2.2.3: Public methods

	/**
	 * Initialize Gravity Forms found on the page.
	 *
	 * Meant to be called after the DOM has loaded.
	 *
	 * @public
	 */
	OueGFs.prototype.init = function () {
		if ( $( this.selectors.gforms ).length ) {
			initWsuIdInputs(this);
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////
	// §2.2.4: Lexically scoped supporting functions

	/**
	 * Initialize inputs accepting WSU ID numbers.
	 *
	 * @param {OueGFs} obj - An OueGFs instance that needs to be initialized.
	 */
	function initWsuIdInputs( obj ) {
		obj.wsuIds = new WsuIdInputs( obj.selectors.wsuIds );
		obj.wsuIds.init();
	}

	return OueGFs;

} )( jQuery );

////////////////////////////////////////////////////////////////////////////////////////////////
// §2.3: WsuIdInputs

/**
 * Provides RegEx mediated validation of gravity form inputs that accept WSU ID numbers.
 *
 * @class
 */
var WsuIdInputs = ( function ( $ ) {

	/**
	 * Constructor for WsuIdInputs class.
	 *
	 * @param {string} selGField - Selects the Gravity Form field containing the input in which the
	 *     WSU ID number will be entered.
	 */
	function WsuIdInputs( selGfield ) {

		////////////////////////////////////////////////////////////////////////////////////////////
		// §2.3.1: Private properties

		/**
		 * The collection of selectors used to find inputs accepting WSU ID numbers in the DOM.
		 *
		 * @private
		 */
		var _sels;

		/**
		 * Key codes for acceptable keystrokes when a WSU ID input has focus.
		 *
		 * @private
		 */
		var _keyCodes;

		/**
		 * Regular expression pattern representing valid complete or incomple WSU ID input.
		 *
		 * @private
		 */
		var _reFinalPattern;

		////////////////////////////////////////////////////////////////////////////////////////////
		// §2.3.2: Private methods

		/**
		 * Handler for blur events triggered in inputs accepting WSU ID numbers.
		 *
		 * @private
		 *
		 * @param {Event} e - Contains information about the blur event.
		 */

		function _onBlur( e ) {
			var $this = $( this );
			var inputText = $this.val();

			if ( inputText != '' ) {
				if ( _reFinalPattern.exec( inputText ) == null ) {
					$this.val( '' );
					alert( 'The WSU ID you entered did not follow the correct pattern; please try a\
gain. When the leading zero is included, WSU ID numbers are 9 digits long. You can also drop the le\
ading zero and enter in 8 digits.' );
				}
			}
		}

		/**
		 * Handler for keydown events triggered in inputs accepting WSU ID numbers.
		 *
		 * @private
		 *
		 * @param {Event} e - Contains information about the keydown event.
		 */
		function _onKeydown( e ) {
			var $this = $( this );
			var inputText = $this.val();

			if ( ( e.keyCode < 48 || ( e.keyCode > 57 && e.keyCode < 96 ) || e.keyCode > 105 )
					&& !~_keyCodes.indexOf( e.keyCode ) && !( e.keyCode == 86 && e.ctrlKey ) ) {
				e.preventDefault();
			} else if ( !~_keyCodes.indexOf( e.keyCode ) && inputText.length >= 9 ) {
				e.preventDefault();
				alert( 'Note: WSU ID numbers are no greater than nine (9) digits in length.' );
			}
		}

		/**
		 * Handler for paste events triggered in inputs accepting WSU ID numbers.
		 *
		 * @private
		 *
		 * @param {Event} e - Contains information about the paste event.
		 */
		function _onPaste( e ) {
			var $this = $( this );
			var clipboardData = e.originalEvent.clipboardData || window.clipboardData;
			var inputText = clipboardData.getData( 'Text' );
			var regExMask = /[^0-9]+/g;

			if ( regExMask.exec( inputText ) != null ) {
				var errorMsg = 'Note: WSU ID numbers can only contain digits.';
				e.stopPropagation();
				e.preventDefault();
				$this.val( inputText.replace( regExMask, '' ) );
				inputText = $this.val();
				if ( inputText.length > 9 ) {
					$this.val( inputText.slice( 0, 9 ) );
					errorMsg += ' Also, they must be no greater than nine (9) digits in length.';
				}
				errorMsg += ' What you pasted will automatically be corrected; please check the res\
ult to see if further corrections are needed.';
				alert( errorMsg );
			} else if ( inputText.length > 9 ) {
				e.stopPropagation();
				e.preventDefault();
				$this.val( inputText.slice( 0,9 ) );
				alert( 'WSU ID numbers are no greater than nine (9) digits in length. What you past\
ed will automatically be corrected. Please check the result to see if further corrections are neede\
d.' );
			}
		}

		////////////////////////////////////////////////////////////////////////////////////////////
		// §2.3.3: Protected methods

		/**
		 * Initializes RegEx mediated validation of inputs accepting WSU ID numbers.
		 *
		 * @protected
		 */
		this.init = function () {
			var $forms = $( _sels.gform );
			var inputSel = _sels.gfield + ' ' + _sels.inputs;

			$forms.on( 'blur', inputSel, _onBlur );
			$forms.on( 'keydown', inputSel, _onKeydown );
			$forms.on( 'paste', inputSel, _onPaste );
		}

		////////////////////////////////////////////////////////////////////////////////////////////
		// §2.3.4: Constructor's main execution section

		_sels = {};
		_sels.gform = '.gform_wrapper';
		_sels.gfield = selGfield;
		_sels.inputs = "input[type='text']";
		_keyCodes = [ 8, 9, 20, 35, 36, 37, 39, 46, 110, 144 ];
		_reFinalPattern = /(?:^[0-9]{8}$)|(?:^0[0-9]{8}$)/;
	}

	return WsuIdInputs;

} )( jQuery );
