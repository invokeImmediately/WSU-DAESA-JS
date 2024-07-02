/*!***
 * ▓▒▒▒ wsuTools.fixWds ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒▓▓▓▓▓
 * ▓▒▒▒  ▄▀▀▄ ▄▀▀▀ ▄▀▀▀ ▄▀▀▄ █▀▀▄ █▀▀▄ ▀█▀ ▄▀▀▄ ▐▀▀▄ ▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒▓▓▓▓
 * ▓▓▒▒  █▄▄█ █    █    █  █ █▄▄▀ █  █  █  █  █ █  ▐ ▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒▓▓▓▓
 * ▓▓▒▒  █  ▀  ▀▀▀  ▀▀▀  ▀▀  ▀  ▀▄▀▀▀  ▀▀▀  ▀▀  ▀  ▐ ▒▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒▓▓▓
 * ▓▓▓▒  Nesting.mjs ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▒▓▒▒▓▒▒▓▓▒▒▓▓▒▒▓▓▒▒▓▓▓
 *
 * wsuTools.fixWdsAccordionNesting.js - v0.1.0
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
   * Update the ID attributes of the HTML elements that make up WDS accordion
   *   blocks so they are unique. (This fixes is an upstream issue where where
   *   ID attributes associated with the title, toggle button, and content
   *   container are the incorrectly same between all accordions.)
   */
  function fixDuplicateIdsInAccordions($main) {
    const $accordions = $main.find('.wsu-accordion');
    const numAccordions = $accordions.length;
    $accordions.each(function(index) {
      // ·> Only accordions beyond the first one that appears within the
      // ·    document have a possibility of containing duplicate IDs.
      if (index==0) {
        return;
      }

      // Isolate the element serving as the title of the accordion.
      const $accordion = $(this);
      const $title = $accordion.find('.wsu-accordion__title').first();
      const titleId = $title.attr('id');

      // ·> Return early if the ID attribute of the accordion title is not
      // ·<   showing the expected duplicate value.
      if (titleId != 'unique-id-1__title') {
        return;
      }

      // ·> Reform the ID attribute for the title so it is unique. Follow the
      // ·<   originally intended but unimplemented naming pattern.
      const titleNewId = titleId.replace(/[0-9]+/, index + 1);
      $title.attr('id', titleNewId);

      // ·> Reform the ID attribute for the element serving as the content
      // ·    container for the accordion so it is unique. Follow the originally // ·<   intended but unimplemented naming pattern.
      const $content = $accordion.find('.wsu-accordion__content').first();
      const contentId = $content.attr('id');
      const contentNewId = contentId.replace(/[0-9]+/, index + 1);
      $content.attr('id', contentNewId);

      // ·> Update the setting for the container's aria-labelledby attribute to
      // ·<   match the title's new, unique ID.
      $content.attr('aria-labelledby', titleNewId);

      // ·> Update the setting for the accordion toggle button's aria-controls
      // ·<   attribute to match the content container's new, unique ID.
      const $button = $accordion.find('.wsu-accordion--toggle').first();
      $button.attr('aria-controls', contentNewId);
    });
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
   * Begin IIFE execution by waiting for the DOM to load and then fixing issues
   *   with accordions. First, fix any duplicate ID attributes of the HTML
   *   elements that make up accordions. Then fix the interactive behavior of
   *   any nested accordions present in the document.
   */
  function iifeMain() {
    $(document).ready(function() {
      $('#wsu-content').each(function() {
        const $main = $(this);
        fixDuplicateIdsInAccordions($main);
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
