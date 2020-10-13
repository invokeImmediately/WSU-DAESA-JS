/*!*************************************************************************************************
 * github.com/invokeImmediately/WSU-UE---JS/gulpBuider.js
 ***************************************************************************************************
 * SUMMARY: Node module used to build CSS and JS modules via gulp.
 *
 * AUTHOR: Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 *
 * LICENSE: MIT - Copyright (c) 2020 Washington State University
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 *   and associated documentation files (the “Software”), to deal in the Software without
 *   restriction, including without limitation the rights to use, copy, modify, merge, publish,
 *   distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
 *   Software is furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included in all copies or
 *   substantial portions of the Software.
 *
 *   THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 *   BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *   NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 *   DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **************************************************************************************************/

////////////////////////////////////////////////////////////////////////////////////////////////////
// TABLE OF CONTENTS
// -----------------
// §1: Importing of Node modules...............................................................46
// §2: Exported Class Declarations.............................................................63
//   §2.1: module.exports.CssBuildSettings.....................................................66
//   §2.2: module.exports.JsBuildSettings.....................................................200
// §3: Exported Function Declarations.........................................................209
//   §3.1: module.exports.fixFileHeaderComments...............................................212
//   §3.2: module.exports.setUpCssBuildTask...................................................238
//   §3.3: module.exports.setUpDefaultTask....................................................344
//   §3.4: module.exports.setUpHelpTask.......................................................351
//   §3.5: module.exports.setUpJsBuildTask....................................................372
// §4: Support functions......................................................................413
//   §4.1: logUpdate..........................................................................416
////////////////////////////////////////////////////////////////////////////////////////////////////

'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////
// §1: Importing of Node modules

// Import node modules that are dependencies in our gulp tasks.
const cleanCss = require( 'gulp-clean-css' );
const concat = require( 'gulp-concat' );
const extName = require( 'gulp-extname' );
const gcmq = require( 'gulp-group-css-media-queries' );
const gulp = require( 'gulp' );
const insert = require( 'gulp-insert' );
const insertLines = require( 'gulp-insert-lines' );
const lessc = require( 'gulp-less' );
const notify = require( 'gulp-notify' );
const replace = require( 'gulp-replace' );
const terser = require( 'gulp-terser' );
const pump = require( 'pump' );

////////////////////////////////////////////////////////////////////////////////////////////////////
// §2: Exported Class Declarations

////////
// §2.1: module.exports.CssBuildSettings

/**
 * Collection of settings needed to build CSS files for OUE websites using gulp.
 *
 * @todo Switch to an ES6-based class implementation.
 *
 * @param {RegExp} settings.commentRemovalNeedle - Used to find and remove impermanent comments the
 *   in unminified source file.
 * @param {String} dependenciesPath - Location of Less build dependencies common to all OUE
 *   websites.
 * @param {String} fontImportStr - CSS @import rule for importing additional functions that will be
 *   prepended to the built stylesheet.
 * @param {String} insertingMediaQuerySectionHeader - Comment block for inline documentation to be
 *   inserted before the section of the built CSS file that will contain media queries.
 * @param {String} minCssFileExtension - Extension to be utilized on the minified built CSS file.
 * @param {String} minCssFileHeaderStr - File header comment for inline documentation to be
 *   prepended to the built CSS file. (Should be structured as a permanent comment.)
 */
module.exports.CssBuildSettings = class CssBuildSettings {
	constructor( settings ) {
		// Begin checking structure of settings argument, which should be an object.
		if ( typeof settings !== "object" ) {
			throw new TypeError( 'Attempted to construct a CSS Build Settings object using an ' +
				'improperly formed settings argument.' );
		}

		// Set an error message prefix that is used to construct all type errors appearing below.
		const typeErrPref = 'Attempted to construct a CSS Build Settings object without supplying ' +
			'a properly formed ';

		// Check the integrity of the setting that controls how comments are removed. If it checks
		//  out, copy the setting to this instance.
		if ( !settings.hasOwnProperty( 'commentRemovalNeedle' ) &&
			typeof settings.commentRemovalNeedle !== 'object' &&
			settings.commentRemovalNeedle instanceof RegExp !== true )
		{
			throw new TypeError( typeErrPref + 'regular expression for identifying comments for ' +
				'removal during minification.' );
		}
		this.commentRemovalNeedle = settings.commentRemovalNeedle;

		// Check the integrity of the setting that records the path to development dependencies. If it
		//  checks out, copy the setting to this instance.
		if ( !settings.hasOwnProperty( 'dependenciesPath' ) &&
			typeof settings.dependenciesPath !== 'string' )
		{
			throw new TypeError( typeErrPref + 'string containing the path to dev dependencies.' );
		}
		this.dependenciesPath = settings.dependenciesPath;

		// Check the integrity of the setting that stores the build destination path. If it checks out,
		//  copy the setting to this instance.
		if ( !settings.hasOwnProperty( 'destFolder' ) &&
			typeof settings.destFolder !== 'string' )
		{
			throw new TypeError( typeErrPref + 'string containing the path to the destination ' +
				'folder for storing CSS builds.' );
		}
		this.destFolder = settings.destFolder;

		// Check the integrity of the setting containing the import directive that will be prepended to
		//  the CSS build. If it checks out, copy the setting to this instance.
		if ( !settings.hasOwnProperty( 'fontImportStr' ) &&
			typeof settings.fontImportStr !== 'string' )
		{
			throw new TypeError( typeErrPref + 'string containing the path to the destination folder ' +
				'for storing CSS builds.' );
		}
		this.fontImportStr = settings.fontImportStr;

		// Check the integrity of the setting for inserting the inline documentation for marking the
		//  media query section of the CSS build. If it checks out, copy the setting to this instance.
		if ( !settings.hasOwnProperty( 'insertingMediaQuerySectionHeader' ) &&
			typeof settings.insertingMediaQuerySectionHeader !== 'object' &&
			!settings.insertingMediaQuerySectionHeader.hasOwnProperty( 'before' ) &&
			typeof settings.insertingMediaQuerySectionHeader.before !== 'object' &&
			settings.insertingMediaQuerySectionHeader.before instanceof RegExp !== true &&
			!settings.insertingMediaQuerySectionHeader.hasOwnProperty( 'lineBefore' ) &&
			typeof settings.insertingMediaQuerySectionHeader.lineBefore !== 'string' )
		{
			throw new TypeError( typeErrPref + 'object with the right properties for inserting the ' +
				'media query .' );
		}
		this.insertingMediaQuerySectionHeader = settings.insertingMediaQuerySectionHeader;

		// Check the integrity of the setting containing inline documentation for marking the media
		//  query section of the CSS build. If it checks out, copy the setting to this instance.
		if ( !settings.hasOwnProperty( 'minCssFileExtension' ) &&
			typeof settings.minCssFileExtension !== 'string' )
		{
			throw new TypeError( typeErrPref + 'string containing the file extension for the minified ' +
				'CSS build.' );
		}
		this.minCssFileExtension = settings.minCssFileExtension;

		// Check the integrity of the setting storing the optional file header comment for the CSS
		//  build. If it checks out, copy the setting to this instance.
		if ( !settings.hasOwnProperty( 'minCssFileHeaderStr' ) &&
			typeof settings.minCssFileHeaderStr !== 'string' )
		{
			throw new TypeError( typeErrPref + 'string containing the optional file header comment ' +
				'to be prepended to the minified CSS build.' );
		}
		this.minCssFileHeaderStr = settings.minCssFileHeaderStr;

		// Check the integrity of the setting that contains the path to the source file serving as the
		//  build entry point. If it checks out, copy the setting to this instance.
		if ( !settings.hasOwnProperty( 'sourceFile' ) &&
			typeof settings.sourceFile !== 'string' )
		{
			throw new TypeError( typeErrPref + 'string containing the optional file header comment ' +
				'to be prepended to the minified CSS build.' );
		}
		this.sourceFile = settings.sourceFile;

		// If present, check the integrity of the setting that records the path to the optional source
		//  file containing CSS written by other DAESA staff. If it is present and checks out, copy the
		//  setting to this instance.
		if ( settings.hasOwnProperty( 'staffAddinsFile' ) &&
			typeof settings.staffAddinsFile !== 'string' )
		{
			throw new TypeError( typeErrPref + 'string containing a path to the optional file ' +
				'containing CSS written by additional DAESA staff.' );
		} else if ( !settings.hasOwnProperty( 'staffAddinsFile' ) ) {
			settings.staffAddInsFile = '';
		}
		this.staffAddinsFile = settings.staffAddinsFile;

		// @todo - Freeze instance?
	}
}

////////
// §2.2: module.exports.JsBuildSettings

/**
 * Collection of settings needed to build CSS files for OUE websites using gulp.
 *
 * @todo Finish writing class using ES6-based implementation.
 */

////////////////////////////////////////////////////////////////////////////////////////////////////
// §3: Exported Function Declarations

////////
// §3.1: module.exports.fixFileHeaderComments

/**
 * Returns a replacement string that will render impermanent file header comments persistent through
 * minification.
 * 
 * This is a callback function to be used consistent with the second, replacement argument of
 * String.replace. It assumes the first, pattern argument to String.replace contained only one
 * capturing group.
 *
 * @param {String} match - The matched substring.
 * @param {String} match - The captured group.
 * @param {Number} offset - The offset of the matched substring within the whole string being
 *     examined.
 * @param {String} string - The whole string being examined.
 * @returns {String}
 */
module.exports.fixFileHeaderComments = function ( match, p1, offset, string ) {
	var replacementStr = match;
	if ( offset == 0 ) {
		replacementStr = '/*!';
	}
	return replacementStr;
}

////////
// §3.2: module.exports.setUpCssBuildTask

/**
 * Uses gulp task automation to build a CSS stylesheet, and its minified version, from Less source
 * files.
 *
 * Built CSS stylesheets are intended to be used in the WSUWP CSS Stylesheet Editor.
 * 
 * @param {CssBuildSettings} settings
 */
module.exports.setUpCssBuildTask = function ( settings ) {
	gulp.task( 'buildMinCss', function ( callBack ) {
		if ( settings.staffAddinsFile === undefined ) {
			pump( [
					gulp.src( settings.sourceFile ).on( 'end', () => {
						logUpdate( 'Beginning CSS build process.' );
					} ),
					lessc( {
						paths: [settings.dependenciesPath]
					} ).on( 'end', () => {
						logUpdate( 'Finished compiling precompiled CSS written in the Less' +
							' language extension of CSS.' );
					} ),
					replace( settings.commentRemovalNeedle, '' ).on( 'end', () => {
						logUpdate( 'Removed comments not marked as persistent.' );
					} ),
					insert.prepend( settings.minCssFileHeaderStr ).on( 'end', () => {
						logUpdate( 'If present, optional file header comment prepended to' +
							' file.' );
					} ),
					gcmq().on( 'end', () => {
						logUpdate( 'Finished grouping media queries.' );
					} ),
					insertLines( settings.insertingMediaQuerySectionHeader ).on( 'end', () => {
						logUpdate( 'Media query section documentation comment inserted.' );
					} ),
					insert.prepend( settings.fontImportStr ).on( 'end', () => {
						logUpdate( 'Prepended font import string (if any) to build.' );
					} ),
					gulp.dest( settings.destFolder ).on( 'end', () => {
						logUpdate( 'Unminified CSS file has been built and written.' );
					} ),
					cleanCss().on( 'end', () => {
						logUpdate( 'Finished minifying CSS.' );
					} ),
					extName( settings.minCssFileExtension ),
					gulp.dest( settings.destFolder ).on( 'end', () => {
						logUpdate( 'Minified CSS file has been built and written.' );
					} ),
					notify( 'The gulp-automated CSS build process has completed.' )
				],
				callBack
			);
		} else {
			let needle = new RegExp( "\/([^\/]+?)\.[^\.]+$" );
			let searchRes = needle.exec( settings.sourceFile );
			let cssFileName = searchRes[ 1 ] + '.css';
			pump( [
					gulp.src( settings.sourceFile ).on( 'end', () => {
						logUpdate( 'Beginning CSS build process.' );
					} ),
					lessc( {
						paths: [settings.dependenciesPath]
					} ).on( 'end', () => {
						logUpdate( 'Finished compiling precompiled CSS written in the Less' +
							' language extension of CSS.' );
					} ),
					replace( settings.commentRemovalNeedle, '' ).on( 'end', () => {
						logUpdate( 'Removed comments not marked as persistent.' );
					} ),
					insert.prepend( settings.minCssFileHeaderStr ).on( 'end', () => {
						logUpdate( 'If present, optional file header comment prepended to' +
							' file.' );
					} ),
					gcmq().on( 'end', () => {
						logUpdate( 'Finished grouping media queries.' );
					} ),
					insertLines( settings.insertingMediaQuerySectionHeader ).on( 'end', () => {
						logUpdate( 'Media query section documentation comment inserted.' );
					} ),
					insert.prepend( settings.fontImportStr ).on( 'end', () => {
						logUpdate( 'Prepended font import string (if any) to build.' );
					} ),
					gulp.src( settings.staffAddinsFile ),
					concat( cssFileName ).on( 'end', () => {
						logUpdate( 'Appended staff CSS add-ins to the build.' );
					} ),
					gulp.dest( settings.destFolder ).on( 'end', () => {
						logUpdate( 'Unminified CSS file has been built and written.' );
					} ),
					cleanCss().on( 'end', () => {
						logUpdate( 'Finished minifying CSS.' );
					} ),
					extName( settings.minCssFileExtension ),
					gulp.dest( settings.destFolder ).on( 'end', () => {
						logUpdate( 'Minified CSS file has been built and written.' );
					} ),
					notify( 'The gulp-automated CSS build process has completed.' )
				],
				callBack
			);			
		}
	} );
}

////////
// §3.3: module.exports.setUpDefaultTask()

module.exports.setUpDefaultTask = function() {
	gulp.task( 'default', gulp.series( 'help' ) );
}

////////
// §3.4: module.exports.setUpHelpTask

module.exports.setUpHelpTask = function() {
	gulp.task( 'help', function ( callBack ) {
		console.log(
			'\r\nProviding usage information on gulp tasks for automating builds of custom CSS ' +
				'and JS code for application to WSUWP websites.\r\n' );
		console.log( `List of available tasks (x2): buildMinCss, buildMinJs

(1) buildMinCss: Compiles and minifies code written in the Less language extension of CSS into a
 stylesheet intended for application to a WSUWP website via the CSS Stylesheet Editor page of the
 WordPress dashboard.

(2) buildMinJs: Concatenantes and minifies JS into a single script file intended for application to
 a WSUWP website via the Custom JavaScript Editor page of the WordPress dashboard.
` );
		callBack();
	} );
}

////////
// §3.5: module.exports.setUpJsBuildTask

/**
 * Uses gulp task automation to build a custom JS file, and its minified version, from dependencies.
 *
 * Built custom JS files are intended to be used in the WSUWP Custom JavaScript Editor.
 * 
 * @param {JsBuildSettings} settings
 */
module.exports.setUpJsBuildTask = function ( settings ) {
	gulp.task( 'buildMinJs', function ( callBack ) {
		pump( [
				gulp.src( settings.buildDependenciesList ),
				replace( settings.commentNeedle, settings.replaceCallback ).on( 'end', () => {
					logUpdate( 'Removed comments not marked as persistent.' );
				} ),
				concat( settings.compiledJsFileName ).on( 'end', () => {
					logUpdate( 'Finished combining separate script modules into a single file.');
				} ),
				gulp.dest( settings.destFolder ).on( 'end', () => {
					logUpdate( 'Unminified JS file has been built and written.' );
				} ),
				terser( {
					output: {
						comments: /^!/
					}
				} ).on( 'end', () => {
					logUpdate( 'Finished minifying JS.' );
				} ),
				extName( settings.minJsFileExtension ),
				gulp.dest( settings.destFolder ).on( 'end', () => {
					logUpdate( 'Minified JS file has been built and written.' );
				} ),
				notify( 'The gulp-automated JS build process has completed.' )
			],
			callBack
		);
	} );
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// §4: Support functions

////////
// §4.1: logUpdate

function logUpdate( msg ) {
	let now = new Date();
	console.log( '[\x1b[1;30m%s\x1b[0m] ' + msg,
		now.getHours().toString().padStart( 2, '0' ) + ':' +
		now.getMinutes().toString().padStart(2, '0') + ':' +
		now.getSeconds().toString().padStart( 2, '0' ) );
}
