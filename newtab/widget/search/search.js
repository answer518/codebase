var Api = require('static/js/api.js'),
    Language = require('static/js/language');
var lang = navigator.language.toLocaleLowerCase();
var isZh = lang === 'zh-cn';

var $search = $('.search-bar');
var $searchEngine = $search.find('.search-engine');
var $changeEngine = $search.find('.change-engine');
var $searchForm = $search.find('.search-form');
var $searchInput = $search.find('.button');
var $engineList = $search.find('.engine-list');
var $searchLogo = $search.find('#s_lg_img');

var dataEngine = {
    "lang": {
        'searchText': {
            'zh-cn': '请在这里输入搜索内容',
            'en-us': 'Please enter the search content here'
        }
    },
    'logo': {
        'default': '//pc-newtab.maxthonimg.com/static/img/search_logo/_light/default' + (!isZh ? '_en' : '') + '.svg',
        'www.google.com': '//pc-newtab.maxthonimg.com/static/img/search_logo/_light/google' + (!isZh ? '_en' : '') + '.svg',
        'www.google.com.hk': '//pc-newtab.maxthonimg.com/static/img/search_logo/_light/google' + (!isZh ? '_en' : '') + '.svg',
        'www.baidu.com': '//pc-newtab.maxthonimg.com/static/img/search_logo/_light/baidu' + (!isZh ? '_en' : '') + '.svg',
        'www.bing.com': '//pc-newtab.maxthonimg.com/static/img/search_logo/_light/bing' + (!isZh ? '_en' : '') + '.svg',
        '1001': '//pc-newtab.maxthonimg.com/static/img/search_logo/_light/gouwu' + (!isZh ? '_en' : '') + '.svg',
        'www.amazon.com': '//pc-newtab.maxthonimg.com/static/img/search_logo/_light/Amoazon' + (!isZh ? '_en' : '') + '.svg',
        'search.yahoo.com': '//pc-newtab.maxthonimg.com/static/img/search_logo/_light/Yahoo' + (!isZh ? '_en' : '') + '.svg',
        'yandex.ru': '//pc-newtab.maxthonimg.com/static/img/search_logo/_light/Yandex' + (!isZh ? '_en' : '') + '.svg',
        's.maxthon.com': '//pc-newtab.maxthonimg.com/static/img/search_logo/_light/muti' + (!isZh ? '_en' : '') + '.svg',
        'eu.ask.com': '//pc-newtab.maxthonimg.com/static/img/search_logo/_light/ASK' + (!isZh ? '_en' : '') + '.svg',
        'www.sougou.com': '//pc-newtab.maxthonimg.com/static/img/search_logo/_light/sougou' + (!isZh ? '_en' : '') + '.svg'
    }
}

$search.on('submit', '.search-form', function (e) {

    // 搜索框输入关键词回车或点击搜索按钮时触发
    require('static/js/datacode').statistic({m: 'newSearch'});
    // 挖矿浏览器心跳上报
    Api.useApi('common.reportLVTAction', { 'action': 'p-mx5Newtab_searchResult'});
    var action = $(this).attr('action');
    if (action === 'http://s.maxthon.com/') {
        var key = $searchInput.val();
        if (key === '') {
            return false;
        }
        maxthon.webSend("quickaccess.multiSearch", { key: key }, function (data) { })
        return false;
    }
    var $form = $(this);
    // 根据用户配置打开网址
    Api.getUserProfile(function(userProfile) {
        if(userProfile['open-search-newtab'] === true) {
            e.preventDefault();
            Api.useApi('newTabUpground', { 'url': action + '?' + $form.serialize()});
        } else {
            showZoomBox();
        }
    });
});

/**
 * 点击切换搜索引擎按钮
 */
$search.on('click', '.search-engine', function (e) {
    var $engineList = $searchEngine.find('.engine-list');
    if ($engineList.is(':visible')) {
        hideEngineList();
    } else {
        // 防止国际版en切到zh-cn标识丢失
        $engineList.show();
    }
    var curIndex = 0;
    var maxLenght = $engineList.find('p').length - 1;
    $(document).off('keydown').on('keydown', function (e) {
        switch (e.keyCode) {
            case 38: //向上键
                if (curIndex < 0) {
                    curIndex = maxLenght;
                }
                // console.log(curIndex);
                $engineList.find('p').removeClass('hover');
                $engineList.find('p').eq(curIndex--).addClass('hover');
                break;
            case 40: //向下键
                if (curIndex > maxLenght) {
                    curIndex = 0;
                }
                // console.log(curIndex);
                $engineList.find('p').removeClass('hover');
                $engineList.find('p').eq(curIndex++).addClass('hover');
                break;
            case 13:
                $engineList.find('p').eq(curIndex).trigger('click');
                break;
        }
        e.preventDefault();
    });

    $changeEngine.toggleClass('down');
    e.stopPropagation();
    e.preventDefault();
});

/**
 * 设置搜索引擎
 */
function setEngine(data) {
    var arrTmp = data.url.split('?');
    var action = arrTmp[0];
    if (arrTmp[1]) {
        var nameParam = arrTmp[1].match(/[\w\-]+=%[\w\-]+/g);
        var keywordName = nameParam[0].split('=')[0];
        var reg = new RegExp('&*' + nameParam + '&*', 'g');
        var param = arrTmp[1].replace(reg, '&').replace(/^&+|&+$/g, '');

        $searchInput.attr('name', keywordName);
        // 添加搜索额外参数
        param = param.replace(/^&+|&+$/g, ''); // 矫正首尾无效值
        var arr = param.split('&');
        var $extraParam = $('<div>', { 'class': 'extra-param' });
        var tmpl = '';
        for (var i = 0; i < arr.length; i++) {
            var n = arr[i].indexOf('=');
            var key = arr[i].substring(0, n);
            var value = arr[i].substring(n + 1);
            tmpl += '<input type="hidden" name="' + key + '" value="' + value + '">';
        }
        $searchForm.find('.extra-param').remove();
        $searchForm.append($extraParam);
        $extraParam.html(tmpl);
    }
    
    var domain = data.url.match(/https?:\/\/([^\/]+)\//i);
    if (domain) {
        domain = domain[1];
    }

    var searchLogo = dataEngine['logo'][domain];
    if (searchLogo === undefined || searchLogo === '') {
        searchLogo = dataEngine['logo']['default'];
    }

    if ($('body').hasClass('dark')) {
        searchLogo = searchLogo.replace('/_light/', '/_dark/');
    }

    $searchLogo.attr('src', searchLogo);
    $changeEngine.text(data.name);
    $searchForm.attr('action', action);
    // 百度搜索特殊处理
    if (data.name == '百度' && !data.url.match(/^https/)) {
        $searchForm.attr('action', action.replace('http', 'https'));
    }
}

/**
 * 搜索时模拟页面跳转
 */
function showZoomBox() {
    var zoomBox = $('<div id="zoom-box"></div>');
    var rect = document.body.getBoundingClientRect();
    zoomBox.appendTo('body');
    zoomBox.css({
        left: rect.left + "px",
        top: rect.top + "px",
        right: rect.right + "px",
        bottom: rect.bottom + "px"
    });
    zoomBox.addClass('in');

    setTimeout(function () {
        zoomBox[0].style.cssText = '';
        zoomBox[0].style.opacity = 1;
    }, 10);
}

/**
 * 隐藏搜索引擎切换列表
 */
function hideEngineList() {
    $engineList.hide();
    $changeEngine.addClass('down'); // 恢复箭头方向
    $(document).off('keydown');
    $engineList.find('p').removeClass('hover');
}

/**
 * 生成搜索引擎列表
 */
function buildEngineList(ele, list) {
    var res = '<div class="engine-list-inner">';
    var _Language = dataEngine['lang'];
    list.forEach(function (item, i) {
        res += '<p data-engine=' + i + '><img src="mx://favicon/' + item.url + '" /><span>' + item.name + '</span></p>';
    });

    res += '</div>';
    ele.empty().append(res);

    $searchInput.attr('placeholder', _Language['searchText'][lang] || _Language['searchText']['en-us']);
    $searchEngine.attr('title', Language.getLang('SelectDefaultEngine'));
}

function initEngineList() {
    Api.useApi('config.getMultiValues', { keys: "['browser.general.search_engine_list2', 'browser.general.default_search_engine2']" }, function (data) {
        if(typeof data === 'string') {
            data = JSON.parse(data);
        }
        
        var searchEngineList = JSON.parse(data[0] || []);
        var defaultSearchEngin = JSON.parse(data[1] || {});
        // 初始化搜索框
        setEngine(defaultSearchEngin);
        buildEngineList($engineList, searchEngineList);
        /**
         * 选择搜索引擎
         */
        $search.on('click', '.engine-list p', function (e) {
            var defaultSearch = searchEngineList[$(this).index()];
            setEngine(defaultSearch);
            Api.useApi('config.set', { key: 'browser.general.default_search_engine2', value: JSON.stringify(defaultSearch) }, function () {
            });
            hideEngineList();
            e.stopPropagation();
        });
    });
    
    Api.useApi('config.onChange', {}, function(data) {
        if(data.key && data.key === 'browser.general.default_search_engine2') {
            setEngine(JSON.parse(data.value));
        }
    });
}

initEngineList();
$(document).off('click', hideEngineList).on('click', hideEngineList);
