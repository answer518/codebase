/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _ApiHandle = __webpack_require__(1);

	var _ApiHandle2 = _interopRequireDefault(_ApiHandle);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function init() {

	  var apiHandle = new _ApiHandle2.default();
	  var list = apiHandle.mostVisited;
	  list = apiHandle.mostVisited.splice(0, Math.min(4, list.length));

	  console.log(list);
	} /**
	   * Binds event listeners.
	   */

	document.addEventListener('DOMContentLoaded', init);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ApiHandle = function () {
	    function ApiHandle(arg) {
	        _classCallCheck(this, ApiHandle);

	        var data = {
	            'zh-cn': [{ 'rid': 11, 'title': '百度', url: 'http://www.baidu.com/', logo: 'baidu' }, { 'rid': 21, 'title': '天猫', url: 'http://www.tmall.com/', logo: 'tmall' }, { 'rid': 33, 'title': '京东', url: 'http://www.jd.com/', logo: 'jd' }, { 'rid': 41, 'title': '新浪网', url: 'http://www.sina.com/', logo: 'sina' }],
	            'en-us': [1, 2]
	        };
	        this.mostVisited = data[navigator.language.toLocaleLowerCase()];
	    }

	    _createClass(ApiHandle, [{
	        key: 'deleteMostVisitedItem',
	        value: function deleteMostVisitedItem() {}
	    }, {
	        key: 'getMostVisitedItemData',
	        value: function getMostVisitedItemData(rid) {
	            // return new Promise((resolve, reject) => {
	            //     try {
	            //         setTimeout(() => {
	            //             resolve(this.data[navigator.language.toLocaleLowerCase()]);
	            //         }, 100);
	            //     } catch (e) {
	            //         reject(e);
	            //     }
	            // })
	        }
	    }, {
	        key: 'undoAllMostVisitedDeletions',
	        value: function undoAllMostVisitedDeletions() {}
	    }, {
	        key: 'undoMostVisitedDeletion',
	        value: function undoMostVisitedDeletion() {}
	    }]);

	    return ApiHandle;
	}();

	exports.default = ApiHandle;

/***/ })
/******/ ]);