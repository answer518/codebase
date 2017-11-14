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
    require('widget/sidebar/sidebar')(); // auto run 
    

    var __PRELOAD__ = {};

    function getPageData(lang) {
        var max_version = Api.max_version,
            _pn = Api.pn;

        var subfix = lang === 'zh-cn' ? lang : 'en-us';
        if (_pn === '7201577005' && lang === 'ru-ru') { // 渠道走专版
            subfix = lang;
        }
        if (_pn === 'ruixing' && lang === 'zh-cn' && max_version === '5.1.1.1000') {
            subfix = 'ruixing';
        }
        return getStore('page_data', 'local_page_data', lang, '/static/res/i18n/data_' + subfix + '.js');
    }

    function getPageTpl(lang) {
        return getStore('page_tpl', 'local_page_template', lang, '/static/res/tpl/page.html');
    }

    function getStore(id, key, lang, url) {
        return new Promise(function(resolve, reject) {
            var version = document.getElementById(id).getAttribute('version');
            var local = localStorage.getItem(key);
            if (local &&
                (local = JSON.parse(local)) &&
                local.lang === lang &&
                local.version === version &&
                !$.isEmptyObject(local.data)) {
                resolve(local.data);
            } else {
                $('#' + id).load(url + '?v=' + version, function(data) {
                    resolve(data);
                    localStorage.setItem(key, JSON.stringify({ 'version': version, 'lang': lang, 'data': data }));
                });
            }
        });
    }

    template.on('getLang', function(key) {
        return Language.getLang(key);
    });

    function pageinit(tpl) {
        
        Controller.getGridDataList({}, function() {
        	console.log('page render...');
        });
    }

    $(document).on('dragstart', function(e) {
    	e.preventDefault();
    });

    var lang = navigator.language.toLocaleLowerCase();
    Promise.all([getPageTpl(lang), getPageData(lang)])
    .then(function(data) { 
        pageinit(data[0]);
        $('#page_data').append(data[1]);
    }).catch(function(err) {
        console.error(err)
    });
});
