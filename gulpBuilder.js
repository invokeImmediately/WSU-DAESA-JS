/**
 * Node module used to build CSS and JS modules via gulp.
 *
 * @link	https://github.com/invokeImmediately/WSU-UE---JS/gulpBuilder.js
 * @author	invokeImmediately (Daniel C. Rieck)
 */

'use strict';

/* -------------------------------------------------------------------------------------------------
** §1: Imprting of Node modules
*/

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
const uglifyJs = require( 'gulp-uglify' );
const pump = require( 'pump' );

/* -------------------------------------------------------------------------------------------------
** §2: Exported Class Declarations
*/

/**
 * Collection of settings needed to build CSS files for OUE websites using gulp.
 *
 * @param {RegExp} commentRemovalNeedle - Used to find and remove impermanent comments in the
 *     unminified source file.
 * @param {String} dependenciesPath - Location of Less build dependencies common to all OUE
 *     websites.
 * @param {String} fontImportStr - CSS @import rule for importing additional functions that will be
 *     prepended to the built stylesheet.
 * @param {String} insertingMediaQuerySectionHeader - Comment block for inline documentation to be
 *     inserted before the section of the built CSS file that will contain media queries.
 * @param {String} minCssFileExtension - Extension to be utilized on the minified built CSS file.
 * @param {String} minCssFileHeaderStr - File header comment for inline documentation to be
 *     prepended to the built CSS file. (Should be structured as a permanent comment.)
 */
module.exports.CssBuildSettings = function (commentRemovalNeedle, dependenciesPath, destFolder,
		fontImportStr, insertingMediaQuerySectionHeader, minCssFileExtension, minCssFileHeaderStr,
		sourceFile, staffAddinsFile) {
	this.commentRemovalNeedle = commentRemovalNeedle;
	this.dependenciesPath = dependenciesPath;
	this.destFolder = destFolder;
	this.fontImportStr = fontImportStr;
	this.insertingMediaQuerySectionHeader = insertingMediaQuerySectionHeader;
	this.minCssFileExtension = minCssFileExtension;
	this.minCssFileHeaderStr = minCssFileHeaderStr;
	this.sourceFile = sourceFile;
	this.staffAddinsFile = staffAddinsFile;
}

/* -------------------------------------------------------------------------------------------------
** §3: Exported Function Declarations
*/

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
				uglifyJs( {
					output: {
						comments: /^!/
					},
					toplevel: true,
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

function logUpdate( msg ) {
	let now = new Date();
	console.log( '[\x1b[1;30m%s\x1b[0m] ' + msg,
		now.getHours().toString().padStart( 2, '0' ) + ':' +
		now.getMinutes().toString().padStart(2, '0') + ':' +
		now.getSeconds().toString().padStart( 2, '0' ) );
}
