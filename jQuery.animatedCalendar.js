/*!*************************************************************************************************
 *    █ ▄▀▀▄ █  █ █▀▀▀ █▀▀▄ █  █   ▄▀▀▄ ▐▀▀▄ ▀█▀ ▐▀▄▀▌ ▄▀▀▄▐▀█▀▌█▀▀▀ █▀▀▄ ▄▀▀▀ ▄▀▀▄ █         
 * ▄  █ █  █ █  █ █▀▀  █▄▄▀ ▀▄▄█   █▄▄█ █  ▐  █  █ ▀ ▌ █▄▄█  █  █▀▀  █  █ █    █▄▄█ █  ▄      
 * ▀▄▄█  ▀█▄  ▀▀  ▀▀▀▀ ▀  ▀▄▄▄▄▀ ▀ █  ▀ ▀  ▐ ▀▀▀ █   ▀ █  ▀  █  ▀▀▀▀ ▀▀▀   ▀▀▀ █  ▀ ▀▀▀  ▀ ▀ ▀
 *
 *             █▀▀▀ ▐▀▀▄ █▀▀▄ ▄▀▀▄ █▀▀▄       █ ▄▀▀▀
 *             █▀▀  █  ▐ █  █ █▄▄█ █▄▄▀    ▄  █ ▀▀▀█
 *       ▀ ▀ ▀ ▀▀▀▀ ▀  ▐ ▀▀▀  █  ▀ ▀  ▀▄ ▀ ▀▄▄█ ▀▀▀ 
 *
 * Script for setting up and running event calendars on the website of the Distinguished
 *   Scholarships Program at Washington State University.
 *
 * @version 1.0.0
 *
 * @author Daniel C. Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/WSU-DAESA-JS/blob/master/jQuery.daesa-custom.js
 *  @license MIT - Copyright (c) 2021 Washington State University
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
 */

(function ($) {  

// Function calls made once the DOM IS READY
$(function () {
	var $calendars = $("table.calendar");
	if ($calendars.length > 0) {
		setupCalendarShortcuts($calendars);
		setupColorCoding($calendars);
		setupCalendarLegendScrolling($calendars);
	}
});

function oueSetDateShorcut($targetElement) {
	if ($targetElement && ($targetElement instanceof $ ||
			$targetElement.constructor.prototype.jquery)) {
		var d = new Date();
		var n = d.toDateString();
		$targetElement.attr("href", "#" + (n.substring(n.indexOf(" ")+1,
			n.indexOf(" ",n.indexOf(" ")+1)) ) + (n.substring(n.indexOf(" ",n.indexOf(" ") + 1) + 1,
			n.indexOf(" ", n.indexOf(" ", n.indexOf(" ")+1)+1))));
	}        
}

function setupCalendarShortcuts($calendars) {
	var $toTodayShortcut = $("#jumpToToday");
	if ($.isJQueryObj($calendars) && $toTodayShortcut.length > 0) {
		var d = new Date();
		var fallYear = 2016;
		var fallStartDay = 15;
		var fallStartLink = "#Aug15";
		var fallEndDay = 16;
		var fallEndLink = "#Dec16";
		var springYear = 2017;
		var springStartDay = 9;
		var springStartLink = "#Jan09";
		var springEndDay = 5;
		var springEndLink = "#May05";
		if (fallYear == springYear || fallYear == springYear - 1) {
			if (fallYear < springYear) {
				if (d.getFullYear() < fallYear) {
					$toTodayShortcut.attr("href", fallStartLink);
				} else if (d.getFullYear() == fallYear) {
					if (d.getMonth() < 7){
							$toTodayShortcut.attr("href", fallStartLink);
					} else if (d.getMonth() == 7){
						if (d.getDate() < fallStartDay) {
							$toTodayShortcut.attr("href", fallStartLink);
						} else {
							oueSetDateShorcut($toTodayShortcut);
						}
					} else if (d.getMonth() > 7 && d.getMonth() < 11) {
						oueSetDateShorcut($toTodayShortcut);
					} else {
						if (d.getDate() <= fallEndDay) {
							oueSetDateShorcut($toTodayShortcut);
						} else {
							$toTodayShortcut.attr("href", fallEndLink);
						}
					}
				} else if (d.getFullYear() == springYear) {
					if (d.getMonth() == 0){
						if (d.getDate() < springStartDay) {
							$toTodayShortcut.attr("href", springStartLink);
						} else {
							oueSetDateShorcut($toTodayShortcut);
						}
					} else if (d.getMonth() > 0 && d.getMonth() < 4) {
						oueSetDateShorcut($toTodayShortcut);
					} else {
						if (d.getDate() <= springEndDay) {
							oueSetDateShorcut($toTodayShortcut);
						} else {
							$toTodayShortcut.attr("href", springEndLink);
						}
					}
				} else {
					$toTodayShortcut.attr("href", springEndLink);
				}
			} else {
				if (d.getFullYear() < fallYear) {
					$toTodayShortcut.attr("href", fallStartLink);
				} else if (d.getFullYear() == fallYear) {
					if (d.getMonth() == 0) {
						if (d.getDate() < springStartDay) {
							$toTodayShortcut.attr("href", springStartLink);
						} else {
							oueSetDateShorcut($toTodayShortcut);
						}
					} else if (d.getMonth() > 0 && d.getMonth() < 4) {
						oueSetDateShorcut($toTodayShortcut);
					} else if (d.getMonth() == 4) {
						if (d.getDate() <= springEndDay) {
							oueSetDateShorcut($toTodayShortcut);
						} else {
							$toTodayShortcut.attr("href", springEndLink);
						}
					} else if (d.getMonth() > 4 && d.getMonth() < 7) {
							$toTodayShortcut.attr("href", fallStartLink);
					} else if (d.getMonth() == 7) {
						if (d.getDate() < fallStartDay) {
							$toTodayShortcut.attr("href", fallStartLink);
						} else {
							oueSetDateShorcut($toTodayShortcut);
						}
					} else if (d.getMonth() > 7 && d.getMonth() < 11) {
						oueSetDateShorcut($toTodayShortcut);
					} else {
						if (d.getDate() <= fallEndDay) {
							oueSetDateShorcut($toTodayShortcut);
						} else {
							$toTodayShortcut.attr("href", fallEndLink);
						}
					}
				} else {
					$toTodayShortcut.attr("href", springEndLink);
				}
			}
		}
	}
}

function setupColorCoding($calendars) {
	if($.isJQueryObj($calendars)) {
		var $calendarCell;
		var $calendarCellLinks;
		var $calendarCellLinkHref;
		var $thisLink;
		$calendars.find("td.has-an-event").each(function(){
			$calendarCell = $(this);
			$calendarCellLinks = $(this).children("p").children("a");
			$calendarCellLinks.each(function() {
				$thisLink = $(this);
				calendarCellLinkHref = $thisLink.attr("href");
				switch(calendarCellLinkHref) {
					case "/calendar/workshops/#intro-to-DS":
						$calendarCell.addClass("crimson");
						break;
					case "/calendar/workshops/#deadlines":
						$calendarCell.addClass("black");
						break;
					case "/calendar/workshops/#fulbright":
						$calendarCell.addClass("gray");
						break;
					case "/calendar/workshops/#gilman":
						$calendarCell.addClass("orange");
						break;
					case "/calendar/workshops/#truman":
						$calendarCell.addClass("olive");
						break;
					case "/calendar/workshops/#goldwater":
						$calendarCell.addClass("blue");
						break;
					case "/calendar/workshops/#udall":
						$calendarCell.addClass("dark-gray");
						break;
					case "/calendar/workshops/#general-abroad":
						$calendarCell.addClass("dark-brown");
						break;
					case "/calendar/workshops/#boren":
						$calendarCell.addClass("brown");
						break;
					case "/calendar/workshops/#schwarzman":
						$calendarCell.addClass("dark-olive");
						break;
					case "/calendar/workshops/#uk-scholarships":
						$calendarCell.addClass("dark-blue");
						break;
					case undefined:
					default:
						break;
				}				
			});
		});
	}
}

function setupCalendarLegendScrolling($calendars) {
	var $window = $(window);
	var $legends = $("div.calendar-legend");
	var $legendPanelsBlack = $("div.legend-panel.black");
	var $legendPanelsCrimson = $("div.legend-panel.crimson");
	var $legendPanelsGray = $("div.legend-panel.gray");
	var $legendPanelsOrange = $("div.legend-panel.orange");
	var $legendPanelsOlive = $("div.legend-panel.olive");
	var $legendPanelsBlue = $("div.legend-panel.blue");
	var $legendPanelsDarkGray = $("div.legend-panel.dark-gray");
	var $legendPanelsBrown = $("div.legend-panel.brown");
	var $legendPanelsDarkBrown = $("div.legend-panel.dark-brown");
	var $legendPanelsDarkOlive = $("div.legend-panel.dark-olive");
	var $legendPanelsDarkBlue = $("div.legend-panel.dark-blue");
	var $legendPanelsGold = $("div.legend-panel.gold");
	var windowScrollPos;
	var legendTop;
	var legendHeight;
	var calendarTop;
	var calendarHeight;
	var calendarBottom;
	var scrollOffset;
	var scrollStop;
	var idx;
	if ($.isJQueryObj($calendars) && $legends.length) {
		if ($legends.length === $calendars.length) {
			$window.scroll(function() {
				windowScrollPos = $window.scrollTop();
				for (idx = 0; idx < $legends.length; idx++) {
					calendarTop = $($calendars.get(idx)).offset().top;
					calendarHeight = $($calendars.get(idx)).height();
					calendarBottom = calendarTop + calendarHeight;
					legendHeight = $($legends.get(idx)).height();
					scrollStop = calendarBottom - legendHeight;
					if (windowScrollPos > calendarTop) {
						if (windowScrollPos < scrollStop) {
							$($legends.get(idx)).animate({top: windowScrollPos - calendarTop}, 1,
								"linear");
						} else {
							legendTop = $($legends.get(idx)).offset().top;
							if (legendTop !== scrollStop) {
								$($legends.get(idx)).animate({top: scrollStop - calendarTop}, 1,
									"linear");
							}
						}
					} else {
						legendTop = $($legends.get(idx)).offset().top;
						if (legendTop !== calendarTop) {
							$($legends.get(idx)).animate({top: 0}, 1, "linear");
						}
					}
				}
			});

			// TODO: Find a way to base this off of styled colors using jQuery color.
			$legendPanelsBlack.hover(function() {
				$("td.has-an-event.black").animate({ backgroundColor: "#30303f" },200);
			}, function() {
				$("td.has-an-event.black").animate({ backgroundColor: "#000000" },200);
			});
			$legendPanelsCrimson.hover(function() {
				$("td.has-an-event.crimson").animate({ backgroundColor: "#bf526f" },200);
			}, function() {
				$("td.has-an-event.crimson").animate({ backgroundColor: "#be1a40" },200);
			});
			$legendPanelsGray.hover(function() {
				$("td.has-an-event.gray").animate({ backgroundColor: "#7d979b" },200);
			}, function() {
				$("td.has-an-event.gray").animate({ backgroundColor: "#67767b" },200);
			});
			$legendPanelsOrange.hover(function() {
				$("td.has-an-event.orange").animate({ backgroundColor: "#df8366" },200);
			}, function() {
				$("td.has-an-event.orange").animate({ backgroundColor: "#e95b34" },200);
			});
			$legendPanelsOlive.hover(function() {
				$("td.has-an-event.olive").animate({ backgroundColor: "#a5a75d" },200);
			}, function() {
				$("td.has-an-event.olive").animate({ backgroundColor: "#9b8b28" },200);
			});
			$legendPanelsBlue.hover(function() {
				$("td.has-an-event.blue").animate({ backgroundColor: "#3d94a3" },200);
			}, function() {
				$("td.has-an-event.blue").animate({ backgroundColor: "#127286" },200);
			});
			$legendPanelsDarkGray.hover(function() {
				$("td.has-an-event.dark-gray").animate({ backgroundColor: "#59696f" },200);
				$("td.has-an-event.dark-gray.brown").css({ backgroundImage: "none" });
			}, function() {
				$("td.has-an-event.dark-gray").animate({ backgroundColor: "#373940" },200);
				$("td.has-an-event.dark-gray.brown").css({
					backgroundImage: "linear-gradient(to bottom, #373940, #723f1f)" });
			});
			$legendPanelsDarkBrown.hover(function() {
				$("td.has-an-event.dark-brown").animate({ backgroundColor: "#664a4d" },200);
			}, function() {
				$("td.has-an-event.dark-brown").animate({ backgroundColor: "#480f13" },200);
			});
			$legendPanelsBrown.hover(function() {
				$("td.has-an-event.brown").animate({ backgroundColor: "#866e56" },200);
				$("td.has-an-event.dark-gray.brown").css({ backgroundImage: "none" });
			}, function() {
				$("td.has-an-event.brown").animate({ backgroundColor: "#723f1f" },200);
				$("td.has-an-event.dark-gray.brown").css({
					backgroundImage: "linear-gradient(to bottom, #373940, #723f1f)" });
			});
			$legendPanelsDarkOlive.hover(function() {
				$("td.has-an-event.dark-olive").animate({ backgroundColor: "#646a4f" },200);
			}, function() {
				$("td.has-an-event.dark-olive").animate({ backgroundColor: "#453a16" },200);
			});
			$legendPanelsDarkBlue.hover(function() {
				$("td.has-an-event.dark-blue").animate({ backgroundColor: "#3d636c" },200);
			}, function() {
				$("td.has-an-event.dark-blue").animate({ backgroundColor: "#12313c" },200);
			});
			$legendPanelsGold.hover(function() {
				$("td.has-an-event.gold").animate({ backgroundColor: "#ffdb8d" },200);
			}, function() {
				$("td.has-an-event.gold").animate({ backgroundColor: "#ffb81c" },200);
			});
		}
	}
}
})(jQuery);
