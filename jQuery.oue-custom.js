/**********************************************************************************************************************
 CUSTOM JQUERY-BASED DYNAMIC CONTENT
 *********************************************************************************************************************/
"use strict";

function isJQuery($obj) {
	return ($obj && ($obj instanceof jQuery || $obj.constructor.prototype.jquery));
}

(function ($) {
	"use strict";
    $(document).ready(function () {
        fixDogears("#spine-sitenav", "li.current.active.dogeared", "current active dogeared");
        checkForLrgFrmtSingle(".single.large-format-friendly", "header.main-header", "div.header-group",
         "centered");
        initHrH2Motif(".column > h2:not(.fancy), .column > section > h2:not(.fancy)",
         "hr:not(.subSection)", "no-top-margin", "narrow-bottom-margin dark-gray thicker", 250);
        initFancyHrH2Motif(".column > h2.fancy, .column > section > h2.fancy", "hr:not(.subSection)",
         "no-bottom-margin dark-gray thicker encroach-horizontal", 250);
        initHrH3Motif(".column > h3:not(.fancy), .column > section > h3:not(.fancy)", "hr:not(.subSection)",
         "narrow-bottom-margin crimson", 250);
        initFancyHrH3Motif(".column > h3.fancy, .column > section > h3.fancy", "hr:not(.subSection)",
         "no-bottom-margin crimson encroach-horizontal", 250);
        initDropDownToggles(".drop-down-toggle", ".toggled-panel", "activated", 500);
        initReadMoreToggles(".read-more-toggle-in-ctrl", '.read-more-toggle-out-ctrl',
         ".read-more-panel", 500);
        initContentFlippers(".content-flipper", ".flipped-content-front", ".flipped-content-back", 500);
        initDefinitionLists("dl.toggled", ".large-format-friendly", "div.column.one", "div.column.two",
         "activated", 400, 100);
		initQuickTabs("section.row.single.quick-tabs");
        initTriggeredByHover(".triggered-on-hover", ".content-revealed", ".content-hidden", 200);
		// initScrollingSidebars("...");
        initWelcomeMessage("#welcome-message", "post-welcome-message", 1000, 500, 500);
    });
    
    $(window).load(function () {
        finalizeLrgFrmtSideRight(".side-right.large-format-friendly", "div.column.one", "div.column.two",
         1051, 100);
    });
    
    $(window).resize(function () {
        resizeLrgFrmtSideRight(".side-right.large-format-friendly", "div.column.one", "div.column.two",
         1051, 100);
    });
    
    function checkForLrgFrmtSingle(slctrSingle, slctrMainHdr, slctrHdrGroup, centeringClass) {
        var $lrgFrmtSnglSctns = $(slctrSingle);
        if ($lrgFrmtSnglSctns.length > 0) {
            var $mainHeader = $(slctrMainHdr);
            $mainHeader.addClass(centeringClass);
            var $mnHdrChldDiv = $mainHeader.find(slctrHdrGroup);
            $mnHdrChldDiv.addClass(centeringClass);
        }
    }
    
    function finalizeLrgFrmtSideRight(slctrSideRight, slctrColOne, slctrColTwo, trggrWidth, animDuration) {
        if($(window).width() >= trggrWidth) {
            $(slctrSideRight + ">" + slctrColTwo).each(function () {
                var $this = $(this);
                var $thisPrev = $this.prev(slctrColOne);
                if($this.height() != $thisPrev.height() ) {
                    $this.height($thisPrev.height());
                }
                var crrntOpacity = $this.css("opacity");
                if (crrntOpacity == 0) {
                    $this.animate({opacity: 1.0}, animDuration);
                }
            });
        }
    }
    
    function fixDogears(slctrSiteNav, slctrDogeared, removedClasses) {
        /**********************************************************************************************
         * Fix bug wherein the wrong items in the spine become dogeared                               *
         **********************************************************************************************/
        var $dogearedItems = $(slctrSiteNav).find(slctrDogeared);
        if ($dogearedItems.length > 1) {
            var currentURL = window.location.href;
            var currentPage = currentURL.substring(currentURL.substring(0, currentURL.length - 1).lastIndexOf("/") + 1, currentURL.length - 1);
            $dogearedItems.each(function () {
                var $this = $(this);
                var $navLink = $this.children("a");
                if ($navLink.length == 1) {
                    var navLinkURL = $navLink.attr("href");
                    var navLinkPage = navLinkURL.substring(navLinkURL.substring(0, navLinkURL.length - 1).lastIndexOf("/") + 1, navLinkURL.length - 1);
                    if (navLinkPage != currentPage) {
                        $this.removeClass(removedClasses);
                    }
                }
            });
        }
    }

    function initContentFlippers(slctrCntntFlppr, slctrFlppdFront, slctrFlppdBack, animDuration) {
        $(slctrCntntFlppr).click(function () {
            var $this = $(this);
            $this.next(slctrFlppdFront).toggle(animDuration);
            $this.next(slctrFlppdFront).next(slctrFlppdBack).fadeToggle(animDuration);
        });
        $(slctrFlppdFront).click(function () {
            var $this = $(this);
            $this.toggle(animDuration);
            $this.next(slctrFlppdBack).fadeToggle(animDuration);
        });
    }
    
    function initTriggeredByHover(slctrTrggrdOnHvr, slctrCntntRvld, slctrCntntHddn, animDuration) {
        $(slctrTrggrdOnHvr).mouseenter(function () {
            var $this = $(this);
            var $rvldCntnt = $this.find(slctrCntntRvld);
            var $hddnCntnt = $this.find(slctrCntntHddn);
            $rvldCntnt.stop().show(animDuration);
            $hddnCntnt.stop().hide(animDuration);
        }).mouseleave(function () {
            var $this = $(this);
            var $rvldCntnt = $this.find(slctrCntntRvld);
            var $hddnCntnt = $this.find(slctrCntntHddn);
            $rvldCntnt.stop().hide(animDuration);
            $hddnCntnt.stop().show(animDuration);
        });
    }
    
    function initDefinitionLists(slctrDefList, slctrLrgFrmtSection, slctrColOne, slctrColTwo, activatingClass,
     animSlideDrtn, animHghtDrtn) {
        $(slctrDefList + " dt").click(function() {
            var $this = $(this);
            $this.toggleClass(activatingClass);
            $this.next("dd").slideToggle(animSlideDrtn, function () {
                var $parent = $this.parents(slctrLrgFrmtSection + ">" + slctrColOne);
                var $prntNxt = $parent.next(slctrColTwo);
                $prntNxt.animate({height: $parent.css('height')}, animHghtDrtn);
            });
        });
        $(slctrDefList + " dd").hide(); // Definitions should be hidden by default.
    }
    
    function initDropDownToggles(slctrToggle, slctrWhatsToggled, activatingClass, animDuration) {
        $(slctrToggle).click(function () {
            var $this = $(this);
            $this.toggleClass(activatingClass);
            $this.next(slctrWhatsToggled).toggle(animDuration)
        });
    }
    
    function initHrH2Motif(slctrStandardH2, slctrPrevHr, h2ClassesAdded, hrClassesAdded, animAddDrtn) {
        $(slctrStandardH2).each(function () {
                var $this = $(this);
                $this.addClass(h2ClassesAdded);
                $this.prev(slctrPrevHr).addClass(hrClassesAdded, animAddDrtn);
        });
    }
    
    function initFancyHrH2Motif(slctrFancyH2, slctrPrevHr, hrClassesAdded, animAddDrtn) {
        $(slctrFancyH2).each(function () {
                $(this).prev(slctrPrevHr).addClass(hrClassesAdded, animAddDrtn);
        });
    }
    
    function initHrH3Motif(slctrStandardH3, slctrPrevHr, hrClassesAdded, animAddDrtn) {
        $(slctrStandardH3).each(function () {
            $(this).prev(slctrPrevHr).addClass(hrClassesAdded, animAddDrtn);
        });
    }
    
    function initFancyHrH3Motif(slctrFancyH3, slctrPrevHr, hrClassesAdded, animAddDrtn) {
        $(slctrFancyH3).each(function () {
                $(this).prev(slctrPrevHr).addClass(hrClassesAdded, animAddDrtn);
        });
    }
    
	function initQuickTabs(slctrQtSctn) {
		var $qtSctn = $(slctrQtSctn);
		$qtSctn.each(function () {
			var $thisSctn = $(this);
			var $tabCntnr = $thisSctn.find("div.column > ul");
			var $tabs = $tabCntnr.find("li");
			var $panelCntnr = $thisSctn.find("table");
			var $panels = $panelCntnr.find("tbody:first-child > tr");
			if($tabs.length == $panels.length) {
				var idx;
				var jdx;
				for (idx = 0; idx < $tabs.length; idx++) {
					$tabs.eq(idx).click(function() {
						var $thisTab = $(this);
						var kdx = $tabs.index($thisTab);
						if (kdx == 0) {
							if ($thisTab.hasClass("deactivated")) {
								$thisTab.removeClass("deactivated");
								$panels.eq(kdx).removeClass("deactivated");
								for (jdx = 1; jdx < $tabs.length; jdx++) {
									if ($tabs.eq(jdx).hasClass("activated")) {
										$tabs.eq(jdx).removeClass("activated");
										$panels.eq(jdx).removeClass("activated");
									}
								}
								$("html, body").animate({
									scrollTop: $thisTab.offset().top
								}, 500);								
							}
						} else {
							if (!$thisTab.hasClass("activated")) {
								if (!$tabs.eq(0).hasClass("deactivated")) {
									$tabs.eq(0).addClass("deactivated");
									$panels.eq(0).addClass("deactivated");
								}
								for (jdx = 1; jdx < kdx; jdx++) {
									if ($tabs.eq(jdx).hasClass("activated")) {
										$tabs.eq(jdx).removeClass("activated");
										$panels.eq(jdx).removeClass("activated");
									}
								}
								$thisTab.addClass("activated");
								$panels.eq(kdx).addClass("activated");
								for (jdx = kdx + 1; jdx < $tabs.length; jdx++) {
									if ($tabs.eq(jdx).hasClass("activated")) {
										$tabs.eq(jdx).removeClass("activated");
										$panels.eq(jdx).removeClass("activated");
									}
								}
								$("html, body").animate({
									scrollTop: $thisTab.offset().top
								}, 500);								
							}
						}
					});
				}
			}
		});
	}

    function initReadMoreToggles(slctrToggleIn, slctrToggleOut, slctrPanel, animDuration) {
        $(slctrToggleIn).click(function () {
            var $this = $(this);
            var $next = $this.next(slctrPanel);
            $this.toggle(animDuration);
            $this.$next.toggle(animDuration);
            $this.$next.next(slctrToggleOut).toggle(animDuration);
        });
        $(slctrToggleOut).click(function () {
            var $this = $(this);
            var $next = $this.next(slctrPanel);
            $this.toggle(animDuration);
            $this.$next.toggle(animDuration);
            $this.$next.next(slctrToggleIn).toggle(animDuration);
        });
    }
    
    function initWelcomeMessage(slctrWlcmMsg, slctrPostWlcmMsg, msgDelay, fadeOutDuration,
     fadeInDuration) {
        $(slctrWlcmMsg).delay(msgDelay).fadeOut(fadeOutDuration, function () {
            $(slctrPostWlcmMsg).fadeIn(fadeInDuration);
        });
    }

    function resizeLrgFrmtSideRight(slctrSideRight, slctrColOne, slctrColTwo, trggrWidth, animDuration) {
        finalizeLrgFrmtSideRight(slctrSideRight, slctrColOne, slctrColTwo, trggrWidth, animDuration);
    }
})(jQuery);
