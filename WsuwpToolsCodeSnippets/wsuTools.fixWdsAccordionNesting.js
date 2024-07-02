/*!***
 * ▓▒▒▒ wsuTools.fixWds ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒▓▓▓▓▓
 * ▓▒▒▒  ▄▀▀▄ ▄▀▀▀ ▄▀▀▀ ▄▀▀▄ █▀▀▄ █▀▀▄ ▀█▀ ▄▀▀▄ ▐▀▀▄ ▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒▓▓▓▓
 * ▓▓▒▒  █▄▄█ █    █    █  █ █▄▄▀ █  █  █  █  █ █  ▐ ▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒▓▓▓▓
 * ▓▓▒▒  █  ▀  ▀▀▀  ▀▀▀  ▀▀  ▀  ▀▄▀▀▀  ▀▀▀  ▀▀  ▀  ▐ ▒▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒▓▓▓
 * ▓▓▓▒  Nesting.mjs ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒▓▓▓
 *
 * wsuTools.fixWdsAccordionNesting.js - v0.0.3
 *
 * Provide missing collapse functionality to nested accordions used on WDS 2 or
 *   3 themed WSUWP websites.
 *
 * By Daniel C. Rieck (daniel.rieck@wsu.edu)
 *   [https://github.com/invokeImmediately/]
 *
 * Copyright (c) 2024 Washington State University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the “Software”), to
 *   deal in the Software without restriction, including without limitation the
 *   rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *   sell copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *   DEALINGS IN THE SOFTWARE.
 ****/

(function($) {

  /**
   * If necessary, use CSS classes to collapse an expanded WDS accordion
   *   component.
   */
  function collapseNestedAccrdn($accordion) {
    if ($accordion.hasClass('wsu-accordion--open')) {
      $accordion.removeClass('wsu-accordion--open');
    }
  }

  /**
   * Enhance event handling to fix issues with collapsible behavior of WDS
   *   accordion components controlled by user click interactions. (Based on
   *   testing, it is only click events that are broken.)
   */
  function fixNestedAccrdnTggls($main) {
    // ·> Set up click event handling on WDS accordions nested inside of other
    // ·<   accordions
    $main.on(
      'click',
      '.wsu-accordion .wsu-accordion .wsu-accordion--toggle',
      toggleNestedAccordionGracefully
    );

    // ·> Set up click event handling on accordions nested inside of WDS card
    // ·<   blocks.
    $main.on(
      'click',
      '.wsu-card .wsu-accordion .wsu-accordion--toggle',
      toggleNestedAccordionGracefully
    );

    // ·> Set up click event handling on child elements of accordion toggle
    // ·    buttons. (Testing has shown that the upstream event handling on such
    // ·    “container buttons” will not be applied to elements contained by the
    // ·<   button.)
    $main.on(
      'click',
      '.wsu-accordion .wsu-accordion--toggle strong',
      toggleAccordionWithContainerButton
    );
  }

  /**
   * Begin IIFE execution by waiting for the DOM to load and then fixing the
   *   interactive behavior of any nested accordions present in the document.
   */
  function iifeMain() {
    $(document).ready(function() {
      $('#wsu-content').each(function() {
        const $main = $(this);
        fixNestedAccrdnTggls($main);
      });
    });
  }

  /**
   * Signal to screen readers that a tested accordion has been expanded via
   *   WAI-ARIA.
   */
  function sgnlExpandedNestedAccrdn($toggle) {
    if ($toggle.attr('aria-expanded') != 'true') {
      $toggle.attr('aria-expanded', 'true');
    }
  }

  /**
   * Handle click events targeting elements contained in the toggle button of an
   *   accordion.
   */
  function toggleAccordionWithContainerButton() {
    const $toggle = $(this).parents('.wsu-accordion--toggle').first();
    $prntAccrdn = $toggle.parents('.wsu-accordion').first();
    $toggle.trigger('click');
  }

  /**
   * Handle a click event targeting the toggle button of a nested accordion.
   *   Only modify the expansion state of the accordion if necessary.
   */
  function toggleNestedAccordionGracefully() {
    const $toggle = $(this);
    $prntAccrdn = $toggle.parents('.wsu-accordion').first();
    if ($prntAccrdn.hasClass('wsu-accordion--open')) {
        setTimeout(collapseNestedAccrdn, 200, $prntAccrdn);
    } else {
        setTimeout(sgnlExpandedNestedAccrdn, 200, $toggle);
    }
  }
  
  iifeMain();
})(jQuery);
