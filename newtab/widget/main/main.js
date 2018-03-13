/**
 * 用于Controller与Model之间的业务服务层
 * @author guotingjie
 */
var Api = require('static/js/api'),
    Language = require('static/js/language'),
    dataCode = require('static/js/datacode.js'),
    Siderbar = require('widget/sidebar/sidebar.js'),
    Tools = require('static/js/tools'),
    Menu = require('static/js/menu'),
    Dao = require('widget/main/dao'),
    helper = require('widget/main/helper');

var $group_dialog,
    $grid_list,
    $grid_body,
    $group_list,
    $group_container,
    data_list,
    fav_list = [],
    grid_ui_data = {},
    drag_drop_data = {},
    current_col = 6,
    animation_time = 300;

var drag_node, current_group, group_node, group_title, grid_add;

function clearDragNode() {
    if (drag_node[0]) {
        document.body.removeChild(drag_node[0]);
        drag_node = null;
    }
}

// 背景放大，解决四周白边的问题
function scalebg() {
    if ($('#media').hasClass('show')) {
        $('#media').removeClass('show');
        $('#wallpapers').css({ 'background-image': 'url(' + $('#media').attr('poster') + ')' });
    }
    $('#wallpapers').css({ 'transform': 'scale(1.1)' });
    $('body').addClass('mask');
}

// 背景还原
function resetbg() {
    if ($('#media').attr('poster')) {
        $('#media').addClass('show');
        $('#wallpapers').removeAttr('style');
    } else {
        $('#wallpapers').css({ 'transform': 'scale(1)' });
    }
    $('body').removeClass('mask');
}

function hideGroup(callback) {
    if (!current_group) return;
    current_group.addLastGridThumbnailNode();
    current_group.container.removeClass('show');

    $group_dialog.removeClass('is-visible');
    resetbg();

    $group_dialog.find('#group_body').removeAttr('style');
    current_group = null;
    if (callback) {
        setTimeout(function () {
            callback();
        }, animation_time);
    }
}

function Grid(data, uiindex) {
    var _this = this;

    _this.uiindex = uiindex;
    for (var i in data) {
        _this[i] = data[i];
    }
}

function getScroll() {
    return {
        top: document.body.scrollTop + document.documentElement.scrollTop,
        left: document.body.scrollLeft
    }
}

function displayBgColor(data) {
    return data.image && (data.image.match(/^https?:\/\//) || data.image.match(/^mx:\/\/newtab/));
}

Grid.prototype = (function () {

    var current_drag, current_drop, ban_move, animationTimer, cover_timer, scroll_state,
        addArea = 0.2,
        moveArea = 0.8,
        Math = window.Math;

    function cloneGridNode() {
        var node, xy = this.getGridFixed(),
            sxy = getScroll();
        node = this.node.clone();
        node.css({ 'left': xy.left + sxy.left, 'top': xy.top + sxy.top, 'width': xy.width, 'height': xy.height });
        document.body.appendChild(node[0]);
        return node;
    }

    function addGridThumbnailNode(data, parentNode) {
        var self = this;
        var nodeHtml = '';
        data = helper.tranData(data); // 转换数据
        if (displayBgColor(data)) {
            nodeHtml += '<div class="thumbnail"';
            nodeHtml += '   style="background-image: url(' + data.image + ')">';
            nodeHtml += '</div>';
        } else {
            nodeHtml += '<div class="thumbnail" style="background-color: ' + (data.bgColor || '#458FF3') + ';">';
            nodeHtml += '   <span>' + data.title.slice(0, 1) + '</span>';
            nodeHtml += '</div>';
        }

        var node = $(nodeHtml)[0];
        parentNode && parentNode.appendChild(node);
        return node;
    }

    function addLastGridThumbnailNode(parentNode, list) {
        if (!parentNode && !this.children) return;
        var self = this,
            parentNode = parentNode || self.list_node,
            list = list || self.children,
            i, length = list.length;
        parentNode.innerHTML = '';

        for (i = 0; i < (length > 4 ? 4 : length); i++) {
            var data = list[i];
            var node = self.addGridThumbnailNode(data, parentNode);
            // 自执行函数传参，利用闭包
            if (!displayBgColor(data)) {
                (function (node, data) {
                    Api.getMeanColor(data.url, function (bgColor) {
                        node.style.cssText = 'background-color:' + bgColor;
                    });
                })(node, data);
            }
        }
    }

    function getGridPosition(index) {
        var size = grid_ui_data,
            current_col, width, marginX, marginY, row, col, left, top;

        index = index || this.uiindex;
        if (!this.children && this.group) {
            width = 620 * 0.20;
            current_col = 5;
            row = Math.floor(index / current_col);
            col = index % current_col;
            left = col * width + (width - grid_ui_data.grid_width) / 2;
            top = row * 113 + 10;
        } else {
            current_col = 7;
            row = Math.floor(index / current_col);
            col = index % current_col;
            width = grid_ui_data.grid_width;
            marginX = (grid_ui_data.container_width - 7 * width) / 6;
            left = col * (marginX + width) + 20;
            top = row * grid_ui_data.grid_height;
        }

        return {
            'left': left,
            'top': top
        };
    }

    function locate(index) {
        var xy = this.getGridPosition(index);
        this.node.css({ 'left': xy.left + 'px', 'top': xy.top + 'px' });
    }

    function showMenu(obj, l, t) {
        var menuList = [],
            version = Api.max_version;
        if (obj.children) {
            var list = obj.children;
            menuList = [
                { 'id': 'open-all-tab', 'label': Language.getLang('NewTabOpenAll') },
                { 'id': 'delete-tab', 'label': Language.getLang('Delete') },
                { type: true },
                { 'id': 'open-all-newwin-tab', 'label': Language.getLang('NewWindowOpenAll') },
                { 'id': 'open-all-invisible-tab', 'label': Language.getLang('NewInvisibleOpenAll') }
            ];
            Menu.showPopupMenu(l, t, menuList, function (data) {
                var urls = [];
                list.forEach(function (item, i) {
                    urls.push(item.url);
                });
                var ueip = { m: 'folderrightmenu' };
                switch (data) {
                    case 'open-all-tab': //打开新标签
                        Api.useApi('openUrl', { 'urls': urls, 'mode': 'BackgroundTab' });
                        ueip.n = 'openall';
                        break;
                    case 'delete-tab':
                        showDelete(obj);
                        ueip.n = 'delete';
                        break;
                    case 'open-all-newwin-tab':
                        Api.useApi('openUrl', { 'urls': urls, 'mode': 'NewWindow' });
                        ueip.n = 'openallinnewwindow';
                        break;
                    case 'open-all-invisible-tab':
                        Api.useApi('openUrl', { 'urls': urls, 'mode': 'NewPrivateWindow' });
                        ueip.n = 'openallinprivatewindow';
                        break;
                }
                dataCode.statistic(ueip);
            });
        } else {
            menuList = [
                { 'id': 'open-tab', 'label': Language.getLang('NewTabOpen') },
                { 'id': 'edit-tab', 'label': Language.getLang('Edit') },
                { 'id': 'delete-tab', 'label': Language.getLang('Delete') },
                { 'type': true },
                { 'id': 'open-newwin-tab', 'label': Language.getLang('NewWindowOpen') },
                { 'id': 'open-invisible-tab', 'label': Language.getLang('NewInvisibleOpen') }
            ];

            Menu.showPopupMenu(l, t, menuList, function (data) {
                var ueip = { m: 'sitesrightmenu' };
                switch (data) {
                    case 'open-tab':
                        Api.useApi('newTabBackground', { 'url': obj.url });
                        ueip.n = 'openinnewtab';
                        break;
                    case 'edit-tab':
                        showEdit(obj);
                        ueip.n = 'edit';
                        break;
                    case 'delete-tab':
                        showDelete(obj);
                        ueip.n = 'delete';
                        break;
                    case 'open-newwin-tab':
                        Api.useApi('openUrl', { 'url': obj.url, 'mode': 'NewWindow' });
                        current_group && hideGroup();
                        ueip.n = 'openinnewwindow';
                        break;
                    case 'open-invisible-tab':
                        Api.useApi('openUrl', { 'url': obj.url, 'mode': 'NewPrivateWindow' });
                        current_group && hideGroup();
                        ueip.n = 'openinprivatewindow';
                        break;
                }
                dataCode.statistic(ueip);
            });
        }
    }

    function showGroup() {
        var _this = this;
        if (!_this.container) return;
        current_group = _this;
        group_title.val(current_group.getGroupName());

        $group_list.find('.grid-list-container').removeClass('show');
        current_group.container.addClass('show');
        scalebg();
        $group_dialog.addClass('is-visible');
        $group_dialog.find('#group_body').css({ 'margin': '0' });
    }

    // 删除文件夹对话框
    function showDelete(obj) {
        var _this = obj;

        if (!_this.children) {
            onRemoveGrid(_this.index);
            return;
        }

        scalebg();
        var $delDialog = $('#del_dialog');
        $delDialog.addClass('is-visible');

        $delDialog.find('h3').html(Language.getLang('DeleteFolderTitle'));
        $delDialog.find('h4').html(Language.getLang('DeleteFolderWarn'));
        $delDialog.find('p').html(Language.getLang('DeleteFolderContent').replace('{name}', obj.title).replace('{count}', obj.children.length));
        $delDialog.find('#ok_btn').html(Language.getLang('Confirm'));
        $delDialog.find('#cancel_btn').html(Language.getLang('Cancel'));

        $delDialog.off('click').on('click', function (e) {
            var target = $(e.target);
            if (/*target.is('#del_dialog') ||*/ target.is('#cancel_btn')) {
                $delDialog.removeClass('is-visible');
                resetbg();
                return;
            }

            if (target.is('#ok_btn')) {
                $delDialog.removeClass('is-visible');
                resetbg();
                onRemoveGrid(_this.index);
            }
        });
    }

    function showEdit(obj) {
        var _this = obj;

        var data = {
            'index': _this.index,
            'uiinde': _this.uiindex,
            'title': _this.title,
            'url': _this.url
        };
        
        if (_this.image) {
            data.image = _this.image;
        } else {
            data.bgColor = _this.bgColor;
        }
        if (_this.group) {
            data.group = _this.group;
        }

        Siderbar.showSider({
            'type': 'custome', // 自定义
            'data': data
        });
    }

    function getGridFixed() {
        var xy = this.node[0].getBoundingClientRect();

        return {
            left: xy.left,
            right: xy.right,
            width: xy.width,
            height: xy.height,
            top: xy.top,
            bottom: xy.bottom
        };
    }

    // 格子之间重叠面积比例计算
    function coverArea(x, y) {
        var width, height, sxy = getScroll();
        y.top += sxy.top;
        y.bottom += sxy.top;
        y.left += sxy.left;
        y.right += sxy.left;

        if (x.left > y.right || y.left > x.right ||
            x.top > y.bottom || y.top > x.bottom) {
            return 0;
        } else {
            width = x.left > y.left ? y.right - x.left : x.right - y.left;
            height = x.top > y.top ? y.bottom - x.top : x.bottom - y.top;
            var area_x = x.width * x.height,
                area_y = y.width * y.height;
            grid_ui_data.area = area_x < area_y ? area_x : area_y;
            return width * height / grid_ui_data.area;
        }
    }

    function isOutGroup(xy) {
        var width = 0,
            height = 0;
        var os = $group_container.offset();
        var areaGroup = {
            top: os.top,
            left: os.left,
            right: os.left + $group_container.width(),
            bottom: os.top + $group_container.height()
        }

        if (xy.left - areaGroup.right > width ||
            xy.right - areaGroup.left < width ||
            xy.top - areaGroup.bottom > height ||
            xy.bottom - areaGroup.top < width) {
            return true;
        }
        return false;
    }

    var bodyScroll = (function () {

        var current_state, current_body, body_height, current_scrollTop, content_height,
            add_height, default_add_height = 5,
            timer, time = 15;

        function update(state) {
            current_body = document.body;
            current_state = state;
            body_height = current_body.offsetHeight;

            current_scrollTop = current_body.scrollTop;
            add_height = default_add_height * current_state;
        }

        function begin() {
            ban_move = true;
            timer = setInterval(function () {
                current_scrollTop = current_body.scrollTop;
                current_scrollTop += add_height;
                current_body.scrollTop = current_scrollTop;
                if ((add_height > 0 && (current_scrollTop + body_height) >= content_height) ||
                    (add_height < 0 && current_scrollTop <= 0)) {
                    stop();
                }
            }, time);
        }

        function up() {
            stop();
            update(-1);
            begin();
        }

        function down() {
            stop();
            update(1);
            begin();
        }

        function stop() {
            timer && clearTimeout(timer);
            ban_move = false;
        }

        function addHeight(value) {
            add_height = (default_add_height + value) * current_state;
        }
        return {
            up: up,
            stop: stop,
            down: down,
            addHeight: addHeight
        }
    })();

    function scrollBody(xy) {

        drag_drop_data.top = document.body.scrollTop;
        drag_drop_data.bottom = drag_drop_data.top + document.documentElement.clientHeight;
        var upHeight = drag_drop_data.top + 10 - xy.top;
        var downHeight = xy.bottom - drag_drop_data.bottom + 10;

        if (upHeight > 0) {
            if (scroll_state) {
                bodyScroll.addHeight(upHeight / 2);
            } else {
                bodyScroll.up(xy);
                scroll_state = true;
            }
        } else if (downHeight > 0 && xy.top < drag_drop_data.height) {
            if (scroll_state) {
                bodyScroll.addHeight(downHeight / 2);
            } else {
                bodyScroll.down(xy);
                scroll_state = true;
            }
        } else {
            if (!scroll_state) return;
            bodyScroll.stop();
            scroll_state = false;
        }
    }

    function moveAnimationTimer() {
        animationTimer && clearTimeout(animationTimer);
        ban_move = true;
        animationTimer = setTimeout(function () {
            ban_move = false;
        }, animation_time);
    }

    function forEachGrid(callback) {
        var i = 0,
            j, list;
        if (current_group) {
            list = current_group.children;
        } else {
            list = data_list;

        }
        j = list.length;
        for (; i < j; i++) {
            if (list[i].title === 'Add' || list[i].title === 'Empty') { // 排除加号与空白
                continue;
            }

            if (callback(list[i], i) === false) { //写成true了 O(∩_∩)O哈哈~ 太粗心大意了
                break;
            }
        }
    }

    // 移动碰撞
    function moveCollision(xy) {
        scrollBody(xy);
        if (ban_move) return;
        var children, area, item;

        // 拖动是文件夹
        if (current_drag.children) {
            children = current_drag.children;
            forEachGrid(function (item, i) {
                if (i !== current_drag.uiindex) {
                    area = coverArea(xy, item.getGridFixed());

                    if (area > moveArea) {
                        moveAnimationTimer();
                        onMovingGrid(current_drag.index, item.index, '');
                        return false;
                    }
                }
            });
        } else if (current_drop) { // 可操作状态（合并、交换、插入）
            area = coverArea(xy, current_drop.getGridFixed());
            if (area > moveArea) {
                moveAnimationTimer();
                onMovingGrid(current_drag.index, current_drop.index, current_drag.group);
            }
            if (area < addArea || area > moveArea) {
                current_drop.removeClass('combo');
                current_drop = null;
            }
        } else if (current_group) {

            if (isOutGroup(xy)) {
                moveAnimationTimer();
                if (grid_add) {
                    item = grid_add; // 增加按钮
                }
                onMovingGrid(current_drag.index, item.index, current_drag.group);
                return;
            }
            forEachGrid(function (item, i) {
                if (i !== current_drag.uiindex && coverArea(xy, item.getGridFixed()) > moveArea) {
                    moveAnimationTimer();
                    onMovingGroup(current_drag.index, item.index, current_drag.group);
                    return false;
                }
            });
        } else {
            forEachGrid(function (item, i) {
                if (i !== current_drag.uiindex) {
                    area = coverArea(xy, item.getGridFixed());
                    if (area > addArea) { // 合并文件夹
                        current_drop = item;
                        if (area > moveArea) {
                            moveAnimationTimer();
                            onMovingGrid(current_drag.index, item.index, current_drag.group);
                            return false;
                        }
                        current_drop.addClass('combo');
                        return false;
                    }
                }
            });
        }
    }

    function html() {
        var _this = this;
        var data = helper.tranData(_this);
        var nodeHtml = '<li class="grid">';

        if (data.image && (data.image.match(/^https?:\/\//) || data.image.match(/^mx:\/\/newtab/))) { //^https?:\/\/
            nodeHtml += '<a href="' + data.url + '" title="" target="_blank">';
            nodeHtml += '   <img src="' + data.image + '" alt="' + data.title + '" />';
            nodeHtml += '</a>';
        } else {
            nodeHtml += '<a href="' + data.url + '" title="" target="_blank" style="background-color: ' + (data.bgColor || '#458FF3') + ';">';
            nodeHtml += data.title.slice(0, 1);
            nodeHtml += '</a>';
        }

        nodeHtml += '<div class="function">';
        nodeHtml += '   <p class="title">' + data.title + '</p>';
        nodeHtml += '   <button class="edit"></button>';
        nodeHtml += '</div>';
        nodeHtml += '</li>';
        return nodeHtml;
    }

    function dom() {
        var _this = this;
        var grid_node, list_node, beginX, beginY, mouse_beginX, mouse_beginY, dragState, moveTimer;

        function startDrag(event) {
            if (event.button !== 0 || _this.node.hasClass('loading') || drag_node) return;

            var xy = _this.getGridFixed();
            beginX = xy.left;
            beginY = xy.top; // 解决滚屏问题
            mouse_beginX = event.clientX;
            mouse_beginY = event.clientY;

            document.addEventListener('mousemove', doDrag, false);
            document.addEventListener('mouseup', stopDrag, false);
        }

        function doDrag(event) {
            // fix: 解决点击与移动冲突的问题
            if ((Math.abs(event.clientX - mouse_beginX) === 0) || (Math.abs(event.clientY - mouse_beginY) === 0)) {
                return;
            }

            var sxy = getScroll();
            var left = beginX + sxy.left + event.clientX - mouse_beginX;
            var top = beginY + sxy.top + event.clientY - mouse_beginY;

            var w = grid_node.width();
            var h = grid_node.innerHeight();
            var xy = {
                left: left,
                right: left + w,
                top: top,
                bottom: top + h,
                width: w,
                height: h
            }

            if (!dragState) {
                grid_node.addClass('notran');
                drag_node = _this.cloneGridNode();
                current_drag = _this;
                dragState = true;
                scrollBody(xy);
                setTimeout(function () {
                    drag_node.addClass('notran');
                }, 20);
                grid_node.addClass('draging');
                drag_node.css({ 'padding': '0', 'margin': '0', 'z-index': '999' });
            }

            drag_node.css({ 'left': left, 'top': top });
            moveCollision(xy);
        }

        function rollback() {
            var xy = _this.getGridFixed(),
                sxy = getScroll();
            drag_node.removeClass('notran');
            drag_node.css({ 'left': xy.left + sxy.left, 'top': xy.top + sxy.top });
            setTimeout(function () {
                grid_node.removeClass('draging');
                setTimeout(function () {
                    grid_node.removeClass('notran');
                    clearDragNode();
                }, 20);
            }, animation_time);
        }

        function stopDrag(event) {
            if (scroll_state) {
                scroll_state = false;
                bodyScroll.stop();
            }

            document.removeEventListener('mousemove', doDrag, false);
            document.removeEventListener('mouseup', stopDrag, false);

            if (!dragState) return;
            dragState = false;
            moveTimer && clearTimeout(moveTimer);
            if (!current_drop || current_group) {
                rollback();
            } else {
                current_drop.removeClass('combo');
                cover_timer && clearTimeout(cover_timer);

                // 直接移动至文件夹
                if (current_drop.children) {
                    var list = current_drop.children;
                    onMovingInGroup(current_drag.index,
                        list[list.length - (current_drag.uiindex > current_drop.uiindex ? 1 : 1)].index,
                        current_drop.title);
                } else {
                    // 首次合并
                    onAddGroup(current_drag.index, current_drop.index, Language.getLang('NewFolder'));
                }
                current_drop = null;
            }
        }
        // 添加按钮
        if (!_this.url && !_this.children) {
            grid_node = $(`<li class="grid">
                            <a class="add" href="javascript:void(0);">
                                <i class="sprite sprite-circle"></i>
                            </a>
                            <div class="function">
                                <p class="title">${Language.getLang('Add')}</p>
                            </div>
                        </li>`);
            // fixed: 用于定位从文件夹中脱出时追加的位置
            grid_add = _this;
            grid_node.on('click', '.add', function (event) {
                event.stopPropagation();
                Siderbar.showSider();
            });
        } else {
            // 实体格子
            if (!_this.children) {

                grid_node = $(_this.html());
                if(_this.image && _this.image.match(/^mx:\/\/newtab/)) {
                    var img = new Image();
                    img.src = _this.image;
                    img.onerror = function() {
                        _this.bgColor = '#458FF3';
                        delete _this.image;
                        _this.node.find('>a').replaceWith('\
                            <a href="' + _this.url + '" title="" target="_blank" style="background-color: #458FF3;">' + _this.title + '</a>\
                        ');
                    }
                }
                
                grid_node.on('click', '.edit', function (event) {
                    event.stopPropagation();
                    showEdit(_this);
                    // hover网址-编辑
                    dataCode.statistic({ m: 'hoverMenu', n: 'hoverEdit' });
                });

                grid_node.on('click', '>a', function (event) {
                    event.preventDefault();
                    // 根据用户配置打开网址
                    Api.getUserProfile(function(userProfile) {
                        if(userProfile['open-url-newtab'] === true) {
                            Api.useApi('newTabUpground', { 'url': _this.url });
                        } else {
                            if(_this.url.match(/^file:\/\//)) {
                                setTimeout(function () {
                                    Api.useApi('newTabUpground', { 'url': _this.url });
                                }, 0);
                            } else {
                                location.href = _this.url;
                            }
                        }
                    });

                    clickStatictis(_this, 'leftClick');
                    if(_this.isHot === true) {
                        // 挖矿浏览器心跳上报
                        Api.useApi('common.reportLVTAction', { 'action': 'p-mx5Newtab_addTop8'});
                    }
                });
            } else { // 文件夹
                _this.group = _this.title;

                grid_node = $('<li class="grid group"></li>');
                list_node = $('<div class="thumbnail-container"></div>');
                // 文件夹缩略图
                _this.addLastGridThumbnailNode(list_node[0], _this.children);

                grid_node.append(list_node);
                grid_node.append(`
                    <div class="function">
                        <p class="title">${_this.title}</p>
                        <button class="del"></button>
                    </div>
                `);
                _this.list_node = list_node[0];

                grid_node.on('click', '.del', function () {
                    showDelete(_this);
                });

                grid_node.on('click', '.thumbnail-container', function () {
                    event.button === 0 && _this.showGroup();
                });
            }

            grid_node.on('mousedown', function (event) {
                event.stopPropagation();
                event.preventDefault();
                if (event.button === 1) {
                    clickStatictis(_this, 'middleClick');
                }
                startDrag(event);
            });

            grid_node.on('contextmenu', function (event) {
                event.stopPropagation();
                event.preventDefault();
                showMenu(_this, event.clientX, event.clientY);
            });
        }

        _this.node = grid_node;
        _this.locate();
        return grid_node;
    }

    function clickStatictis(obj, key_type) {

        var _location = obj.uiindex;
        if (obj.group && obj.group !== '') { // 之前判断不严谨，undefined !== '' 也是true
            data_list.forEach(function (item, i) {
                if (item.group === obj.group) {
                    _location = item.uiindex;
                    return false;
                }
            });
        }
        var ueip = {
            m: 'newmyfavoritesClick', n: key_type, data: {
                location: _location,
                url: obj.url,
                title: obj.title
            }
        };
        dataCode.statistic(ueip);
    }

    function addClass(className) {
        this.node.addClass(className);
    }

    function removeClass(className) {
        this.node.removeClass(className);
    }

    function getGroupName() {
        return this.group;
    }

    function setGroupName(group_name) {
        var _this = this,
            list = _this.children;

        _this.group = group_name;
        if (list) {
            list.forEach(function (item) {
                item.group = group_name;
            });

            if (group_name !== '') {
                _this.node.find('.title')[0].textContent = group_name;
            }
        }
    }

    return {
        dom: dom,
        html: html,
        locate: locate,
        addClass: addClass,
        removeClass: removeClass,
        getGroupName: getGroupName,
        setGroupName: setGroupName,
        showGroup: showGroup,
        showDelete: showDelete,
        getGridPosition: getGridPosition,
        getGridFixed: getGridFixed,
        cloneGridNode: cloneGridNode,
        addGridThumbnailNode: addGridThumbnailNode,
        addLastGridThumbnailNode: addLastGridThumbnailNode
    }
})();

function initData(data) {
    var top8_list = [], grid_list = [];
    
    data.forEach(function (item, i) {
        if (item) {
            // 过滤无效数据： Add 增加按钮 Empty:占位格子
            if (item.title === 'Add' || item.title === 'Empty') {
                return true;
            }

            if (item.group) delete item.group;
            if (item.uiindex) delete item.uiindex;

            // 从这个版本开始截图类型改为色块
            if (item.image) {
                if(item.image.match(/^mx:\/\/thumbs/)) {
                    delete item.image;
                }
            }

            if(item.isHot === true) {
                top8_list.push(item);
            } else {
                if (item.children) {
                    item.children.forEach(function (item2, j) {
                        if (!item2) {
                            item.children.splice(j, 1);
                            return true;
                        }
                    });
                }
                grid_list.push(item);
            }
        }
    });
    // top8 追加到我的站点前面
    grid_list = top8_list.concat(grid_list);
    return grid_list;
}

function initGridDataList(grid_list) {
    var grid, index = 0;
    data_list = [];

    grid_list.forEach(function (item, i) {
        if (!item.children) { // 普通格子
            item = new Grid(item, i);
            $grid_list.append(item.dom());
            if (!displayBgColor(item) && item.type !== 'button') {
                Api.getMeanColor(item.url, function (bgColor) {
                    item.node.find('>a').css({ 'background-color': bgColor });// = bgColor;
                });
            }
        } else {
            grid = new Grid(item, i);
            grid.container = $('<div class="grid-list-container"></div>');
            grid.children = [];
            item.children.forEach(function (item2, j) {
                item2.group = grid.title;
                item2 = new Grid(item2, j);
                grid.container.append(item2.dom());
                if (!displayBgColor(item2)) {
                    Api.getMeanColor(item2.url, function (bgColor) {
                        item2.node.find('>a').css({ 'background-color': bgColor });
                    });
                }
                grid.children[j] = item2;
                // 这里出现了文件夹拖出的bug
                // item2.index = index++;
            });
            $group_list.append(grid.container);
            $grid_list.append(grid.dom());
            item = grid;
        }
        item.index = i;
        data_list[i] = item;
    });

    // 追加一个按钮
    index = data_list.length;
    var item = new Grid({ 'title': 'Add', 'type': 'button' }, index);
    item.index = index;
    data_list[index] = item;
    $grid_list.append(item.dom());
}

/**
 * 初始化UI数据
 */
function readyInitUiData() {
    $grid_body = $('.nav-body');
    $grid_list = $('#grid_list');
    $group_list = $('#group_list');
    $group_dialog = $('#group');
    $group_container = $group_dialog.find('#group_container');

    // 清空元素
    $grid_list.empty();
    group_title = $('#group-title');

    group_title.on('click', function (e) {
        e.stopPropagation();
        if (group_title.hasClass('editable'))
            return;
        group_title.addClass('editable');
        this.focus();
        document.onkeydown = function (e) {
            if (e.keyCode === 13) {
                group_title.removeClass('editable');
                return false;
            }
            return true;
        }
    });

    // 标题失去焦点
    group_title.on('blur', function (e) {
        var title = this.value.trim();
        var title_len = title.replace(/[^\x00-\xff]/g, '**').length;

        if (title_len === 0) {
            title = Language.getLang('NewFolder');
        }
        if (title_len > 20) {
            title = title.substring(0, 20);
        }
        var current_title = current_group.getGroupName();
        if (title === '' || title === current_title) {
            this.value = current_title;
        } else {
            var list = current_group.children;
            onSetGroupName(current_group.index, list[list.length - 1].index, title);
        }
        // 关闭右键弹层
        Menu.hideAndRemovePopupMenu();
        group_title.removeClass('editable');
    });

    $group_dialog.on('click', function (e) {
        var $target = $(event.target);
        if ($(event.target).is('.dialog')) {
            event.preventDefault();
            $group_dialog.hide();
            
            resetbg();

            $group_dialog.find('#group_body').removeAttr('style');
            setTimeout(function () {
                $group_dialog.removeClass('is-visible').show();
                current_group = null;
            }, 200);
        }
    });

    resizeUIData();
}

function test(item) {
    if (item.image && (item.image.match(/^https?:\/\//) || item.image.match(/^mx:\/\/newtab/))) {
        return `<a href="${item.url}" title="" target="_blank">
                    <img src="${item.image}" alt="${item.title}" />
                </a>`;
    } else {
        // 在标题中过滤特殊字符
        item.title = item.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]*/, '');
        return `<a href="${item.url}" title="" target="_blank">
                    ${item.title.slice(0, 1)}
                </a>`;
    }
}

function getGridDataList(mapList, next) {
    readyInitUiData();
    Dao.getGridList().then(function (grid_list) {
        var grid_list = initData(grid_list);
        Dao.setGridList(grid_list);
        initGridDataList(grid_list);
        // 这里暂时不能优化，注释掉会有bug,后面分析
        resizeGridPositionAndIndex();
        // $grid_list[0].style.height = grid_ui_data.grid_height * 2 - 20 + 'px';
        return Dao.getMyFavoriteList(grid_list);
    }).then(function (favList) {
        var $fav_list = $('#fav_list');
        var container_width = grid_ui_data.container_width;
        var grid_width = grid_ui_data.grid_width;
        var grid_margin = (container_width - 7 * grid_width) / 6;
        $fav_list.empty();

        fav_list = favList;
        fav_list.forEach(function (item, i) {
            // if (i > 6) return false;
            var left = i * (grid_margin + grid_width) + 20;
            var grid_node = $(`
                <li class="grid" style="top:20px;left:${left}px;">
                    ${test(item)}
                    <div class="function">
                        <p class="title">${item.title}</p>
                        <button class="new"></button>
                    </div>
                </li>
            `);
            if(!item.image) {
                Api.getMeanColor(item.url, function (bgColor) {
                    item.bgColor = bgColor;
                    grid_node.find('>a').css({ 'background-color': bgColor });
                });
            }

            $fav_list.append(grid_node);
            grid_node.on('click', '.new', function () {
                var p = grid_node.offset();
                var clone_grid = grid_node.clone();
                clone_grid.css({ 'margin-bottom': '0', 'left': p.left, 'top': p.top });
                document.body.appendChild(clone_grid[0]);
                var p2 = grid_add.getGridFixed();
                var l2 = p2.left;
                var t2 = p2.top + document.body.scrollTop;

                grid_node.addClass('remove');
                clone_grid.css({ "left": l2, "top": t2 });

                var data = item;
                onInsertGridItem(data, grid_add);
                setTimeout(function () {
                    if (clone_grid) {
                        document.body.removeChild(clone_grid[0]);
                        clone_grid = null;
                    }
                    var index = 0;
                    for(var ii = 0; ii < fav_list.length; ii ++) {
                        var iitem = fav_list[ii];
                        if (iitem.url == data.url) {
                            index = ii;
                            break;
                        }
                    }

                    fav_list.splice(index, 1);
                    grid_node.remove();
                    fav_list.forEach(function (item, i) {
                        var node = item.node;
                        var left = i * (grid_ui_data.grid_margin + grid_ui_data.grid_width) + 20;
                        node.css({ 'left': left });
                    });
                    // 点击加号添加至快速拨号区
                    dataCode.statistic({ m: 'hoverMenu', n: 'hoverAdd' });
                }, animation_time);
            });

            grid_node.on('click', '>a', function (event) {
                event.preventDefault();
                location.href = $(this).attr('href');
            });

            grid_node.on('contextmenu', function (event) {
                // event.stopPropagation();
                event.preventDefault();
                var menuList = [
                    { 'id': 'open-tab', 'label': Language.getLang('NewTabOpen') },
                    { 'id': 'delete-tab', 'label': Language.getLang('Delete') },
                    { 'type': true },
                    { 'id': 'open-newwin-tab', 'label': Language.getLang('NewWindowOpen') },
                    { 'id': 'open-invisible-tab', 'label': Language.getLang('NewInvisibleOpen') }
                ];
                var obj = item;
                Menu.showPopupMenu(event.clientX, event.clientY, menuList, function (data) {
                    switch (data) {
                        case 'open-tab':
                            Api.useApi('newTabBackground', { 'url': obj.url });
                            break;
                        case 'delete-tab':
                            grid_node.addClass('remove');
                            setTimeout(function () {
                                grid_node.remove();
                                var index = 0;
                                for(var ii = 0; ii < fav_list.length; ii ++) {
                                    var iitem = fav_list[ii];
                                    if (iitem.url == obj.url) {
                                        index = ii;
                                        break;
                                    }
                                }
                                fav_list.splice(index, 1);
                                Dao.addToBlackList(obj);
                                resizeGridPositionForMostVisite();
                            }, animation_time);
                            break;
                        case 'open-newwin-tab':
                            Api.useApi('openUrl', { 'url': obj.url, 'mode': 'NewWindow' });
                            break;
                        case 'open-invisible-tab':
                            Api.useApi('openUrl', { 'url': obj.url, 'mode': 'NewPrivateWindow' });
                            break;
                    }
                });
            });
            fav_list[i].node = grid_node;
        });
    });

    var $favListContainer = $('.fav-list-container');
    $(document).on('click', '.fav-collapse', function () {
        $favListContainer.toggleClass('collapse');
        var $this = $(this);
        $this.toggleClass('down');
        var hideMostVisit = false;
        if ($this.hasClass('down')) { // 收起
            hideMostVisit = true;
            $this.attr('title', Language.getLang('DisplayOftenVisit'));
        } else {
            $this.attr('title', Language.getLang('HideOftenVisit'));
        }

        Api.setUserProfile('hide-most-visit', hideMostVisit);
        // 点击最常访问按钮
        dataCode.statistic({ m: 'mostVisited' });
    });
}

function resizeUIData() {
    grid_ui_data.container_width = $grid_body.width() - (window.innerWidth >= 1680 ? 120 : 80);
    grid_ui_data.grid_width = window.innerWidth >= 1680 ? 72 : 60;
    grid_ui_data.grid_margin = (grid_ui_data.container_width - 7 * grid_ui_data.grid_width) / 6;
    grid_ui_data.grid_height = window.innerWidth >= 1680 ? 130 : 120;
}

function windowResizeWidth() {
    resizeUIData();
    resizeGridPositionForMostVisite();
    resizeGridPositionAndIndex();
}

var Tools = require('static/js/tools');
window.addEventListener('resize', Tools.throttle(windowResizeWidth, 100, 300), false);

/**
 * 重新定位
 */
function resizeGridPositionAndIndex() {
    var index = 0, children;

    data_list.forEach(function (item, i) {
        item.uiindex = i;
        item.locate();
        children = item.children;
        if (children) {
            children.forEach(function (item2, j) {
                item2.uiindex = j;
                item2.locate(j);
                if (item2.url) {
                    item2.index = index++;
                } else {
                    item2.index = index;
                }
            });
        }
        item.index = index++;
    });
 
    $grid_list[0].style.height = (Math.ceil(data_list.length / 7) * grid_ui_data.grid_height) + 'px';
    drag_drop_data.height = document.body.scrollHeight;
}

/**
 * 最常访问重新定位
 */
function resizeGridPositionForMostVisite() {
    fav_list.forEach(function (item, i) {
        var node = item.node;
        var left = i * (grid_ui_data.grid_margin + grid_ui_data.grid_width) + 20;
        node.css({ 'left': left });
    });
}

function onMovingGrid(drag_index, drop_index, group_name) {
    var dragGroup, dropGroup, drag = getGridItem(drag_index),
        drop = getGridItem(drop_index);
    var dragObj = drag.grid,
        dropObj = drop.grid,
        length;
        
    if (drag.j >= 0) dragGroup = data_list[drag.i];
    if (drop.j >= 0) dropGroup = data_list[drop.i];
    if (dragObj.group && dragObj.group !== '') {
        if (group_name == '') {
            data_list.splice(drop.i, 0, data_list.splice(drag.i, 1)[0]);
        } else {
            delete dragObj.group;
            data_list.splice(drop.i, 0, dragGroup.children.splice(drag.j, 1)[0]);
            if (dragGroup.children.length === 0) { // 文件夹为空时，自动删除
                data_list.splice(drag.i, 1);
                dragGroup.node.remove();
            } else {
                // 只能这么删，不然事件丢失了
                dragGroup.container[0].removeChild(dragObj.node[0]);
                dragGroup.addLastGridThumbnailNode();
            }
            $grid_list.append(dragObj.node);
            hideGroup();
            // 移出文件夹
            dataCode.statistic({ m: 'event', n: 'dragOutFolder' });
        }
    } else {
        data_list.splice(drop.i, 0, data_list.splice(drag.i, 1)[0]);
        // 站点移动埋码
        dataCode.statistic({ m: 'event', n: 'change' });
    }
    // 持久化
    Dao.moveGridItem({ i: drag.i, j: drag.j }, { i: drop.i, j: drop.j });
    resizeGridPositionAndIndex();
}

// 文件夹内移动
function onMovingGroup(drag_index, drop_index, group_name) {
    var dragGroup, dropGroup, drag = getGridItem(drag_index),
        drop = getGridItem(drop_index);

    if (drag.j >= 0) dragGroup = data_list[drag.i];
    if (drop.j >= 0) dropGroup = data_list[drop.i];

    current_group.children.splice(drop.j, 0, current_group.children.splice(drag.j, 1)[0]);
    dragGroup.addLastGridThumbnailNode();
    // 持久化
    Dao.moveGridItem({ i: drag.i, j: drag.j }, { i: drop.i, j: drop.j });
    resizeGridPositionAndIndex();
}

var setGroupNameTimer;
function onSetGroupName(first_index, last_index, group_name) {
    var obj = getGridItem(first_index),
        obj = data_list[obj.i];

    obj.title = group_name;
    obj.setGroupName(group_name);
    clearTimeout(setGroupNameTimer);
    setGroupNameTimer = setTimeout(function () {
        // 持久化
        Dao.updateGridGroup(obj.uiindex, group_name);
    }, animation_time);
}

// 移入文件夹
function onMovingInGroup(drag_index, drop_index, group_name) {
    var dragGroup, dropGroup, drag = getGridItem(drag_index),
        drop = getGridItem(drop_index);
    var dragObj = drag.grid,
        dropObj = drop.grid,
        length;
    
    if (drag.j >= 0) dragGroup = data_list[drag.i];
    if (drop.j >= 0) dropGroup = data_list[drop.i];

    dragObj.setGroupName(group_name);
    dropGroup.children.splice(dropGroup.children.length, 0, data_list.splice(drag.i, 1)[0]);
    // 只能这么删，不然事件丢失了
    $grid_list[0].removeChild(dragObj.node[0]);
    dropGroup.container.append(dragObj.node);
    if (drag_node && !current_group) {
        dragObj.removeClass('draging');
        dragObj.removeClass('notran');
        length = dropGroup.children.length - 1;
        var xy = dropGroup.getGridFixed();

        // 设置缩略图大小
        setGroupGirdNodeSize(drag_node, length, xy);
        setTimeout(function () {
            dropGroup.addLastGridThumbnailNode();
            // 持久化
            Dao.insertGridItem(drag.i, drop.i);
            resizeGridPositionAndIndex();
            clearDragNode();

            // 移入文件夹
            dataCode.statistic({ m: 'event', n: 'dragInFolder' });
        }, animation_time);
    }
}

// 增加文件夹
function onAddGroup(drag_index, drop_index, group_name) {
    var drag = getGridItem(drag_index),
        dragObj = drag.grid,
        drop = getGridItem(drop_index),
        dropObj = drop.grid,
        uiindex = drop.i + (drag_index > drop_index ? 0 : -1),
        list, drop_node, xy,
        group = new Grid({
            title: group_name,
            container: $('<div class="grid-list-container"></div>'),
            children: []
        }, uiindex);

    list = group.children;
    if (drag_index > drop_index) {
        list[1] = data_list.splice(drag.i, 1)[0];
        list[0] = data_list.splice(drop.i, 1)[0];
    } else {
        list[0] = data_list.splice(drop.i, 1)[0];
        list[1] = data_list.splice(drag.i, 1)[0];
    }

    if (drag_node) {
        xy = dropObj.getGridFixed();
        drop_node = dropObj.cloneGridNode();
        drop_node.css({ padding: 0, margin: 0, overflow: 'hidden' });
    }

    var group_node = group.dom();
    group_node.css({ 'z-index': '-100' });
    $grid_list.append(group_node);
    $group_list.append(group.container);

    data_list.splice(uiindex, 0, group);
    group.setGroupName(group_name);
    $grid_list[0].removeChild(dropObj.node[0]);
    $grid_list[0].removeChild(dragObj.node[0]);
    group.container.append(dropObj.node);
    group.container.append(dragObj.node);

    dragObj.removeClass('draging');
    dragObj.removeClass('notran');
    if (drag_node) {
        setGroupGirdNodeSize(drop_node, 0, xy);
        setGroupGirdNodeSize(drag_node, 1, xy);
        setTimeout(function () {
            group_node.removeAttr('style');
            // 持久化
            Dao.addGridGroup(uiindex, drag.i, drop.i, group_name);
            resizeGridPositionAndIndex();
            clearDragNode();
            drop_node.remove();
        }, animation_time - 150);
    }

    dataCode.createFolder({});
}

function clearExtraAttr(data) {
    var obj = {
        title: data.title,
        image: data.image,
        url: data.url
    }
    if (!obj.image) {
        delete obj.image;
        delete obj.colorBlock;
        obj.bgColor = data.bgColor;
    }
    return obj;
}

function onInsertGridItem(data, targetObj) { // 确保targetObj 存在
    var dataindex, container, list, grid, group, obj = targetObj || grid_add;
    list = data_list;
    dataindex = obj.uiindex;
    data.uiindex = dataindex;
    grid = new Grid(data, dataindex);
    list.splice(dataindex, 0, grid);
    obj.node.parent().append(grid.dom());
    // 持久化
    Dao.insertGridItem(dataindex, -1, clearExtraAttr(data));
    resizeGridPositionAndIndex();
}

function onUpdateGridItem(data) {
    var obj = getGridItem(data.index),
        i = obj.i,
        j = obj.j,
        parentNode, grid;

    if (j < 0) {
        grid = new Grid(data, i);
        parentNode = data_list[i].node.parent();
        data_list[i] = grid;
        grid.uiindex = i;
    } else {
        data.group = obj.grid.group; // 分组名称不能丢
        grid = new Grid(data, j);
        data_list[i].children[j] = grid;
        grid.uiindex = j;
        parentNode = data_list[i].container;
        data_list[i].addLastGridThumbnailNode();
    }

    parentNode.append(grid.dom());
    obj.grid.node.remove();
    resizeGridPositionAndIndex();
    // 持久化
    Dao.updateGridItem(i, j, clearExtraAttr(data));
}

//删除
function onRemoveGrid(index) {
    var obj = getGridItem(index),
        grid = obj.grid,
        i = obj.i,
        j = obj.j,
        group;

    grid.addClass('remove');
    setTimeout(function () {
        grid.node.remove();
        if (j < 0) {
            data_list.splice(i, 1);
        } else {
            group = data_list[i];
            group.children.splice(j, 1);
            if (group.children && group.children.length === 0) {
                data_list.splice(i, 1);
                group.node.remove();
                hideGroup();
            } else {
                group.addLastGridThumbnailNode();
            }
        }
        // 持久化
        Dao.removeGridItem(i, j);
        // 
        dataCode.removeGrid(grid);
        resizeGridPositionAndIndex();
    }, animation_time);
}

function setGroupGirdNodeSize(node, index, xy) {
    var top = 3,
        left = 3,
        sxy = getScroll();
    if (index > 1) {
        top += 24;
    }
    if (index % 2 == 1) {
        left += 24;
    }
    top += xy.top + sxy.top;
    left += xy.left + sxy.left;
    node.removeClass('notran');
    setTimeout(function () {
        node.addClass('small');
        setTimeout(function () {
            node[0].style.cssText = 'left:' + left + 'px; top: ' + top + 'px; width:71px; height: 46px;';
        }, 5);
    }, 5);
}

/**
 * getGridItem from index
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */
function getGridItem(index) {
    if (index !== 0 && !index) {
        return {
            grid: grid_add,
            i: -1,
            j: -1
        }
    }

    var grid, item, item2,
        i = 0,
        j = -1,
        length = data_list.length,
        group_length;

    for1: for (; i < length; i++) {
        item = data_list[i];

        if (item.index == index) {
            grid = item;
            break;
        }
        if (item.children) {
            for2: for (j = 0, group_length = item.children.length; j < group_length; j++) {
                item2 = item.children[j];
                if (item2.index == index) {
                    grid = item2;
                    break for1;
                    break;
                }
            }
            j = -1;
        }
    }
    return !grid ? false : {
        grid: grid,
        i: i,
        j: j
    }
}

function getDataList() {
    return data_list || [];
}

module.exports = {
    getGridItem: getGridItem,
    getDataList: getDataList,
    getGridDataList: getGridDataList,
    onUpdateGridItem: onUpdateGridItem,
    onInsertGridItem: onInsertGridItem
}