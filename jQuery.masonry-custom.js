/*!
 * jQuery.masonry-custom.js
 * ------------------------
 * DESCRIPTION:
 *     Application of imagesLoaded and Masonry libraries, both written by David DeSandro, to WSU OUE
 *     websites. (Please see [https://github.com/desandro/imagesloaded] and [https://github.com/desa
 *     ndro/masonry] for David's repositories.) 
 *
 * AUTHOR: Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 */
( function ($) {

// ---- DOM IS READY: Code executed after the DOM is ready for use. --------------------------------
$( function () {
	var $masonryTrgts = $( 'ul.cascaded-layout' );
	$masonryTrgts.each( function () {
		var $thisCascade = $( this );
		var proceedWithLayout = true;
		var sizerFound = false;
		var gutterSizerFound = false;
		var $cascadeChilren = $thisCascade.children();
		$cascadeChilren.each( function () { // Look for the correct layout
			var $thisChild = $( this );
			if ( !$thisChild.hasClass( 'cascaded-item' ) ) {
				if ( !$thisChild.hasClass( 'cascade-sizer' ) ) {
					if ( !$thisChild.hasClass( 'gutter-sizer' ) ) {
						if ( !$thisChild.hasClass( 'cascade-other' ) ) {
							return proceedWithLayout = false;
						}
					} else {
						gutterSizerFound = true;
					}
				} else {
					sizerFound = true;
				}
			}
		} );
		if ( proceedWithLayout && ( !sizerFound || !gutterSizerFound ) ) proceedWithLayout = false;
		if ( proceedWithLayout ) {
			$thisCascade.masonry( {
				columnWidth: '.cascade-sizer',
				gutter: '.gutter-sizer',
				itemSelector: '.cascaded-item',
				percentPosition: true
			} );
			$thisCascade.attr( 'data-masonry-active', '1' );
			$thisCascade.imagesLoaded().progress( function() {
				$thisCascade.masonry( 'layout' );
			} );
		}
	} );
});

// ---- WINDOW LOADED: Code executed after the browser window has fully loaded ---------------------
$( window ).on( 'load', function () {
	var $masonryTrgts = $( 'ul.cascaded-layout' );
	$masonryTrgts.each( function () {
		var $thisCascade = $( this );
		var proceedWithLayout = true;
		var sizerFound = false;
		var gutterSizerFound = false;
		var $cascadeChilren = $thisCascade.children();
		$cascadeChilren.each( function () {

			// Verify that the layout is correct
			var $thisChild = $( this );
			if ( !$thisChild.hasClass( 'cascaded-item' ) ) {
				if ( !$thisChild.hasClass( 'cascade-sizer' ) ) {
					if ( !$thisChild.hasClass( 'gutter-sizer' ) ) {
						if ( !$thisChild.hasClass( 'cascade-other' ) ) {
							return proceedWithLayout = false;
						}
					} else {
						gutterSizerFound = true;
					}
				} else {
					sizerFound = true;
				}
			}
		});
		if ( proceedWithLayout && ( !sizerFound || !gutterSizerFound ) ) proceedWithLayout = false;
		if ( proceedWithLayout ) {
			$thisCascade.masonry( 'layout' );
		}
	} );
} );
} )( jQuery );
