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

var $countdownTimerById;
var $countdownTimersByClass;
var animationTiming = 400;	// Controls the speed at which jQuery-induced countdown animations occur
var thisFileName = 'jQuery.countdown-custom';

////////////////////////////////////////////////////////////////////////////////////////////////////
// DOM-READY EXECUTION SECTION

$( function () {
	$countdownTimerById = processCountdownTimerById( '#countdown-clock' );
	// TODO: $countdownTimersByClass = processCountdownTimersByClass( … );
} );

////////////////////////////////////////////////////////////////////////////////////////////////////
// WINDOW-LOADED EXECUTION SECTION

$( window ).on( 'load', function () {
	showIdSelectedCountdownTimer( $countdownTimerById, animationTiming );
	// TODO: showClassSelectedCountdownTimers( $countdownTimersByClass );
} );

////////////////////////////////////////////////////////////////////////////////////////////////////
// CLASS DEFINITIONS

/**
 * Validated settings for OUE countdown timers designed to be functionalized via jQuery class
 * selectors.
 *
 * @param {string} timer - Class selector for isolating countdown timer elements.
 * @param {string} container - Class selector for obtaining the container component of a countdown
 *     timer.
 * @param {string} message -  Class selector targeting the message component of a countdown timer.
 * @param {string} prependedHtml - Class selector for isolating the component of a countdown timer
 *     that contains HTML to be prepended to the inner HTML of the message.
 * @param {string} appendedHtml - Class selector for isolating the component of a countdown timer
 *     that contains HTML to be appended to the inner HTML of the message.
 *
 * @throws {object} If the type of any argument is invalid and/or an argument is not a properly
 *     formatted class selector, an object will be thrown containing four string-typed parameters:
 *     fileName, fName, fDesc, and errorMsg. The thrown object is thus meant to be utilized with the
 *     jQuery.logError function.
 */
function CountdownTimerSelectors( timer, container, message, prependedHtml, appendedHtml ) {
	////////////////////////////////////////////////////////////////////////////////////////////
	// PRIVATE PROPERTIES

	var argTypeMask = 0;
	var validSelectorNeedle = /\.[a-zA-Z0-9\-_]+$/;
	var validSelectorMask = 0;
	var error = {
		fileName: thisFileName,
		fName: 'CountdownTimerSelectors',
		fDesc: 'Validated settings for class-based OUE countdown timers.',
		errorMsg: ''
	};

	////////////////////////////////////////////////////////////////////////////////////////////
	// PUBLIC PROPERTIES

	this.timer = timer;
	this.container = container;
	this.message = message;
	this.prependedHtml = prependedHtml;
	this.prependedHtml = appendedHtml;

	////////////////////////////////////////////////////////////////////////////////////////////
	// MAIN CONSTRUCTOR EXECUTION

	checkArgTypes();
	checkSelectorStructure();
	throwAnyErrors();

	////////////////////////////////////////////////////////////////////////////////////////////
	// MAIN CONSTRUCTOR EXECUTION

	function checkArgTypes() {
		argTypeMask = typeof timer === 'string';
		argTypeMask = ( argTypeMask << 1 ) | typeof container === 'string';
		argTypeMask = ( argTypeMask << 1 ) | typeof message === 'string';
		argTypeMask = ( argTypeMask << 1 ) | typeof prependedHtml === 'string';
		argTypeMask = ( argTypeMask << 1 ) | typeof appendedHtml === 'string';
	}

	function checkSelectorStructure() {
		validSelectorMask = !!validSelectorNeedle.exec( timer );
		validSelectorMask = ( validSelectorMask << 1 ) | !!validSelectorNeedle.exec( container );
		validSelectorMask = ( validSelectorMask << 1 ) | !!validSelectorNeedle.exec( message );
		validSelectorMask = ( validSelectorMask << 1 ) |
			!!validSelectorNeedle.exec( prependedHtml );
		validSelectorMask = ( validSelectorMask << 1 ) | !!validSelectorNeedle.exec( appendedHtml );
	}

	function throwAnyErrors() {
		if ( !argTypeMask || !validSelectorMask ) {
			if ( !argTypeMask ) {
				error.errorMsg = 'I encountered a wrongly typed argument during construction.';
				if ( !validSelectorMask ) {
					error.errorMsg += ' Also, ';
				}
			}
			if ( !validSelectorMask ) {
				error.errorMsg += 'I found that at least one of my arguments did not contain a prop\
erly formed class selector as required.';
			}
			throw error;
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTION DEFINITIONS

/**
 * Find and process a countdown timer element that has been marked with the ID attribute.
 * 
 * @param {string} selectorStr - Selector string for isolating countdown timer elements within the
 *     DOM.
 *
 * @return {(undefined|jQuery)} Either a jQuery object representing the element identified by ID as
 *     a countdown timer or undefined if an error condition was encountered.
 */
function processCountdownTimerById( selectorStr ) {
	var $countdownClockById = undefined;
	var argIsIdSelector;
	var errMsg;
	var error = {
		fileName: thisFileName,
		fName: 'processCountdownTimerById',
		fDesc: 'Find and process a countdown timer element that has been marked with an ID attribut\
e.',
		msg: ''
	};
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
				error.msg = 'I found ' + ($countdownClockById.length).toString() + ' instead of the\
 required 1 ID-labeled countdown timers.'
				throw error;
			}
		} else {
			if ( validArgType ) {
				error.msg += 'I was passed a selector string argument that was typed as ' +
					( typeof selectorStr ) + ' instead of string.';
			}
			if ( argIsIdSelector ) {
				if ( validArgType ) {
					error.msg += ' Also, '
				}
				error.msg += 'I was passed a selector string argument that did not contain a simple \
ID-based selector.';
			}
			throw error;
		}
	} catch ( thrownError ) {
		$.logError( thrownError.fileName, thrownError.fName, thrownError.fDesc, thrownError.msg );
	}

	return $countdownClockById;
}

/**
 *  Invokes the "The Final Countdown" jQuery plugin on appropriate elements within the DOM.
 *  
 *  @param {jQuery} $countdownTimer - A single jQuery object containing an element on which the
 *      plugin will be invoked.
 */
function processCountdownTimerMsg ( $countdownTimerMsg ) {
	var countdownTarget;
	var expiredMsg;
	var fnctnDesc = 'Invokes the "The Final Countdown" jQuery plugin on appropriate elements within\
 the DOM.';
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
				'Because I encountered a problem with expected data attributes, I am unable to proc\
eed with invocation of The Final Countdown on the jQuery object I am currently working with.\n\tHer\
e\'s information on the variables I am handling:'
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

/**
 * Find and process countdown timer elements whose components have been marked with the class
 * attribute.
 * 
 * @param {string} selectorStr - Selector string for isolating countdown timer elements within the
 *     DOM.
 *
 * @return {(undefined|jQuery)} Either a jQuery object representing the elements identified by class
 *     as countdown timers or undefined if an error condition was encountered.
 */
// TODO: function processCountdownTimersByClass( … ) { … }

/**
 * Show a countdown timer that was marked by its ID attribute.
 *
 * @param {undefined|jQuery} $countdownClock - Either a jQuery object representing the element
 *     identified by ID as a countdown timer or undefined if no such element was found.
 * @param {number} animationTiming - The duration of the show animation in milliseconds.
 */
function showIdSelectedCountdownTimer( $countdownClock, animationTiming ) {
	var $countdownParent;
	var hideCountdown = false;
	var validArgTypes = {};
	var error = {
		fileName: thisFileName,
		fName: 'showIdSelectedCountdownTimer',
		fDesc: 'Show a countdown timer that was marked by its ID attribute.',
		msg: ''
	};

//	var hideUntilTime = $countdownClock.data( 'hide-until' );
//	var showUntilTime = $countdownClock.data( 'show-until' );

	//TODO: Implement showing/hiding times for countdown timers.
	try {
		validArgTypes[ '$countdownClock' ] = $.isJQueryObj( $countdownClock );
		validArgTypes[ 'animationTiming' ] = typeof animationTiming === 'number';
		if ( $countdownClock && validArgTypes [ '$countdownClock' ] &&
				validArgTypes[ 'animationTiming' ] ) {
			$countdownParent = $countdownClock.parents( 'section' ).first();
			if ( !hideCountdown ) {
				$countdownParent.show( animationTiming );
			}
		} else {
			if ( $countdownClock ) {
				if ( !validArgTypes[ '$countdownClock' ] ) {
					error.msg = 'I was passed a purported jQuery object representing the countdown \
timer, but it turned out to not actually be a jQuery object.';
				}
				if ( !validArgTypes[ 'animationTiming' ] ) {
					if ( error.msg == '' ) {
						error.msg += ' Also, ';
					}
					error.msg += 'I was passed a non-number argument for the show animation timing \
that turned out to be typed as ' + ( typeof animationTiming ) +  '.';
				}
				throw error;
			}
		}
	} catch ( thrownError ) {
		$.logError( thrownError.fileName, thrownError.fName, thrownError.fDesc, thrownError.msg );
	}
}

} )( jQuery );
