/**************************************************************************************************\
| JQUERY-MEDIATED ENHANCED INTERACTIVITY OF GRAVITY FORM FIELDS                                    |
\**************************************************************************************************/
(function ($) {
    "use strict";
    
	$(document).ready(function () {
        hghlghtRqrdInpts('.oue-gf-rqrd-input');
        hghlghtRqrdChckbxs('.oue-gf-rqrd-checkbox');
        hghlghtRqrdTxtAreas('.oue-gf-rqrd-txtarea');
        setupActvtrChckbxs('.oue-gf-actvtr-checkbox');
        setupActvtrChain('.oue-gf-actvtr-chain');
    });
    
    /******************************************************************************************\
    | Highlight required INPUTS until a value has been properly entered                        |
    \******************************************************************************************/
    function hghlghtRqrdInpts (selector) {
        if ($.type(selector) === "string") {
            $(selector).each(function () {
                var $this = $(this);
                var $inputs = $this.find('input');
                $inputs.each(function () {
                    var $thisChild = $(this);
                    if ($thisChild.val() == "") {
                        $thisChild.removeClass('gf-value-entered');
                    }
                    else {
                        $thisChild.addClass('gf-value-entered');
                    }
                    $thisChild.blur(function () {
                        if ($thisChild.val() == "") {
                            $thisChild.removeClass('gf-value-entered');
                        }
                        else {
                            $thisChild.addClass('gf-value-entered');
                        }
                    });
                });
            });
        }
    }

    /******************************************************************************************\
    | Highlight required CHECKBOXES until at least one has been checked                        |
    \******************************************************************************************/
    function hghlghtRqrdChckbxs (selector) {
        if ($.type(selector) === "string") {
            $(selector).each(function () {
                var $this = $(this);
                var $inputs = $this.find('input');
                $inputs.each(function () {
                    var $thisChild = $(this);
                    $thisChild.change(function () {
                        var $thisParent, $parentsInputs;
                        var inputReady = false;
                        
                        $thisParent = $thisChild.parents('ul.gfield_checkbox');
                        $parentsInputs = $thisParent.find('input');
                        $parentsInputs.each(function () {
                            if ($(this).prop('checked') == true && !inputReady) {
                                inputReady = true;
                            }
                        });
                        if (inputReady) {
                            $thisParent.addClass('gf-value-entered');
                        }
                        else {
                            $thisParent.removeClass('gf-value-entered');
                        }
                    });
                });
            });
        }
    }

    /******************************************************************************************\
    | Highlight required TEXT AREA inputs until a value has been properly entered              |
    \******************************************************************************************/
    function hghlghtRqrdTxtAreas (selector) {
        if ($.type(selector) === "string") {
            $(selector).each(function () {
                var $this = $(this);
                var $inputs = $this.find('textarea');
                $inputs.each(function () {
                    var $thisChild = $(this);
                    if ($thisChild.val() == "") {
                        $thisChild.removeClass('gf-value-entered');
                    }
                    else {
                        $thisChild.addClass('gf-value-entered');
                    }
                    $thisChild.change(function () {
                        if ($thisChild.val() == "") {
                            $thisChild.removeClass('gf-value-entered');
                        }
                        else {
                            $thisChild.addClass('gf-value-entered');
                        }
                    });
                });
            });
        }
    }

    /******************************************************************************************\
    | Setup activator checkboxes that disappear once one is selected                           |
    \******************************************************************************************/
    function setupActvtrChckbxs (selector) {
        if ($.type(selector) === "string") {
            $('.gform_body').on('change', selector + ' input', function () {
                var $thisChild = $(this);
                var $thisParent = $thisChild.parents(selector);
                $thisParent.addClass('gf-activated');
            });
        }
    }
    
    /******************************************************************************************\
    | Setup a chain of activator checkboxes, wherein once a checkbox is activated/deactivated, |
    | only its closest previous sibling is hidden/shown.                                       |
    \******************************************************************************************/
    function setupActvtrChain (selector) {
        if ($.type(selector) === "string") {
            $('.gform_body').on('change', selector + ' input', function () {
                var $thisChild = $(this);
                var $thisParent = $thisChild.parents(selector);
                var $parentPrevSblngs = $thisParent.prevAll(selector);
                if($thisChild.prop('checked')) {
                    $parentPrevSblngs.first().addClass('gf-hidden');
                }
                else {
                    $parentPrevSblngs.first().removeClass('gf-hidden');
                }
            });
        }
    }
    
 })(jQuery);
