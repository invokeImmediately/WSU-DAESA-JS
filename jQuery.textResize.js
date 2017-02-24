/**
 * jQuery.textResize.js
 * Released under GNU GPLv2
 *
 * Based on FitText.js 1.2 (https://github.com/davatron5000/FitText.js) by Dave Rupert
 *  (http://daverupert.com).
 */
(function($){
	var clmnWidth = 926; // px - default column width
	var spineWidth = 198; // px - default width of spine
	
    $.fn.textResize = function( scalingFactor, options ) {
        // Set up default options in case the caller passed no attributes
        var scalingAmount = scalingFactor || 1,
            settings = $.extend({
                "minFontSize" : Number.NEGATIVE_INFINITY,
                "maxFontSize" : Number.POSITIVE_INFINITY,
				"againstSelf" : true
            }, options);
        return this.each(function () {
            var $this = $(this);
			var $parent = undefined;
			if (!settings.againstSelf) {
				$parent = $this.parents(".column").first();
			}
          
            // Resizer() keeps font-size proportional to object width as constrainted by the user
            var resizer = function () {
				if(!settings.againstSelf) {
					$this.css("font-size", Math.max(Math.min($parent.innerWidth() / (scalingAmount*10),
						parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
				}
				else {
					$this.css("font-size", Math.max(Math.min($this.width() / (scalingAmount*10),
						parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
				}
            };
          
            // Call once to set the object's font size based on current window size, then call as resize or orientation-change events are triggered.
            resizer();
            $(window).on("resize.textresize orientationchange.textresize", resizer);
        });
    };
	
    // Now use the plugin on the WSU Undergraduate education website (i.e. delete or modify the following statement if you are going to utilize this plugin on your own site).
    $(document).ready(function () {
		initArticleHeaderText();
		initAutoFittedElems();
    });

	function initArticleHeaderText() {
		var $columns = $(".column");
        $columns.find(".article-header .header-content h1").each(function () {
            $(this).textResize(1.277142857142857, {"minFontSize" : "34.8"});
        });
        $columns.find(".article-header .header-content h2").each(function () {
            $(this).textResize(1.847840465639262, {"minFontSize" : "24.0"});
        });
        $columns.find(".article-header .header-content h3").each(function () {
            $(this).textResize(4.110097222222222, {"minFontSize" : "10.7"});
        });
	}
	
	function initAutoFittedElems() {
		var $fittedElems = $(".auto-fits-text");
		$fittedElems.each(function() {
			var $this = $(this);
			var $parent = $this.parents(".column").first();
			var $parentSection = $parent.parent(".row");
			var fontSz = $this.css("font-size");
			var maxWidth = $parent.css("max-width");
			var scalingAmt;
			if (maxWidth == "none") {
				var $binder = $("#binder");
				if ($binder.length == 1) {
					maxWidth = $binder.css("max-width");
					if (maxWidth != "none") {
						clmnWidth = parseFloat(maxWidth) - spineWidth;
						if ($.isJQueryObj($parentSection)) {
							if ($parentSection.hasClass("halves")) {
								clmnWidth /= 2;
							} else if ($parentSection.hasClass("thirds")) {
								clmnWidth /= 3;
							} else if ($parentSection.hasClass("quarters")) {
								clmnWidth /= 4;
							}
						}
					}
				}
				scalingAmt = clmnWidth / (parseFloat(fontSz) * 10);
			}
			else {
				scalingAmt = parseFloat(maxWidth) / (parseFloat(fontSz) * 10);
			}
			$this.textResize(scalingAmt, {"minFontSize" : "10.7px", "againstSelf" : 0})
		});
	}
	
// TODO: write function for fitting text.
//	$.fn.fitText = function(  )

// TODO: Come up with a line-based solution
//  Ideas: invisible absolutely positioned duplicate of element that is scaled until desired effect is
//   achieved, then settings are applied to original; etc.
/*	function FontShrinker($fromElem) {
		this.maxLines = undefined;
		this.leadingRatio = undefined;
		this.fontSizeStart = undefined;
		this.fontSizeThreshold = undefined;
		
		var validArg = isJQuery($fromElem);
		if(validArg) {
			this.maxLines = $this.data("max-lines");
			var styleProps = $this.css([
				"fontSize", "lineHeight"
			]);
			styleProps = $.extend({
				"height" : $this.height()
			}, styleProps);
			var height = parseFloat(styleProps.height);
			var fontSize = parseFloat(styleProps.fontSize);
			var lineHeight = parseFloat(styleProps.lineHeight);
			this.leadingRatio = parseFloat(styleProps.lineHeight) / parseFloat(styleProps.fontSize);
			var curLines = height / lineHeight;
			if(this.maxLines != undefined && curLines > maxLines) {
				var newFontSz = 
			} else {
				
			}
		}
	}*/

})(jQuery);
// 14.4px;
