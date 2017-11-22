var $search = $('.search-bar');
var $searchEngine = $search.find('.search-engine');
var $changeEngine = $search.find('.change-engine');
var $searchForm = $search.find('.search-form');
var $engineIcon = $search.find('.engine-icon');

var dataEngine = {
    "engineList": {
        "baidu": {
            "name": "百度",
            "icon": "/static/images/baidu-icon.png",
            "url": "http://www.baidu.com/baidu?word=%us&ie=utf-8&tn=myie2dg&ch=6",
            "keyword": ""
        },
        "googleSearch": {
            "name": "谷歌搜索",
            "icon": "/static/images/google-icon.png",
            "url": "http://www.google.com.hk/cse?cx=partner-pub-2698861478625135:4231236449&ie=UTF-8&sa=Search&q=%us",
            "keyword": ""
        },
        "google": {
            "name": "谷歌",
            "icon": "/static/images/google-icon.png",
            "url": "http://www.google.com.hk/search?client=aff-maxthon-maxthon4&channel=t25&q=%us",
            "keyword": ""
        },
        "taobao": {
            "name": "淘宝",
            "icon": "/static/images/taobao-icon.png",
            "url": "http://s8.taobao.com/search?q=%s&pid=mm_12431063_2220385_8721096&commend=all&search_type=auction&user_action=initiative&f=D9_5_1&at_topsearch=1&sort=&spercent=0",
            "keyword": ""
        },
        "multi": {
            "name": "多重搜索",
            "icon": "/static/images/multi-icon.png",
            "url": "http://s.maxthon.com/?q=%us",
            "keyword": ""
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

$search.on('keydown', '.button', function(e) {
    if (e.keyCode === 13) { // 回车键
        // e.preventDefault();
        // var url = $searchForm.attr('action') + '?' + $(this).serialize();
        // console.log(url);
    }
});

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
    $searchForm.attr('action', action.replace('http', 'https'));
    $engineIcon.attr('src', data.icon);
    $changeEngine.text(data.name);

}
/**
 * 搜索切换列表使用fixed定位
 */
function setEngineListPos() {

}

/**
 * 隐藏搜索引擎切换列表
 */
function hideEngineList() {
    $searchEngine.find('.engine-list').hide();
    $changeEngine.removeClass('change-engine-close'); // 恢复箭头方向
}
