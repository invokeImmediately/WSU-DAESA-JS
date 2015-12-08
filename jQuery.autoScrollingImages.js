(function($){
    $(document).ready(function () {
        $('div.auto-scroller div.inner-scroll-area').each(function(){
            var $autoScroller = $(this);
            var scrollingFactor = 1;
            if($autoScroller.hasClass('scroll-in-reverse'))
                scrollingFactor = -1;
            var $asContent = $autoScroller.children('ul');
            $asContent.children().clone().appendTo($asContent);
            var curX = 0;
            $asContent.children().each(function(){
                var $this = $(this);
                $this.css('left', curX);
                curX += $this.width();
            });
            var fullScrollerWidth = curX / 2;
            var scrollerViewWidth = $autoScroller.width();
            // Set up tweening of scrolling speed between, start, paused, and restarting states
            var scrollingController = {curSpeed:0, fullSpeed:2};
            var $scrollingController = $(scrollingController);
            var tweenToNewSpeed = function(newSpeed, duration){
                if (duration === undefined)
                    duration = 333;
                $scrollingController.stop(true).animate({curSpeed:newSpeed}, duration);
            };
            // Pause scrolling upon hover
            $autoScroller.hover(function(){
                tweenToNewSpeed(0);
            }, function(){
                tweenToNewSpeed(scrollingController.fullSpeed);
            });
            // Start the automatic scrolling
            var doScroll = function (){
                var curX = $autoScroller.scrollLeft();
                var newX = curX + scrollingController.curSpeed * scrollingFactor;
                if (newX > fullScrollerWidth * 2 - scrollerViewWidth)
                    newX -= fullScrollerWidth;
                else if (newX < 0)
                    newX += fullScrollerWidth;
                $autoScroller.scrollLeft(newX);
            };
            if($autoScroller.hasClass('scroll-in-reverse'))
                $autoScroller.scrollLeft(fullScrollerWidth - scrollerViewWidth);
            setInterval(doScroll, 20);
            tweenToNewSpeed(scrollingController.fullSpeed);
        });
    });
})(jQuery);