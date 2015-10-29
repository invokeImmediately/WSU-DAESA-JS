/**
 * jQuery.textResize.js
 * Released under GNU GPLv2
 *
 * Based on FitText.js 1.2 (https://github.com/davatron5000/FitText.js) by Dave Rupert
 *  (http://daverupert.com).
 */
(function($){
    $.fn.textResize = function( scalingFactor, options ) {
        // Set up default options in case the caller passed no attributes
        var scalingAmount = scalingFactor || 1,
            settings = $.extend({
                'minFontSize' : Number.NEGATIVE_INFINITY,
                'maxFontSize' : Number.POSITIVE_INFINITY
            }, options);
        return this.each(function () {
            var $this = $(this);
          
            // Resizer() keeps font-size proportional to object width as constrainted by the user
            var resizer = function () {
                $this.css('font-size', Math.max(Math.min($this.width() / (scalingAmount*10),
                    parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
            };
          
            // Call once to set the object's font size based on current window size, then call as
            // resize or orientation-change events are triggered.
            resizer();
            $(window).on('resize.textresize orientationchange.textresize', resizer);
        });
    };
    
    // Now use the plugin on the WSU Undergraduate education website (i.e. delete or modify the
    // following statement if you are going to utilize this plugin on your own site).
    $(document).ready(function () {
        $('section.article-header div.header-content h1').each(function () {
            $(this).textResize(1.277142857142857, {'minFontSize' : '34.8'});
        });
        $('section.article-header div.header-content h2').each(function () {
            $(this).textResize(1.847840465639262, {'minFontSize' : '24.0'});
        });
        $('section.article-header div.header-content h3').each(function () {
            $(this).textResize(4.110097222222222, {'minFontSize' : '10.7'});
        });
    });
})(jQuery);
