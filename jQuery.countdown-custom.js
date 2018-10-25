/*!
 * jQuery.countdown-custom.js 
 * -------------------------------------------------------------------------------------------------
 * DESCRIPTION: Application of "The Final Countdown" jQuery plugin, written by Edson Hilios, to WSU
 *   OUE websites. (Please see https://github.com/hilios/jQuery.countdown for Edson's repository for
 *   "The Final Countdown.")
 *
 * AUTHOR: Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 *
 * REPOSITORY: https://github.com/invokeImmediately/WSU-UE---JS
 */
( function ( $ ) {

var thisFileName = 'jQuery.countdown-custom';
var animationTiming = 400;	// Controls the speed at which jQuery-induced countdown animations occur

////////////////////////////////////////////////////////////////////////////////////////////////////
// DOM-READY EXECUTION SECTION

$( function () {
	processCountdownTimerById( '#countdown-clock' );
	// $countdownClockByClass = $( '.countdown-clock' );
} );

////////////////////////////////////////////////////////////////////////////////////////////////////
// WINDOW-LOADED EXECUTION SECTION

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

////////////////////////////////////////////////////////////////////////////////////////////////////
// IIFE-LOCALIZED DEFINITIONS OF FUNCTIONS USED IN THIS SCRIPT

/**
 * Find and process a countdown timer element that has been marked with an ID attribute.
 * 
 * @param {string} selectorStr - Selector string for isolating countdown timer elements within the
 *     DOM.
 */
function processCountdownTimerById( selectorStr ) {
	var $countdownClockById;
	var argIsIdSelector;
	var errMsg;
	var thisFDesc = 'Set up countdown timers on page.';
	var thisFName = 'processCountdownTimerById';
	var validArgType;

	validArgType = typeof selectorStr === 'string';
	argIsIdSelector = validArgType ?
		( /^#/ ).exec( selectorString ) :
		false;
	try {
		if ( validArgType && argIsIdSelector ) {
			$countdownClockById = $( selectorStr );
			if ( $countdownClockById.length === 1 ) {
				processCountdownTimerMsg( $countdownClock );
			} else if ( $countdownClockById.length > 1 ) {
				throw {
					fileName: thisFileName,
					fName: thisFName,
					fDesc, thisFDesc,
					msg: 'I found ' + ($countdownClockById.length).toString() + ' instead of the re\
quired 1 ID-labeled countdown timers.'
				};
			}
		} else {
			errorMsg = '';
			if ( validArgType ) {
				errorMsg += 'I was passed a selector string argument that was typed as ' +
					( typeof selectorStr ) + ' instead of string.';
			}
			if ( argIsIdSelector ) {
				if ( validArgType ) {
					errorMsg += ' Also, '
				}
				errorMsg += 'I was passed a selector string argument that did not contain a simple \
ID-based selector.';
			}
			throw {
				fileName: thisFileName,
				fName: thisFName,
				fDesc, thisFDesc,
				msg: errMsg;
			};
		}
	} catch ( error ) {
		$.logError( error.fileName, error.fName, error.fDesc, error.msg );
	}

}

/**
 *  processCountdownTimer DESCRIPTION: Invokes the "The Final Countdown" jQuery plugin on
 *      appropriate elements within the DOM.
 *  
 *  ARGUMENTS:
 *      $countdownTimer: a single jQuery object containing an element on which the plugin will be
 *                       invoked.
 */
function processCountdownTimerMsg ( $countdownTimerMsg ) {
	var countdownTarget;
	var expiredMsg;
	var fnctnDesc = 'Invokes the "The Final Countdown" jQuery plugin on appropriate elements \
within the DOM.';
	var fnctnName = 'processCountdownTimer';
	var format;
	var parsedMsg;
	var pendingMsg;

	// Check integrity of argument
	if ( $.isJQueryObj( $countdownTimerMsg ) ) {
		// Invoke The Final Countdown plugin on the object after parsing the necessary data.
		countdownTarget = $countdownTimerMsg.data( 'countdown' );

		// TODO: Add appending and prepending of message strings
		pendingMsg = $countdownTimerMsg.data( 'pending-message' );
		expiredMsg = $countdownTimerMsg.data( 'expired-message' );
		// TODO: Refactor this function for improved performance:
		// * Parse the messages only once
		// * Add spans as children to the element and label them with identifying classes
		// * Update the html of only the countdown span each clock cycle
		if ( countdownTarget && pendingMsg && expiredMsg ) {
			$countdownTimerMsg.countdown( countdownTarget ).on( 'update.countdown', 
					function( event ) {
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
				'Because I encountered a problem with expected data attributes, I am unable to \ 
proceed with invocation of The Final Countdown on the jQuery object I am currently working with.\
\n\tHere\'s information on the variables I am handling:'
			);
			console.log( $countdownTimerMsg, pendingMsg, expiredMsg );
		}
	} else {
		$.logError( thisFileName, fnctnName, fnctnDesc,
			'I was passed an invalid argument for $countdownTimerMsg, which appears below:'
		);
		console.log( $countdownTimerMsg );
	}
}

} )( jQuery );
