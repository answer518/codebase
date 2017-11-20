/**
 * 弹框逻辑
 */

var maxthon = require('static/js/api.js'),
	Language = require('static/js/language'),
	Controller = require('widget/main/main'),
	Helper = require('widget/main/helper');

var $dialog_node, $dialog_nav_node, $grid_nav_node, $grid_tab_node,
    $input_url, $input_title, $dialog_add_btn, $dialog_grid, $color_block,
    $color_block_list, $radio_list, $search_btn, $search_input, $mask_node;

var mapList = {}, clickcalls = [];

function init(map) {
    $dialog_node = $('#add-dialog'),
    $dialog_nav_node = $dialog_node.find('.dialog-nav > li'),
    $grid_nav_node = $dialog_node.find('.grid-nav > li'),
    $grid_tab_node = $dialog_node.find('.tab > li'),
    $input_url = $dialog_node.find('input[name="url"]'),
    $input_title = $dialog_node.find('input[name="title"]'),
    $dialog_add_btn = $dialog_node.find('#dialog_add_btn'),
    $dialog_grid = $dialog_node.find('.dialog-grid-list'),
    $color_block = $dialog_node.find('.color-block-list'),
    $color_block_list = $dialog_node.find('.color-block-list > li'),
    $radio_list = $dialog_node.find('.radio-list'),
    $search_btn = $dialog_node.find('#grid-search-icon'),
    $search_input = $dialog_node.find('#grid_search_btn'),
    $mask_node = $('#mx_mask_layer');

    var $alltab = $dialog_node.find('.main-warp > div');
    // 点击回调数组
    clickcalls = [
        function(index) {
            maxthon.useApi('common.getCurrentOpenedList', {}, function(data) {
                renderUrlList(data, $alltab.eq(index));
            });
        },
        function(index) {
            maxthon.useApi('history.getTopVisitedList', {}, function(data) {
                renderUrlList(data, $alltab.eq(index));
            });
        },
        function(index) {
            maxthon.useApi(getNodeFolderApiName, {}, function(data) {
                if (!data.folders) return;
                var tree = new treeMenu(data.folders);
                $alltab.eq(index).empty().append(tree.init(data.pid));

                if (getNodeFolderApiName === 'note.getFoldersTree') return;
                getNoteListByPid('00000001-0000-0000-0000-000000000000', function(html) {
                    $alltab.eq(index).append(html);
                });
            });
        },
        function(index) {
            maxthon.useApi('getLastOpenList', {}, function(data) {
                renderUrlList(data, $alltab.eq(index));
            });
        }
    ];

    $dialog_nav_node.on('click', function() {
        var $this = $(this);
        $this.siblings().removeClass('selected');
        $this.addClass('selected');
        $dialog_node.find('article').hide().eq($this.index()).show();
    });
    
    // 导航切换
    $grid_nav_node.on('click', function() {
        var $this = $(this);
        $this.siblings('li').removeClass('current');
        $this.addClass('current');
        renderGridHtml(SITE_LIST[$this.index()]);
    });

    // 网址来源选
    $grid_tab_node.on('click', function() {
        var $this = $(this),
            index = $this.index();

        $this.siblings('li').removeClass('hover');
        $this.addClass('hover');
        
        $alltab.addClass('hide').eq(index).removeClass('hide');
        index != -1 && clickcalls[index].call(this, index);
    });

    $input_url.on('init', function() {
        var url = $input_url.val().trim();
        if (url.length === 0) return;
        $input_url.removeClass('error');
        $dialog_node.find('.error').hide();

        var editable = editableMode() ? false : true;
        // 选择的是笔记
        if (url.indexOf('mx://note/?id') === 0) {
            // 文本框置灰
            $input_url.attr('disabled', 'disabled');
            updateRadio({
                'recommendlogo': { 'disable': true },
                'screenshot': { 'disable': true },
                'colorblock': { 'disable': false, 'checked': true }
            }, editable);
            return;
        }

        $input_url.removeAttr('disabled').removeAttr('style');
        var image = getImageFromUrl(url);
        // 匹配上推荐图片
        if (image === '') {
            updateRadio({
                'recommendlogo': { 'disable': true },
                'screenshot': { 'disable': false, 'checked': true },
                'colorblock': { 'disable': false }
            }, editable);
        } else {
            grid_image = image;
            var config = {
                'recommendlogo': { 'disable': false, 'checked': true },
                'screenshot': { 'disable': false },
                'colorblock': { 'disable': false }
            };
            updateRadio(config, editable);
        }
    }).on('blur', function() {
        $(this).trigger('init');
    }).on('focus', function() {
        $(this).removeClass('error');
    });

    $dialog_node.on('click', '.main-warp li:not(.folder) > a', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);

        $input_title.val($this.attr('title'));
        $input_url.val($this.attr('href')).trigger('init');
        $grid_tab_node.each(function(i, n) {
            if ($(n).hasClass('hover')) {
                grid_source = ['currentlyOpen', 'mostVisited', 'maxnote', 'lastSession'][i];
                return false;
            }
        });
        if (grid_source === 'maxnote') {
            if ($this.attr('et') !== '1') {
                maxnoteCategory = 'record';
            } else {
                maxnoteCategory = 'website';
            }
        } else {
            maxnoteCategory = undefined;
        }
        return false;
    });

    $dialog_node.on('click', '.main-warp li.folder', function(e) {
        var $this = $(this);
        $this.toggleClass('open');
        var pid = $this.attr('uuid');

        getNoteListByPid(pid, function(html) {
            $this.find('>ul').find('li:not(.folder)').remove().end().append(html);
        });
        return false;
    });

    $dialog_node.on('mouseover mouseout', '.main-warp .menu-head,.main-warp .jstree-note', function(e) {
        e.stopPropagation();
        if (e.type == "mouseover") {
            $(this).siblings('.jstree-wholerow').show();
        } else if (e.type == "mouseout") {
            $(this).siblings('.jstree-wholerow').hide();
        }
    });

    $dialog_grid.on('click', '> li', function(e) {
        e.preventDefault();
        var $this = $(this);

        if ($this.hasClass('disable')) {
            return;
        }
        // 防止频繁点击，导致添加多次
        $this.addClass('disable');
        var $ele = $this.find('a');
        var item = {
            'title': $ele.attr('d-title'), // 标题
            'url': $ele.attr('href'), // url链接
            'image': $ele.attr('d-image'), // 图片路径
            'sq_img': $ele.attr('d-sq-img'),
            'sq_md5sum': $ele.attr('d-sq-md5'),
            're_img': $ele.attr('d-re-img'),
            're_md5sum': $ele.attr('d-re-md5'),
            'isHot': false
        };

        setTimeout(function() {
            // 构建动画元素
            var target_grid = $this.clone();
            var w = $this.width(),
                h = $this.innerHeight();
            var p = $this.offset();

            target_grid.css({ 'position': 'absolute', '-webkit-transition': 'all 0.3s', 'left': p.left, 'top': p.top + document.body.scrollTop });
            document.body.appendChild(target_grid[0]);
            // 获取移动位置
            var grid = Controller.getGridItem(grid_index).grid;
            item.index = grid_index;
            if (grid.isHot === true) {
                item.isHot = true;
                // g.image = g.image.replace('/Re/', '/Sq/');
            }

            var editOperate = editableMode();
            if (!editOperate) {
                var add_uiindex = grid.isHot === true ? Math.min(grid.topuiindex + 1, 7) : grid.uiindex + 1;
                var xy = grid.getGridPosition(add_uiindex);
                grid.node.css({ "left": xy.left, "top": xy.top });
            }

            if (!grid.group) {
                var p2 = grid.getGridFixed();
                var l2 = p2.left;
                var t2 = p2.top + document.body.scrollTop;
                target_grid.css({ "left": l2, "top": t2 });
                setTimeout(function() {
                    editOperate ? Controller.onUpdateGridItem(item) : Controller.onInsertGridItem(item, grid);
                    if (target_grid) {
                        document.body.removeChild(target_grid[0]);
                        target_grid = null;
                    }
                }, 300);
            } else {
                Controller.onUpdateGridItem(item);
                if (target_grid) {
                    document.body.removeChild(target_grid[0]);
                    target_grid = null;
                }
            }

            // 关闭弹框
            closeDialog();
        }, 50);
    });

    $dialog_add_btn.on('click', function(e) {
        var $this = $(this);
        if ($this.hasClass('disable')) {
            return;
        }

        var url = $input_url.val().trim();
        var title = $input_title.val().trim();
        $dialog_node.find('.error').hide();
        if (url.length === 0) {
            $dialog_node.find('.error').eq(0).find('>span').html(Language.getLang('EnterUrl')).end().show();
            $input_url.addClass('error');
            return;
        }

        if (url.indexOf('..') > 0 && url.indexOf('..')) {
            $dialog_node.find('.error').eq(0).find('>span').html(Language.getLang('CheckUrl')).end().show();
            $input_url.focus();
            return;
        }

        // 防止频繁点击，导致添加多次
        $this.addClass('disable');
        if (title.length === 0) {
            title = url;
        }
        var item = {
            'title': title,
            'url': url //url.notUrl() ? 'http://' + url : url
        };

        $radio_list.each(function(i, n) {
            var $item = $(n);
            if ($item.hasClass('selected')) {
                switch (i) {
                    case 0:
                        item.image = grid_image;
                        break;
                    case 1:
                        item.image = getThumbsUrl(item.url, 0);
                        break;
                    default:
                        item.colorBlock = grid_color;
                        break;
                }
                return false;
            }
        });

        var grid = Controller.getGridItem(grid_index).grid;
        if (grid.isHot === true) {
            item.isHot = true;
            item.image = item.image && item.image.replace('/Re/', '/Sq/');
        }

        if (maxnoteCategory && grid_source === 'maxnote') {
            ueip_data.data.maxnoteCategory = maxnoteCategory;
        }
        // 关闭窗口
        if (editableMode()) {
            ueip_data.n = 'edit';
            ueip_data.o += 'Edit';
            item.index = grid_index;
            Controller.onUpdateGridItem(item);
        } else {
            ueip_data.n = 'add';
            ueip_data.o += 'Add';
            Controller.onInsertGridItem(item, grid);
        }

        // 关闭弹框
        closeDialog();
    });

    var searchTimer;
    $search_input.on('input', function() {

        if (searchTimer) {
            clearTimeout(searchTimer);
        }
        searchTimer = setTimeout(function() {
            searchFun();
        }, 200);
        return false;
    });

    $color_block_list.on('click', function(e) {
        var $this = $(this);
        e.stopPropagation();
        if ($this.parent().hasClass('disable')) return;
        grid_color = $this.attr('class');
        $this.siblings().removeClass('selected').end().addClass('selected');
    });

    $radio_list.on('click', function(e) {
        var $this = $(this);
        if ($this.hasClass('disabled')) return;
        switchRadio($this); // 切换
    });
}

init();

function switchRadio($this) {
    var index = $this.index();
    var url = $input_url.val().trim();
    // url = url.notUrl() ? 'http://' + url : url;
    switch (index) {
        case 0:
            var matchimage = getImageFromUrl(url);
            if (matchimage !== '') { // ps:自动匹配到预置图片，才重新赋值，防止第三方图没有找到预置图
                grid_image = matchimage;
            }
            $color_block.addClass('disable');
            break;
        case 1:
            grid_image = getThumbsUrl(url, 0);
            $color_block.addClass('disable');
            break;
        default:
            $color_block.removeClass('disable');
            $color_block_list.removeClass('selected').siblings('.' + grid_color).addClass('selected');
            break;
    }

    $this.siblings().removeClass('selected').end().addClass('selected');
}

function searchFun() {
    var search = $search_input.val().replace(/\s+/g, "");

    var html = [];
    if (search.length === 0) {
        renderGridHtml(SITE_LIST[search.length]);
        return;
    }
    var result = { list: [] };
    for (var i = 0; i < SITE_LIST.length; i++) {
        var list = SITE_LIST[i].list;

        for (var j = 0; j < list.length; j++) {
            var item = list[j];
            if (item.url.indexOf(search) !== -1 || item.title.indexOf(search) !== -1) {
                result.list.push(item);
                continue;
            }
        }
    }
    renderGridHtml(result);
    // 默认高亮第一个标签
    $grid_nav_node.removeClass('current').eq(0).addClass('current');
}

var grid_index, grid_uiindex, grid_url, grid_image, grid_title, grid_color, grid_thumb_type, grid_source, maxnoteCategory, add_quick_dialog, openInDialog;
/**
 * 打开新弹窗
 * @param data 数据
 * @param openFlag 弹出框中打开
 * @return {[type]} [description]
 */
function showDialog(data, editable, openFlag) {
    var thiz = this;
    var selectIndex = editable ? 1 : 0,
        btnText = editable ? Language.getLang('Save') : Language.getLang('CustomAdd');
    $dialog_node.find('.error').hide();
    $search_input.val('');
    openInDialog = openFlag; // 用全局变量存放一个弹框打开状态

    // 默认显示热门标签
    $grid_nav_node.eq(0).click();
    $grid_tab_node.eq(0).click();
    $dialog_nav_node.eq(selectIndex).click();
    $dialog_add_btn.text(btnText);
    bindData(data);

    add_quick_dialog = $dialog_node.Dialog({
        close: function() {
            return false; 
        },
        start_fn_later: function() {
            $dialog_node.find('.close').off('click').on('click', function() {
                var grid = Controller.getGridItem(grid_index).grid;
                $dialog_nav_node.each(function(i, n) {
                    if ($(n).hasClass('selected')) {
                        grid_source = ['default', 'custome'][i];
                        return false;
                    }
                });
                // 关闭弹框
                closeDialog(openInDialog);
            });
        }
    });
}

function closeDialog() {
    var openFlag = openInDialog;
    clearData();
    // 重置自定义弹窗
    $dialog_add_btn.removeClass('disable');
    $input_url.removeAttr('disabled').removeAttr('style').removeClass('error');
    $radio_list.removeClass('disabled').removeClass('selected').eq(1).addClass('selected');
    $color_block_list.removeClass('selected').eq(0).addClass('selected');
    // 打开文件夹弹框
    if (openFlag === true) {
        $dialog_node.hide();
        $group_dialog.show();
        $('#mx_mask_layer').off('click').on('click', function(e) {
            window.Api.dialog.close();
        }).show();
        return false;
    }
    add_quick_dialog.close();
}

/**
 * 绑定数据到自定义编辑框
 * @param data 绑定的对象
 */
function bindData(data) {
    data = data || {};
    grid_index = data.index;
    grid_uiindex = data.uiindex;
    grid_title = data.title || '';
    grid_url = data.url || '';
    grid_image = data.image || '';
    grid_color = data.colorBlock || 'color-block-6';
    grid_thumb_type = data.thumbType;

    updateHTML();
    if (editableMode()) {
        if (grid_image === '') { // 默认 截图
            grid_thumb_type = 2;
        } else {
            if (grid_image.indexOf('mx://thumbs/?reflush') === 0) {
                grid_thumb_type = 1;
            } else {
                grid_thumb_type = 0;
            }
        }
    } else {
        grid_thumb_type = 1;
    }

    // 自定义添加编辑状态
    var config = {};
    switch (grid_thumb_type) {
        case 2:
            config.colorblock = { 'disable': false, 'checked': true }
            break;
        case 1:
            config.screenshot = { 'disable': false, 'checked': true }
            break;
        default:
            config.recommendlogo = { 'disable': false, 'checked': true }
            break;
    }
    // 判断如果是第三方图库图片，还是保留推荐图
    var matchimage = getImageFromUrl(grid_url);
    if (matchimage === '') {
        if (!(data.image && data.image.indexOf('http://fastdail-img') === 0)) {
            config.recommendlogo = {
                'disable': true
            }
        }
    }

    if (grid_url.indexOf('mx://note/?id') === 0) {
        config.screenshot = { 'disable': true };
        // 文本框置灰
        $input_url.attr('disabled', 'disabled');
    }
    updateRadio(config, true);
}

function clearData() {
    grid_index = '';
    grid_url = '';
    grid_title = '';
    grid_image = '';
    grid_color = '';
    grid_source = undefined;
    grid_thumb_type = undefined;
    maxnoteCategory = undefined;
    openInDialog = undefined;
}

function editableMode() {
    return $dialog_add_btn.text() === Language.getLang('Save');
}

function updateHTML() {
    $input_title.val(grid_title);
    $input_url.val(grid_url);
}
/**
 * 根据url更新radio列表
 * @param options 
 * @param editable 是否能切换
 */
function updateRadio(options, editable) {
    var config = $.extend(true, {
        'recommendlogo': { index: 0 },
        'screenshot': { index: 1 },
        'colorblock': { index: 2 }
    }, options);

    for (var i in config) {
        if (config[i]) {
            var index = config[i].index;
            if (config[i].disable === true) {
                $radio_list.eq(index).addClass('disabled');
                if ($radio_list.eq(index).hasClass("selected")) {
                    editable = true;
                }
                $radio_list.eq(index).addClass('disabled');
            } else {
                $radio_list.eq(index).removeClass('disabled');
                $radio_list.eq(index).removeClass('disabled');
            }
            if (editable && config[i].checked === true) {
                switchRadio($radio_list.eq(index));
            }
        }
    }
}

function renderGridHtml(data) {
    var _html = [];
    for (var i = 0; i < data.list.length; i++) {
        var item = data.list[i];
        var attrHtml = [];
        if (mapList[item.url]) { // map中有md5
            item['sq_img'] = mapList[item.url]['sq_img'] || '';
            if (item['sq_img'] && item['sq_img'] !== '') {
                attrHtml.push('d-sq-img="' + item.sq_img + '" ');
            }
            item['re_img'] = mapList[item.url]['re_img'] || '';
            if (item['re_img'] && item['re_img'] !== '') {
                attrHtml.push('d-re-img="' + item.re_img + '" ');
            }
            item['re_md5sum'] = mapList[item.url]['re_md5sum'] || '';
            if (item['re_md5sum'] && item['re_md5sum'] !== '') {
                attrHtml.push('d-re-md5="' + item.re_md5sum + '" ');
            }
            item['sq_md5sum'] = mapList[item.url]['sq_md5sum'] || '';
            if (item['sq_md5sum'] && item['sq_md5sum'] !== '') {
                attrHtml.push('d-sq-md5="' + item.sq_md5sum + '" ');
            }
        }
        item = Helper.tranData(item);
        _html.push('<li>');
        _html.push('<a href="' + item.url + '" d-title="' + item.title + '" d-image="' + item.image + '" ' + attrHtml.join('') + ' target="_blank">');
        _html.push('<img class="grid-img" src="' + item.image + '" width="150" height="100"/>');
        _html.push('<p class="grid-title">' + item.title + '</p>');
        _html.push('</a>');
        _html.push('</li>');
    }
    $dialog_grid.empty().append(_html.join(''));
}

function renderUrlList(data, $dom) {
    var html = ['<ul>'];
    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        html.push('<li>\
                        <a href="' + d.url + '" title="' + d.title + '">\
                            <img src="mx://favicon/' + d.url + '" alt="' + d.title + '" height="16" width="16" onerror="this.src=\'' + staticServer + '/img/icon/6000.png\'" class="nav-icon" />\
                            <span class="nav-text">' + d.title + '</span>\
                        </a>\
                        </li>');
    }
    html.push('</ul>');
    $dom.empty().append(html.join(''));
}

function getNoteListByPid(pid, cb) {
    maxthon.useApi(getNotesByPidApiName, { 'pid': pid }, function(data) {
        var html = '';
        var notes = data.notes || data.nodes;
        if (!notes) return;
        for (var i = 0; i < notes.length; i++) {
            var d = notes[i] || {};
            html += '<li>\
                            <div class="jstree-wholerow"></div>\
                            <a class="jstree-note" href="' + (d.et !== 1 ? "mx://note/?id=" + d.uuid + "&pid=" + pid : d.url) + '" title="' + d.fn + '" et="' + d.et + '">\
                                <img src="' + (d.et !== 1 ? staticServer + "/img/icon/node_icon_note.png" : "mx://favicon/" + d.url) + '" alt="' + d.fn + '" height="16" width="16" onerror="this.src=\'' + staticServer + '/img/icon/6000.png\'" class="nav-icon" />\
                                <span class="nav-text">' + d.fn + '</span>\
                            </a>\
                        </li>';
        }
        cb && cb(html);
    });
}

/**
 * 根据URL匹配相关图片列表
 * @param  {[type]}   url      [description]
 * @return {[type]}            [description]
 */
function getImageFromUrl(url, callback) {
    if (url.length == 0) return;
    var qUrl = url.notUrl() ? 'http://' + url : url;
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
    var host = '',
        image = '';
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
        for (var i = 0; i < SITE_LIST.length; i++) {
            var category = SITE_LIST[i];
            for (var j = 0; j < category.list.length; j++) {
                var _category = category.list[j];

                var _url = _category.url;
                if (_url.indexOf(host) >= 0) { // 开头// 开头
                    image = _category.image;
                    i = SITE_LIST.length;
                    break innerloop;
                }

                if (_category.match) {
                    for (var k = 0; k < _category.match.length; k++) {
                        var __url = _category.match[k];
                        if (__url.indexOf(host) >= 0) { // 开头
                            image = _category.image;
                            i = SITE_LIST.length;
                            break innerloop;
                        }
                    }
                }
            }
        }
    return image;
}
/**
 * 获取截图URL
 * @param  {[type]} url     [description]
 * @param  {[type]} reflush [description]
 * @return {[type]}         [description]
 */
function getThumbsUrl(url, reflush) {
    if (reflush == 0)
        return 'mx://thumbs/?reflush=' + (reflush) + '&stamp=' + (new Date().getTime()) + '&url=' + url;
    if (window.onLine == true) {
        return 'mx://thumbs/?reflush=' + (reflush) + '&stamp=' + (new Date().getTime()) + '&url=' + url;
    } else {
        return cdnServer + '/image/logo/Re/offline.png';
    }
}

module.exports = {
    showDialog: showDialog,
    getThumbsUrl: getThumbsUrl,
    getImageFromUrl: getImageFromUrl
}
