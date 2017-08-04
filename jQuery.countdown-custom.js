/*!
 * Application of imagesLoaded & Masonry libraries to WSU OUE websites.
 * Author: Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 */
( function ($) {

var animationTiming = 400;	// Controls the speed at which jQuery-induced countdown animations occur

/* DOM IS READY: Code executed after the DOM is ready for use. */
$( function () {
	var $countdownClock = $("#countdown-clock");
	var countdownTarget;
	var pendingMsg;
	var expiredMsg;
	if( $countdownClock ) {
		countdownTarget = $countdownClock.data( "countdown" );
		pendingMsg = $countdownClock.data( "pending-message" );
		expiredMsg = $countdownClock.data( "expired-message" );
		if( countdownTarget && pendingMsg && expiredMsg ) {
			$countdownClock.countdown( countdownTarget ).on( "update.countdown", function( event ) {
				var parsedMsg = pendingMsg.replace( /\[/g, "<" ).replace( /\]/g, ">" );
				var format = "%H:%M:%S";
				if( event.offset.totalDays > 0 ) {
					format = "%-D day%!D and " + format;
				}
				format = "<strong>" + format + "</strong>" + parsedMsg;
				$( this ).html( event.strftime( format ) );
			} ).on("finish.countdown", function( event ) {
				$( this ).html( expiredMsg );
			} );
		}
	}
} );

/* WINDOW LOADED: Code executed after the browser window has fully loaded. */
$( window ).on( "load", function () {
	var $countdownClock = $( "#countdown-clock" );
	var $countdownParent = $countdownClock.parents( "section" ).first();
	$countdownParent.show( animationTiming );
} );

} )( jQuery );
