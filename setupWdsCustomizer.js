/*!*************************************************************************************************
 * ▄▀▀▀ █▀▀▀▐▀█▀▌█  █ █▀▀▄▐   ▌█▀▀▄ ▄▀▀▀ ▄▀▀▀ █  █ ▄▀▀▀▐▀█▀▌▄▀▀▄ ▐▀▄▀▌▀█▀ ▀▀▀█ █▀▀▀ █▀▀▄      █ ▄▀▀▀
 * ▀▀▀█ █▀▀   █  █  █ █▄▄▀▐ █ ▌█  █ ▀▀▀█ █    █  █ ▀▀▀█  █  █  █ █ ▀ ▌ █   ▄▀  █▀▀  █▄▄▀   ▄  █ ▀▀▀█
 * ▀▀▀  ▀▀▀▀  █   ▀▀  █    ▀ ▀ ▀▀▀  ▀▀▀   ▀▀▀  ▀▀  ▀▀▀   █   ▀▀  █   ▀▀▀▀ █▄▄▄ ▀▀▀▀ ▀  ▀▄▀ ▀▄▄█ ▀▀▀
 *
 * Browser dev tools script for automating the rapidly specifying settings in the customizer of a
 *   DAESA website newly running the WDS theme.
 *
 * @version 0.1.0
 *
 * @author Daniel C. Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/main/setupWdsCustomizer.js
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

( function( $, iifeArgs ) {
  function findThemeCstmzr( slctr ) {
    if ( typeof slctr !== 'string' ) {
      throw new TypeError( `I was expecting a string for the selector used to find the WDS theme customizer interface in the DOM but received a parameter of type ${typeof slctr}.` );
    }
    const $themeCstmzr = $( slctr );
    if ( $themeCstmzr.length !== 1 ) {
      throw new Error( `I am not finding the DOM component I was expecting to see if we are on a WDS theme customizer page.` );
    }
    return $themeCstmzr;
  }

  async function goBack2ThemeCstmzr( $custPanel ) {
    const $custPanelBack = $custPanel.find( iifeArgs.sels.custPanelBack );
    $custPanelBack.trigger( 'click' );
    await wait4Browser( iifeArgs.dfltWaitTime );
  }

  async function goBack2PanelSctn( $custSctn ) {
    const $custSctnBack = $custSctn.find( iifeArgs.sels.custSctnBack );
    $custSctnBack.trigger( 'click' );
    await wait4Browser( iifeArgs.dfltWaitTime );
  }

  async function iifeMain() {
    console.log( `Beginning automated specification of WDS theme customizer settings at ${window.location.href}.` );
    const $themeCstmzr = findThemeCstmzr( iifeArgs.sels.themeCstmzr );
    await specThemeStgs( $themeCstmzr );
    // ...
    // await specContactInfo( $themeCstmzr );
    // await publishStgs( $themeCstmzr );
    console.log( `Theme settings have been published.` );
  }

  async function setSiteHdrOpts( $themeCstmzr ) {
    const $custSctn = $themeCstmzr.find( iifeArgs.sels.cpsSiteHdr );
    $custSctn.find( iifeArgs.sels.sectTitle ).trigger( 'click' );
    await wait4Browser( iifeArgs.dfltWaitTime );
    const $custSctnOpts = $themeCstmzr.find( iifeArgs.sels.cpsSiteHdrOpts );
    $custSctnOpts.find( iifeArgs.sels.optCtrlHideSiteHdrOnHome )
      .prop( 'checked', iifeArgs.stgs.hideSiteHdrOnHome );
    await wait4Browser( iifeArgs.dfltWaitTime );
    $custSctnOpts.find( iifeArgs.sels.optCtrlHideSubtitle )
      .prop( 'checked', iifeArgs.stgs.hideSiteSubtitle );
    await wait4Browser( iifeArgs.dfltWaitTime );
    await goBack2PanelSctn( $custSctnOpts );
  }

  async function setSiteFtrOpts( $themeCstmzr ) {
    const $custSctn = $themeCstmzr.find( iifeArgs.sels.cpsSiteFtr );
    $custSctn.find( iifeArgs.sels.sectTitle ).trigger( 'click' );
    await wait4Browser( iifeArgs.dfltWaitTime );
    const $custSctnOpts = $themeCstmzr.find( iifeArgs.sels.cpsSiteFtrOpts );
    $custSctnOpts.find( iifeArgs.sels.optCtrlFtrHead )
      .val( iifeArgs.stgs.siteFtrHead )
      .trigger( 'change' );
    await wait4Browser( iifeArgs.dfltWaitTime * 5 );
    $custSctnOpts.find( iifeArgs.sels.optCtrlFtrCapt )
      .val( iifeArgs.stgs.siteFtrCapt )
      .trigger( 'change' );
    await wait4Browser( iifeArgs.dfltWaitTime * 5 );
    await goBack2PanelSctn( $custSctnOpts );
  }

  async function setSiteNavOpts( $themeCstmzr ) {
    const $custSctn = $themeCstmzr.find( iifeArgs.sels.cpsSiteNav );
    $custSctn.find( iifeArgs.sels.sectTitle ).trigger( 'click' );
    await wait4Browser( iifeArgs.dfltWaitTime );
    const $custSctnOpts = $themeCstmzr.find( iifeArgs.sels.cpsSiteNavOpts );
    $custSctnOpts.find( iifeArgs.sels.optCtrlNavColor )
      .val( iifeArgs.stgs.navColor )
      .trigger( 'change' );
    await wait4Browser( iifeArgs.dfltWaitTime * 5 );
    await goBack2PanelSctn( $custSctnOpts );
  }

  async function specThemeStgs( $themeCstmzr ) {
    const $themeStgs = $themeCstmzr.find( iifeArgs.sels.themeStgs );
    $themeStgs.find( iifeArgs.sels.sectTitle).trigger( 'click' );
    await wait4Browser( iifeArgs.dfltWaitTime );
    await setSiteHdrOpts( $themeCstmzr );
    await setSiteFtrOpts( $themeCstmzr );
    await setSiteNavOpts( $themeCstmzr );
    const $custPanel = $themeCstmzr.find( iifeArgs.sels.cpThemeStgs );
    await goBack2ThemeCstmzr( $custPanel );
  }

  async function wait4Browser( waitTime ) {
    return new Promise( resolve => {
      setTimeout( () => { resolve() }, waitTime );
    } );
  }

  iifeMain();
} )( jQuery, {
  dfltWaitTime: 500,
  sels: {
    themeCstmzr: '.wp-customizer #customize-controls',
    themeStgs: '#accordion-panel-wds_theme_panel',
    cpThemeStgs: '#sub-accordion-panel-wds_theme_panel',
    cpsSiteHdr: '#accordion-section-wsu_sote_header_section',
    cpsSiteHdrOpts: '#sub-accordion-section-wsu_sote_header_section',
    optCtrlHideSiteHdrOnHome: '#_customize-input-wsu_wds_site_header_home_hide_control',
    optCtrlHideSubtitle: '#_customize-input-wsu_wds_site_header_subtitle_hide_control',
    cpsSiteFtr: '#accordion-section-wsu_sote_footer_section',
    cpsSiteFtrOpts: '#sub-accordion-section-wsu_sote_footer_section',
    optCtrlFtrHead: '#_customize-input-wsu_wds_site_footer_heading_control',
    optCtrlFtrCapt: '#_customize-input-wsu_wds_site_footer_caption_control',
    cpsSiteNav: '#accordion-section-wsu_site_navigation_section',
    cpsSiteNavOpts: '#accordion-section-wsu_site_navigation_section',
    optCtrlNavColor: '#_customize-input-wsu_wds_site_navigation_color_control',
    wdsTemplates: '#accordion-panel-wds_template_panel',
    wdsAdvStgs: '#accordion-section-wsu_advanced_options',
    custPanelBack: '.customize-panel-back',
    custSctnBack: '.customize-section-back',
    sectTitle: '.accordion-section-title',
  },
  stgs: {
    hideSiteHdrOnHome: true,
    hideSiteSubtitle: true,
    siteFtrHead: 'Transfer Center for Policy & Resources',
    siteFtrCapt: 'Division of Academic Engagement and Student Achievement, Office of the Provost and Executive Vice President',
    navColor: 'horizontal', // WDS bug; should be "Dark"
    twitterUrl: 'https://twitter.com/WSU_DAESA',
    facebookUrl: 'https://www.facebook.com/WSUDAESA',
    instagramUrl: 'https://www.instagram.com/wsu_daesa/',
    youtubeUrl: 'https://www.youtube.com/@wsudaesacommunications7832',
    contactTitle: 'DAESA, Washington State University',
    contactAddrL1: 'P.O. Box 641046',
    contactCity: 'Pullman',
    contactState: 'WA',
    contactZip: '99164-1046',
    contactPhone: undefined,
    contactEmail: 'daesa.provost@wsu.edu',
  },
} );
