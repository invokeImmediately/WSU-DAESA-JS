/***************************************************************************************************************************
 * jQuery.oue-animate.js: custom JavaScript code to be used on all WSU Undergraduate Education websites for animating      *
 * elements.                                                                                                               *
 ***************************************************************************************************************************/
"use strict";

(function ($) {
	var thisFileName = "jQuery.oue-custom.js";
	// TODO: Write a function for setting CSS property anim-filling-mode via JS
	// TODO: Convert animation functions into objects to better organize code.
	
	/*******************************************************************************************************************
	 * WINDOW LOAD event bindings                                                                                      *
	 *******************************************************************************************************************/
    $(window).on("load", function () {
		var argsList = new Object(); // List of arguments that will be passed to functions
		var args;
		
		// Set up organized list of arguments to be passed to functions called after the window has loaded
		argsList.doFadeInFromTopAnimations = {
			slctrAnimatedElems: ".js-fade-in-from-top",
			dfltSpeed: 1000,
			fastClass: "fast",
			fastModifier: 0.5,
			delayedClass: "delayed"
		};
		
		// Call post window loading functions
		args = argsList.doFadeInFromTopAnimations
		doFadeInFromTopAnimations(
			args.slctrAnimatedElems,
			args.dfltSpeed,
			args.fastClass,
			args.fastModifier,
			args.delayedClass
		);
	});
	
	/*******************************************************************************************************************
	 * POST WINDOW LOADING FUNCTIONS                                                                                   * 
	 *******************************************************************************************************************/
	function doFadeInFromTopAnimations(slctrAnimatedElems, dfltSpeed, fastClass, fastModifier, delayedClass) {
		// TODO: What if JS isn't running? Solution: need a JS Notice.
		var thisFuncName = "doFadeInFromTopAnimations";
		var thisFuncDesc = "Upon page load, sets the expansion state of a drop down toggle element based on previous user interactions during the session.";
		var specialAction = undefined;
		var storageQueried = false;
		try {
			specialAction = sessionStorage.getItem("doFadeInFromTopAnimations");
			storageQueried = true;
		} catch(e) {
			$.logError(thisFileName, thisFuncName, thisFuncDesc, e.message);
		}
		var $objs = $(slctrAnimatedElems);
		$objs.each(function(){
			var $this = $(this);
			var speed = dfltSpeed;
			var delayTime = 0;
			if ($this.hasClass(fastClass)) {
				speed *= fastModifier;
			}
			if ($this.hasClass(delayedClass)) {
				delayTime = speed;
			}
			if (storageQueried && specialAction == "fade-in-only") {
				$this.stop().delay(delayTime).animate({
					opacity: 1
				}, speed / 2);
			} else {
				var height = $this.height();
				$this.css("top", -height);
				$this.stop().delay(delayTime).animate({
					opacity: 1,
					top: 0
				}, speed);
			}
		});
		if (storageQueried && !specialAction) {
			try {
				sessionStorage.setItem("doFadeInFromTopAnimations", "fade-in-only");
			} catch(e) {
				$.logError(thisFileName, thisFuncName, thisFuncDesc, e.message);
			}
		}
	}
})(jQuery);