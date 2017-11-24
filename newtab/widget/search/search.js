var $search = $('.search-bar');
var $searchEngine = $search.find('.search-engine');
var $changeEngine = $search.find('.change-engine');
var $searchForm = $search.find('.search-form');
var $searchInput = $search.find('.button');
var $engineIcon = $search.find('.engine-icon');
var $engineList = $search.find('.engine-list');

var dataEngine = {
    "lang": {
        'zh-cn': '在这里输入网址或搜索内容',
        'en-us': 'Type to search or visit...'
    },
    "engineList": {
        "baidu": {
            "name": "百度",
            "icon": "/static/images/baidu-icon.png",
            "url": "http://www.baidu.com/baidu?word=%us&ie=utf-8&tn=myie2dg&ch=6"
        },
        "googleSearch": {
            "name": "谷歌搜索",
            "icon": "/static/images/google-icon.png",
            "url": "http://www.google.com.hk/cse?cx=partner-pub-2698861478625135:4231236449&ie=UTF-8&sa=Search&q=%us"
        },
        "google": {
            "name": "谷歌",
            "icon": "/static/images/google-icon.png",
            "url": "http://www.google.com.hk/search?client=aff-maxthon-maxthon4&channel=t25&q=%us"
        },
        "taobao": {
            "name": "傲游多重搜索",
            "icon": "/static/images/multi-icon.png",
            "url": "https://www.baidu.com/s?wd=%us&ie=utf-8&tn=90998635_hao_pg"
        },
        "multi": {
            "name": "购物搜索",
            "icon": "/static/images/multi-icon.png",
            "url": "http://ai.taobao.com/search/index.htm?key=%us&pid=mm_12431063_2220385_55870514&unid=&source_id=tdj_search&clk1=2e844211ed94a6588628156a65c839f4&upsid=2e844211ed94a6588628156a65c839f4"
        }
    }
}

/**
 * 点击切换搜索引擎按钮
 */
$search.on('click', '.search-engine', function(e) {
    var $engineList = $searchEngine.find('.engine-list');
    if ($engineList.is(':visible')) {
        hideEngineList();
    } else {
        var searchWidgetType = $searchForm.attr('data-engine');

        // 防止国际版en切到zh-cn标识丢失
        $engineList.show();
        setEngineListPos(); // 设置engineList位置
        $changeEngine.addClass('change-engine-close');
    }

    e.stopPropagation();
    e.preventDefault();
});

// $search.on('keydown', '.button', function(e) {
//     if (e.keyCode === 13) { // 回车键
//         // e.preventDefault();
//         // var url = $searchForm.attr('action') + '?' + $(this).serialize();
//         // console.log(url);
//     }
// });

/**
 * 选择搜索引擎
 */
$search.on('click', '.engine-list p', function(e) {
    var type = $(this).data('engine');
    setEngine(dataEngine.engineList[type]);

    localStorage.setItem('searchWidgetType', type);
    $searchForm.attr('data-engine', type);

    hideEngineList();
    e.stopPropagation();
});

/**
 * 设置搜索引擎
 */
function setEngine(data) {
    var arrTmp = data.url.split('?');
    var action = arrTmp[0];
    var action = arrTmp[0];
    var nameParam = arrTmp[1].match(/[\w\-]+=%[\w\-]+/g);
    var keywordName = nameParam[0].split('=')[0];
    var reg = new RegExp('&*' + nameParam + '&*', 'g');
    var param = arrTmp[1].replace(reg, '&').replace(/^&+|&+$/g, '');

    $engineIcon.attr('src', data.icon);
    $searchInput.attr('name', keywordName);
    $changeEngine.text(data.name);

    $searchForm.attr('action', action);
    // 百度搜索特殊处理
    if (data.name == '百度') {
        $searchForm.attr('action', action.replace('http', 'https'));
    }

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
    $extraParam.html(tmpl);
    $searchForm.find('.extra-param').remove();
    $searchForm.append($extraParam);
}
/**
 * 搜索切换列表使用fixed定位
 */
function setEngineListPos() {}

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
function buildEngineList(ele, data) {
    var res = '<div class="engine-list-inner">';
    for (var i in data.engineList) {
        res += '<p data-engine=' + i + '><img src=' + data.engineList[i].icon + '><span>' + data.engineList[i].name + '</span></p>';
    }
    res += '</div>';
    ele.empty().append(res);
    $searchInput.attr('placeholder', data['lang'][navigator.language.toLocaleLowerCase()] || data['lang']['en-us']);
}

buildEngineList($engineList, dataEngine);
$(document).off('click', hideEngineList).on('click', hideEngineList);
