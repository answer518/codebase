var Api = require('static/js/api.js');
var $navigation = $('#navigation');
var $header = $('.header');
var $liList = $navigation.find('li');
var timer;
var cArr = ["p5", "p4", "p3"/*, "p2", "p1"*/];
var length = cArr.length - 1;

var index = 0;
if (window.localStorage && !localStorage.getItem('banner-coin-collapse')) {
    initList();
    begin();
} else {
    $('#small_hanger').addClass('visible');
    $navigation.addClass('fixed');
}

bindeEvent();

/**
 * 切换样式
 */
function switchClass() {
    $navigation.toggleClass('height24');
    $navigation.find('#small_hanger').toggleClass('visible');
}

function bindeEvent() {

    $navigation.on('click', ".next", function () {
        nextImg();
    });

    $navigation.on('click', ".prve", function () {
        preImg();
    });

    $navigation.on('click', '.close', function () {
        switchClass();
        // setTimeout(function() {
        $('.header').removeClass('no-fixed');
        $navigation.addClass('fixed');
        // }, 500);
        clearTimeout(timer);
        localStorage.setItem('banner-coin-collapse', 'done');
    });
    //点击图片能切换的功能
    //点击class为p3的图片
    $navigation.on("click", ".p3", function () {
        nextImg();
    });
    //点击class为p5的图片
    $navigation.on("click", ".p5", function () {
        preImg();
    });

    $navigation.on('click', '.click-btn', function () {
        var url = 'https://www.lives.one/reserve/?l=en-us&f=mx5qa';
        Api.useApi('newTabUpground', { 'url': url});
    });

    $navigation.on('click', '.small-hanger', function () {
        switchClass();
        initList();
        begin();
        localStorage.removeItem('banner-coin-collapse');
    });

    //自动播放功能
    var $container = $navigation.find('.container');
    //鼠标移入box时清除定时器
    $container.mouseover(function () {
        clearInterval(timer);
    });

    // 鼠标移出box时开始定时器
    $container.mouseleave(function () {
        timer = setInterval(nextImg, 4000);
    });
}

function nextImg() {
    cArr.unshift(cArr[length]); // 向开头添加p1
    cArr.pop(); // 把最后的p1删掉，最终数组是【p1,p5,p4,p3,p2】
    $liList.each(function (i, e) {
        $(e).removeClass().addClass(cArr[i]);
    });
    index++;
    if (index > length) {
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
        index = length;
    }
}

function begin() {
    // 展示轮播区域
    $navigation.addClass('height24').removeClass('fixed');
    $('.header').addClass('no-fixed');

    // 进入页面自动开始定时器
    timer = setInterval(nextImg, 4000);
}

function initList() {
    var isZh = navigator.language.toLocaleLowerCase() === 'zh-cn';
    var attr = isZh ? 'zh-src' : 'en-src';
    var adText = isZh ? '广告' : 'AD';

    $liList.each(function (i, dom) {
        var image = dom.getElementsByTagName('img')[0];
        if (image.getAttribute(attr)) {
            image.setAttribute('src', image.getAttribute(attr));
        }
    });
    $navigation.find('.ad-text').text(adText);
    $navigation.find('ul').removeClass('hide');
}