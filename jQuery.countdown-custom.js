/*!
 * jQuery.countdown-custom.js 
 * --------------------------
 * DESCRIPTION: 
 *     Application of "The Final Countdown" jQuery plugin, written by Edson Hilios, to WSU OUE
 *     websites. (Please see https://github.com/hilios/jQuery.countdown for Edson's repository for
 *     "The Final Countdown.") 
 *
 * AUTHOR: Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 */
( function ( $ ) {

var thisFileName = 'jQuery.countdown-custom';
var animationTiming = 400;	// Controls the speed at which jQuery-induced countdown animations occur

// ---- DOM IS READY: Code executed after the DOM is ready for use. --------------------------------
$( function () {

	// TODO: Also implement a class based approach
	var $countdownClock = $( '#countdown-clock' );
	processCountdownTimerMsg( $countdownClock );
} );

// ---- WINDOW LOADED: Code executed after the browser window has fully loaded ---------------------
$( window ).on( 'load', function () {
	var $countdownClock = $( '#countdown-clock' );
	var $countdownParent = $countdownClock.parents( 'section' ).first();

	//TODO: Implement showing/hiding times for countdown timers.
//	var hideUntilTime = $countdownClock.data( 'hide-until' );
//	var showUntilTime = $countdownClock.data( 'show-until' );
	var hideCountdown = false;

//	if (hideUntilTime) {
//		
//	}

	if ( !hideCountdown ) {
		$countdownParent.show( animationTiming );
	}
} );

// ---- IIFE-localized definitions of FUNCTIONS USED IN THIS SCRIPT --------------------------------

/**
 *  processCountdownTimer DESCRIPTION: Invokes the "The Final Countdown" jQuery plugin on
 *      appropriate elements within the DOM.
 *  
 *  ARGUMENTS:
 *      $countdownTimer: a single jQuery object containing an element on which the plugin will be
 *                       invoked.
 */
function processCountdownTimerMsg ( $countdownTimerMsg ) {
	var fnctnName = 'processCountdownTimer';
	var fnctnDesc = 'Invokes the "The Final Countdown" jQuery plugin on appropriate elements ' +
					'within the DOM.';
	var countdownTarget;
	var pendingMsg;
	var expiredMsg;
	var parsedMsg;
	var format;

	// Check integrity of argument
	if ( $.isJQueryObj( $countdownTimerMsg ) && $countdownTimerMsg.length === 1 ) {
		
		// Invoke The Final Countdown plugin on the object after parsing the necessary data.
		countdownTarget = $countdownTimerMsg.data( 'countdown' );

		// TODO: Add appending and prepending of message strings
		pendingMsg = $countdownTimerMsg.data( 'pending-message' );
		expiredMsg = $countdownTimerMsg.data( 'expired-message' );
		if ( countdownTarget && pendingMsg && expiredMsg ) {
			$countdownTimerMsg.countdown( countdownTarget ).on( 'update.countdown', function( event ) {
				parsedMsg = pendingMsg.replace( /\[/g, '<' ).replace( /\]/g, '>' );
				format = '%H:%M:%S';
				if ( event.offset.totalDays > 0 ) {
					format = '%-D day%!D and ' + format;
				}
				format = '<strong>' + format + '</strong>' + parsedMsg;
				$( this ).html( event.strftime( format ) );
			} ).on( 'finish.countdown', function( event ) {
				parsedMsg = expiredMsg.replace( /\[/g, '<' ).replace( /\]/g, '>' );
				$( this ).html( parsedMsg );
			} );
		} else {

			// TODO: Expand error reporting to achieve optimal granularity for troubleshooting.
			$.logError( thisFileName, fnctnName, fnctnDesc,
				'Because I encountered a problem with expected data attributes, I am unable to ' +
				'proceed with invocation of The Final Countdown on the jQuery object I am ' +
				'currently working with.\n\tHere\'s information on the variables I am handling:'
			);
			console.log( $countdownTimerMsg, pendingMsg, expiredMsg );
		}
	} else if ($countdownTimerMsg.length != 0) {

		// Report appropriate problem with argument integrity
		if ( !$.isJQueryObj( $countdownTimerMsg ) ) {
			errorMsg = 
			$.logError( thisFileName, fnctnName, fnctnDesc,
				'I was passed an invalid argument for $countdownTimerMsg, which appears below:'
			);
			console.log( $countdownTimerMsg );
		} else {
			$.logError( thisFileName, fnctnName, fnctnDesc,
				'I was expecting a single jQuery object as an argument for $countdownTimerMsg. ' +
				'Instead, I was passed a jQuery object with a length of ' + $countdownTimerMsg.length
			);
		}
	}
}

} )( jQuery );
