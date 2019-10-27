/*!
 * jQuery.textResize.js
 *
 * SUMMARY: Automatically scale the font size of an element based on either its own width or the
 * width of one of its parents.
 *
 * DESCRIPTION: Adapted from FitText.js 1.2 (https://github.com/davatron5000/FitText.js) by Dave
 * Rupert (http://daverupert.com).
 *
 * AUTHOR: Daniel Rieck <danielcrieck@gmail.com> (https://github.com/invokeImmediately)
 *
 * LICENSE: Released under GNU GPLv2
 */
( function( $, dfltBasisSlctr, fileName ) {
	// TODO: Modify with enhancement by adding an option to specify the selector for the basis of
	// the resizing, such as a parent column.
	$.fn.textResize = function( scalingFactor, options ) {
		// Set up default options in case the caller passed no attributes
		var scalingAmount = scalingFactor || 1,
			settings = $.extend( {
				'minFontSize' : Number.NEGATIVE_INFINITY,
				'maxFontSize' : Number.POSITIVE_INFINITY,
				'againstSelf' : true,
				'basisSelector' : dfltBasisSlctr
			}, options );

		return this.each( function () {
			var $this = $( this );
			var $parent = undefined;

			if ( !settings.againstSelf ) {
				$parent = $this.parents( settings.basisSelector ).first();
				if ( !$parent.length ) {
					settings.againstSelf = true;
					console.log( 'Error in ' + fileName + ': I was unable to select the basis for t\
ext resizing from the DOM. Defaulting to resizing the font of the element represented by the follow\
ing jQuery object against its own width.' );
					console.log( 'Basis selector: ' + settings.basisSelector );
					console.log( $this );
				}
			}

			// Resizer() keeps font-size proportional to object width as constrainted by the user
			var resizer = function () {
				if( !settings.againstSelf ) {
					$this.css('font-size', Math.max(
						Math.min(
							$parent.innerWidth() / ( scalingAmount * 10 ),
							parseFloat( settings.maxFontSize )
						),
						parseFloat( settings.minFontSize ) ) );
				}
				else {
					$this.css('font-size', Math.max(
						Math.min(
							$this.width() / ( scalingAmount * 10 ),
							parseFloat( settings.maxFontSize )
						),
						parseFloat( settings.minFontSize ) ) );
				}
			};

			// Call once to set the object's font size based on current window size, then call as
			// resize or orientation-change events are triggered.
			resizer();
			$( window ).on( 'resize.textresize orientationchange.textresize' , resizer );
		} );
	};
} )( jQuery, '.column', 'jQuery.textResize.js' );

var TextAutoResizers = ( function( $ ) {

	// TODO: Refactor class design for improved efficiency, lower overhead
	function TextAutoResizers( cssClass, spineWidth, dfltBasisSlctr ) {	
		var $resizers = $( cssClass );
		
		this.initTextAutoResizing = function () {
			if ( $.isJQueryObj( $resizers ) && $resizers.length > 0 ) {
				$resizers.each( function() {
					var textAutoResizer = new TextAutoResizingElem( $( this ), spineWidth );
				} );				
			}
		}		
		
		function TextAutoResizingElem( $jqObj, spineWidth ) {
			var $this = $jqObj;

			initTextAutoResizing();
			
			function initTextAutoResizing() {
				if ( $.isJQueryObj( $this ) ) {
					var basisSlctr;
					var cssData;
					var fontSz;
					var minFontSz;
					var minFontSzNeedle = new RegExp( '^[0-9]+|[0-9]+pt[0-9]$' );
					var resizeOptions;
					var scalingAmt;

					resizeOptions = {
						minFontSize: '14',
						againstSelf: false,
						basisSelector: dfltBasisSlctr
					};
					fontSz = parseFloat( $this.css( 'font-size' ) );
					if ( $this.hasClass( 'has-max-size' ) )  {
						resizeOptions.maxFontSize = fontSz;
					}
					if ( $this.hasClass( 'resize-against-self' ) ) {
						resizeOptions.againstSelf = true;
					}
					cssData = new CssData( $this );
					minFontSz = cssData.getData('min-fs');
					if ( typeof minFontSz === 'string' && minFontSz !== '' &&
							minFontSzNeedle.exec( minFontSz ) ) {
					 	resizeOptions.minFontSize = minFontSz.replace( 'pt', '.' );
					}
					basisSlctr = cssData.getData('resize-against')
					if ( typeof basisSlctr === 'string' && basisSlctr !== '' ) {
						basisSlctr = '.' + basisSlctr;
						resizeOptions.basisSelector = basisSlctr;
					} else {
						basisSlctr = dfltBasisSlctr;
					}
					scalingAmt = calculateScalingAmount( fontSz, basisSlctr );
					$this.textResize( scalingAmt, resizeOptions );
				}
			}
			
			function calculateScalingAmount( fontSz, basisSlctr ) {
				var maxColumnWidth = findMaxColumnWidth( basisSlctr );

				return maxColumnWidth / ( fontSz * 10 );
			}
			
			function findMaxColumnWidth( basisSlctr ) {
				var $parentCol = $this.parents( basisSlctr ).first();
				if ( $parentCol.length === 0 ) {
					$parentCol = $this.parents( dfltBasisSlctr ).first();
				}
				var maxColWidth = findMaxColWidth( $parentCol );

				return maxColWidth;
			}
			
			function findMaxColWidth( $parentCol ) {
				var maxRowWidth;
				var maxWidthCss;

				// Set the default max row width to the lowest possible amount based on the
				// WordPress theme. It will be overwitten below if appropriate.
				maxRowWidth = 990;

				// Use the max width for parental column if it was explicitly set
				maxWidthCss = $parentCol.css( 'max-width' );
				if ( maxWidthCss != 'none' ) {
					maxRowWidth = parseFloat( maxWidthCss );
				} else {
					// Calculate maximum column width if it can be implied from a maximum row width
					maxRowWidth = findMaxRowWidthFromBinder( maxRowWidth );
				}

				// Return the max column width by dividing up the max row width as needed
				return divideUpMaxRowWidth( maxRowWidth, $parentCol );
			}
			
			function findMaxRowWidthFromBinder( dfltMaxRowWidth ) {
				var maxRowWidth = dfltMaxRowWidth;
				var maxCssWidth = findBindersMaxWidthCss();

				if ( maxCssWidth != 'none' ) {
					// The binder's max width includes the spine's fixed width, so subtract it off
					// to achieve actual max width of row
					maxRowWidth = parseFloat( maxCssWidth ) - spineWidth;
				}

				// Return the max width in numerical form
				return maxRowWidth;
			}
			
			function findBindersMaxWidthCss() {
				var maxWidthCss = 'none';
				var $binder = $( '#binder' );

				if ($binder.length == 1) {
					if ( $binder.hasClass( 'max-1188' ) ) {
						maxWidthCss = '1188';
					} else if ( $binder.hasClass( 'max-1386' ) ) {
						maxWidthCss = '1386';
					} else if ( $binder.hasClass( 'max-1584' ) ) {
						maxWidthCss = '1584';
					} else if ( $binder.hasClass( 'max-1782' ) ) {
						maxWidthCss = '1782';
					} else if ( $binder.hasClass( 'max-1980' ) ) {
						maxWidthCss = '1980';
					}
				}

				// Return a string containing the parental binder's max width as specified in CSS
				return maxWidthCss;
			}
			
			function divideUpMaxRowWidth( maxRowWidth, $parentCol ) {
				var maxColWidth = maxRowWidth;
				var $parentRow = ( $.isJQueryObj( $parentCol ) ) ?
					$parentCol.parent( '.row' ) :
					undefined;

				if ( $parentCol.css( 'max-width' ) == 'none' && $.isJQueryObj( $parentRow ) ) {
					if ( $parentRow.hasClass( 'halves' ) ) {
						maxColWidth /= 2;
					} else if ($parentRow.hasClass( 'thirds' ) ) {
						maxColWidth /= 3;
					} else if ($parentRow.hasClass( 'quarters' ) ) {
						maxColWidth /= 4;
					}
				}

				return maxColWidth;
			}
		}
	}

	return TextAutoResizers;
} )( jQuery );

// Now use the plugin on the WSU Undergraduate education website (i.e. delete or modify the
// following statement if you are going to utilize this plugin on your own site).
// TODO: Pass in default maximum column, spine widths
( function( $, themeMinColumnWidth, themeSpineWidth, resizersClass, dfltBasisSlctr, fileName ) {

try {
	var clmnWidth;
	var dfltSpineWidth; // px - default width of spine

	if ( typeof themeMinColumnWidth !== 'number' || typeof themeSpineWidth !== 'number' ||
			typeof resizersClass !== 'string' ) {
		throw 'I was not set up with properly typed initialization parameters and am unable to proc\
eed.';
	}

	// Set the default column width in pixels (passed in based on the theme)
	clmnWidth = themeMinColumnWidth;

	// Set the default width of the Spine in pixels (passed in based on the theme)
	dfltSpineWidth = themeSpineWidth;

	$( function () {
		initArticleHeaderText( resizersClass );
		initTextAutoResizers( '.' + resizersClass );
	} );

	function initArticleHeaderText( resizersClass ) {
		//TODO: Refactor to prefer relying on functionality mediated by auto-fits-text class
		var $columns = $( '.column' );
		var $this;

		$columns.find( '.article-header .header-content h1' ).each( function () {
			$this = $( this );
			if ( !$this.hasClass( resizersClass ) ) {
				$this.textResize( 1.277142857142857, {'minFontSize' : '34.8' } );
			}
		} );
		$columns.find( '.article-header .header-content h2').each( function () {
			$this = $( this );
			if ( !$this.hasClass( resizersClass ) ) {
				$this.textResize( 1.847840465639262, { 'minFontSize' : '28' } );
			}
		} );
		$columns.find( '.article-header .header-content h3').each( function () {
			$this = $( this );
			if ( !$this.hasClass( resizersClass ) ) {
				$this.textResize( 4.110097222222222, {'minFontSize' : '16' } );
			}
		} );
	}

	function initTextAutoResizers( cssClass ) {
		var $textAutoResizers = new TextAutoResizers( cssClass, dfltSpineWidth, dfltBasisSlctr );

		$textAutoResizers.initTextAutoResizing();
	}
} catch ( errMsg ) {
	console.log( 'Error in ' + fileName + ':' );
	console.log( errMsg );
}

} )( jQuery, 990, 198, 'auto-fits-text', '.column', 'jQuery.textResize.js' );
