/**********************************************************************************************************************
 CUSTOM JQUERY-BASED DYNAMIC CONTENT
 *********************************************************************************************************************/
(function ($) {
    "use strict";
    
	$(document).ready(function () {
			/**********************************************************************************************
			 * As desired, tweak the CSS of the previous sibling of certain selected elements in the DOM  *
			 **********************************************************************************************/
            var $lrgFrmtSnglSctns = $('.single.large-format-friendly');
            if ($lrgFrmtSnglSctns.length > 0) {
                var $mainHeader = $('header.main-header');
                $mainHeader.addClass('centered');
                var $mnHdrChldDiv = $mainHeader.find('div.header-group');
                $mnHdrChldDiv.addClass('centered');
            }
			$('.column > h2:not(.fancy), .column > section > h2:not(.fancy)').each(function () {
					var $this = $(this);
                    $this.addClass('no-top-margin');
                    $this.prev('hr:not(.subSection)').addClass('narrow-bottom-margin dark-gray thicker', 250);
			});
			$('.column > h2.fancy, .column > section > h2.fancy').each(function () {
					$(this).prev('hr:not(.subSection)').addClass('no-bottom-margin dark-gray thicker encroach-horizontal', 250);
			});
			$('.column > h3:not(.fancy), .column > section > h3:not(.fancy)').each(function () {
					$(this).prev('hr:not(.subSection)').addClass('narrow-bottom-margin crimson', 250);
			});
			$('.column > h3.fancy, .column > section > h3.fancy').each(function () {
					$(this).prev('hr:not(.subSection)').addClass('no-bottom-margin crimson encroach-horizontal', 250);
			});

            /**********************************************************************************************
             * Fix bug wherein the wrong items in the spine become dogeared                               *
             **********************************************************************************************/
            var $dogearedItems = $("#spine-sitenav").find("li.dogeared");
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
                            $this.removeClass("dogeared");
                        }
                    }
                });
            }
            
			/**********************************************************************************************
			 * Set column heights on fluid-width containters                                              *
			 **********************************************************************************************/
            // TODO: Move the code below to document.ready + replace it with a check to ensure image loading hasn't changed the heights we are working with
            $(window).load(function () {
                if($(window).width() >= 1051) {
                    $('.large-format-friendly > div.column.two').each(function () {
                            var $this = $(this);
                            $this.height($this.prev('div.column.one').height());
                            $this.animate({opacity: 1.0}, 100);
                    });
                }
            });
            $(window).resize(function () {
                $('.large-format-friendly > div.column.two').each(function () {
					var $this = $(this);
                    var crrntOpacity = $this.css("opacity");
                    if (crrntOpacity == 0 && $(window).width() >= 1051) {
                        $this.animate({opacity: 1.0}, 100);
                    }
                    var $thisPrev = $this.prev('div.column.one');
                    if($this.height() != $thisPrev.height() ) {
                        $this.height($thisPrev.height());
                    }
                });
            });
            
			/**********************************************************************************************
			 * Implement dynamic behaviors of interactive elements                                        *
			 **********************************************************************************************/
			$('.drop-down-toggle').click(function () {
                var $this = $(this);
                $this.toggleClass('activated');
                $this.next('.toggled-panel').toggle(500)
			});
			$('.read-more-toggle-in-ctrl').click(function () {
                var $this = $(this);
                $this.toggle(500);
                $this.next('.read-more-panel').toggle(500);
                $this.next('.read-more-panel').next('.read-more-toggle-out-ctrl').toggle(500);
			});
			$('.read-more-toggle-out-ctrl').click(function () {
                var $this = $(this);
                $this.toggle(500);
                $this.next('.read-more-panel').toggle(500);
                $this.next('.read-more-panel').next('.read-more-toggle-in-ctrl').toggle(500);
			});
			$('.content-flipper').click(function () {
                var $this = $(this);
                $this.next('.flipped-content-front').toggle(500);
                $this.next('.flipped-content-front').next('.flipped-content-back').fadeToggle(500);
			});
			$('.flipped-content-front').click(function () {
                var $this = $(this);
                $this.toggle(500);
                $this.next('.flipped-content-back').fadeToggle(500);
			});
            $('#welcome-message').delay(1000).fadeOut(500, function () {
                $('#post-welcome-message').fadeIn(500);
            });
            $("dl.toggled dt").click(function() {
                var $this = $(this);
                $this.toggleClass('activated');
                $this.next("dd").slideToggle(400, function () {
                    var $parent = $this.parents('.large-format-friendly > div.column.one');
                    var $prntNxt = $parent.next('div.column.two');
                    $prntNxt.animate({height: $parent.css('height')}, 100);
                });
            });
            $("dl.toggled dd").hide();           
            
	});
})(jQuery);
