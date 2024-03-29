/*-*************************************************************************************************
 *    █ ▄▀▀▄ █  █ █▀▀▀ █▀▀▄ █  █   █▀▀▄ ▄▀▀▄ █▀▀▀ ▄▀▀▀ ▄▀▀▄    ▄▀▀▀ █  █ ▄▀▀▀
 * ▄  █ █  █ █  █ █▀▀  █▄▄▀ ▀▄▄█   █  █ █▄▄█ █▀▀  ▀▀▀█ █▄▄█ ▀▀ █    █  █ ▀▀▀█ ▀
 * ▀▄▄█  ▀█▄  ▀▀  ▀▀▀▀ ▀  ▀▄▄▄▄▀ ▀ ▀▀▀  █  ▀ ▀▀▀▀ ▀▀▀  █  ▀     ▀▀▀  ▀▀  ▀▀▀
 *
 *        ▐▀█▀▌▄▀▀▄ ▐▀▄▀▌      █ ▄▀▀▀
 *       ▀  █  █  █ █ ▀ ▌   ▄  █ ▀▀▀█
 *          █   ▀▀  █   ▀ ▀ ▀▄▄█ ▀▀▀
 *
 * Custom JS code common to all websites of the Division of Academic Engagement and Student
 *   Achievement (DAESA) in the Office of the Provost at Washington State University (WSU).
 *
 * @version 1.1.5-rc1.0.1
 *
 * @todo Move modular scripting into dedicated source files. For example, OueEventCalendarFixer
 *   class, initContentFlippers, initQuickTabs, etc.
 *
 * @author Daniel C. Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/main/jQuery.daesa-custom.js
 * @license MIT - Copyright (c) 2022 Washington State University
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 *     and associated documentation files (the “Software”), to deal in the Software without
 *     restriction, including without limitation the rights to use, copy, modify, merge, publish,
 *     distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
 *     Software is furnished to do so, subject to the following conditions:
 *   The above copyright notice and this permission notice shall be included in all copies or
 *     substantial portions of the Software.
 *   THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 *     BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 *     DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *     FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **************************************************************************************************/

////////////////////////////////////////////////////////////////////////////////////////////////////
// TABLE OF CONTENTS
// -----------------
//   §1: Persistent documentation for final output..............................................70
//   §2: Addition of functions to jQuery........................................................84
//     §2.1: jQuery.isCssClass..................................................................87
//     §2.2: jQuery.isJQueryObj................................................................107
//     §2.3: jQuery.logError...................................................................121
//   §3: DAESA website initilization modules...................................................195
//     §3.1: OueEventCalendarFixer class.......................................................198
//       §3.1.1:  Constructor..................................................................212
//       §3.1.2:  Public members...............................................................232
//       §3.1.3:  Lexically scoped supporting functions........................................286
//     §3.2: OuePrintThisPage class............................................................307
//       §3.2.1:  Constructor..................................................................321
//       §3.2.2:  Public members...............................................................339
//     §3.3: DaesaAbAddin class................................................................392
//   §4: Execution entry point.................................................................403
//     §4.1: Function declarations.............................................................410
//       §4.1.1:  addDefinitionListButtons.....................................................413
//       §4.1.2:  fixDogears...................................................................524
//       §4.1.3:  fixEventCalendars............................................................550
//       §4.1.4:  initContentFlippers..........................................................560
//       §4.1.5:  initDefinitionLists..........................................................689
//       §4.1.6:  initPrintThisPageLinks.......................................................733
//       §4.1.7:  initQuickTabs................................................................741
//       §4.1.8:  initReadMoreToggles..........................................................805
//       §4.1.9: initTriggeredByHover..........................................................825
//       §4.1.10: showDefinitionListButtons....................................................844
//     §4.2: DOM-Ready execution sequence......................................................875
//     §4.3: Window-loaded event bindings......................................................959
//     §4.4: Window-resized event bindings.....................................................986
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
// §1: PERSISTENT DOCUMENTATION for final output

/*!***
 * jQuery.daesa-custom.js - v1.1.5-rc1.0.0
 * Custom JS code common to all websites of the Division of Academic Engagement and Student Achievement (DAESA) in the Office of the Provost at Washington State University (WSU).
 * By Daniel C. Rieck (daniel.rieck@wsu.edu). See [GitHub](https://github.com/invokeImmediately/WSU-DAESA-JS/blob/main/jQuery.daesa-custom.js) for more info.
 * Copyright (c) 2022 Washington State University and governed by the MIT license.
 ****/

( function ( $, thisFileName ) {

'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////
// §2: ADDITION OF FUNCTIONS to jQuery

////////
// §2.1: jQuery.isCssClass

/**
 * Checking function to verify that the passed argument is a valid CSS class.
 *
 * @since 1.0.0
 *
 * @param {*} possibleClass - Possible string consisting of a valid CSS class; could, in fact, be
 *   anything.
 */
$.isCssClass = function ( possibleClass ) {
  var cssClassNeedle = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;
  var isClass;

  isClass = typeof possibleClass === 'string' && cssClassNeedle.test( possibleClass );

  return isClass;
}

////////
// §2.2: jQuery.isJQueryObj

/**
 * Checking function to verify that the passed argument is a valid jQuery object.
 *
 * @since 1.0.0
 *
 * @param {*} $obj - Possible jQuery object; could, in fact, be anything.
 */
$.isJQueryObj = function ( $obj ) {
  return ( $obj && ( $obj instanceof $ || $obj.constructor.prototype.jquery ) );
}

////////
// §2.3: jQuery.logError

/**
 * Log an error using the browser console in JSON notation.
 *
 * @since 1.0.0
 *
 * @param {string} fileName - Name of the JS source file wherein the error was encountered.
 * @param {string} fnctnName - Name of the function that called $.logError.
 * @param {string} fnctnDesc - Description of what the calling function is supposed to do.
 * @param {string} errorMsg - Message that describes what went wrong within the calling function.
 */
$.logError = function ( fileName, fnctnName, fnctnDesc, errorMsg ) {
  var thisFuncName = "jQuery.logError";
  var thisFuncDesc = "Log an error using the browser console in JSON notation.";
  var bitMask = typeof fileName === "string";
  bitMask = ( typeof fnctnName === "string" ) | ( bitMask << 1 );
  bitMask = ( typeof fnctnDesc === "string" ) | ( bitMask << 1 );
  bitMask = ( typeof errorMsg === "string" || typeof errorMsg === "object" ) | ( bitMask << 1 );

  // Output a properly formed error message.
  if ( bitMask === 15 && typeof errorMsg === "string" ) {
    console.log( "error = {\n\tfile: '" + fileName + "',\n\tfunctionName: '" + fnctnName +
      "'\n\tfunctionDesc: '" + fnctnDesc + "'\n\terrorMessage: '" + errorMsg + "'\n\t};" );
    return;
  } else if ( bitMask === 15 ) {
    console.log( "error = {\n\tfile: '" + fileName + "',\n\tfunctionName: '" + fnctnName +
      "'\n\tfunctionDesc: '" + fnctnDesc + "'\n\terror object: See following.'\n\t};" );
    console.log( errorMsg );
    return;
  }

  // Handle the case where
  var incorrectTypings;
  var bitMaskCopy;
  var newErrorMsg;

  // Determine how many incorrectly typed arguments were encountered
  for ( var i=0, incorrectTypings = 0, bitMaskCopy = bitMask; i < 4; i++ ) {
    incorrectTypings += bitMaskCopy & 1;
    bitMaskCopy = bitMaskCopy >> 1;
  }

  // Construct a new error message
  if ( incorrectTypings == 1 ) {
    newErrorMsg = "Unfortunately, a call to jQuery.error was made with an incorrectly typed argument.\n"
  } else {
    newErrorMsg = "Unfortunately, a call to jQuery.error was made with incorrectly typed arguments.\n"
  }
  newErrorMsg += "Here are the arguments that were passed to jQuery.logError:\n\t\tfileName = " + fileName + "\n";
  if ( !( ( bitMask & 8 ) >> 3 ) ) {
    newErrorMsg += "\t\ttypeof filename = " + ( typeof fileName ) + "\n";
    fileName = thisFileName;
  }
  newErrorMsg += "\t\tfnctnName = " + fnctnName + "\n";
  if( !( ( bitMask & 4 ) >> 2 ) ) {
    newErrorMsg += "\t\ttypeof fnctnName = " + ( typeof fnctnName ) + "\n";
    fnctnName = thisFuncName;
  }
  newErrorMsg += "\t\tfnctnDesc = " + fnctnDesc + "\n";
  if( !( ( bitMask & 2 ) >> 1 ) ) {
    newErrorMsg += "\t\ttypeof fnctnDesc = " + ( typeof fnctnDesc ) + "\n";
    fnctnDesc = thisFuncDesc;
  }
  newErrorMsg += "\t\terrorMsg = " + errorMsg + "\n";
  if( !( bitMask & 1 ) ) {
    newErrorMsg += "\t\ttypeof errorMsg = " + ( typeof errorMsg ) + "\n";
  }
  console.log(newErrorMsg);
}

} )( jQuery, 'jQuery.daesa-custom.js' );

////////////////////////////////////////////////////////////////////////////////////////////////////
// §3: DAESA WEBSITE INITIALIZATION MODULES

////////
// §3.1: OueEventCalendarFixer class

/**
 * Module for fixing event calendar pages on OUE websites.
 *
 * @since 1.0.0
 *
 * @todo Refactor to rename class to replace references to OUE with references to DAESA.
 * @class
 */
const OueEventCalendarFixer = ( function( $, thisFileName ) {
  'use strict';

//////////
//// §3.1.1: Constructor

  /**
   * Constructor for OueEventCalendarFixer.
   *
   * @since 1.0.0
   *
   * @param {object} sels - Collection of selectors to event calendar pages and their elements.
   * @param {string} sels.singleEventPage - Selector for isolating a tribe events single event
   *   viewing page.
   * @param {string} sels.sepLocationText - Selector for isolating the text describing the
   *   location of an event on a single event page.
   * @param {string} sels.sepEventSchedule - Selector for isolating the schedule for an event on a
   *   SEP single event page.
   */
  function OueEventCalendarFixer( sels ) {
    this.sels = sels;
  }

//////////
//// §3.1.2: Public members

  /**
   * Check the state of the OueEventCalendarFixer object's paremeters to ensure it was
   * appropriately constructed.
   *
   * @since 1.0.0
   *
   * @return {boolean} A boolean flag indicating whether the object is valid based on correctly
   *   typed and appropriately set arguments.
   */
  OueEventCalendarFixer.prototype.fixSingleEventPage = function () {
    var $elemWithLocation;
    var $page;

    if ( this.isValid() ) {
      $page = $( this.sels.singleEventPage );
      if ( $page.length === 1 ) {
        copyLocationIntoEventTitle( $page, this.sels.sepLocationText,
          this.sels.sepEventSchedule );
      }
    }
  }

  /**
   * Check the state of the OueEventCalendarFixer object's paremeters to ensure it was
   * appropriately constructed.
   *
   * @since 1.0.0
   *
   * @return {boolean} A boolean flag indicating whether the object is valid based on correctly
   *   typed and appropriately set arguments.
   */
  OueEventCalendarFixer.prototype.isValid = function () {
    var stillValid;
    var props;

    // Check the integrity of the sels member.
    stillValid = typeof this.sels === 'object';
    if ( stillValid ) {
      props = Object.getOwnPropertyNames( this.sels );
      stillValid = props.length === 3 && props.find ( function( elem ) {
        return elem === 'singleEventPage';
      } ) && props.find ( function( elem ) {
        return elem === 'sepLocationText';
      } ) && props.find ( function( elem ) {
        return elem === 'sepEventSchedule';
      } );
    }

    return stillValid;
  }

//////////
//// §3.1.3: Lexically scoped supporting functions

  function copyLocationIntoEventTitle( $page, selLocationText, selSchedule ) {
    var $location;
    var $schedule;
    var locationText;
    var newHtml;

    $location = $page.find( selLocationText );
    locationText = $location.text();
    if ( locationText != '' ) {
      $schedule = $page.find( selSchedule );
      newHtml = '<span class="tribe-event-location"> / ' + locationText + '</span>';
      $schedule.append( newHtml );
    }
  }

  return OueEventCalendarFixer;
} )( jQuery, 'jQuery.daesa-custom.js' );

////////
// §3.2: OuePrintThisPage class

/**
 * Module for fixing event calendar pages on OUE websites.
 *
 * @since 1.0.0
 * @todo Refactor to rename class to replace references to OUE with references to DAESA.
 *
 * @class
 */
const OuePrintThisPage = ( function( $, thisFileName ) {
  'use strict';

//////////
//// §3.2.1: Constructor

  /**
   * Construct an instance of OuePrintThisPage.
   *
   * @since 1.0.0
   *
   * @param {object} sels - Collection of selectors to event calendar pages and their elements.
   * @param {string} sels.container - Selector for isolating a tribe events single event
   *   viewing page.
   * @param {string} sels.identifier - Selector by which 'print this page' shortcuts are
   *   identified.
   */
  function OuePrintThisPage( sels ) {
    this.sels = sels;
  }

//////////
//// §3.2.2: Public members

  /**
   * Check the state of the OueEventCalendarFixer object's paremeters to ensure it was
   * appropriately constructed.
   *
   * @since 1.0.0
   *
   * @return {boolean} A boolean flag indicating whether the object is valid based on correctly
   *   typed and appropriately set arguments.
   */
  OuePrintThisPage.prototype.initOnThisPageLinks = function () {
    var $containers;

    if ( this.isValid() ) {
      $containers = $( this.sels.container );
      $containers.on( 'click', this.sels.identifier, function() {
        window.print();
      } );
    }
  }

  /**
   * Check the state of the OueEventCalendarFixer object's paremeters to ensure it was
   * appropriately constructed.
   *
   * @since 1.0.0
   *
   * @return {boolean} A boolean flag indicating whether the object is valid based on correctly
   *   typed and appropriately set arguments.
   */
  OuePrintThisPage.prototype.isValid = function () {
    var stillValid;
    var props;

    // Check the integrity of the sels member.
    stillValid = typeof this.sels === 'object';
    if ( stillValid ) {
      props = Object.getOwnPropertyNames( this.sels );
      stillValid = props.length === 2 && props.find ( function( elem ) {
        return elem === 'container';
      } ) && props.find ( function( elem ) {
        return elem === 'identifier';
      } );
    }

    return stillValid;
  }

  return OuePrintThisPage;
} )( jQuery, 'jQuery.daesa-custom.js' );

////////
// §3.3: DaesaAbAddin class

// const DaesaAbAddin = ( function( $, thisFileName ) {
//  class DaesaAbAddin {

//  }

//  return DaesaAbAddin;
// } )( jQuery, 'jQuery.daesa-custom.js' );

////////////////////////////////////////////////////////////////////////////////////////////////////
// §4: Execution entry point

( function( $, thisFileName ) {

'use strict';

////////
// §4.1: Function declarations

//////////
//// §4.1.1: addDefinitionListButtons

/**
 * Automatically creates and binds events to expand/collapse all buttons designed for improving UX
 * of OUE site definition lists.
 *
 * @since 1.0.0
 *
 * @param {string} slctrDefList - Selector string for locating definition list elements within the
 *   DOM that contain collapsible definitions.
 * @param {string} expandAllClass - CSS class for controlling the layout of expand all buttons.
 * @param {string} collapseAllClass - CSS class for controlling the layout of collapse all buttons.
 * @param {string} btnDisablingClass - CSS class applied to disable expand/collapse all buttons.
 * @param {string} dtActivatingClass - CSS class used to indicate an active/expanded state for
 *   definition terms.
 * @param {string} ddRevealingClass - CSS class used to realize a revealed, visible state on
 *   definitions.
 */
function addDefinitionListButtons( slctrDefList, expandAllClass, collapseAllClass,
    btnDisablingClass, dtActivatingClass, ddRevealingClass, animSldDrtn ) {
  var thisFuncName = "addDefinitionListButtons";
  var thisFuncDesc = "Automatically creates and binds events to expand/collapse all buttons designed for improving UX of OUE site definition lists";

  // Find and remove any pre-existing expand/collapse all buttons
  var $lists = $( slctrDefList );
  var $existingExpandAlls = $lists.children( "." + expandAllClass );
  var $existingCollapseAlls = $lists.children( "." + collapseAllClass );
  if ( $existingExpandAlls.length > 0 ) {
    $existingExpandAlls.remove();
    $.logError(
      thisFileName, thisFuncName, thisFuncDesc,
      "Expand all buttons were already discovered in the DOM upon document initialization; please remove all buttons from the HTML source code to avoid wasting computational resources."
    );
  }
  if ( $existingCollapseAlls.length > 0 ) {
    $existingCollapseAlls.remove();
    $.logError(
      thisFileName, thisFuncName, thisFuncDesc,
      "Collapse all buttons were already discovered in the DOM upon document initialization; please remove all buttons from the HTML source code to avoid wasting computational resources."
    );
  }

  // Add initially hidden ( via CSS ) expand/collapse all buttons to definition lists
  $lists.prepend( '<button type="button" class="collapse-all-button">Collapse All -</button>' );
  $lists.prepend( '<button type="button" class="expand-all-button">Expand All +</button>' );
  var slctrExpandAll = slctrDefList + " > ." + expandAllClass;
  var $expandAlls = $( slctrExpandAll );
  var slctrCollapseAll = slctrDefList + " > ." + collapseAllClass;
  var $collapseAlls = $( slctrCollapseAll );

  // Bind handling functions to button click events
  $expandAlls.click( function() {
    var $thisExpand = $( this );
    if ( !$thisExpand.hasClass( btnDisablingClass ) ) {
      var $nextCollapse = $thisExpand.next( "." + collapseAllClass );
      var $parentList = $thisExpand.parent( slctrDefList );
      if ( $parentList.length == 1 ) {
        // TODO: Disable buttons
        var $defTerms = $parentList.children( "dt" );
        $defTerms.each( function() {
          var $thisDefTerm = $( this );
          if ( !$thisDefTerm.hasClass( dtActivatingClass ) ) {
            $thisDefTerm.addClass( dtActivatingClass );
            var $thisDefTermNext = $thisDefTerm.next( "dd" );
            $thisDefTermNext.addClass( ddRevealingClass );
            $thisDefTermNext.stop().animate( {
              maxHeight: $thisDefTermNext[0].scrollHeight
            }, animSldDrtn );
          }
        } );
        // TODO: Enable buttons
      } else {
        $.logError(
          thisFileName, thisFuncName, thisFunDesc,
          "When trying to bind a click event on an expand all button to a handling function, could not locate the parental definition list within DOM."
        );
      }
    }
  } );
  $collapseAlls.click( function() {
    var $thisCollapse = $( this );
    if ( !$thisCollapse.hasClass( btnDisablingClass ) ) {
      var $prevExpand = $thisCollapse.prev( "." + expandAllClass );
      var $parentList = $thisCollapse.parent( slctrDefList );
      if ( $parentList.length == 1 ) {
        // TODO: Disable buttons
        var $defTerms = $parentList.children( "dt" );
        $defTerms.each( function() {
          var $thisDefTerm = $( this );
          if ( $thisDefTerm.hasClass( dtActivatingClass ) ) {
            $thisDefTerm.removeClass( dtActivatingClass );
            var $thisDefTermNext = $thisDefTerm.next( "dd" );
            $thisDefTermNext.removeClass( ddRevealingClass );
            $thisDefTermNext.stop().animate( {
              maxHeight: 0
            }, animSldDrtn );
          }
        } );
        // TODO: Enable buttons
      } else {
        $.logError(
          thisFileName, thisFuncName, thisFunDesc,
          "When trying to bind a click event on collapse all button #" +
            $thisCollapse.index() + "to a handling function, could not locate the parental definition list within the DOM."
        );
      }
    }
  } );
}

//////////
//// §4.1.2: fixDogears

// TODO: Add inline documentation in JSDoc3 format.,.
function fixDogears( slctrSiteNav, slctrDogeared, removedClasses ) {
  // Fix bug wherein the wrong items in the spine become dogeared
  var $dogearedItems = $( slctrSiteNav ).find( slctrDogeared );
  if ( $dogearedItems.length > 1 ) {
    var currentURL = window.location.href;
    var currentPage = currentURL.substring( currentURL.substring( 0, currentURL.length - 1 )
      .lastIndexOf( "/" ) + 1, currentURL.length - 1 );
    $dogearedItems.each( function () {
      var $this = $( this );
      var $navLink = $this.children( "a" );
      if ( $navLink.length == 1 ) {
        var navLinkURL = $navLink.attr( "href" );
        var navLinkPage = navLinkURL.substring( navLinkURL.substring( 0, navLinkURL.length - 1 )
          .lastIndexOf( "/" ) + 1, navLinkURL.length - 1 );
        if ( navLinkPage != currentPage ) {
          $this.removeClass( removedClasses );
        }
      }
    } );
  }
}

//////////
//// §4.1.3: fixEventCalendars

// TODO: Add inline documentation in JSDoc3 format.
function fixEventCalendars( sels ) {
  var fixer = new OueEventCalendarFixer( sels );

  fixer.fixSingleEventPage();
}

//////////
//// §4.1.4: initContentFlippers

// TODO: Add inline documentation in JSDoc3 format.
// TODO: Convert to class-based implementation.
function initContentFlippers( slctrCntntFlppr, slctrFlppdFront, slctrFlppdBack, animDuration ) {
  // Set up initial state of content flippers and front and back panels.
  $( slctrCntntFlppr ).each( function() {
    // Set tabindex on flipper control.
    let $flipper = $( this );
    if ( !$flipper.attr( 'tabindex' ) || $flipper.attr( 'tabindex' ) != '0' ) {
      $flipper.attr( 'tabindex', '0' );
    }

    // Set role of flipper to button and pressed state to false.
    if ( !$flipper.attr( 'role' ) || !$flipper.attr( 'role' ) != 'button' ) {
      $flipper.attr( 'role', 'button' );
    }
    if ( !$flipper.attr( 'aria-pressed' ) || !$flipper.attr( 'aria-pressed' ) != 'false' ) {
      $flipper.attr( 'aria-pressed', 'false' );
    }

    // Set expansion state of front panel to expanded.
    let $front = $flipper.next( slctrFlppdFront );
    if ( !$front.attr( 'aria-expanded' ) || !$front.attr( 'aria-expanded' ) != 'true' ) {
      $front.attr( 'aria-expanded', 'true' );
    }

    // Set expansion state of back panel to collapsed.
    let $back = $front.next( slctrFlppdBack );
    if ( !$back.attr( 'aria-expanded' ) || !$back.attr( 'aria-expanded' ) != 'false' ) {
      $back.attr( 'aria-expanded', 'false' );
    }
  } );

  // Set up mouse click handler for content flippers.
  $( slctrCntntFlppr ).click( function () {
    // Toggle flipper's aria-pressed state.
    let $flipper = $( this );
    if( $flipper.attr( 'aria-pressed' ) == 'false' ) {
      $flipper.attr( 'aria-pressed', 'true' );
    } else {
      $flipper.attr( 'aria-pressed', 'false' );
    }

    // Toggle the front panel's state.
    let $front = $flipper.next( slctrFlppdFront );
    $front.toggle( animDuration );
    if( $front.attr( 'aria-expanded' ) == 'false' ) {
      $front.attr( 'aria-expanded', 'true' );
    } else {
      $front.attr( 'aria-expanded', 'false' );
    }

    // Toggle the back panel's state.
    let $back = $front.next( slctrFlppdBack );
    $back.fadeToggle( animDuration );
    if( $back.attr( 'aria-expanded' ) == 'false' ) {
      $back.attr( 'aria-expanded', 'true' );
    } else {
      $back.attr( 'aria-expanded', 'false' );
    }
  } );

  // Set up mouse click handler for content flippers' front panels, if appropriate.
  $( slctrFlppdFront ).click( function () {
    let $front = $( this );
    $front.toggle( animDuration );
    if( $front.attr( 'aria-expanded' ) == 'false' ) {
      $front.attr( 'aria-expanded', 'true' );
    } else {
      $front.attr( 'aria-expanded', 'false' );
    }

    let $back = $front.next( slctrFlppdBack );
    $back.fadeToggle( animDuration );
    if( $back.attr( 'aria-expanded' ) == 'false' ) {
      $back.attr( 'aria-expanded', 'true' );
    } else {
      $back.attr( 'aria-expanded', 'false' );
    }

    let $flipper = $front.prev(slctrCntntFlppr);
    if( $flipper.attr( 'aria-pressed' ) == 'false' ) {
      $flipper.attr( 'aria-pressed', 'true' );
    } else {
      $flipper.attr( 'aria-pressed', 'false' );
    }
  } );

  // Set up keydown handler for content flippers.
  $( slctrCntntFlppr ).on( 'keydown', function( e ) {
    let regExActKeys = /Enter| /g;
    if( regExActKeys.test( e.key ) ) {
      e.preventDefault();
      // Toggle flipper's aria-pressed state.
      let $flipper = $( this );
      if( $flipper.attr( 'aria-pressed' ) == 'false' ) {
        $flipper.attr( 'aria-pressed', 'true' );
      } else {
        $flipper.attr( 'aria-pressed', 'false' );
      }

      // Toggle the front panel's state.
      let $front = $flipper.next( slctrFlppdFront );
      $front.toggle( animDuration );
      if( $front.attr( 'aria-expanded' ) == 'false' ) {
        $front.attr( 'aria-expanded', 'true' );
      } else {
        $front.attr( 'aria-expanded', 'false' );
      }

      // Toggle the back panel's state.
      let $back = $front.next( slctrFlppdBack );
      $back.fadeToggle( animDuration );
      if( $back.attr( 'aria-expanded' ) == 'false' ) {
        $back.attr( 'aria-expanded', 'true' );
      } else {
        $back.attr( 'aria-expanded', 'false' );
      }
    }
  } );

  $( slctrCntntFlppr ).on( 'mouseleave', function( e ) {
    let $flipper = $( this );
    $flipper.trigger( 'blur' );
  } );
}

//////////
//// §4.1.5: initDefinitionLists

// TODO: Add inline documentation in JSDoc3 format.
function initDefinitionLists( slctrDefList, dtActivatingClass, ddRevealingClass, animHghtDrtn ) {
  var $listDts = $( slctrDefList + " dt" );
  $listDts.attr( "tabindex", 0 );
  $listDts.click( function() {
    var $this = $( this );
    $this.toggleClass( dtActivatingClass );
    var $thisNext = $this.next( "dd" );
    $thisNext.toggleClass( ddRevealingClass );
    if ( $thisNext.hasClass( ddRevealingClass ) ) {
      $thisNext.stop().animate( {
        maxHeight: $thisNext[0].scrollHeight
      } );
    } else {
      $thisNext.stop().animate( {
        maxHeight: 0
      } );
    }
  } );
  $listDts.on( "keydown", function( e ) {
    var regExMask = /Enter| /g; // TODO: Divide and conquer
    if ( regExMask.exec( e.key ) != null ) {
      e.preventDefault();
      var $this = $( this );
      $this.toggleClass( dtActivatingClass );
      var $thisNext = $this.next( "dd" );
      $thisNext.toggleClass( ddRevealingClass );
      if ( $thisNext.hasClass( ddRevealingClass ) ) {
        $thisNext.stop().animate( {
          maxHeight: $thisNext[0].scrollHeight
        } );
      } else {
        $thisNext.stop().animate( {
          maxHeight: 0
        } );
      }
    }
  } );
  $( slctrDefList + " dd" ).removeClass( ddRevealingClass );
}

//////////
//// §4.1.6: initPrintThisPageLinks

function initPrintThisPageLinks( sels ) {
  var printThisPageLinks = new OuePrintThisPage( sels );
  printThisPageLinks.initOnThisPageLinks();
}

//////////
//// §4.1.7: initQuickTabs

// TODO: Convert to a class-based initialization module
function initQuickTabs( slctrQtSctn ) {
  var $qtSctn = $( slctrQtSctn );
  $qtSctn.each( function () {
    var $thisSctn = $( this );
    var $tabCntnr = $thisSctn.find( "div.column > ul" );
    var $tabs = $tabCntnr.find( "li" );
    var $panelCntnr = $thisSctn.find( "table" );
    var $panels = $panelCntnr.find( "tbody:first-child > tr" );
    if( $tabs.length == $panels.length ) {
      var idx;
      var jdx;
      for ( idx = 0; idx < $tabs.length; idx++ ) {
        $tabs.eq( idx ).click( function() {
          var $thisTab = $( this );
          var kdx = $tabs.index( $thisTab );
          if ( kdx == 0 ) {
            if ( $thisTab.hasClass( "deactivated" ) ) {
              $thisTab.removeClass( "deactivated" );
              $panels.eq( kdx ).removeClass( "deactivated" );
              for ( jdx = 1; jdx < $tabs.length; jdx++ ) {
                if ( $tabs.eq( jdx ).hasClass( "activated" ) ) {
                  $tabs.eq( jdx ).removeClass( "activated" );
                  $panels.eq( jdx ).removeClass( "activated" );
                }
              }
              $( "html, body" ).animate( {
                scrollTop: $thisTab.offset().top
              }, 500 );
            }
          } else {
            if ( !$thisTab.hasClass( "activated" ) ) {
              if ( !$tabs.eq( 0 ).hasClass( "deactivated" ) ) {
                $tabs.eq( 0 ).addClass( "deactivated" );
                $panels.eq( 0 ).addClass( "deactivated" );
              }
              for ( jdx = 1; jdx < kdx; jdx++ ) {
                if ( $tabs.eq( jdx ).hasClass( "activated" ) ) {
                  $tabs.eq( jdx ).removeClass( "activated" );
                  $panels.eq( jdx ).removeClass( "activated" );
                }
              }
              $thisTab.addClass( "activated" );
              $panels.eq( kdx ).addClass( "activated" );
              for ( jdx = kdx + 1; jdx < $tabs.length; jdx++ ) {
                if ( $tabs.eq( jdx ).hasClass( "activated" ) ) {
                  $tabs.eq( jdx ).removeClass( "activated" );
                  $panels.eq( jdx ).removeClass( "activated" );
                }
              }
              $( "html, body" ).animate( {
                scrollTop: $thisTab.offset().top
              }, 500 );
            }
          }
        } );
      }
    }
  } );
}

//////////
//// §4.1.8: initReadMoreToggles

function initReadMoreToggles( slctrToggleIn, slctrToggleOut, slctrPanel, animDuration ) {
  $( slctrToggleIn ).click( function () {
    var $this = $( this );
    var $next = $this.next( slctrPanel );
    $this.toggle( animDuration );
    $this.$next.toggle( animDuration );
    $this.$next.next( slctrToggleOut ).toggle( animDuration );
  } );
  $( slctrToggleOut ).click( function () {
    var $this = $( this );
    var $next = $this.next( slctrPanel );
    $this.toggle( animDuration );
    $this.$next.toggle( animDuration );
    $this.$next.next( slctrToggleIn ).toggle( animDuration );
  } );
}

//////////
//// §4.1.9: initTriggeredByHover

function initTriggeredByHover( slctrTrggrdOnHvr, slctrCntntRvld, slctrCntntHddn, animDuration ) {
  $( slctrTrggrdOnHvr ).mouseenter( function () {
    var $this = $( this );
    var $rvldCntnt = $this.find( slctrCntntRvld );
    var $hddnCntnt = $this.find( slctrCntntHddn );
    $rvldCntnt.stop().show( animDuration );
    $hddnCntnt.stop().hide( animDuration );
  } ).mouseleave( function () {
    var $this = $( this );
    var $rvldCntnt = $this.find( slctrCntntRvld );
    var $hddnCntnt = $this.find( slctrCntntHddn );
    $rvldCntnt.stop().hide( animDuration );
    $hddnCntnt.stop().show( animDuration );
  } );
}

//////////
//// §4.1.10: showDefinitionListButtons

/**
 * Display expand/collapse all buttons, which were initially hidden
 *
 * @since 1.0.0
 *
 * @param {string} slctrDefList - Selector string for locating definition list elements within the
 *   DOM that contain collapsible definitions.
 * @param {string} expandAllClass - CSS class for controlling the layout of expand all buttons.
 * @param {string} collapseAllClass - CSS class for controlling the layout of collapse all buttons.
 * @param {number} animFadeInDrtn - The animation speed in ms by which definitions fade into view.
 */
function showDefinitionListButtons( slctrDefList, expandAllClass, collapseAllClass,
    animFadeInDrtn ) {
  var thisFuncName = "addDefinitionListButtons";
  var thisFuncDesc = "Display expand/collapse all buttons, which were initially hidden";

  // Display expand/collapse all buttons
  var $lists = $( slctrDefList );
  var $expandAlls = $lists.children( "." + expandAllClass );
  var $collapseAlls = $lists.children( "." + collapseAllClass );
  $lists.animate( {
    marginTop: "+=39px"
  }, animFadeInDrtn, function() {
    $expandAlls.fadeIn( animFadeInDrtn );
    $collapseAlls.fadeIn( animFadeInDrtn );
  } );
}

////////
// §4.2: DOM-Ready execution sequence

$( function () {
  var argsList = new Object(); // List of arguments that will be passed to functions
  var args; // List of arguments currently being utilized

  argsList.fixDogears = {
    slctrSiteNav: "#spine-sitenav",
    slctrDogeared: "li.current.active.dogeared",
    removedClasses: "current active dogeared"
  };
  args = argsList.fixDogears;
  fixDogears( args.slctrSiteNav, args.slctrDogeared, args.removedClasses );

  fixEventCalendars( {
    singleEventPage: 'body.single-tribe_events',
    sepLocationText: '.tribe-events-meta-group-venue .tribe-venue a',
    sepEventSchedule: '.tribe-events-schedule h2'
  } );


  argsList.initReadMoreToggles = {
    slctrToggleIn: ".read-more-toggle-in-ctrl",
    slctrToggleOut: ".read-more-toggle-out-ctrl",
    slctrPanel: ".read-more-panel",
    animDuration: 500
  };
  args = argsList.initReadMoreToggles;
  initReadMoreToggles( args.slctrToggleIn, args.slctrToggleOut, args.slctrPanel,
    args.animDuration );

  argsList.initContentFlippers = {
    slctrCntntFlppr: ".content-flipper",
    slctrFlppdFront: ".flipped-content-front",
    slctrFlppdBack: ".flipped-content-back",
    animDuration: 500
  };
  args = argsList.initContentFlippers;
  initContentFlippers( args.slctrCntntFlppr, args.slctrFlppdFront, args.slctrFlppdBack,
    args.animDuration );

  argsList.initDefinitionLists = {
    slctrDefList: "dl.toggled",
    dtActivatingClass: "activated",
    ddRevealingClass: "revealed",
    animSldDrtn: 400,
    animHghtDrtn: 100
  };
  args = argsList.initDefinitionLists;
  initDefinitionLists( args.slctrDefList, args.dtActivatingClass, args.ddRevealingClass,
    args.animSldDrtn, args.animHghtDrtn );

  argsList.addDefinitionListButtons = {
    slctrDefList: argsList.initDefinitionLists.slctrDefList,
    expandAllClass: "expand-all-button",
    collapseAllClass: "collapse-all-button",
    btnDisablingClass: "disabled",
    dtActivatingClass: argsList.initDefinitionLists.dtActivatingClass,
    ddRevealingClass: argsList.initDefinitionLists.ddRevealingClass,
    animSldDrtn: argsList.initDefinitionLists.animSldDrtn
  };
  args = argsList.addDefinitionListButtons;
  addDefinitionListButtons( args.slctrDefList, args.expandAllClass, args.collapseAllClass,
    args.btnDeactivatingClass, args.dtActivatingClass, args.ddRevealingClass,
    args.animSldDrtn );

  argsList.initQuickTabs = {
    slctrQtSctn: "section.row.single.quick-tabs"
  };
  args = argsList.initQuickTabs;
  initQuickTabs( args.slctrQtSctn );

  argsList.initTriggeredByHover = {
    slctrTrggrdOnHvr: ".triggered-on-hover",
    slctrCntntRvld: ".content-revealed",
    slctrCntntHddn: ".content-hidden",
    animDuration: 200
  };
  args = argsList.initTriggeredByHover;
  initTriggeredByHover( args.slctrTrggrdOnHvr, args.slctrCntntRvld, args.slctrCntntHddn,
    args.animDuration );
} );

////////
// §4.3: Window-loaded event binding

$( window ).on( "load", function () {
  var argsList = new Object();
  var args;

  argsList.showDefinitionListButtons = {
    slctrDefList: "dl.toggled",
    expandAllClass: "expand-all-button",
    collapseAllClass: "collapse-all-button",
    animFadeInDrtn: 400
  };
  args = argsList.showDefinitionListButtons;
  showDefinitionListButtons( args.slctrDefList, args.expandAllClass, args.collapseAllClass,
    args.animFadeInDrtn );

  argsList.initPrintThisPageLinks = {
    sels: {
      container: '.column',
      identifier: '.link__print-this-page'
    }
  };
  args = argsList.initPrintThisPageLinks;
  initPrintThisPageLinks( args.sels );
} );

////////
// §4.4: Window-resized event binding

$( window ).resize( function () {
  // TODO: Add code as needed.
} );

} )( jQuery, 'jQuery.daesa-custom.js' );
