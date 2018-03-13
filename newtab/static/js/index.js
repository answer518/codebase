/**
 * 入口js
 * @author guotingjie@maxthon.net
 * @ctime 2016-6-8
 */
'use strict';
// 我的站点
define('static/js/index', function (require, exports, module) {
    var Api = require('static/js/api.js');
    var Language = require('static/js/language');
    var Controller = require('widget/main/main');
    var LastSession = require('widget/lastsession/lastsession');
    var Siderbar = require('widget/sidebar/sidebar');
    var dataCode = require('static/js/datacode.js');

    // auto run 
    require('widget/navigation/navigation');
    require('widget/header/header');
    require('widget/search/search');

    // var __PRELOAD__ = {};
    template.on('getLang', function (key) {
        return Language.getLang(key);
    });

    function pageinit() {
        var tpl = document.getElementById('pageTpl').innerHTML;
        var pageHtml = template(tpl, { lang: navigator.language.toLocaleLowerCase() });
        document.getElementById('wrapper').innerHTML = pageHtml;
        Controller.getGridDataList();
        Siderbar.start();
    }

    $(document).on('contextmenu', function (e) {
        if (e.target.tagName !== 'INPUT') {
            e.preventDefault();
        }
    }).on('dragstart', function (e) {
        e.preventDefault();
    }).on('click', '.nav-header-menu li', function () {
        $('.nav-header-menu li').removeClass('active');
        $(this).addClass('active');
        $('.nav-body > div').addClass('hide').eq($(this).index()).removeClass('hide');

        $(this).index() === 1 ? LastSession.init() : void (0);
    });

    pageinit();

    var Tools = require('static/js/tools.js');
    setTimeout(function() {
        var beginners_guide_status = Tools.getCookie('beginners_guide_status');
        if(beginners_guide_status !== 'close') {
            var intro = introJs();
            if(navigator.language.toLocaleLowerCase() === 'zh-cn') {
                intro.setOptions({
                    nextLabel: '下一步 &rarr;',
                    prevLabel: '&larr; 上一步',
                    skipLabel: '跳过',
                    doneLabel: '完成', 
                });
            }
            
            intro.onexit(function() {
                Tools.setCookie('beginners_guide_status', 'close', 365);
                require('static/js/banner/question.js');
            });
            intro.start();
        } else {
            require('static/js/banner/question.js');
        }
    }, 1000);

    Api.useApi('quickaccess.addEventListener', {}, function (res) {
        if ($.isEmptyObject(res)) return;
        console.log(res);
        var g = {
            url: res.url,
            title: res.title
        }
        switch (res.type) {
            case 'addNewSite':
                var regex = /.*\:\/\/([^\/]*).*/;
                var match = g.url.match(regex);
                var host = '';
                if (typeof match != "undefined" && null != match) {
                    host = match[1];
                }
                if (host !== '') {
                    // 自动匹配图片
                    innerloop:
                    for (var attr in URL_LIBRARY) {
                        var langLibrary = URL_LIBRARY[attr];
                        for (var i = 0; i < langLibrary.length; i++) {
                            var category = langLibrary[i];
                            for (var j = 0; j < category.list.length; j++) {
                                var _category = category.list[j];

                                var _url = _category.url;
                                if (_url.indexOf(host) >= 0) { // 开头// 开头
                                    g.image = _category.image;
                                    i = langLibrary.length;
                                    break innerloop;
                                }

                                if (_category.match) {
                                    for (var k = 0; k < _category.match.length; k++) {
                                        var __url = _category.match[k];
                                        if (__url.indexOf(host) >= 0) { // 开头
                                            g.image = _category.image;
                                            i = langLibrary.length;
                                            break innerloop;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (g.image) {
                    Controller.onInsertGridItem(g);
                } else {
                    Api.getMeanColor(g.url, function (bgColor) {
                        g.bgColor = bgColor;
                        Controller.onInsertGridItem(g);
                    });
                }

                dataCode.statistic({
                    'm': 'sendintoqa',
                    'data': {
                        'title': g.title,
                        'href': g.href
                    }
                });
                break;
            case 'guestSuccess': // MX4 guest数据导入成功
                localStorage.removeItem('local_my_site');
                Controller.getGridDataList();
                break;
            case 'guest5Success': // MX5 guest数据导入成功
                localStorage.removeItem('local_my_site');
                Controller.getGridDataList();
                break;
            case 'dataSyncCompleted':
                var old_and_new_version = Tools.getCookie('old_and_new_version');
                if(old_and_new_version === 'old') return;
                Api.getUserProfile(function (profile) {
                    if (profile['open-async-data'] !== false) {
                        localStorage.removeItem('local_my_site');
                        Controller.getGridDataList();
                    }
                });
                break;
        }
    });
});
