/**********************************************************************************************************************
 CUSTOM JQUERY-BASED DYNAMIC CONTENT
 *********************************************************************************************************************/
(function ($) {
    "use strict";
	$(document).ready(function () {
			/**********************************************************************************************
			 * As desired, tweak the CSS of the previous sibling of certain selected elements in the DOM  *
			 **********************************************************************************************/
			$('div.column > h2:not(.fancy), div.column > section > h2:not(.fancy)').each(function () {
					var $this = $(this);
                    $this.addClass('no-top-margin');
                    $this.prev('hr:not(.subSection)').addClass('narrow-bottom-margin dark-gray thicker');
			});
			$('div.column > h2.fancy, div.column > section > h2.fancy').each(function () {
					$(this).prev('hr:not(.subSection)').addClass('no-bottom-margin dark-gray thicker encroach-horizontal');
			});
			$('div.column > h3:not(.fancy), div.column > section > h3:not(.fancy)').each(function () {
					$(this).prev('hr:not(.subSection)').addClass('narrow-bottom-margin crimson');
			});
			$('div.column > h3.fancy, div.column > section > h3.fancy').each(function () {
					$(this).prev('hr:not(.subSection)').addClass('no-bottom-margin crimson encroach-horizontal', 250);
			});

			/**********************************************************************************************
			 * Set column heights on fluid-width containters                                              *
			 **********************************************************************************************/
			$('.large-format-friendly > div.column.two').each(function () {
					var $this = $(this);
                    $this.height($this.prev('div.column.one').height());
			});
            $(window).resize(function () {
                $('.large-format-friendly > div.column.two').each(function () {
					var $this = $(this);
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
            $("dd").hide();           
            
	});
})(jQuery);
