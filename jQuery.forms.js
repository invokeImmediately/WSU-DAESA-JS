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
    });
    
    /******************************************************************************************\
    | Via CSS, highlight required inputs until a value has been properly entered               |
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
    | Via CSS, highlight required checkboxes until at least one has been checked               |
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
    | Via CSS, highlight required text are inputs until a value has been properly entered      |
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
            $('gform_body').on('change', selector + ' input', function () {
                var $thisChild = $(this);
                var $thisParent, $parentSiblings;
                $thisParent = $thisChild.parents(selector);
                $parentSiblings = $thisParent.siblings(selector);
                $thisParent.addClass('gf-activated');
                $parentSiblings
            });
        }
    }
    
})(jQuery);