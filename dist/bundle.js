/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var list_item_1 = __webpack_require__(7);
__webpack_require__(13);
var List = (function (_super) {
    __extends(List, _super);
    function List(props) {
        return _super.call(this, props) || this;
    }
    List.prototype.getItems = function () {
        return this.props.data.items.map(function (item) {
            return React.createElement(list_item_1.default, { data: item });
        });
    };
    List.prototype.getClasses = function () {
        return this.props.data.show === true ? "list-view active" : "list-view";
    };
    List.prototype.render = function () {
        return (React.createElement("div", { className: this.getClasses() },
            React.createElement("ul", null, this.getItems())));
    };
    return List;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = List;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
__webpack_require__(14);
var SearchBox = (function (_super) {
    __extends(SearchBox, _super);
    function SearchBox(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            activeClass: "search-wrapper",
        };
        return _this;
    }
    SearchBox.prototype.handleSearchToggle = function () {
        var searchInput = document.getElementById("search-input");
        searchInput.focus();
        searchInput.select();
        if (this.state.activeClass != "search-wrapper active") {
            this.setState({
                activeClass: "search-wrapper active"
            });
            return;
        }
        //search
        if (searchInput.value != "") {
            this.props.handleSearch(searchInput.value);
        }
    };
    SearchBox.prototype.handleCloseClick = function () {
        var searchInput = document.getElementById("search-input");
        if (searchInput.value == "") {
            this.props.exitSearch();
            this.setState({
                activeClass: "search-wrapper"
            });
        }
        searchInput.value = "";
    };
    SearchBox.prototype.handleKeyPress = function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            this.handleSearchToggle();
        }
        if (event.keyCode == 27) {
            event.preventDefault();
            this.handleCloseClick();
        }
    };
    SearchBox.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: this.state.activeClass },
            React.createElement("div", { className: "click-random" },
                React.createElement("a", { href: "https://en.wikipedia.org/wiki/Special:Random", target: "_blank", className: "random-article" }, "Click Here for Random!")),
            React.createElement("div", { className: "input-holder" },
                React.createElement("input", { type: "text", id: "search-input", onKeyDown: function (event) { _this.handleKeyPress(event); }, className: "search-input", placeholder: "Type to search" }),
                React.createElement("div", { className: "close-icon", onClick: this.handleCloseClick.bind(this) },
                    React.createElement("span", null)),
                React.createElement("div", { className: "search-icon", onClick: this.handleSearchToggle.bind(this) },
                    React.createElement("span", null))),
            React.createElement("div", { className: "message" }, this.props.message !== "" ? React.createElement("p", null, this.props.message) : "")));
    };
    return SearchBox;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchBox;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
__webpack_require__(12);
var ListItem = (function (_super) {
    __extends(ListItem, _super);
    function ListItem(props) {
        return _super.call(this, props) || this;
    }
    ListItem.prototype.render = function () {
        return (React.createElement("a", { className: "list-item", href: this.props.data.url, target: "_blank" },
            React.createElement("li", null,
                React.createElement("div", { className: "title" },
                    React.createElement("h2", null, this.props.data.title)),
                React.createElement("div", { className: "description" },
                    React.createElement("p", null, this.props.data.description)))));
    };
    return ListItem;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ListItem;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".list-item {\n  display: flex;\n  flex: 1;\n  background-color: white;\n  margin: 0.5em;\n  padding: 0.3em;\n  border-radius: 5px;\n  text-decoration: none;\n  color: #071321;\n  opacity: 0.8;\n  transition: all 0.3s cubic-bezier(0, 0.1, 0.03, 1.5);\n  box-shadow: 0px 0px 6px #000; }\n  .list-item li {\n    width: 100%;\n    height: 75px;\n    margin-left: 0.8em;\n    display: flex;\n    flex-direction: column;\n    justify-content: space-around; }\n    .list-item li .title {\n      flex: 1;\n      display: flex;\n      align-items: flex-end; }\n      .list-item li .title h2 {\n        font-size: 1.4em; }\n    .list-item li .description {\n      flex: 1;\n      display: flex;\n      align-items: flex-start;\n      width: 94%;\n      min-width: 0;\n      color: #071321; }\n      .list-item li .description p {\n        font-size: 1.2em;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis; }\n\n.list-item:hover {\n  opacity: 1;\n  transform: scale(1.03);\n  box-shadow: 0px 0px 15px #000;\n  transition: all 0.3s cubic-bezier(0, 0.3, 1.2, 1.5); }\n", ""]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".list-view {\n  flex: 0;\n  overflow: hidden;\n  width: 80%;\n  height: 0;\n  display: block;\n  position: relative;\n  transition: 0.3s ease-in-out;\n  opacity: 0; }\n  .list-view ul {\n    list-style: none;\n    width: 100%;\n    height: 0;\n    text-align: left;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    overflow: hidden;\n    transition: 0.3s ease-in-out; }\n\n.list-view.active {\n  flex: 9;\n  height: 100%;\n  opacity: 1;\n  overflow: visible !important;\n  transition: 0.3s ease-in-out; }\n  .list-view.active ul {\n    height: auto;\n    transition: 0.3s ease-in-out;\n    overflow: visible !important; }\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".search-wrapper {\n  display: flex;\n  flex: 3;\n  min-height: 150px;\n  height: 100%;\n  width: 100%;\n  flex-direction: column;\n  justify-content: center;\n  align-content: center; }\n  .search-wrapper .message {\n    color: white;\n    margin-top: 15px; }\n  .search-wrapper .click-random {\n    margin: 1em; }\n    .search-wrapper .click-random a {\n      text-decoration: none;\n      color: white;\n      font-size: 1.2em;\n      opacity: 0.8;\n      transition: opacity 0.3s ease-in; }\n    .search-wrapper .click-random a:hover {\n      opacity: 1;\n      transition: opacity 0.3s ease-in; }\n  .search-wrapper .input-holder {\n    display: flex;\n    justify-content: flex-end;\n    align-self: center;\n    max-width: 230px;\n    width: 100%;\n    height: 70px;\n    position: relative; }\n    .search-wrapper .input-holder .search-input {\n      height: 50px;\n      width: 65%;\n      position: absolute;\n      opacity: 1;\n      top: 10px;\n      left: 0px;\n      background: transparent;\n      box-sizing: border-box;\n      border: none;\n      outline: none;\n      font-family: \"Open Sans\", Arial, Verdana;\n      font-size: 16px;\n      font-weight: 400;\n      line-height: 20px;\n      color: #FFF;\n      transform: translate(0, 60px);\n      opacity: 0;\n      transition: all 0.2s cubic-bezier(0, 0.105, 0.035, 1.57);\n      transition-delay: 0.3s; }\n    .search-wrapper .input-holder .search-icon {\n      width: 70px;\n      height: 70px;\n      position: absolute;\n      left: -34%;\n      border: none;\n      border-radius: 6px;\n      background: #FFF;\n      padding: 0px;\n      outline: none;\n      position: relative;\n      z-index: 2;\n      float: right;\n      cursor: pointer;\n      transition: all 0.3s ease-in-out;\n      display: flex;\n      justify-content: center;\n      align-content: center; }\n      .search-wrapper .input-holder .search-icon span {\n        width: 22px;\n        height: 22px;\n        display: flex;\n        vertical-align: middle;\n        position: relative;\n        transform: rotate(45deg);\n        transition: all 0.4s cubic-bezier(0.65, -0.6, 0.24, 1.65);\n        margin-top: 23px;\n        transform: rotate(45deg);\n        right: 0; }\n      .search-wrapper .input-holder .search-icon span::before,\n      .search-wrapper .input-holder .search-icon span::after {\n        position: absolute;\n        content: ''; }\n      .search-wrapper .input-holder .search-icon span::before {\n        width: 4px;\n        height: 11px;\n        left: 9px;\n        top: 18px;\n        border-radius: 2px;\n        background: #FE5F55; }\n      .search-wrapper .input-holder .search-icon span::after {\n        width: 14px;\n        height: 14px;\n        left: 0px;\n        top: 0px;\n        border-radius: 16px;\n        border: 4px solid #FE5F55; }\n    .search-wrapper .input-holder .close-icon {\n      width: 70px;\n      height: 70px;\n      border: none;\n      left: -10%;\n      position: absolute;\n      border-radius: 6px;\n      padding: 0px;\n      outline: none;\n      position: relative;\n      z-index: 2;\n      float: right;\n      cursor: pointer;\n      transition: all 0.3s ease-in-out;\n      display: flex;\n      justify-content: center;\n      align-content: center; }\n      .search-wrapper .input-holder .close-icon span {\n        width: 22px;\n        height: 22px;\n        display: flex;\n        vertical-align: middle;\n        position: relative;\n        transform: rotate(45deg);\n        transition: all 0.4s cubic-bezier(0.65, -0.6, 0.24, 1.65);\n        margin-top: 18px;\n        transform: rotate(-45deg);\n        right: 0; }\n      .search-wrapper .input-holder .close-icon span::before,\n      .search-wrapper .input-holder .close-icon span::after {\n        position: absolute;\n        content: ''; }\n      .search-wrapper .input-holder .close-icon span::before {\n        width: 4px;\n        height: 20px;\n        border-radius: 2px;\n        background: #FE5F55; }\n      .search-wrapper .input-holder .close-icon span::after {\n        width: 4px;\n        height: 20px;\n        border-radius: 2px;\n        background: #FE5F55;\n        transform: rotate(-90deg); }\n\n.search-wrapper.active .search-input {\n  opacity: 1;\n  transform: translate(0, 0);\n  transition: all 0.2s cubic-bezier(0, 0.105, 0.035, 1.57); }\n\n.search-wrapper.active .search-icon {\n  left: 0;\n  border-radius: 60px; }\n  .search-wrapper.active .search-icon span {\n    transform: rotate(-45deg); }\n\n.search-wrapper.active .close-icon {\n  left: 55%;\n  transform: rotate(-180deg); }\n\n.search-wrapper.active .click-random {\n  opacity: 0.5; }\n  .search-wrapper.active .click-random a {\n    opacity: 0.5; }\n", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "html {\n  min-height: 100vh;\n  padding: 0;\n  top: 0;\n  left: 0; }\n\nbody {\n  min-height: 100%;\n  background-image: linear-gradient(#06111d, #173c69);\n  padding: 0;\n  top: 0;\n  left: 0;\n  font-family: 'Roboto', sans-serif;\n  font-size: 14px; }\n\n* {\n  top: 0;\n  left: 0;\n  padding: 0;\n  margin: 0; }\n\n#app {\n  width: 100%;\n  height: 100%;\n  display: block;\n  text-align: center; }\n\n.app-container {\n  width: 70%;\n  min-height: 100vh;\n  margin-right: auto;\n  margin-left: auto;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  position: relative; }\n  @media screen and (max-width: 720px) {\n    .app-container {\n      width: 95%; } }\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(10);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var ReactDOM = __webpack_require__(6);
__webpack_require__(5);
var searchbox_1 = __webpack_require__(4);
var list_1 = __webpack_require__(3);
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        _this.state = {
            wikiList: {
                show: false,
                items: [],
            },
            message: ""
        };
        return _this;
    }
    App.prototype.handleSearch = function (query) {
        var _this = this;
        var list = this.state.wikiList;
        list.items = [];
        list.show = false;
        this.setState({
            wikiList: list,
            message: "Searching..."
        });
        var api = 'https://en.wikipedia.org/w/api.php?action=opensearch&limit=15&namespace=0&format=json&search=';
        //let api = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=";
        api += query;
        //api += "&callback=JSON_CALLBACK";
        $.ajax({
            type: "GET",
            url: api,
            contentType: "application/jsonp; charset=utf-8",
            async: false,
            dataType: "jsonp",
            success: function (data, textStatus, jqXHR) {
                var list = _this.state.wikiList;
                list.items = [];
                list.show = true;
                console.log(data);
                for (var i = 0; i < data[1].length; i++) {
                    console.log(data[1][i]);
                    var title = data[1][i].length > 25 ? data[1][i].substring(0, 24) + "..." : data[1][i];
                    //let desctiption = data[2][i].length > 40 ? data[2][i].substring(0, 39)+"..." : data[2][i];
                    list.items[i] = {
                        title: title,
                        description: data[2][i],
                        url: data[3][i]
                    };
                }
                if (list.items.length > 0) {
                    _this.setState({
                        wikiList: list,
                        message: ""
                    });
                }
                else {
                    list.show = false;
                    _this.setState({
                        wikiList: list,
                        message: "No results found!!!"
                    });
                }
            },
            error: function (errorMessage) {
                console.log(errorMessage);
            }
        });
    };
    App.prototype.exitSearch = function () {
        var list = this.state.wikiList;
        list.show = false;
        this.setState({
            wikiList: list
        });
    };
    App.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: "app-container" },
            React.createElement(searchbox_1.default, { message: this.state.message, handleSearch: function (str) { return (_this.handleSearch(str)); }, exitSearch: function () { return (_this.exitSearch()); } }),
            React.createElement(list_1.default, { data: this.state.wikiList })));
    };
    return App;
}(React.Component));
ReactDOM.render(React.createElement(App, null), document.getElementById("app"));


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map