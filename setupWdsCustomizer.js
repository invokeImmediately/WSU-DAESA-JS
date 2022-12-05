/*!*************************************************************************************************
 * ▄▀▀▀ █▀▀▀▐▀█▀▌█  █ █▀▀▄▐   ▌█▀▀▄ ▄▀▀▀ ▄▀▀▀ █  █ ▄▀▀▀▐▀█▀▌▄▀▀▄ ▐▀▄▀▌▀█▀ ▀▀▀█ █▀▀▀ █▀▀▄      █ ▄▀▀▀
 * ▀▀▀█ █▀▀   █  █  █ █▄▄▀▐ █ ▌█  █ ▀▀▀█ █    █  █ ▀▀▀█  █  █  █ █ ▀ ▌ █   ▄▀  █▀▀  █▄▄▀   ▄  █ ▀▀▀█
 * ▀▀▀  ▀▀▀▀  █   ▀▀  █    ▀ ▀ ▀▀▀  ▀▀▀   ▀▀▀  ▀▀  ▀▀▀   █   ▀▀  █   ▀▀▀▀ █▄▄▄ ▀▀▀▀ ▀  ▀▄▀ ▀▄▄█ ▀▀▀
 *
 * Browser dev tools script for automating the rapidly specifying settings in the customizer of a DAESA website newly running the WDS theme.
 *
 * @version 0.1.1
 *
 * @author Daniel C. Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/main/setupWdsCustomizer.js
 * @license MIT - Copyright (c) 2022 Washington State University
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *   The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *   THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **************************************************************************************************/

( function( $, iifeArgs ) {
  function findThemeCustomizer( selector ) {
    if ( typeof selector !== 'string' ) {
      throw new TypeError( `I was expecting a string for the selector used to find the WDS theme customizer interface in the DOM but received a parameter of type ${typeof selector}.` );
    }
    const $themeCustomizer = $( selector );
    if ( $themeCustomizer.length !== 1 ) {
      throw new Error( `I am not finding the DOM component I was expecting to see if we are on a WDS theme customizer page.` );
    }
    return $themeCustomizer;
  }

  async function goBackToThemeCustomizer( $customizerPanel ) {
    const $panelBackButton = $customizerPanel.find( iifeArgs.selectors.panelBackButton );
    $panelBackButton.trigger( 'click' );
    await wait4Browser( iifeArgs.defaultWaitTime );
  }

  async function goBack2PanelSctn( $custSctn ) {
    const $panelSectionBackButton = $custSctn.find( iifeArgs.selectors.panelSectionBackButton );
    $panelSectionBackButton.trigger( 'click' );
    await wait4Browser( iifeArgs.defaultWaitTime );
  }

  async function iifeMain() {
    console.log( `Beginning automated specification of WDS theme customizer settings at ${window.location.href}.` );
    const $themeCustomizer = findThemeCustomizer( iifeArgs.selectors.themeCustomizer );
    await specThemeStgs( $themeCustomizer );
    // ...
    // await specContactInfo( $themeCustomizer );
    // await publishStgs( $themeCustomizer );
    console.log( `Theme settings have been published.` );
  }

  async function setSiteHdrOpts( $themeCustomizer ) {
    const $custSctn = $themeCustomizer.find( iifeArgs.selectors.sectionSiteHeader );
    $custSctn.find( iifeArgs.selectors.sectionTitle ).trigger( 'click' );
    await wait4Browser( iifeArgs.defaultWaitTime );
    const $custSctnOpts = $themeCustomizer.find( iifeArgs.selectors.sectionSiteHeaderOptions );
    $custSctnOpts.find( iifeArgs.selectors.optionHideSiteHeaderOnHome )
      .prop( 'checked', iifeArgs.settings.hideSiteHeaderOnHome );
    await wait4Browser( iifeArgs.defaultWaitTime );
    $custSctnOpts.find( iifeArgs.selectors.optionHideSubtitle )
      .prop( 'checked', iifeArgs.settings.hideSiteSubtitle );
    await wait4Browser( iifeArgs.defaultWaitTime );
    await goBack2PanelSctn( $custSctnOpts );
  }

  async function setSiteFtrOpts( $themeCustomizer ) {
    const $custSctn = $themeCustomizer.find( iifeArgs.selectors.sectionSiteFooter );
    $custSctn.find( iifeArgs.selectors.sectionTitle ).trigger( 'click' );
    await wait4Browser( iifeArgs.defaultWaitTime );
    const $custSctnOpts = $themeCustomizer.find( iifeArgs.selectors.sectionSiteFooterOptions );
    $custSctnOpts.find( iifeArgs.selectors.optionFooterHeading )
      .val( iifeArgs.settings.siteFooterHeading )
      .trigger( 'change' );
    await wait4Browser( iifeArgs.defaultWaitTime * 5 );
    $custSctnOpts.find( iifeArgs.selectors.optionFooterCaption )
      .val( iifeArgs.settings.siteFooterCaption )
      .trigger( 'change' );
    await wait4Browser( iifeArgs.defaultWaitTime * 5 );
    await goBack2PanelSctn( $custSctnOpts );
  }

  async function setSiteNavOpts( $themeCustomizer ) {
    const $custSctn = $themeCustomizer.find( iifeArgs.selectors.sectionSiteNav );
    $custSctn.find( iifeArgs.selectors.sectionTitle ).trigger( 'click' );
    await wait4Browser( iifeArgs.defaultWaitTime );
    const $custSctnOpts = $themeCustomizer.find( iifeArgs.selectors.sectionSiteNavOptions );
    $custSctnOpts.find( iifeArgs.selectors.optionNavColor )
      .val( iifeArgs.settings.navColor )
      .trigger( 'change' );
    await wait4Browser( iifeArgs.defaultWaitTime * 5 );
    await goBack2PanelSctn( $custSctnOpts );
  }

  async function specThemeStgs( $themeCustomizer ) {
    const $themeSettings = $themeCustomizer.find( iifeArgs.selectors.themeSettings );
    $themeSettings.find( iifeArgs.selectors.sectionTitle).trigger( 'click' );
    await wait4Browser( iifeArgs.defaultWaitTime );
    await setSiteHdrOpts( $themeCustomizer );
    await setSiteFtrOpts( $themeCustomizer );
    await setSiteNavOpts( $themeCustomizer );
    const $customizerPanel = $themeCustomizer.find( iifeArgs.selectors.panelThemeSettings );
    await goBackToThemeCustomizer( $customizerPanel );
  }

  async function wait4Browser( waitTime ) {
    return new Promise( resolve => {
      setTimeout( () => { resolve() }, waitTime );
    } );
  }

  iifeMain();
} )( jQuery, {
  defaultWaitTime: 500,
  selectors: {
    themeCustomizer: '.wp-customizer #customize-controls',
    themeSettings: '#accordion-panel-wds_theme_panel',
    panelThemeSettings: '#sub-accordion-panel-wds_theme_panel',
    sectionSiteHeader: '#accordion-section-wsu_sote_header_section',
    sectionSiteHeaderOptions: '#sub-accordion-section-wsu_sote_header_section',
    optionHideSiteHeaderOnHome: '#_customize-input-wsu_wds_site_header_home_hide_control',
    optionHideSubtitle: '#_customize-input-wsu_wds_site_header_subtitle_hide_control',
    sectionSiteFooter: '#accordion-section-wsu_sote_footer_section',
    sectionSiteFooterOptions: '#sub-accordion-section-wsu_sote_footer_section',
    optionFooterHeading: '#_customize-input-wsu_wds_site_footer_heading_control',
    optionFooterCaption: '#_customize-input-wsu_wds_site_footer_caption_control',
    sectionSiteNav: '#accordion-section-wsu_site_navigation_section',
    sectionSiteNavOptions: '#sub-accordion-section-wsu_site_navigation_section',
    optionNavColor: '#_customize-input-wsu_wds_site_navigation_color_control',
    wdsTemplates: '#accordion-panel-wds_template_panel',
    wdsAdvancedSettings: '#accordion-section-wsu_advanced_options',
    panelBackButton: '.customize-panel-back',
    panelSectionBackButton: '.customize-section-back',
    sectionTitle: '.accordion-section-title',
  },
  settings: {
    hideSiteHeaderOnHome: true,
    hideSiteSubtitle: true,
    siteFooterHeading: 'Transfer Center for Policy & Resources',
    siteFooterCaption: 'Division of Academic Engagement and Student Achievement, Office of the Provost and Executive Vice President',
    navColor: 'horizontal', // WDS bug; should be "Dark"
    twitterUrl: 'https://twitter.com/WSU_DAESA',
    facebookUrl: 'https://www.facebook.com/WSUDAESA',
    instagramUrl: 'https://www.instagram.com/wsu_daesa/',
    youtubeUrl: 'https://www.youtube.com/@wsudaesacommunications7832',
    contactTitle: 'DAESA, Washington State University',
    contactAddressLine1: 'P.O. Box 641046',
    contactCity: 'Pullman',
    contactState: 'WA',
    contactZipcode: '99164-1046',
    contactPhone: undefined,
    contactEmail: 'daesa.provost@wsu.edu',
  },
} );
