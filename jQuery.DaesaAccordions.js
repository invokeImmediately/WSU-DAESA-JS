/**
 * ▓▓▓ jQuery ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
 * ▓▓▒ ─────────────────────────────────────────────────────────── ▒▒▒▒▒▒▒▒▒▒▒▒▒
 * ▓▒▒   █▀▀▄ ▄▀▀▄ █▀▀▀ ▄▀▀▀ ▄▀▀▄    ▄▀▀▀ █  █ ▄▀▀▀▐▀█▀▌▄▀▀▄ ▐▀▄▀▌ ▒▒▒▒▒▒▒▒▒▒▒▒▓
 * ▒▒▒   █  █ █▄▄█ █▀▀  ▀▀▀█ █▄▄█ ▀▀ █    █  █ ▀▀▀█  █  █  █ █ ▀ ▌ ▒▒▒▒▒▒▒▒▒▒▒▓▓
 * ▒▒▒ ▀ ▀▀▀  █  ▀ ▀▀▀▀ ▀▀▀  █  ▀     ▀▀▀  ▀▀  ▀▀▀   █   ▀▀  █   ▀.js ▒▒▒▒▒▒▒▓▓▓
 *
 * Script for implementing the interactive and persistent behaviors of DAESA
 *  accordions. Meant to be included on DAESA websites as needed.
 *
 * @version 1.0.1
 *
 * @todo Create a variant of this module that works in vanilla JS.
 * @todo Check ID of accordion and update it as needed.
 * @todo Use ARIA's role, aria-pressed, and aria-expanded attributes to support
 *  better usability with screen readers.
 *
 * @author Daniel C. Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/main/jQuery.daesa-custom.js
 * @license MIT - Copyright (c) 2022 Washington State University
 *  Permission is hereby granted, free of charge, to any person obtaining a
 *   copy of this software and associated documentation files
 *   (the “Software”), to deal in the Software without restriction, including
 *   without limitation the rights to use, copy, modify, merge, publish,
 *   distribute, sublicense, and/or sell copies of the Software, and to permit
 *   persons to whom the Software is furnished to do so, subject to the
 *   following conditions:
 *  The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 *  THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 *   THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *   DEALINGS IN THE SOFTWARE.
 */

////////////////////////////////////////////////////////////////////////////////
// TABLE OF CONTENTS
// -----------------
//   §1: Persistent documentation for final output..........................45
//   §2: DaesaAccordion class...............................................59
//   §3: Initialization of accordions......................................343
//   §4: Code execution triggered by DOM loading...........................368
//   §5: Closure of IIFE...................................................384
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// §1: PERSISTENT DOCUMENTATION for final output

/*!*
 * jQuery.DaesaAccordions.js — v1.0.1
 * Script for implementing the interactive and persistent behaviors of DAESA
 *  accordions.
 * By Daniel C. Rieck (daniel.rieck@wsu.edu). See [GitHub](https://github.com/
 *  invokeImmediately/WSU-DAESA-JS/blob/main/jQuery.daesa-custom.js) for more
 *  info.
 * Copyright (c) 2023 Washington State University and governed by the MIT
 *  license.
 */

( function ( $, thisFileName ) {

'use strict';

////////////////////////////////////////////////////////////////////////////////
// §2: DAESAACCORDION class

/**
 * Module for initializing accordions on DAESA websites.
 */
const DaesaAccordions = ( function( $, thisFileName ) {
  'use strict';

  /**
   * Constructor for DaesaAccordions.
   *
   * @since 1.0.0
   *
   * @param {object} sels - Collection of selectors to drop down toggles and their components.
   * @param {string} sels.toggles - Selector for isolating drop down toggle elements.
   * @param {string} sels.containers - Selector for isolating containers of drop down toggle
   *   elements.
   * @param {string} sels.targets - Selector for isolating the expandable targets of drop down
   *   toggle elements.
   * @param {string} activatingClass - CSS class that, when applied to a drop down toggle element,
   *   causes it to enter an activated state.
   */
  function DaesaAccordions( sels, activatingClass ) {
    this.sels = sels;
    this.activatingClass = activatingClass;
  }

  /**
   * Check the state of the DaesaAccordions object's paremeters to ensure it was appropriately
   * constructed.
   *
   * @since 1.0.0
   *
   * @return {boolean} A boolean flag indicating whether the object is valid based on correctly
   *   typed and appropriately set arguments.
   */
  DaesaAccordions.prototype.isValid = function () {
    var stillValid;
    var props;

    // Check the integrity of the sels member.
    stillValid = typeof this.sels === 'object';
    if ( stillValid ) {
      props = Object.getOwnPropertyNames( this.sels );
      stillValid = props.length === 3 && props.find ( function( elem ) {
        return elem === 'toggles';
      } ) && props.find ( function( elem ) {
        return elem === 'containers';
      } ) && props.find ( function( elem ) {
        return elem === 'targets';
      } );
    }

    // Check the integrity of the activatingClass member.
    if ( stillValid ) {
      stillValid = typeof this.activatingClass === 'string' &&
        $.isCssClass( this. activatingClass);
    }

    return stillValid;
  }

  /**
   * Initialize drop down toggles to respond to user interaction.
   *
   * @since 1.0.0
   */
  DaesaAccordions.prototype.initialize = function () {
    var $containers;
    var $targets;
    var $toggles;
    var funcName = 'DaesaAccordions.prototype.initialize';
    var funcDesc = 'Initialize drop down toggles to respond to user interaction.'

    if ( this.isValid() ) {
      $containers = $( this.sels.containers );
      $toggles = $containers.find( this.sels.toggles );
      $targets = $containers.find( this.sels.targets );
      setTabIndices( $toggles );
      preventAnchorHighlighting( $toggles );
      effectToggleStatePermanence( $toggles, this.activatingClass );
      bindClickHandlers( $containers, this.sels.toggles, this.activatingClass,
        this.sels.targets );
      bindKeydownHandlers( $containers, this.sels.toggles, this.activatingClass,
        this.sels.targets );
      bindChildFocusHandlers( $targets, this.sels.targets, this.sels.toggles,
        this.activatingClass );
    } else {
      $.logError( thisFileName, funcName, funcDesc, 'I was not constructed with valid' +
        'arguments. Here\'s what I was passed:\nthis.sels.toString() = ' +
        this.sels.toString() + '\nthis.activatingClass.toString() = ' +
        this.activatingClass.toString() );
    }
  }

  /**
   * Bind a handler to ensure that a drop down toggle has been activated if one of its child
   * elements receives focus.
   *
   * @since 1.0.0
   *
   * @param {jquery} $containers - Collection of the containers which may contain drop down
   *   toggles.
   * @param {string} selToggles - Selector string for isolating drop down toggle elements within
   *   the provided collection of containers.
   * @param {string} activatingClass - CSS class that, when applied to a drop down toggle element,
   *   causes it to enter an activated state.
   */
  function bindChildFocusHandlers( $targets, selTargets, selToggles, activatingClass ) {
    $targets.on( 'focusin', '*', function () {
      var $parentTargets;
      var $this;

      $this = $( this );
      $parentTargets = $this.parents( selTargets );
      $parentTargets.each( function() {
        var $thisTarget = $( this );
        var $toggle = $thisTarget.prev( selToggles );
        $toggle.addClass( activatingClass );
        setUpToggleStatePermanence( $toggle, activatingClass );
        handleCascadingChildren( $thisTarget );
      } );
    } );
  }

  /**
   * Bind a click handler to drop down toggles that enables the user to interact with them using
   * mouse input.
   *
   * @since 1.0.0
   *
   * @param {jquery} $containers - Collection of the containers which may contain drop down
   *   toggles.
   * @param {string} selToggles - Selector string for isolating drop down toggle elements within
   *   the provided collection of containers.
   * @param {string} activatingClass - CSS class that, when applied to a drop down toggle element,
   *   causes it to enter an activated state.
   */
  function bindClickHandlers( $containers, selToggles, activatingClass, selTargets ) {
    var $this;

    $containers.on( 'click', selToggles, function () {
      $this = $( this );
      $this.blur();
      $this.toggleClass( activatingClass );
      setUpToggleStatePermanence( $this, activatingClass );
      handleCascadingChildren( $this.next( selTargets ) );
    } );
  }

  /**
   * Bind a keydown handler to drop down toggles that enables the user to interact with them using
   * keyboard input.
   *
   * @since 1.0.0
   *
   * @param {jquery} $containers - Collection of the containers which may contain drop down
   *   toggles.
   * @param {string} selToggles - Selector string for isolating drop down toggle elements within
   *   the provided collection of containers.
   * @param {string} activatingClass - CSS class that, when applied to a drop down toggle element,
   *   causes it to enter an activated state.
   */
  function bindKeydownHandlers( $containers, selToggles, activatingClass, selTargets ) {
    $containers.on( 'keydown', selToggles, function ( e ) {
      var $this;
      var reActivatingKeys = /Enter| /g;

      if ( reActivatingKeys.test( e.key ) ) {
        e.preventDefault();
        $this = $ ( this );
        $this.toggleClass( activatingClass );
        setUpToggleStatePermanence( $this, activatingClass );
        handleCascadingChildren( $this.next( selTargets ) );
      }
    } );
  }

  /**
   * During page load, set the expansion state of drop down toggle elements based on previous user
   * interactions during the session.
   *
   * @since 1.0.0
   *
   * @param {jquery} $toggles - Collection of the drop down toggle elements within the page.
   * @param {string} activatingClass - CSS class that, when applied to a drop down toggle element,
   *   causes it to enter an activated state.
   */
  function effectToggleStatePermanence( $toggles, activatingClass ) {
    var $this;
    var state;
    var thisFuncName = "effectDropDownTogglePermanence";
    var thisFuncDesc = "Upon page load, sets the expansion state of a drop down toggle element based on previous user interactions during the session.";

    $toggles.each( function() {
      $this = $( this );
      if ( $this[0].id ) {
        try {
          state = sessionStorage.getItem( $this[0].id );
          if ( state == "expanded" ) {
            $this.toggleClass( activatingClass );
          }
        } catch( e ) {
          $.logError( thisFileName, thisFuncName, thisFuncDesc, e.message );
        }
      } else {
        $.logError( thisFileName, thisFuncName, thisFuncDesc,
          "No ID was set for this drop down toggle element; thus, expansion state permanence cannot be effected." );
      }
    } );
  }

  /**
   * Handle the process of updating the layout of cascading children of a toggled container.
   *
   * @since 1.0.0
   *
   * @param {jquery} $container - The container that has been toggled.
   */
  function handleCascadingChildren( $container ) {
    var $cascaded = $container.find( '.cascaded-layout' );
    if ( $cascaded.length < 1 ) {
      return;
    }
    setTimeout( function() {
      $cascaded.masonry( 'layout' );
    }, 1000 );
  }

  /**
   * Apply a CSS class that keeps anchor highlighting styles from being applied to drop down
   * toggles.
   *
   * @since 1.0.0
   *
   * @param {jquery} $toggles - Collection of the drop down toggle elements within the page.
   */
  function preventAnchorHighlighting( $toggles ) {
    $toggles.addClass( 'no-anchor-highlighting' );
  }

  /**
   * Ensure that drop down toggles are properly included in the web page's tab order.
   *
   * @since 1.0.0
   *
   * @param {jquery} $toggles - Collection of the drop down toggle elements within the page.
   */
  function setTabIndices( $toggles ) {
    $toggles.attr( 'tabindex', 0 );
  }

  /**
   * Cause expansion state of drop down toggles to be remembered during the session.
   *
   * @since 1.0.0
   *
   * @param {jquery} $toggles - Collection of the drop down toggle elements within the page.
   * @param {string} activatingClass - CSS class that, when applied to a drop down toggle element,
   *   causes it to enter an activated state.
   */
  function setUpToggleStatePermanence( $toggle, activatingClass ) {
    var state;
    var thisFuncName = 'setUpToggleStatePermanence';
    var thisFuncDesc = 'Records the expansion state of a drop down toggle element in local' +
      ' storage to later effect permanence.';

    if ( $toggle[0].id ) {
      try {
        state = $toggle.hasClass( activatingClass ) ? 'expanded' : 'collapsed';
        sessionStorage.setItem( $toggle[0].id, state );
      } catch( e ) {
        $.logError( thisFileName, thisFuncName, thisFuncDesc, e.message );
      }
    } else {
      $.logError( thisFileName, thisFuncName, thisFuncDesc, 'No ID was set for this drop' +
        ' down toggle element; thus, expansion state permanence cannot be effected.' );
    }
  }

  return DaesaAccordions;
} )( jQuery, 'jQuery.DaesaAccordions.js' );

////////////////////////////////////////////////////////////////////////////////
// §3: INITIALIZATION of accordions

/**
 * Initialize drop down toggle elements to respond to user interaction.
 *
 * @since 1.0.0
 *
 * @param {string} selToggles - Selector string for isolating drop down toggle elements.
 * @param {string} selContainers - Selector string for isolating containers that may contain drop
 *   down toggle elements.
 * @param {string} activatingClass - CSS class that, when applied to a drop down toggle element,
 *   causes it to enter an activated state.
 */
function initDaesaAccordions( selToggles, selContainers, selTargets, activatingClass ) {
  const daesaAccordions = new DaesaAccordions( {
    toggles: selToggles,
    containers: selContainers,
    targets: selTargets
  }, activatingClass );
  daesaAccordions.initialize();
}

////////////////////////////////////////////////////////////////////////////////
// §4: Code execution TRIGGERED BY DOM LOADING

$( function () {
  const argsList = {};  // List of arguments that will be passed to functions
  let args;             // List of arguments currently being utilized ///////
  argsList.initDaesaAccordions = {
    selToggles: ".drop-down-toggle",
    selContainers: ".column",
    selTargets: ".toggled-panel",
    activatingClass: "activated",
  };
  args = argsList.initDaesaAccordions;
  initDaesaAccordions( args.selToggles, args.selContainers, args.selTargets, args.activatingClass );
} );

////////////////////////////////////////////////////////////////////////////////
// §5: Closure of IIFE

} )( jQuery, 'jQuery.DaesaAccordions.js' );
