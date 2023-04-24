/*!*****************************************************************************
 * PrintWp █▀▀▄ ▄▀▀▄ █▀▀▀ █▀▀▀ █▀▀▄ █▀▀▀▐▀█▀▌▄▀▀▄ ▀█▀ █    ▄▀▀▀ · · · · · · · ·
 *  · · ·  █▄▄▀ █▄▄█ █ ▀▄ █▀▀  █  █ █▀▀   █  █▄▄█  █  █  ▄ ▀▀▀█  · · · · · · ·
 * · · · · █    █  ▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀  ▀▀▀▀  █  █  ▀ ▀▀▀ ▀▀▀  ▀▀▀  .devTools.js  ·
 * ·············································································
 *
 * Browser dev tools script that leverages jQuery to quickly extract data about the page-type posts that are present in a WSUWP website's administration area.
 *
 * To run the script, first navigate to the "All Pages" section of a WordPress admin dashboard, and then the paste it in the JavaScript console of your browser's client and hit enter. The script will start keeping its own record of data of interest about the pages being maintained in WordPress. (The data is stored in the web browser's interface and is therefore a temporary copy associated only with your current browsing session.) Moreover, the script will initially navigate to the first page of the "All Pages" interface if not already there, and when it is done scanning a page, it will automatically move to the next page of the table. Once the next pages loads, simply press Up + Enter to run the script again for that new page; repeat until each page of the table has been scanned. Finally, note that once the last page is reached, the output will be printed to the JavaScript console as a tab separated value table that can be pasted into a text editor and imported to Excel for further analysis.
 *
 * @version 0.1.1
 *
 * @author Daniel C. Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/main/printWpPageDetails.devTools.js
 * @license MIT - Copyright (c) 2023 Washington State University
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *   The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *   THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 ******************************************************************************/

( function( $, iifeArgs ) {

  function createDictionaryFromSessionData( dataOnPages ) {
    const dictionary = {};
    for ( i = 0; i < dataOnPages.length; i++ ) {
      dictionary[ dataOnPages[ i ].postId ] = true;
    }
    return dictionary;
  }

  function evaluateScanningProgress( dataOnPages ) {
    setSessionDataOnPages( dataOnPages );
    if ( !isWsuwpEditorOnLastPage() ) {
      navigateToNextWsuwpPage();
      return;
    }
    printSessionDataOnPages( dataOnPages );
  }

  function findWpListTable( selector ) {
    const $pageList = $( selector );
    // if(); TODO: Error handling
    return $pageList;
  }

  function getSessionDataOnPages() {
    const pagesDataString = window.sessionStorage.getItem( iifeArgs.sessionDataKey );
    if ( pagesDataString === null && isWsuwpEditorOnFirstPage() ) {
      return [];
    } else if ( pagesDataString === null ) {
      navigateWsuwpEditorToFirstPage();
    }
    const pagesData = JSON.parse( pagesDataString );
    return pagesData;
  }

  async function iifeMain() {
    console.log( `Scanning page at ${window.location.href} for information about WSUWP posts.` );
    let dataOnPages = getSessionDataOnPages();
    const $pageList = findWpListTable( iifeArgs.selectors.wpListTable );
    dataOnPages = scanPageListForData( $pageList, dataOnPages );
    await evaluateScanningProgress( dataOnPages );
  }

  function isWsuwpEditorOnFirstPage() {
    const $tableNav = $( iifeArgs.selectors.tableNav );
    const $currentPageIndicator = $tableNav.find( iifeArgs.selectors.currentPageIndicator );
    const currentPage = parseInt( $currentPageIndicator.val(), 10 );
    return currentPage === 1;
  }

  function isWsuwpEditorOnLastPage() {
    const $tableNav = $( iifeArgs.selectors.tableNav );
    const $currentPageIndicator = $tableNav.find( iifeArgs.selectors.currentPageIndicator );
    const currentPage = parseInt( $currentPageIndicator.val(), 10 );
    const $totalPagesIndicator = $tableNav.find( iifeArgs.selectors.totalPagesIndicator );
    const lastPage = parseInt( $totalPagesIndicator.text(), 10 );
    console.log( `On page ${currentPage} of ${lastPage}.` )
    return currentPage === lastPage;
  }

  async function makeProcessWait( waitTime ) {
    return new Promise( resolve => {
      setTimeout( () => { resolve() }, waitTime );
    } );
  }

  function navigateWsuwpEditorToFirstPage() {
    const $tableNav = $( iifeArgs.selectors.tableNav );
    let $navButtonToUse = $tableNav.find( iifeArgs.selectors.firstPageButton );
    if ( $navButtonToUse.length === 0 ) {
      $navButtonToUse = $tableNav.find( iifeArgs.selectors.prevPageButton );
    }
    $navButtonToUse[ 0 ].click();
    makeProcessWait( iifeArgs.waitTime );
  }

  function navigateToNextWsuwpPage() {
    const $tableNav = $( iifeArgs.selectors.tableNav );
    const $nextPageButton = $tableNav.find( iifeArgs.selectors.nextPageButton );
    $nextPageButton[ 0 ].click();
  }

  function printSessionDataOnPages( dataOnPages ) {
    let printedOutput = 'Page ID\tTitle\tAuthor\tPost Date Type\tPost Date\tPost Date Time\tLast Updated By\tLast Updated Date\tLast Updated Time\n';
    for( i = 0; i < dataOnPages.length; i++ ) {
      printedOutput += `${dataOnPages[i].postId}\t${dataOnPages[i].pageTitle}\t${dataOnPages[i].author}\t${dataOnPages[i].dateType}\t${dataOnPages[i].dateValue}\t${dataOnPages[i].dateTime}\t${dataOnPages[i].lastUpdatedBy}\t${dataOnPages[i].lastUpdatedDate}\t${dataOnPages[i].lastUpdatedTime}\n`;
    }
    console.log( printedOutput );
  }

  function scanPageListForData( $pageList, dataOnPages ) {
    const postDictionary = createDictionaryFromSessionData( dataOnPages );
    const $pageRows = $pageList.first().find( iifeArgs.selectors.pageDataRows );
    $pageRows.each( function() {
      const $row = $( this );
      const pageData = {};
      const postId = $row.attr( "id" ).match( iifeArgs.regEx.postId )[ 1 ];
      if ( postId in postDictionary ) {
        return;
      } else {
        postDictionary[ postId ] = true;
      }
      pageData.postId = postId;
      pageData.pageTitle = $row.find( iifeArgs.selectors.rowTitle ).text();
      pageData.author = $row.find( iifeArgs.selectors.pageAuthor ).text();
      const dateHtml = $row.find( iifeArgs.selectors.pageDate ).html();
      const dateRegEx = dateHtml.match( iifeArgs.regEx.updateDate );
      pageData.dateType = dateRegEx[ 1 ];
      pageData.dateValue = dateRegEx[ 2 ];
      pageData.dateTime = dateRegEx[ 3 ];
      const lastUpdatedHtml = $row.find( iifeArgs.selectors.pageLastUpdated ).html();
      const lastUpdatedRegEx = lastUpdatedHtml.match( iifeArgs.regEx.updateDate );
      pageData.lastUpdatedBy = lastUpdatedRegEx[ 1 ];
      pageData.lastUpdatedDate = lastUpdatedRegEx[ 2 ];
      pageData.lastUpdatedTime = lastUpdatedRegEx[ 3 ];
      dataOnPages.push( pageData );
    } );
    return dataOnPages;
  }

  function setSessionDataOnPages( dataOnPages ) {
    window.sessionStorage.setItem( iifeArgs.sessionDataKey, JSON.stringify( dataOnPages ) );
  }

  iifeMain();

} )(
  jQuery,
  {
    regEx: {
      updateDate: /(.*)<br>(.+) at (.+)/,
      postId: /post-([0-9]+)/,
    },
    selectors: {
      currentPageIndicator: '#current-page-selector',
      firstPageButton: '.first-page.button',
      nextPageButton: '.next-page.button',
      pageAuthor: '.author',
      pageDataRows: 'tr.type-page',
      pageDate: '.date',
      pageLastUpdated: '.wsu_last_updated',
      prevPageButton: '.prev-page.button',
      rowTitle: '.row-title',
      tableNav: '#wpbody-content #posts-filter .tablenav.top .tablenav-pages',
      totalPagesIndicator: '.total-pages',
      wpListTable: '#wpbody-content #posts-filter .wp-list-table',
    },
    sessionDataKey: 'printWpPageDetails.devTools.js.wsuwpDataOnSitePages',
    waitTime: 333,
  },
);
