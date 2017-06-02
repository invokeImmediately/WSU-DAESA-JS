/*!
 * Application of imagesLoaded & Masonry libraries to WSU OUE websites.
 */
(function ($) {
	/*******************************************************************************************************************
	 * Function calls made once the DOM IS READY                                                                       *
	 *******************************************************************************************************************/
    $(function () {
        var $masonryTrgts = $("ul.cascaded-layout");
        $masonryTrgts.each(function () {
            var $thisCascade = $(this);
            var proceedWithLayout = true;
            var sizerFound = false;
            var gutterSizerFound = false;
            var $cascadeChilren = $thisCascade.children();
            $cascadeChilren.each(function () { // Look for the correct layout
                var $thisChild = $(this);
                if(!$thisChild.hasClass("cascaded-item")) {
                    if(!$thisChild.hasClass("cascade-sizer")) {
                        if(!$thisChild.hasClass("gutter-sizer")) {
                            if(!$thisChild.hasClass("cascade-other")) {
                                return proceedWithLayout = false;
                            }
                        }
                        else
                        {
                            gutterSizerFound = true;
                        }
                    }
                    else {
                        sizerFound = true;
                    }
                }
            });
            if(proceedWithLayout && (!sizerFound || !gutterSizerFound)) proceedWithLayout = false;
            if(proceedWithLayout) {
                $thisCascade.masonry({
                    columnWidth: ".cascade-sizer",
                    gutter: ".gutter-sizer",
                    itemSelector: ".cascaded-item",
                    percentPosition: true
                });
                $thisCascade.attr("data-masonry-active","1");
                $thisCascade.imagesLoaded().progress( function() {
                    $thisCascade.masonry("layout");
                });
            }
        });
    });
	
	/*******************************************************************************************************************
	 * WINDOW LOAD event bindings                                                                                      *
	 *******************************************************************************************************************/
    $(window).on("load", function () {
        var $masonryTrgts = $("ul.cascaded-layout");
        $masonryTrgts.each(function () {
            var $thisCascade = $(this);
            var proceedWithLayout = true;
            var sizerFound = false;
            var gutterSizerFound = false;
            var $cascadeChilren = $thisCascade.children();
            $cascadeChilren.each(function () { // Look for the correct layout
                var $thisChild = $(this);
                if(!$thisChild.hasClass("cascaded-item")) {
                    if(!$thisChild.hasClass("cascade-sizer")) {
                        if(!$thisChild.hasClass("gutter-sizer")) {
                            if(!$thisChild.hasClass("cascade-other")) {
                                return proceedWithLayout = false;
                            }
                        }
                        else
                        {
                            gutterSizerFound = true;
                        }
                    }
                    else {
                        sizerFound = true;
                    }
                }
            });
            if(proceedWithLayout && (!sizerFound || !gutterSizerFound)) proceedWithLayout = false;
            if(proceedWithLayout) {
                $thisCascade.masonry("layout");
            }
        });
    });
})(jQuery);
