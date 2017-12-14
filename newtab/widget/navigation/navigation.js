var Api = require('static/js/api.js');
var $navigation = $('#navigation');
var $liList = $navigation.find('li');
Api.getSyncValue('noSyncData', function(data) {
    // if(!data || !data.isLoaded) {
        initList();
        bindeEvent();
    // }
});

function bindeEvent() {
    
    var cArr = ["p5", "p4", "p3"/*, "p2", "p1"*/];
    var $s = $(".buttons span");
    
    var index = 0;
    $(".next").click(function () {
        nextImg();
    });
    $(".prve").click(function () {
        preImg();
    });
    function nextImg() {
        cArr.unshift(cArr[2]);//向开头添加p1
        cArr.pop();//把最后的p1删掉，最终数组是【p1,p5,p4,p3,p2】
        $liList.each(function (i, e) {
            $(e).removeClass().addClass(cArr[i]);
        })
        index++;
        if (index > 2) {
            index = 0;
        }
    }
    function preImg() {
        cArr.push(cArr[0]); // 向数组末尾添加p5
        cArr.shift();       // 把开头的p5删掉，最终数组是【p4,p3,p2,p1,p5】
        $liList.each(function (i, e) {
            $(e).removeClass().addClass(cArr[i]);
        })
        index--;
        if (index < 0) {
            index = 2;
        }
    }

    $navigation.height(260);
    $navigation.on('click', '.close', function() {
        $navigation.height(0);
        Api.getSyncValue('noSyncData', function(data) {
            data = data || {};
            data.isLoaded = 'yes';
            Api.setSyncValue('noSyncData', data);
        });
    });
    //点击图片能切换的功能
    //点击class为p3的图片
    $(document).on("click", ".p3", function () {
        nextImg();
    });
    //点击class为p5的图片
    $(document).on("click", ".p5", function () {
        preImg();
    });
    
    //自动播放功能
    var $container = $navigation.find('.container');
    //鼠标移入box时清除定时器
    // $container.mouseover(function () {
    //     clearInterval(timer);
    // });
    
    // //鼠标移出box时开始定时器
    // $container.mouseleave(function () {
    //     timer = setInterval(nextImg, 4000);
    // });
    
    // // 进入页面自动开始定时器
    // timer = setInterval(nextImg, 4000);
}

function initList() {
    var attr = navigator.language.toLocaleLowerCase() !== 'zh-cn' ? 'en-src' : 'zh-src';

    $liList.each(function(i, dom) {
        var image = dom.getElementsByTagName('img')[0];
        image.setAttribute('src', image.getAttribute(attr));
    });

    $navigation.find('ul').removeClass('hide');
}