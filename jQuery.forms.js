////////////////////////////////////////////////////////////////////////////////////////////////////
// §1: OUE-Wide Gravity Forms Enhancements

/************************************************************************************************************\
| JQUERY-MEDIATED ENHANCED INTERACTIVITY OF GRAVITY FORM FIELDS                                              |
\************************************************************************************************************/
(function ($) {
	"use strict";

	$(document).bind("gform_post_render", function () {
		var $rqrdFlds =  $("li.gfield_contains_required");
		checkRqrdInpts($rqrdFlds.find("input"));
		checkRqrdChckbxs($rqrdFlds.find("ul.gfield_checkbox, ul.gfield_radio"));
		checkRqrdTxtAreas($rqrdFlds.find("textarea"));
	});
	$(function () {
		if($("div.gform_body").length > 0) {
			initWsuIdInputs(".gf-is-wsu-id");
			setupActvtrChckbxs(".oue-gf-actvtr-checkbox");
			setupActvtrChain(".oue-gf-actvtr-chain");
			setupUploadChain(".oue-gf-upload-chain");
			
			// TODO: streamline functions by querying all ul.gform_fields li.gfield, then determine 
			//   how to handle object by finding div children with gfield_container_class. Best to
			//   implement as a class.
			var $rqrdFlds =  $("li.gfield_contains_required");
			hghlghtRqrdInpts($rqrdFlds.find("input"));
			hghlghtRqrdChckbxs($rqrdFlds.find("ul.gfield_checkbox, ul.gfield_radio"));
			hghlghtRqrdTxtAreas($rqrdFlds.find("textarea"));
			hghlghtRqrdSelects($rqrdFlds.find("select"));
		}
	});
	$(window).load(function () {
		hghlghtRqrdRchTxtEdtrs( $( '.gfield_contains_required.uses-rich-editor' ) );
	});

	/******************************************************************************************\
	| Highlight required INPUTS until a value has been properly entered                        |
	\******************************************************************************************/
	function checkRqrdInpts ($fields) {
		if ($.isJQueryObj($fields)) {
			$fields.each(function () {
				var $thisInput = $(this);
				if ($thisInput.val() == "") {
					$thisInput.removeClass("gf-value-entered");
				}
				else {
					$thisInput.addClass("gf-value-entered");
				}
			});
		}
	}
	
	function hghlghtRqrdInpts ($fields) {
		if ($.isJQueryObj($fields)) {
			$fields.each(function () {
				var $thisInput = $(this);
				$thisInput.blur(function () {
					if ($thisInput.val() == "") {
						$thisInput.removeClass("gf-value-entered");
					}
					else {
						$thisInput.addClass("gf-value-entered");
					}
				});
			});
		}
	}

	/******************************************************************************************\
	| Highlight required CHECKBOXES until at least one has been checked                        |
	\******************************************************************************************/
	function checkRqrdChckbxs ($fields) {
		if ($.isJQueryObj($fields)) {
			$fields.each(function () {
				var $this = $(this);
				var $inputs = $this.find("input");
				var inputReady = false;
				$inputs.each(function () {
					if ($(this).prop("checked") == true && !inputReady) {
						inputReady = true;
					}
				});
				if (inputReady) {
					$this.addClass("gf-value-entered");
				}
				else {
					$this.removeClass("gf-value-entered");
				}
			});
		}
	}

	function hghlghtRqrdChckbxs ($fields) {
		if ($.isJQueryObj($fields)) {
			$fields.each(function () {
				var $this = $(this);
				var $inputs = $this.find("input");
				$inputs.each(function () {
					var $thisChild = $(this);
					$thisChild.change(function () {
						var $thisParent, $parentsInputs;
						var inputReady = false;

						$thisParent = $thisChild.parents("ul.gfield_checkbox, ul.gfield_radio");
						$parentsInputs = $thisParent.find("input");
						$parentsInputs.each(function () {
							if ($(this).prop("checked") == true && !inputReady) {
								inputReady = true;
							}
						});
						if (inputReady) {
							$thisParent.addClass("gf-value-entered");
						}
						else {
							$thisParent.removeClass("gf-value-entered");
						}
					});
				});
			});
		}
	}

	/******************************************************************************************\
	| Highlight required TEXT AREA inputs until a value has been properly entered              |
	\******************************************************************************************/
	function checkRqrdTxtAreas ($fields) {
		checkRqrdInpts($fields);
	}

	function hghlghtRqrdTxtAreas ($fields) {
		hghlghtRqrdInpts($fields);
	}

	/******************************************************************************************\
	| Highlight required RICH TEXT EDITOR containters until a value has been properly entered  |
	\******************************************************************************************/
	function hghlghtRqrdRchTxtEdtrs($fields) {
		if ($.isJQueryObj($fields) && $fields.length > 0) {
			$fields.each(function () {
				var $edtrFrm = $(this).find("iframe");
				$edtrFrm.each(function () {
					var $edtrBdy = $(this).contents().find("#tinymce");
					$edtrBdy.css( {
						 backgroundColor: 'rgba(255,0,0,0.1)',
						 fontFamily: '"Open sans", sans-serif'
					} );
					$edtrBdy.focus(function () {
						$(this).css("background-color", "rgba(255,255,255,1)");
					});
					$edtrBdy.blur(function () {
						var $this = $(this);
						if($this.text().replace(/\n|\uFEFF/g, "") == "") {
							$this.css("background-color","rgba(255,0,0,0.1)");
						}
					});
				});
			});
		}
	}

	/******************************************************************************************\
	| Highlight required SELECTS until at least one has been checked                           |
	\******************************************************************************************/
	function hghlghtRqrdSelects ($fields) {
		if ($.isJQueryObj($fields)) {
			$fields.each(function () {
				var $thisInput = $(this);
				var $childSlctdOptn = $thisInput.find("option:selected");
				var optionVal = $childSlctdOptn.text();
				if (optionVal != "") {
					$thisInput.addClass("gf-value-entered");
				}
				else {
					$thisInput.removeClass("gf-value-entered");
				}
				$thisInput.change(function () {
					$childSlctdOptn = $thisInput.find("option:selected");
					optionVal = $childSlctdOptn.text();
					if (optionVal != "") {
						$thisInput.addClass("gf-value-entered");
					}
					else {
						$thisInput.removeClass("gf-value-entered");
					}
				});
			});
		}
	}

	/******************************************************************************************\
	| Initialize RegEx filtration of inputs that accept WSU ID numbers                         |
	\******************************************************************************************/
	function initWsuIdInputs(slctrInputs) {
		var $wsuIdInputs = $(slctrInputs).find("input[type='text']");
		$wsuIdInputs.keydown(function(e) {
			var $this = $(this);
			var inputText = $this.val();
			if((e.keyCode < 48 || (e.keyCode > 57 && e.keyCode < 96) || e.keyCode > 105) &&
			 !~[8, 9, 20, 35, 36, 37, 39, 46, 110, 144].indexOf(e.keyCode) &&
			 !(e.keyCode == 86 && e.ctrlKey)) {
				e.preventDefault();
			}
			else if (!~[8, 9, 20, 35, 36, 37, 39, 46, 110, 144].indexOf(e.keyCode) &&
					inputText.length >= 9) {
				e.preventDefault();
				alert("Note: WSU ID numbers are no greater than nine (9) digits in length.");
			}
		});
		$wsuIdInputs.on("paste", function (e) {
			var $this = $(this);
			var clipboardData = e.originalEvent.clipboardData || window.clipboardData;
			var inputText = clipboardData.getData('Text');
			var regExMask = /[^0-9]+/g;
			if (regExMask.exec(inputText) != null) {
				var errorMsg = "Note: WSU ID numbers can only contain digits.";
				e.stopPropagation();
				e.preventDefault();
				$this.val(inputText.replace(regExMask, ""));
				inputText = $this.val();
				if (inputText.length > 9) {
					$this.val(inputText.slice(0,9));
					errorMsg += " Also, they must be no greater than nine (9) digits in length.";
				}
				errorMsg += " What you pasted will automatically be corrected; please check the "
					+ "result to see if further corrections are needed."
				alert(errorMsg);
			}
			else if (inputText.length > 9) {
				e.stopPropagation();
				e.preventDefault();
				$this.val(inputText.slice(0,9));
				alert("WSU ID numbers are no greater than nine (9) digits in length. What you "
					+ "pasted will automatically be corrected; please check the result to see if "
					+ "further corrections are needed.");
			}
		});
		$wsuIdInputs.blur(function () {
			var $this = $(this);
			var regExFinalPttrn = /(?:^[0-9]{8}$)|(?:^0[0-9]{8}$)/;
			var inputText = $this.val();
			if (inputText != "") {
				if (regExFinalPttrn.exec(inputText) == null) {					
					$this.val("");
					alert("Please try again: when the leading zero is included, WSU ID numbers are "
						+ "nine (9) digits long. (You can also drop the leading zero and enter in "
						+ "eight (8) digits.)");
				}
			}
		});
	}

	/******************************************************************************************\
	| Setup activator checkboxes that disappear once one is selected                           |
	\******************************************************************************************/
	function setupActvtrChckbxs (selector) {
		if ($.type(selector) === "string") {
			$(".gform_body").on("change", selector + " input", function () {
				var $thisChild = $(this);
				var $thisParent = $thisChild.parents(selector);
				$thisParent.addClass("gf-activated");
			});
		}
	}

	/******************************************************************************************\
	| Setup a chain of activator checkboxes, wherein once a checkbox is activated/deactivated, |
	| only its closest previous sibling is hidden/shown.                                       |
	\******************************************************************************************/
	function setupActvtrChain (selector) {
		if ($.type(selector) === "string") {
			$(".gform_body").on("change", selector + " input", function () {
				var $thisChild = $(this);
				var $thisParent = $thisChild.parents(selector);
				var $parentPrevSblngs = $thisParent.prevAll(selector);
				if($thisChild.prop("checked")) {
					$parentPrevSblngs.first().addClass("gf-hidden");
				}
				else {
					$parentPrevSblngs.first().removeClass("gf-hidden");
				}
			});
		}
	}

	/******************************************************************************************\
	| Setup a chain of file uploading inputs, wherein only the left-most input in the tree is  |
	| visible. As the user uploads files in sequence, the next nearest neighbor is unveiled.   |
	\******************************************************************************************/
	function setupUploadChain (selector) {
		if ($.type(selector) === "string") {

			// CHECK IF UPLOADS ALREADY EXIST:
			//  It is possible to arrive at this point in execution after the user has submitted a
			//  form containing errors that also already contains transcripts uploaded to input
			//  fields that will be hidden by default. The following blocks of code resolve this
			//  situation by showing such fields, as well as their nearest neighbors.
			var $inputs = $(selector + " input[type='file']");
			$inputs.each(function () {
				var $thisInput = $(this);
				var $nextDiv = $thisInput.nextAll("div[id]").first();
				if($nextDiv.length > 0) {
					$thisInput.addClass("gf-value-entered");
					var $parentOfInput = $thisInput.parents(selector).first();
					$parentOfInput.removeClass("gf-hidden");
					var $parentNextSblngs = $parentOfInput.nextAll(selector).first();
					$parentNextSblngs.removeClass("gf-hidden");
				}
			});
			$(".gform_body").on("change", selector + " input[type='file']", function () {
				var $thisInput = $(this);
				if($thisInput.prop("files") != null && $thisInput.prop("files").length > 0) {
					var valuePassed = true;
					var $parentOfInput = $thisInput.parents(selector).first();
					var $parentNextSblngs = $parentOfInput.nextAll(selector);
					var $parentPrevSblngs = $parentOfInput.prevAll(selector);
					if($parentNextSblngs.length != 0 || $parentPrevSblngs.length != 0) {
						var originalFileName = $thisInput.prop("files").item(0).name;
						$parentPrevSblngs.each(function () {
							if(valuePassed) {
								var $thisSblng = $(this);
								var $thisSblngInput = $thisSblng.find("input[type='file']").first();
								if($thisSblngInput.prop("files") != null &&
										$thisSblngInput.prop("files").length > 0) {
									var thisFileName = $thisSblngInput.prop("files").item(0).name;
									valuePassed = originalFileName != thisFileName;
								}
							}
						});
						$parentNextSblngs.each(function () {
							if(valuePassed) {
								var $thisSblng = $(this);
								var $thisSblngInput = $thisSblng.find("input[type='file']").first();
								if($thisSblngInput.prop("files") != null &&
										$thisSblngInput.prop("files").length > 0) {
									var thisFileName = $thisSblngInput.prop("files").item(0).name;
									valuePassed = originalFileName != thisFileName;
								}
							}
						});
					}
					if(valuePassed) {
						$thisInput.addClass("gf-value-entered");
						$parentNextSblngs.first().removeClass("gf-hidden");
					}
					else
					{
						alert("A file with the same name has already been uploaded; please choose "
							+ "a different file.");
						$thisInput.get(0).value = "";
					}
				}
				else {
					$thisChild.removeClass("gf-value-entered");
				}
			});
		}
	}
	
 })(jQuery);


////////////////////////////////////////////////////////////////////////////////////////////////////
// §2: Optional Gravity Forms Enhancements

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
		// Declare/set private properties

		var _$form;

		////////////////////////////////////////////////////////////////////////////////////////////
		// Declare/set public properties

		this.sels = sels;

		////////////////////////////////////////////////////////////////////////////////////////////
		// Declare privileged methods

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
		// Perform main constructor execution
		this.findForm();
	}

	////////////////////////////////////////////////////////////////////////////////////////////////
	// Declare public methods

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
