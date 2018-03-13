var Api = require('static/js/api.js');
var Tools = require('static/js/tools.js');
var dataCode = require('static/js/datacode.js');
var strUtils = require('static/js/strUtils');
var Language = require('static/js/language');
var helper = require('widget/main/helper');

var $wallpapers = $('#wallpapers'),
    $siderbar = $('#siderbar'),
    media = document.getElementById('media'),
    $blbg = $('.header .blbg'),
    image = null,
    doing = false,
    option,
    lang = navigator.language.toLocaleLowerCase(), 
    userProfile,
    urlLibrary = URL_LIBRARY[lang];

var $sbHeaderNav,
    $sbSections,
    $leftNav,
    $rightContent,
    $sbBg,
    $sbBgItem;

function test() {
    return lang === 'zh-cn' ? 
            `<ul class="left-nav fl">
                    <li class="current" code="popularWebSite">热门网址</li>
                    <li code="news">新闻资讯</li>
                    <li code="movie">影视频道</li>
                    <li code="shopping">网上购物</li>
                    <li code="social">社交网络</li>
                    <li code="literatureNovel">文学小说</li>
                    <li code="gameEntertainment">游戏娱乐</li>
                    <li code="lifeService">生活服务</li>
                </ul>` : 
            `<ul class="left-nav fl">
                <li class="current" code="default">Featured</li>
                <li code="social">Social</li>
                <li code="newsmedia">News&Media</li>
                <li code="shopping">Shopping</li>
                <li code="tools">Tools</li>
            </ul>`;
}

var tpl = `<div class="after"></div>
                <div class="sb-header">
                    <ul class="sb-header-nav">
                        <li>
                            <a class="sb-nav-link">${Language.getLang('Recommend')}</a>
                        </li>
                        <li>
                            <a class="sb-nav-link">${Language.getLang('Customize')}</a>
                        </li>
                        <li>
                            <a class="sb-nav-link">${Language.getLang('Background')}</a>
                        </li>
                        <li>
                            <a class="sb-nav-link">${Language.getLang('Other')}</a>
                        </li>
                    </ul>
                    <button class="close close-btn"></button>
                </div>
                <div class="sb-content">
                <div class="sb-section pl20">
                    <h3>${Language.getLang('AddRecommendSites')}</h3>
                    <div class="sb-search-box clearfix">
                        <input type="text" id="search_url" class="input" placeholder="${Language.getLang('EnterUrl')}..." autocomplete="off" />
                    </div>
                    ${test()}
                    <div class="right-content fr"></div>
                </div>
                <div class="sb-section pl20 pr20 hide">
                    <h3>${Language.getLang('PreviewIcon')}</h3>
                    <div class="preview-wrap">
                        <div class="preview">
                            <a href="javascript:void(0);" class="empty"></a>
                            <input type="hidden" id="custome_image" /> 
                            <input type="hidden" id="custome_bgColor" />
                            <button id="upload_btn" class="upload">${Language.getLang('UploadIcon')}</button>
                        </div>
                        <p class="describe">${Language.getLang('RecommendedIconSize')}：384 <em>x</em> 384<em>px</em></p>
                        <p class="describe">${Language.getLang('RecommendedIconVolume')}：${lang === 'zh-cn' ? '100<em>kb</em> 以内' : 'Within 100<em>kb</em>'}</p>
                    </div>
                    <div class="input-box clearfix">
                        <span class="fl label">${Language.getLang('Url')}</span>
                        <div class="fl">
                            <input type="hidden" id="custome_index" />
                            <input type="text" id="custome_url" placeholder="${Language.getLang('EnterUrl')}..." autocomplete="off" />
                        </div>
                    </div>
                    <div class="input-box clearfix">
                        <span class="fl label">${Language.getLang('Title')}</span>
                        <div class="fl"><input type="text" id="custome_title" placeholder="${Language.getLang('EnterTitle')}..." autocomplete="off"></div>
                    </div>
                    <div class="btn-group clearfix">
                        <button id="save_btn" class="btn fl"><span>${Language.getLang('Save')}</span></button>
                    </div>
                    <div id="errorInfo" class="input-box"></div>
                </div>
                <div class="sb-section pl20 hide">
                    <h3 class="help">
                        <span>${Language.getLang('SelectBackground')}</span>
                        <p class="help-tips">${Language.getLang('SelectBackgroundNotice')}</p>
                    </h3>
                    <ul class="sb-bg clearfix">
                        <li class="fl sb-bg-item">
                            <p class="pure-bg" style="height:100%;width:100%;background-color:#F6F6F6;"></p>
                        </li>
                        <li class="fl sb-bg-item">
                            <p class="pure-bg" style="height:100%;width:100%;background-color:#212121;"></p>
                        </li>
                        <li class="fl sb-bg-item">
                            <button class="bg-btn play"></button>
                            <img src="//pc-newtab.maxthonimg.com/static/img/bg/preview/bj-01.png" alt="" width="150" height="100" />
                        </li>
                        <li class="fl sb-bg-item">
                            <button class="bg-btn play"></button>
                            <img src="//pc-newtab.maxthonimg.com/static/img/bg/preview/bj-02.png" alt="" width="150" height="100" />
                        </li>
                        <li class="fl sb-bg-item">
                            <button class="bg-btn play"></button>
                            <img src="//pc-newtab.maxthonimg.com/static/img/bg/preview/bj-03.png" alt="" width="150" height="100" />
                        </li>
                        <li class="fl sb-bg-item">
                            <button class="bg-btn play"></button>
                            <img src="//pc-newtab.maxthonimg.com/static/img/bg/preview/bj-04.png" alt="" width="150" height="100" />
                        </li>
                        <li class="fl sb-bg-item">
                            <button class="bg-btn play"></button>
                            <img src="//pc-newtab.maxthonimg.com/static/img/bg/preview/bj-05.png" alt="" width="150" height="100" />
                        </li>
                        <li class="fl sb-bg-item">
                            <button class="bg-btn play"></button>
                            <img src="//pc-newtab.maxthonimg.com/static/img/bg/preview/bj-06.png" alt="" width="150" height="100" />
                        </li>
                        <li class="fl sb-bg-item">
                            <button class="bg-btn play"></button>
                            <img src="//pc-newtab.maxthonimg.com/static/img/bg/preview/bj-07.png" alt="" width="150" height="100" />
                        </li>
                        <li class="fl sb-bg-item">
                            <button class="bg-btn play"></button>
                            <img src="//pc-newtab.maxthonimg.com/static/img/bg/preview/bj-08.png" alt="" width="150" height="100" />
                        </li>
                        <li class="fl sb-bg-item">
                            <button class="bg-btn play"></button>
                            <img src="//pc-newtab.maxthonimg.com/static/img/bg/preview/bj-09.png" alt="" width="150" height="100" />
                        </li>
                        <li class="fl sb-bg-item">
                            <button class="bg-btn play"></button>
                            <img src="//pc-newtab.maxthonimg.com/static/img/bg/preview/bj-10.png" alt="" width="150" height="100" />
                        </li>
                    </ul>
                    <div class="btn-group fixed-bar">
                        <button id="custome_upload_bg_btn" class="btn fl"></button>
                    </div>
                </div>
                <div class="sb-section pl20 pr20 hide">
                    <h3>${Language.getLang('OpenSearchResultNewTab')}</h3>
                    <div class="split-line">
                        <div class="toggle">
                            <input type="checkbox" id="open-search-newtab" class="toggle-checkbox"/>
                            <label class="toggle-btn" for="open-search-newtab">
                                <span class="toggle-feature" data-label-on="on" data-label-off="off"></span>
                            </label>
                        </div>
                    </div>
                    <h3>${Language.getLang('OpenURLNewTab')}</h3>
                    <div class="split-line">
                        <div class="toggle">
                            <input type="checkbox" id="open-url-newtab" class="toggle-checkbox"/>
                            <label class="toggle-btn" for="open-url-newtab">
                                <span class="toggle-feature" data-label-on="on" data-label-off="off"></span>
                            </label>
                        </div>
                    </div>
                    <h3>${Language.getLang('SyncDataAutomatically')}</h3>
                    <div class="split-line">
                        <div class="toggle">
                            <input type="checkbox" id="open-async-data" class="toggle-checkbox" checked="checked"/>
                            <label class="toggle-btn" for="open-async-data">
                                <span class="toggle-feature" data-label-on="on" data-label-off="off"></span>
                            </label>
                        </div>
                        <p>${Language.getLang('SyncDataAutomaticallyNotice')}</p>
                    </div>
                    <h3>${Language.getLang('DynamicBackground')}</h3>
                    <div class="split-line">
                        <div class="toggle">
                            <input type="checkbox" id="open-dynamic-background" class="toggle-checkbox" checked="checked"/>
                            <label class="toggle-btn" for="open-dynamic-background">
                                <span class="toggle-feature" data-label-on="on" data-label-off="off"></span>
                            </label>
                        </div>
                        <p>${Language.getLang('DynamicBackgroundNotice')}</p>
                    </div>
                    <h3>${Language.getLang('MostVisit')}</h3>
                    <div class="split-line">
                        <div class="toggle">
                            <input type="checkbox" id="open-most-visit" class="toggle-checkbox" checked="checked"/>
                            <label class="toggle-btn" for="open-most-visit">
                                <span class="toggle-feature" data-label-on="on" data-label-off="off"></span>
                            </label>
                        </div>
                        <p>${Language.getLang('MostVisitNotice')}</p>
                    </div>
                    <h3>${Language.getLang('SetTextColor')}</h3>
                    <div class="split-line">
                        <p>
                            <label class="switch-btn">
                                <input type="radio" value="light" name="brightness" checked="checked" style="vertical-align:middle;"/>
                                <span class="switch-txt">${Language.getLang('dark')}</span>
                            </label>
                            <label class="switch-btn">
                                <input type="radio" value="dark" name="brightness" style="vertical-align:middle;"/>
                                <span class="switch-txt">${Language.getLang('light')}</span>
                            </label>
                        </p>
                    </div>
                    <h3>${Language.getLang('RecoverDefaultSettings')}</h3>
                    <div class="split-line">
                        <button class="reset-btn">${Language.getLang('RecoverNow')}</button>
                        <p>${Language.getLang('RecoverDefaultSettingsNotice')}</p>
                    </div>
                </div>
            </div>`;

function start() {
    init();
    bindEvent();
}

function init() {
    renderSiderbar();
    getOption(function (config) {
        option = config;
        renderSetting();
        if (option.nBgIndex === -1 && option.nCustomBackground) {
            var img = new Image();
            img.onload = function () {
                lazyLoadImage(option.nCustomBackground);
                switchDarkOrLight(option.nBrightness);
                // 启用手动设置文字颜色
                enableDarkOrLight(true);
            }
            img.onerror = function () {
                option.nBgIndex = 0;
                switchBackground('');
                switchDarkOrLight('light');
                saveOption();
            }
            img.src = option.nCustomBackground;
        } else {
            $sbBgItem.eq(option.nBgIndex).addClass('selected');
            switch(option.nBgIndex) {
                case 0:
                    switchBackgroudColor('#F6F6F6');
                    switchDarkOrLight('light');
                    break;
                case 1:
                    switchBackgroudColor('#212121');
                    switchDarkOrLight('dark');
                    break;
                default:
                    // 关闭了动态背景
                    var src = $sbBgItem.eq(option.nBgIndex).find('img').attr('src');
                    // 关闭了动态背景
                    if (option['open-dynamic-background'] === false) {
                        lazyLoadImage(src);
                    } else {
                        switchBackgroundVideo(src, option.nPlay);
                    }
                    switchDarkOrLight('dark');
                    break;
            }
            enableDarkOrLight(false);
        }
    });
}

/**
 * 渲染面板
 */
function renderSiderbar() {
    $siderbar.empty().append(tpl);
    $sbHeaderNav = $siderbar.find('.sb-header-nav li'),
    $sbSections = $siderbar.find('.sb-section'),
    $leftNav = $siderbar.find('.left-nav li'),
    $rightContent = $siderbar.find('.right-content'),
    $sbBg = $siderbar.find('.sb-bg'),
    $sbBgItem = $siderbar.find('.sb-bg-item');
}

/**
 * 重置设置面板
 */
function renderSetting() {

    Api.useApi('account.getCurrentAccount', {}, function (data) {
        if (data.id === -1) { // 游客
            $('#open-async-data').removeAttr('checked').prop('disabled', 'disabled');
        } else {
            if (option['open-async-data'] === false) {
                $('#open-async-data').removeAttr('checked');
            }
        }
    });

    if(option['open-search-newtab'] === true) {
        $('#open-search-newtab').attr('checked', 'checked');
    }

    if(option['open-url-newtab'] === true) {
        $('#open-url-newtab').attr('checked', 'checked');
    }

    if (option['open-dynamic-background'] === false) {
        $('#open-dynamic-background').removeAttr('checked');
        $siderbar.find('.bg-btn').addClass('disable-dynamic-btn');
    }
    
    if (option['open-most-visit'] === false) {
        $('.fav-list-warp').addClass('hide');
        $('#open-most-visit').removeAttr('checked');
    } else {
        if (option['hide-most-visit'] === true) {
            $('.fav-collapse').addClass('down').attr('title', Language.getLang('DisplayOftenVisit'));
            $('.fav-list-container').addClass('collapse');
        } else {
            $('.fav-collapse').attr('title', Language.getLang('HideOftenVisit'));
            $('.fav-collapse').removeClass('down');
            $('.fav-list-container').removeClass('collapse');
        }
    }
    
    if(option['nBgIndex'] === -1 && option['nBrightness'] === 'dark') {
        $siderbar.find('.switch-btn').eq(1).click();
    }
}

function bindEvent() {

    $siderbar.on('click', '.close', function () {
        hideSider();
    });

    $siderbar.on('click', '.sb-header-nav li', function (e) {
        e.stopPropagation();
        var $this = $(this);
        $sbHeaderNav.removeClass('current');
        $this.addClass('current');
        $sbSections.addClass('hide');
        $sbSections.eq($this.index()).removeClass('hide');

        // 点击设置中的背景时触发
        if ($this.index() === 2) {
            dataCode.statistic({ m: 'background' });
        }
    });

    var searchTimer;
    $siderbar.on('input', '#search_url', function () {

        if (searchTimer) {
            clearTimeout(searchTimer);
        }
        searchTimer = setTimeout(function () {
            searchFun();
        }, 500);
        return false;
    });

    $siderbar.on('click', '.left-nav li', function (e) {
        e.stopPropagation();
        $leftNav.removeClass('current');
        render(urlLibrary[$(this).index()]);

        $siderbar.find('#search_url').val('');
        $(this).addClass('current');
    });

    $siderbar.on('click', '.right-content > a', function (event) {
        event.preventDefault();
        var $this = $(this);

        if ($this.hasClass('added')) { // 已经添加过不能重复添加
            return;
        }

        var item = {
            'title': $this.attr('d-title'),                                  // 标题
            'url': $this.attr('href'),                                       // url链接
            'image': $this.attr('d-image')                                   // 图片路径
        }

        var index = $siderbar.find('#custome_index').val();
        var Controller = require('widget/main/main');
        var currentGrid = Controller.getGridItem(index).grid;
        if (currentGrid.type === 'button') {
            Controller.onInsertGridItem(item);
        } else {
            item.index = currentGrid.index;
            Controller.onUpdateGridItem(item);
        }

        $this.addClass('added');

        // 点击设置中推荐时触发
        var classAdd = 'classAdd', _class = $leftNav.filter('.current').attr('code');
        if ($siderbar.find('.right-content').hasClass('search')) {
            classAdd = 'searchAdd';
        }

        dataCode.statistic({ m: 'settingRecommend', n: classAdd, data: { 'class': _class } });
    });

    $siderbar.on('click', '#upload_btn', function () {
        Api.useApi("quickaccess.selectImage", {}, function (result) {
            if (result && result.succeed === true) {
                $siderbar.find('.preview a').removeAttr('style').css({ 'background-image': 'url(' + result.path + ')' }).text('');
                $siderbar.find('#custome_image').val(result.path);
                // 上传自定义图标成功后, 将原来的色块背景置空
                $siderbar.find('#custome_bgColor').val('');
            } else {
                console.log('upload error');
            }
        });
    });

    $siderbar.on('click', '#custome_upload_bg_btn', function () {
        Api.useApi("quickaccess.selectBgImage", {}, function (result) {
            if (result && result.succeed === true) {
                var CUSTOM_BACKGROUND = 'mx://newtab/user_custom_bg_image.png?v=' + (new Date().getTime());
                option.nBgIndex = -1;
                option.nCustomBackground = CUSTOM_BACKGROUND;
                saveOption();
                switchBackground(CUSTOM_BACKGROUND);
                switchDarkOrLight();
                $sbBgItem.removeClass('selected');
                enableDarkOrLight(true);
            } else {
                console.log(result);
            }
        });
    });

    $siderbar.on('input', '#custome_url', function () {
        var url = $(this).val().trim();
        if (url.length === 0) {
            $siderbar.find('#save_btn').removeClass('save');
            $siderbar.find('.input-box').removeClass('input-box-err');
            $siderbar.find('#errorInfo').hide();
            return;
        }
        // 添加按钮可用
        $siderbar.find('#save_btn').addClass('save');

        var $custome_image = $siderbar.find('#custome_image');
        var $custome_bgColor = $siderbar.find('#custome_bgColor');
        // 有上传图标
        if($custome_image.val() !== '' && $custome_bgColor.val() === '') {
            return;
        }

        var image = findImageByUrl(url);
        // 匹配到推荐图片预览图标显示推荐图片，否则清空
        if (image !== '') {
            $custome_image.val(image);
            $siderbar.find('.preview a').css({ 'background-image': 'url(' + image + ')' }).text('');
            $custome_bgColor.val('');
        } else {
            var title = $siderbar.find('#custome_title').val().trim();
            if (title.length === 0) {
                title = url;
            }

            Api.getMeanColor(url, function (bgColor) {
                $siderbar.find('.preview a').removeAttr('style').css({ 'background-color': bgColor }).text(title.slice(0, 1));;
                $custome_bgColor.val(bgColor);
            });
            $custome_image.val('');
        }
    });

    $siderbar.on('input', '#custome_title', function () {
        var title = $(this).val().trim();
        var bgColor = $siderbar.find('#custome_bgColor').val().trim();
        if (bgColor.length > 0) {
            if (title.length === 0) {
                title = $siderbar.find('#custome_url').val().trim();
            }
            $siderbar.find('.preview a').text(title.slice(0, 1));
        }
    });

    $siderbar.on('click', '#save_btn', function () {

        if (!$(this).hasClass('save')) {
            return;
        }
        var Controller = require('widget/main/main');
        var index = $siderbar.find('#custome_index').val();
        var currentGrid = Controller.getGridItem(index).grid;
        var url = $siderbar.find('#custome_url').val().trim();
        var title = $siderbar.find('#custome_title').val().trim();
        var image = $siderbar.find('#custome_image').val();
        var bgColor = $siderbar.find('#custome_bgColor').val();

        if (url.length === 0) {
            alert(Language.getLang('EnterUrl')); //
            return;
        }

        if (url.indexOf('..') > 0) { // 
            $siderbar.find('#errorInfo').html(Language.getLang('CheckUrl')).show();
            $siderbar.find('#custome_url').parents('.input-box').addClass('input-box-err');
            $siderbar.find('#custome_url').focus();
            return;
        }

        if (title.length === 0) {
            title = url;
        }

        if (!url.match(/^https?:\/\//)
            && !url.match(/^file:\/\//)
            && !url.match(/^mx:\/\//)
            && !url.match(/^ftp:\/\//)) {
            url = 'http://' + url;
        }

        // clear erro
        $siderbar.find('.input-box').removeClass('input-box-err');
        $siderbar.find('#errorInfo').hide();

        var item = {
            url: url,
            title: title,
            image: image
        }

        if (currentGrid.type === 'button') { // 新增
            Api.getMeanColor(item.url, function (bgColor) {
                item.bgColor = bgColor;
                Controller.onInsertGridItem(item, currentGrid);
                dataCode.statistic({ m: 'customWebSite' });
                // 挖矿浏览器心跳上报
                Api.useApi('common.reportLVTAction', { 'action': 'p-mx5Newtab_addWebSite' });
                hideSider();
            });
        } else {
            if (bgColor) {
                item.bgColor = bgColor;
                delete item.image;
            }
            item.index = currentGrid.index;
            Controller.onUpdateGridItem(item);
            hideSider();
        }
    });

    $siderbar.on('click', '.sb-bg-item', function () {
        var $this = $(this);
        if ($this.hasClass('selected') || doing !== false) return;

        $sbBgItem.removeClass('selected');
        $(this).addClass('selected');

        // 清除自定义图
        // localStorage.removeItem('CUSTOM_BACKGROUND');
        var nBgIndex = $this.index();
        var ueip = { m: 'switchbackground', data: { position: nBgIndex } };
        // 前两个背景是纯色背景
        switch(nBgIndex) {
            case 0:
                // 动画结束
                doing = false;
                switchBackgroudColor('#F6F6F6');
                switchDarkOrLight('light');
                break;
            case 1:
                // 动画结束
                doing = false;
                switchBackgroudColor('#212121');
                switchDarkOrLight('dark');
                break;
            default:
                // 动画进行中
                doing = true;
                // 关闭了动态背景
                if ($sbBgItem.find('button').hasClass('disable-dynamic-btn')) {
                    switchBackground($this.find('img').attr('src'));
                    ueip.n = 'staticBackground';
                } else {
                    switchBackgroundVideo($this.find('img').attr('src'), true);
                    ueip.n = 'dynamicBackground';
                }
                switchDarkOrLight('dark');
                break;
        }

        option.nBgIndex = nBgIndex; // 新版背景图标示
        option.nCustomBackground && delete option.nCustomBackground;
        saveOption(option);
        // 禁用文字颜色切换
        enableDarkOrLight(false);
        // 切换背景图片的点击情况
        dataCode.statistic(ueip);
    });

    $siderbar.on('click', '.toggle-checkbox', function (e) {
        var $this = $(this);
        var checked = $this.is(':checked');
        var id = $this.attr('id');

        var ueip = { m: 'setingSet' };
        option[id] = checked;
        switch (id) {
            case 'open-async-data':
                if (checked) {
                    ueip.n = 'openAuto';
                } else {
                    ueip.n = 'closeSync';
                }
                break;
            case 'open-dynamic-background':
                if (checked) {
                    $siderbar.find('.bg-btn').removeClass('disable-dynamic-btn');
                    if (option.nBgIndex > 1) {
                        switchBackgroundVideo($sbBgItem.eq(option.nBgIndex).find('img').attr('src'));
                    }
                    ueip.n = 'openBackground';
                } else {
                    $siderbar.find('.bg-btn').addClass('disable-dynamic-btn');
                    if (option.nBgIndex > 1) {
                        lazyLoadImage($sbBgItem.eq(option.nBgIndex).find('img').attr('src'), function() {
                            media.removeAttribute('src');
                            media.removeAttribute('poster');
                            media.className = ''; // 隐藏
                            option && delete option.nPlay;
                        });
                    }
                    ueip.n = 'closeBackground';
                }
                break;
            case 'open-most-visit':
                if (checked) {
                    ueip.n = 'openVisit';
                } else {
                    ueip.n = 'closeVisit';
                }
                closeOrOpenMostVisit(checked);
                break;
        }

        saveOption(option);
        // 点击设置icon中的设置触发
        dataCode.statistic(ueip);
    });

    $siderbar.on('click', '.reset-btn', function (e) {
        $siderbar.find('.toggle-checkbox').each(function (i, item) {
            if(i < 2) {
                if (!$(item).is(':checked')) return true; // 相当于continue
            } else {
                if ($(item).is(':checked')) return true; // 相当于continue
            }
            $(item).trigger('click');
        });

        // 点击设置icon中的设置触发
        dataCode.statistic({ m: 'setingSet', n: 'reducation' });
    });

    $siderbar.on('click', '.play', function (e) {
        e.stopPropagation();
        // 检查vedio初始
        if (media.networkState === 3) { // 没有找到视频源
            media.load();
            return;
        }
        // var nBgIndex = option.nBgIndex;
        if (media.paused) {
            media.play();
            option.nPlay = true;
        } else {
            media.pause();
            option.nPlay = false;
        }
        saveOption(option);
    });

    $siderbar.on('click', '.switch-btn', function (e) {
        var $this = $(this);
        if(option.nBgIndex !== -1 || $this.find('input').prop("checked")) {
            return ;
        }
        var brightness = $this.find('input').val();
        switchDarkOrLight(brightness);
        option.nBrightness = brightness
        saveOption();
    });

    $siderbar.on('click', '.go-to-add', function (e) {
        $sbHeaderNav.eq(1).trigger('click');
    });

    media.addEventListener('play', function () {
        // console.log('play');
        $wallpapers.removeAttr('style');
        media.className = 'show';
        $siderbar.find('.bg-btn').removeClass('start').removeClass('loading').addClass('pause');
    });

    media.addEventListener('error', function () {
        $siderbar.find('.bg-btn').addClass('start');
    });

    media.addEventListener('pause', function () {
        media.className = 'show';
        $siderbar.find('.bg-btn').removeClass('pause').removeClass('loading').addClass('start');
    });
    // 解决视频后台播放的问题
    var playFlag = false; 
    function onVisibilityChanged(event) {
        var hidden = event.target.webkitHidden;
        if (hidden) {
            if(!media.paused) {
                media.pause();
                playFlag = true;
            }
        } else {
            if(playFlag === true && media.paused) {
                media.play();
                playFlag = false;
            }
        }
    }
    // 解决新标签页进入后台后，暂停播放，显示到前台继续播放
    document.addEventListener("webkitvisibilitychange", onVisibilityChanged, false);

    // 解决视频背景比例显示的问题
    var onresize = function (e) {
        var height = window.innerHeight;
        // if(media.className === 'show') {
        //     var width = height * 16 / 9;
        //     media.style.cssText = `width: ${width}px;height:${height}px;`;
        // } else {
        //     media.removeAttribute('style');
        // }
        $sbBg.height(height - 124);
        $rightContent.height(height - 130);
    }

    onresize();
    window.addEventListener('resize', Tools.throttle(onresize, 100, 300), false);
}

/**
 * 根据URL查找图片列表
 * @param  {[type]}   url      [description]
 * @return {[type]}            [description]
 */
function findImageByUrl(url, callback) {
    if (url.length == 0) return;
    var qUrl = !url.match(/^https?:\/\//) ? 'http://' + url : url;
    var urlReg = /^((https|http)?:\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
    if (!urlReg.test(qUrl)) return '';
    if (/http:\/\/go.maxthon.(cn|com)\/redir\/mx(4|5)\//.test(url)) {
        var qStr = url.getQueryString('f');
        switch (qStr) {
            case 'tmall':
                qUrl = 'http://jx.tmall.com';
                break;
            case 'fbmx5':
                qUrl = 'https://www.facebook.com/maxthon';
                break;
            case 'jumei':
                qUrl = 'http://bj.jumei.com/';
                break;
            case 'juhuasuan':
                qUrl = 'https://ju.taobao.com/';
                break;
            case 'meituan':
                qUrl = 'http://bj.meituan.com/';
                break;
            case 'aitaobao':
                qUrl = 'http://ai.taobao.com/';
                break;
            case 'vipshop':
                qUrl = 'http://www.vip.com/';
                break;
            case 'amazon':
                qUrl = 'https://www.amazon.cn';
                break;
            case 'gome':
                qUrl = 'http://www.gome.com.cn/';
                break;
            default:
                qUrl = 'http://www.' + qStr + '.com';
                break;
        }
    }

    var regex = /.*\:\/\/([^\/]*).*/;
    var match = qUrl.match(regex);
    var host = '', image = '';
    if (typeof match != "undefined" && null != match) {
        if ((match[0] === 'https://vk.com/maxthon_ru' ||
            match[0] === 'https://facebook.com/maxthon.org.ru' ||
            match[0] === 'http://maxthon.org.ru')) {
            host = match[0];
        } else {
            host = match[1];
        }
    }
    if (host === 'go.maxthon.com' || host === 'go.maxthon.cn') return '';
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
                    image = _category.image;
                    i = langLibrary.length;
                    break innerloop;
                }

                if (_category.match) {
                    for (var k = 0; k < _category.match.length; k++) {
                        var __url = _category.match[k];
                        if (__url.indexOf(host) >= 0) { // 开头
                            image = _category.image;
                            i = langLibrary.length;
                            break innerloop;
                        }
                    }
                }
            }
        }
    }
    return image;
}

/**
 * 关闭最常访问区域
 * @param checked  true: close, false : open
 */
function closeOrOpenMostVisit(checked) {
    if (checked === true) {
        $('.fav-list-warp').removeClass('hide');
        setTimeout(function() {
            $('.fav-list-container').removeClass('collapse');
            $('.fav-collapse').removeClass('down');
        }, 0);
        delete option['hide-most-visit'];
    } else {
        $('.fav-list-container').addClass('collapse');
        setTimeout(function() {
            $('.fav-list-warp').addClass('hide');
        }, 300);
    }
}

function switchBackground(path) {
    lazyLoadImage(path, function() {
        media.removeAttribute('src');
        media.removeAttribute('poster');
        media.className = ''; // 隐藏
        option && delete option.nPlay;
    });
}

function switchBackgroudColor(color) {
    $wallpapers.removeAttr('style').css({'background-color': color});
    $blbg.removeAttr('style').css({'background-color': color, opacity: 1});
    media.removeAttribute('src');
    media.removeAttribute('poster');
    media.className = ''; // 隐藏
    option && delete option.nPlay;
}

function switchBackgroundVideo(path, play) {
    path = path.replace(/\/preview\//, '/');
    media.className = '';
   
    lazyLoadImage(path, function() {
        var isPlay = play === false ? false : true;
        media.setAttribute('poster', path);
        media.setAttribute('src', path.replace(/([A-Za-z\-0-9]+).png/, function (val, $1) {
            return $1 + '.mp4';
        }));
    
        if (isPlay === true) {
            media.play();
        } else {
            media.pause();
            // 初始化时不触发pause事件
            // $config_layer.find('.operate-button').removeClass('loading').addClass('start');
        }
        media.className = 'show';
    });
}

function lazyLoadImage(path, succ, err) {
    image = new Image();
    path = path.replace(/\/preview\//, '/');
    image.onload = function () {
        // 动画
        var anim_box = document.querySelector('.anim_fade_image');
        anim_box.style.cssText = `background-image: url('${path}'); opacity:1;`;
        $blbg.removeAttr('style');
        window.animFun = function() {
            doing = false;
            console.log(doing);
            $wallpapers.css({ 'background-image': 'url(' + path + ')' });
            succ && succ();
            anim_box.style.display = 'none';
            anim_box.removeAttribute('style');
            anim_box.removeEventListener('transitionend', window.animFun);
            $blbg.css({ 'background-image': 'url(' + path + ')', opacity: 1});
        }
        //动画结束时事件 
        anim_box.addEventListener('transitionend', window.animFun, false);
        image = null;
    }
    image.onerror = function () {
        image = null;
        err && err();
    }
    image.src = path;
}

function switchDarkOrLight(brightness) {
    var $body = $('body');
    if (!brightness) {
        if (option.nBgIndex === -1) {
            calcMeanColor(option.nCustomBackground);
            return false;
        } else {
            brightness = 'light'; // 默认都是这个
        }
    }
    var $searchLogo = $('#s_lg_img');
    var src = $searchLogo.attr('src');
    if(brightness === 'light') {
        $searchLogo.attr('src', src.replace('/_dark/', '/_light/'));
    } else {
        $searchLogo.attr('src', src.replace('/_light/', '/_dark/'));
    }
    $body.attr('class', brightness);
    option.nBrightness = brightness;
}

/**
 * 启用或禁用文字颜色
 * @param {*} enable 
 */
function enableDarkOrLight(enable) {
    if(enable === true) {
        $siderbar.find('input[name="brightness"]').removeAttr('disabled');
        $siderbar.find('.switch-btn').removeClass('disabled');
    } else {
        $siderbar.find('input[name="brightness"]').attr("disabled", "disabled");
        $siderbar.find('.switch-btn').addClass('disabled');
    }
}

function getOption(next) {
    Api.getUserProfile(function (config) {
        if(config.nBgIndex === undefined) {
            config.nBgIndex = 0;
        }
        next(config);
    });
}

function saveOption() {
    Api.setSyncValue('noSyncData', option);
}

function getImageData(img, loaded) {
    var imgObj = new Image();
    var imgSrc = img.src || img;
    if (imgSrc.substring(0, 5) !== 'data:')
        imgObj.crossOrigin = "Anonymous";

    imgObj.onload = function () {
        var context = getContext(imgObj.width, imgObj.height);
        context.drawImage(imgObj, 0, 0);

        var imageData = context.getImageData(0, 0, imgObj.width, imgObj.height);
        loaded && loaded(imageData.data);
    };

    imgObj.src = imgSrc;
}

function getContext(width, height) {
    var canvas = document.createElement("canvas");
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    return canvas.getContext('2d');
}

function calcMeanColor(isCustomBG) {
    if (!isCustomBG || isCustomBG.length === 0) return;
    
    getImageData(isCustomBG, function (imageData) {
        if (worker) {
            worker.terminate();
        }

        var worker = new Worker("/static/js/worker/calc_mean_color.js");
        worker.onmessage = function (message) {
            console.timeEnd("calc color");
            console.info(message.data);
            var brightness = 'light';
            if (message.data < 128) {// 代表图片是深色
                brightness = 'dark';
            }
            if(brightness === 'dark') {
                $siderbar.find('.switch-btn').eq(1).click();
            }
            switchDarkOrLight(brightness);
            saveOption();
        };
        console.time("calc color");
        worker.postMessage(imageData); // Start the worker.  
    });
}

function render(data, type) {
    var _html = [], $rightContent = $siderbar.find('.right-content');
    if (data.list.length === 0) {
        _html.push(`<div class="no-search">
            <img src="//pc-newtab.maxthonimg.com/static/img/noresult.svg" alt="not result">
            <p class="word">${Language.getLang('NotFound')}</p>
            <p><button class="go-to-add">${Language.getLang('GoToAdd')}</button></p>
        </div>`);
        $rightContent.empty().append(_html.join(''));
    } else {
        var data_list = require('widget/main/main').getDataList();
        data.list.forEach(function (item) {
            item = helper.tranData(item);
            var itemCount = Tools.getCountByItem(data_list, item);
            if (itemCount >= 1) {
                item.isAdded = true;
            } else {
                delete item.isAdded;
            }
            _html.push(`
                <a href="${item.url}" d-title="${item.title}" d-image="${item.image}" target="_blank" class="fl ${fn(item.isAdded)}">
                    <img class="grid-img" src="${item.image}" width="60" height="60"/>
                    <p class="grid-title" title="${item.title}">${item.title}</p>
                </a>
            `);
        });
        var tpl = _html.join('');
        if (type && type !== '') {
            $rightContent.addClass('search');
        } else {
            $rightContent.removeClass('search');
        }
        $rightContent.empty().append(tpl);
    }
}

function fn(isAdded) {
    return isAdded === true ? 'added' : '';
}

function searchFun() {
    var search = $siderbar.find('.sb-search-box input').val().replace(/\s+/g, "");

    var html = [];
    if (search.length === 0) {
        render(urlLibrary[search.length]);
        return;
    }

    var result = { list: [] };
    for (var attr in URL_LIBRARY) {
        var data = URL_LIBRARY[attr];
        for (var i = 0; i < data.length; i++) {
            var list = data[i].list;

            for (var j = 0; j < list.length; j++) {
                var item = list[j];
                if (item.url.indexOf(search) !== -1 || item.title.indexOf(search) !== -1) {
                    result.list.push(item);
                    continue;
                }
            }
        }
    }

    render(result, 'search');
    // 默认高亮第一个标签
    $leftNav.removeClass('current').eq(0).addClass('current');
}

function testFun(e) {
    var $siderbar = $('#siderbar');
    if(!$siderbar.is(event.target) && $siderbar.has(event.target).length === 0) {
        hideSider();
    }
}

/**
 * 展开侧边栏
 */
function showSider(opt) {
    opt = opt || {};

    var type = opt.type || '';
    var data = opt.data || { index: '', url: '', title: '', image: '' };
    switch (type) {
        case 'custome':
            $sbHeaderNav.eq(1).trigger('click');
            // 图标存在且不是截图类型的时候，显示预览图
            if (data.image && !data.image.match(/^mx:\/\/thumbs/)) {
                $siderbar.find('.preview a').removeAttr('style').css({ 'background-image': 'url(' + data.image + ')' }).text('');
                $siderbar.find('#custome_image').val(data.image);
            } else {
                if (data.bgColor) {
                    $siderbar.find('.preview a').removeAttr('style').css({ 'background-color': data.bgColor }).text(data.title.slice(0, 1));
                    $siderbar.find('#custome_bgColor').val(data.bgColor);
                }

                Api.getMeanColor(data.url, function (bgColor) {
                    $siderbar.find('.preview a').removeAttr('style').css({ 'background-color': bgColor }).text(data.title.slice(0, 1));
                    $siderbar.find('#custome_bgColor').val(bgColor);
                });
            }

            $siderbar.find('.preview a').removeClass('empty');
            $siderbar.find('#save_btn').addClass('save');
            break;
        default:
            $sbHeaderNav.eq(0).trigger('click');
            $siderbar.find('#save_btn').removeClass('save');
            $siderbar.find('.preview a').addClass('empty').removeAttr('style').text('');
            break;
    }
    $siderbar.find('#custome_index').val(data.index);
    $siderbar.find('#custome_url').val(data.url);
    $siderbar.find('#custome_title').val(data.title);
    $siderbar.css({ 'right': '0' });
    // $siderbar.find('.after').css({ 'visibility': 'visible' });
    $(document).on('click', testFun);
    // 默认查找
    $leftNav.eq(0).trigger('click');
}

/**
 * 隐藏侧边栏
 */
function hideSider() {

    $siderbar.find('.preview a').addClass('empty').removeAttr('style').text('');
    $siderbar.removeAttr('style');
    // $siderbar.find('.after').removeAttr('style');
    $siderbar.find('.input-box').removeClass('input-box-err');
    $siderbar.find('#errorInfo').hide();
    $siderbar.find('input[type="hidden"]').val('');
    // window.onresize = null;
    $(document).off('click', testFun);
}

// 启动模块
// start();
module.exports = {
    showSider: showSider,
    hideSider: hideSider,
    start: start
}