var Api = require('static/js/api.js'),
    Language = require('static/js/language');

var $search = $('.search-bar');
var $searchEngine = $search.find('.search-engine');
var $changeEngine = $search.find('.change-engine');
var $searchForm = $search.find('.search-form');
var $searchInput = $search.find('.button');
var $engineList = $search.find('.engine-list');

var dataEngine = {
    "lang": {
        'zh-cn': '搜索',
        'en-us': 'search'
    }
}

$search.on('submit', '.search-form', function (e) {
    
    var action = $(this).attr('action');
    if (action === 'http://s.maxthon.com/') {
        var key = $searchInput.val();
        if(key === '') {
            return false;
        }
        maxthon.webSend("quickaccess.multiSearch", { key: key }, function (data) { })
        return false;
    }
    
    showZoomBox();
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
        $changeEngine.addClass('change-engine-close');
    }

    e.stopPropagation();
    e.preventDefault();
});

/**
 * 设置搜索引擎
 */
function setEngine(data) {
    var arrTmp = data.url.split('?');
    var action = arrTmp[0];
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

    $searchEngine.css({ 'background-image': 'url(mx://favicon/' + data.url + ')' });
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
    $changeEngine.removeClass('change-engine-close'); // 恢复箭头方向
}

/**
 * 生成搜索引擎列表
 */
function buildEngineList(ele, list) {
    var res = '<div class="engine-list-inner">';

    list.forEach(function (item, i) {
        res += '<p data-engine=' + i + '><img src="mx://favicon/' + item.url + '" /><span>' + item.name + '</span></p>';
    });

    res += '</div>';
    ele.empty().append(res);

    var lang = navigator.language.toLocaleLowerCase();
    $searchInput.attr('placeholder', dataEngine['lang'][lang] || data['lang']['en-us']);

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
}

initEngineList();
$(document).off('click', hideEngineList).on('click', hideEngineList);
