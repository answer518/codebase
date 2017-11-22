/**
 * 入口js
 * @author guotingjie@maxthon.net
 * @ctime 2016-6-8
 */
'use strict';
// 我的站点
define('static/js/index', function(require, exports, module) {
    var Api = require('static/js/api.js');
    var Language = require('static/js/language');
    var Controller = require('widget/main/main');
    
    var __PRELOAD__ = {};

    template.on('getLang', function(key) {
        return Language.getLang(key);
    });

    function pageinit(tpl) {
        Controller.getGridList({}, function() {
        	console.log('page render...');
        });
    }

    $(document).on('dragstart', function(e) {
    	e.preventDefault();
    });

    // var lang = navigator.language.toLocaleLowerCase();
    // console.log(document.getElementById('pageTpl').innerHTML);
    pageinit();
    // Promise.all([getPageTpl(lang)])
    // .then(function(data) { 
    //     pageinit(data[0]);
    // }).catch(function(err) {
    //     console.error(err)
    // });
});
