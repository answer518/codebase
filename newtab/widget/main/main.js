/**
 * 用于Controller与Model之间的业务服务层
 * @author guotingjie
 */
var Api = require('static/js/api'),
    Language = require('static/js/language'),
    Tools = require('static/js/tools'),
    Menu = require('static/js/menu'),
    Poup = require('widget/main/poup.js'),
    Dao = require('widget/main/dao'),
    helper = require('widget/main/helper');

var $group_dialog,
    $grid_container,
    $top_container,
    $add_grid,
    $group_list,
    data_list,
    grid_ui_data = {},
    drag_drop_data = {},
    map_list,
    current_col = 6,
    animation_time = 300;

var top_container_width, drag_node, current_group, group_node, group_title, group_operate, grid_add, current_grid;

function clearDragNode() {
    if (drag_node[0]) {
        document.body.removeChild(drag_node[0]);
        drag_node = null;
    }
}

function hideGroup(callback) {
    if (!current_group) return;
    current_group.addLastGridThumbnailNode();
    current_group.container.removeClass('show');
    group_operate.trigger('dialog-close');
    current_group = null;
    if (callback) {
        setTimeout(function() {
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
        top: document.body.scrollTop,
        left: document.body.scrollLeft
    }
}

Grid.prototype = (function() {

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
        if (data.image) {
            if (data.image.slice(0, data.image.length) === 'mx://thumbs') {
                nodeHtml += '<div class="thumbnail loading" url="' + data.url + '"></div>';
            } else {
                nodeHtml += '<div class="thumbnail" ';
                nodeHtml += '   style="background-image: url(' + data.image + ')">';
                nodeHtml += '</div>';
            }
        } else {
            nodeHtml += '<div class="thumbnail ' + data.colorBlock + '">';
            nodeHtml += '   <span>' + data.title + '</span>';
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
        self.thumburls = [];
        for (i = 0; i < (length > 4 ? 4 : length); i++) {
            self.addGridThumbnailNode(list[i], parentNode);
            self.thumburls.push(list[i].url);
        }

        if (self.thumburls.length === 0) return;
    }

    function getGridPosition(index) {
        var size = grid_ui_data,
            current_col, width, marginX, marginY, row, col, left, top;
        if (this.isHot === true) {
            current_col = 8;
            index = index || this.topuiindex;
            row = Math.floor(index / current_col);
            col = index % current_col;
            width = size.top_container_width * 0.125;
            left = width * col;
            top = 0;
        } else {
            index = index || this.uiindex;
            if (!this.children && this.group) {
                width = 153, marginX = 938 * 0.012, marginY = 330 * 0.02;
                current_col = 5;
                row = Math.floor(index / current_col);
                col = index % current_col;
                left = (width + 2 * marginX) * col;
                top = (width * 0.7 + marginY) * row;
            } else {
                var container_width = size.container_width;
                if (container_width > 0) {
                    current_col = 6;
                    width = container_width * 0.15;
                    marginX = container_width * 0.008;
                    marginY = container_width * 0.01;
                    row = Math.floor(index / current_col);
                    col = index % current_col;
                    grid_top = (width * 0.7 + marginY) * row;

                    left = (width + 2 * marginX) * col;
                    top = grid_top;
                }
            }
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

    function reload() {
        this.node.find('.thumb').css({ 'background-image': 'url(' + Poup.getThumbsUrl(this.url, 0) + ')' });
        this.node.removeClass('loading');
    }

    function showMenu(obj, l, t) {
        var menuList = [],
            version = Api.max_version;
        if (obj.children) {
            var list = obj.children;
            Menu.showPopupMenu(l, t, menuList, function(data) {
                var urls = [];
                list.forEach(function(item, i) {
                    urls.push(item.url);
                });
                switch (data) {
                    case 'open-all-tab': //打开新标签
                        Api.useApi('openUrl', { 'urls': urls, 'mode': 'BackgroundTab' });
                        break;
                    case 'delete-tab':
                        showDelete(obj);
                        break;
                    case 'open-all-newwin-tab':
                        Api.useApi('openUrl', { 'urls': urls, 'mode': 'NewWindow' });
                        break;
                    case 'open-all-invisible-tab':
                        Api.useApi('openUrl', { 'urls': urls, 'mode': 'NewPrivateWindow' });
                        break;
                }
            });
        } else {
            menuList = [
                { 'id': 'open-tab', 'label': Language.getLang('NewTabOpen') },
                { 'id': 'edit-tab', 'label': Language.getLang('Edit') },
                { 'id': 'delete-tab', 'label': Language.getLang('Delete') }
            ];

            Menu.showPopupMenu(l, t, menuList, function(data) {
                switch (data) {
                    case 'open-tab':
                        Api.useApi('newTabBackground', { 'url': obj.url });
                        break;
                    case 'edit-tab':
                        showEdit(obj);
                        break;
                    case 'delete-tab':
                        showDelete(obj);
                        break;
                    case 'open-newwin-tab':
                        Api.useApi('openUrl', { 'url': obj.url, 'mode': 'NewWindow' });
                        current_group && hideGroup();
                        break;
                    case 'open-invisible-tab':
                        Api.useApi('openUrl', { 'url': obj.url, 'mode': 'NewPrivateWindow' });
                        current_group && hideGroup();
                        break;
                }
            });
        }
    }

    function gridClick(obj) {

        setTimeout(function() {
            Api.useApi('newTabUpground', { 'url': obj.url });
        }, 10);

        // 关闭文件夹弹框
        current_group && hideGroup();
        // return false;
    }

    function showGroup() {
        var _this = this;
        if (!_this.container) return;
        current_group = _this;
        group_title.val(current_group.getGroupName());
        $group_list.find('.grid-list-container').removeClass('show');
        current_group.container.addClass('show');
        group_operate = $group_dialog.Dialog({
            close_btn: false,
            start_fn_before: function() {
                var urlList = [],
                    nodeList = [];
                current_group.children.forEach(function(item, i) {
                    if (!item.node.hasClass('loading')) {
                        return true;
                    }
                    urlList.push(item.url);
                    nodeList.push(item);
                });
            },
            remove_fn_later: function() {
                // 编辑状态
                $group_dialog.attr('edit', false);
                if (current_group) current_group = null;
                return true;
            }
        });
    }

    // 删除文件夹对话框
    function showDelete(obj) {
        var _this = obj;
        if (!_this.children) {
            onRemoveGrid(_this.index);
            return;
        }
        Tools.showDeleteFolder(_this);
    }

    function showEdit(obj) {
        var _this = obj,
            dialogModel, _current_group = current_group;

        if (obj.group && obj.group !== '') {
            if (group_operate) {
                group_operate.trigger('dialog-close');
                $group_dialog.attr('edit', true);
                dialogModel = true;
                // fix:解决在文件夹打开状态下编辑后，把current_group置空导致交互异常的问题
                current_group = _current_group;
            }
        }

        Poup.showDialog({
            'index': _this.index,
            'uiinde': _this.topuiindex || _this.uiindex,
            'title': _this.title,
            'url': _this.url,
            'image': _this.image,
            'colorBlock': _this.colorBlock,
            'group': _this.group
        }, true, dialogModel);
    }

    function refresh(obj) {
        obj.node.addClass('loading');
        Tools.reflushThumb(obj.url);
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
        var offset = $group_dialog.offset();
        var areaGroup = {
            top: offset.top,
            left: offset.left,
            right: offset.left + $group_dialog.width(),
            bottom: offset.top + $group_dialog.height()
        }
        if (xy.left - areaGroup.right > width ||
            xy.right - areaGroup.left < width ||
            xy.top - areaGroup.bottom > height ||
            xy.bottom - areaGroup.top < width) {
            return true;
        }
        return false;
    }

    var bodyScroll = (function() {

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
            timer = setInterval(function() {
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
        animationTimer = setTimeout(function() {
            ban_move = false;
        }, animation_time);
    }

    function getDropIndex(drag, drop) {
        var drop_index, dropList;
        drop_index = drop.index;
        return drop_index;
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

    function isCross(current_drag, current_drop) {
        return (current_drag.isHot === true && current_drop.isHot !== true) || (current_drag.isHot !== true && current_drop.isHot === true);
    }

    // 移动碰撞
    function moveCollision(xy) {
        scrollBody(xy);
        if (ban_move) return;
        var children, area, item;
        // 拖动是文件夹
        if (current_drag.children) {
            children = current_drag.children;
            forEachGrid(function(item, i) {
                if (i !== current_drag.uiindex && !isCross(current_drag, item)) {
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
            if (isCross(current_drag, current_drop)) {
                if (area > moveArea) {
                    drag_node.addClass('swap');
                } else {
                    drag_node.removeClass('swap');
                    current_drop.removeClass('combo');
                    current_drop.removeClass('current');
                    current_drop = null;
                }
            } else {
                if (area > moveArea) {
                    moveAnimationTimer();
                    onMovingGrid(current_drag.index, current_drop.index, current_drag.group);
                }
                if (area < addArea || area > moveArea) {
                    current_drop.removeClass('combo');
                    current_drop = null;
                }
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
            forEachGrid(function(item, i) {
                if (i !== current_drag.uiindex && coverArea(xy, item.getGridFixed()) > moveArea) {
                    moveAnimationTimer();
                    onMovingGroup(current_drag.index, item.index, current_drag.group);
                    return false;
                }
            });
        } else {
            forEachGrid(function(item, i) {
                if (i !== current_drag.uiindex) {
                    area = coverArea(xy, item.getGridFixed());
                    if (area > addArea) { // 合并文件夹
                        current_drop = item;
                        if (isCross(current_drag, current_drop)) {
                            current_drop.addClass('current');
                        } else {
                            if (area > moveArea) {
                                moveAnimationTimer();
                                onMovingGrid(current_drag.index, item.index, current_drag.group);
                                return false;
                            }
                            current_drop.addClass('combo');
                        }
                        return false;
                    }
                }
            });
        }
    }

    function html() {
        return helper.render(this);
    }

    function dom() {
        var _this = this;
        var grid_node, function_node, list_node, beginX, beginY, mouse_beginX, mouse_beginY, dragState, moveTimer;

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
                setTimeout(function() {
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
            setTimeout(function() {
                grid_node.removeClass('draging');
                setTimeout(function() {
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

                // 上下互相交换
                if (isCross(current_drag, current_drop)) {
                    if (current_drag.children || current_drop.children) {
                        rollback();
                        current_drop.removeClass('current');
                        current_drop = null;
                        return;
                    }
                    onSwappingGrid(current_drag.index, getDropIndex(current_drag, current_drop));
                } else {
                    // fix: top8 不允许合并
                    if (current_drag.isHot === true && current_drop.isHot === true) {
                        rollback();
                    } else {
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
                    }
                }
                current_drop = null;
            }
        }
        // 添加按钮
        if (!_this.url && !_this.children) {
            if (_this.isHot === true) {
                if (_this.title === 'Add') {
                    grid_node = $(helper.add_grid);
                } else {
                    grid_node = $(helper.empty_grid_html);
                }
            } else {
                grid_node = $(helper.add_grid.replace('top', 'main add'));
                // fixed: 用于定位从文件夹中脱出时追加的位置
                grid_add = _this;
            }
            grid_node.on('click', '.add', function(event) {
                current_grid = _this;
                Poup.showDialog({ index: _this.index, uiindex: _this.topuiindex || _this.uiindex }, false);
            });
        } else {
            // 实体格子
            if (!_this.children) {
                grid_node = $(_this.html());
                grid_node.on('click', function(event) {
                    event.stopPropagation();
                    var target = $(event.target);
                    if (target.is('button')) {
                        var buttonType = target.prop('className');
                        switch (buttonType) {
                            case 'delete':
                                showDelete(_this);
                                break;
                            case 'edit':
                                showEdit(_this);
                                break;
                            case 'refresh':
                                refresh(_this);
                                break;
                        }
                        return false;
                    }

                    return true;
                });

            } else { // 文件夹
                _this.group = _this.title;

                grid_node = $('<li class="main grid group"></li>');
                list_node = $('<div class="thumbnail-container"></div>');
                function_node = $(['<div class="function">',
                    '<strong class="title">', _this.group, '</strong>',
                    '<button class="delete">×</button>',
                    '</div>'
                ].join(''));
                // 文件夹缩略图
                _this.addLastGridThumbnailNode(list_node[0], _this.children);

                grid_node.append(list_node);
                grid_node.append(function_node);
                _this.list_node = list_node[0];
                _this.function_node = function_node[0];
                _this.list_node.addEventListener('click', function(event) {
                    event.button === 0 && _this.showGroup();
                });
                _this.function_node.addEventListener('click', function(event) {
                    var target = $(event.target);
                    if (target.is('button')) {
                        var buttonType = target.prop('className');
                        switch (buttonType) {
                            case 'delete':
                                showDelete(_this);
                                break;
                            case 'edit':
                                showEdit(_this);
                                break;
                            case 'refresh':
                                refresh(_this);
                                break;
                        }
                        return false;
                    }
                });
            }

            grid_node.on('mousedown', function(event) {
                startDrag(event);
            });

            grid_node.on('contextmenu', function(event) {
                showMenu(_this, event.clientX, event.clientY);
                event.stopPropagation();
                event.preventDefault();
            });
        }

        _this.node = grid_node;
        _this.locate();
        return grid_node;
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
            list.forEach(function(item) {
                item.group = group_name;
            });

            if (group_name !== '') {
                _this.function_node.firstChild.textContent = group_name;
            }
        }
    }

    return {
        dom: dom,
        html: html,
        locate: locate,
        reload: reload,
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

function getGridList(mapList, callback) {
    map_list = mapList;
    Dao.getGridList(function(data) {
        readyInitUiData();
        initData(data);
        initGridDataList();
        // 优化一下这个地方
        resizeGridPositionAndIndex();
    });
}

function initData(data) {
    var top_data_list = [],
        topuiindex = 0;
    data_list = [];
    data.forEach(function(item, i) {
        if (item) {
            if (item.isHot === true) {
                item.topuiindex = topuiindex++;
                top_data_list.push(item);
            } else {
                if (item.children) {
                    item.children.forEach(function(item2, j) {
                        if (!item2) {
                            item.children.splice(j, 1);
                            return true;
                        }
                    });
                }
                data_list.push(item);
            }
        }
    });

    data_list.push({ 'title': 'Add', 'type': 'button' });
    data_list.push.apply(data_list, autoComplete(top_data_list));
}

// 自动补全Top8
function autoComplete(list) {
    var length = list.length;

    if (length < 8) {
        list.push({ 'title': 'Add', isHot: true, topuiindex: length });
        for (var i = 0; i < 8 - length; i++) {
            list.push({ 'title': 'Empty', isHot: true, topuiindex: length + 1 + i });
        }
    } else {
        list.splice(8);
    }
    return list;
}

function initGridDataList() {
    var grid;
    data_list.forEach(function(item, i) {
        if (!item.children) { // 普通格子
            item = new Grid(item, i);
            if (item.isHot === true) {
                $top_container.append(item.dom());
            } else {
                $grid_container.append(item.dom());
            }
        } else {
            grid = new Grid(item, i);
            grid.container = $('<div class="grid-list-container"></div>');
            grid.children = [];
            item.children.forEach(function(item2, j) {
                item2.group = grid.title;
                item2 = new Grid(item2, j);
                grid.container.append(item2.dom());
                grid.children[j] = item2;
            });
            $group_list.append(grid.container);
            $grid_container.append(grid.dom());
            item = grid;
        }
        item.index = i;
        data_list[i] = item;
    });
}

/**
 * 重新定位
 */
function resizeGridPositionAndIndex() {
    var index = 0,
        topindex = 0,
        children;

    data_list.forEach(function(item, i) {
        item.uiindex = i;
        if (item.isHot === true) {
            if (topindex > 7) {
                item.node.remove();
                data_list.splice(i, 1);
                return false;
            }
            item.topuiindex = topindex++;
        }
        item.locate();
        children = item.children;
        if (children) {
            children.forEach(function(item2, j) {
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

    $grid_container[0].style.height = data_list[data_list.length - 9].getGridPosition().top + grid_ui_data.height + 'px';
    drag_drop_data.height = document.body.scrollHeight;
}

/**
 * 初始化UI数据
 */
function readyInitUiData() {
    $grid_body = $('.nav-body');
    $grid_container = $('#grid_list_container');
    $group_dialog = $('#group'),
    $top_container = $('#top'),
    $add_grid = $('#add-grid'),
    $group_list = $('#group_list');

    // 清空元素
    $grid_container.empty();
    $top_container.empty();

    group_title = $('#group-title');

    group_title.on('click', function(e) {
        e.stopPropagation();
        if (group_title.hasClass('editable'))
            return;
        group_title.addClass('editable');
        this.focus();
        document.onkeydown = function(e) {
            if (e.keyCode === 13) {
                group_title.removeClass('editable');
                return false;
            }
            return true;
        }
    });

    // 标题失去焦点
    group_title.on('blur', function(e) {
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

    // 推荐站点click行为
    $('#add-dialog').on('click', '.dialog-grid-list > li', function(e) {
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
            var $cloneGrid = $this.clone();
            var w = $this.width(),
                h = $this.innerHeight();
            var p = $this.offset();

            $cloneGrid.css({ 'position': 'absolute', '-webkit-transition': 'all 0.3s', 'left': p.left, 'top': p.top + document.body.scrollTop });
            document.body.appendChild($cloneGrid[0]);
            // 获取目标位置
            item.index = current_grid.index;
            item.isHot = current_grid.isHot;

            if (!current_grid.group) {
                var p2 = current_grid.getGridFixed();
                var l2 = p2.left;
                var t2 = p2.top + document.body.scrollTop;
                $cloneGrid.css({ "left": l2, "top": t2 });
                setTimeout(function() {
                    // editOperate ? onUpdateGridItem(item) : onInsertGridItem(item, grid);
                    onInsertGridItem(item, current_grid);
                    if ($cloneGrid) {
                        document.body.removeChild($cloneGrid[0]);
                        $cloneGrid = null;
                    }
                }, 300);
            } else {
                Controller.onUpdateGridItem(item);
                if ($cloneGrid) {
                    document.body.removeChild($cloneGrid[0]);
                    $cloneGrid = null;
                }
            }

            // 关闭弹框
            $('#add-dialog').trigger('dialog-close');
        }, 50);
    });

    grid_ui_data.top_container_width = $top_container.width();
    grid_ui_data.container_width = $grid_body.width();
    grid_ui_data.height = grid_ui_data.container_width * 0.15 * 0.7 + grid_ui_data.container_width * 0.01;
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
            $grid_container.append(dragObj.node);
            hideGroup();
        }
    } else {
        data_list.splice(drop.i, 0, data_list.splice(drag.i, 1)[0]);
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
    setGroupNameTimer = setTimeout(function() {
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
    $grid_container[0].removeChild(dragObj.node[0]);
    dropGroup.container.append(dragObj.node);
    if (drag_node && !current_group) {
        dragObj.removeClass('draging');
        dragObj.removeClass('notran');
        length = dropGroup.children.length - 1;
        var xy = dropGroup.getGridFixed();

        // 设置缩略图大小
        setGroupGirdNodeSize(drag_node, length, xy);
        setTimeout(function() {
            dropGroup.addLastGridThumbnailNode();
            // 持久化
            Dao.insertGridItem(drag.i, drop.i);
            resizeGridPositionAndIndex();
            clearDragNode();
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
    $grid_container.append(group_node);
    $group_list.append(group.container);

    data_list.splice(uiindex, 0, group);
    group.setGroupName(group_name);
    $grid_container[0].removeChild(dropObj.node[0]);
    $grid_container[0].removeChild(dragObj.node[0]);
    group.container.append(dropObj.node);
    group.container.append(dragObj.node);

    dragObj.removeClass('draging');
    dragObj.removeClass('notran');
    if (drag_node) {
        setGroupGirdNodeSize(drop_node, 0, xy);
        setGroupGirdNodeSize(drag_node, 1, xy);
        setTimeout(function() {
            group_node.removeAttr('style');
            // 持久化
            Dao.addGridGroup(uiindex, drag.i, drop.i, group_name);
            resizeGridPositionAndIndex();
            clearDragNode();
            drop_node.remove();
        }, animation_time - 150);
    }
}

// 上下互换
function onSwappingGrid(drag_index, drop_index) {
    var drag = getGridItem(drag_index),
        dragObj = drag.grid,
        drop = getGridItem(drop_index),
        dropObj = drop.grid,
        sxy = getScroll(),
        list, drop_node, drop_xy, drag_xy, dropItem, dragItem, dropData, dropData;

    if (drag_node) {
        drag_node.removeClass('notran');
        drop_xy = dropObj.getGridFixed();
        drop_node = dropObj.cloneGridNode();
        drop_node.css({ padding: 0, margin: 0, overflow: 'hidden' });
    }

    drag_xy = dragObj.getGridFixed();
    drop_node.css({ 'left': drag_xy.left + sxy.left, 'top': drag_xy.top + sxy.top });
    drag_node.css({ 'left': drop_xy.left + sxy.left, 'top': drop_xy.top + sxy.top });

    dropData = Object.assign({}, dropObj);
    dragData = Object.assign({}, dragObj);
    if (dragObj.isHot === true) {
        dropData.isHot = true;
        dropData.topuiindex = dragObj.topuiindex;
        dragData.isHot = false;
        delete dragData.topuiindex;
        dragData.uiindex = dropObj.uiindex;
    } else {
        dragData.isHot = true;
        dragData.topuiindex = dropObj.topuiindex;
        dropData.isHot = false;
        delete dropData.topuiindex;
        dropData.uiindex = dragObj.uiindex;
    }

    dropItem = new Grid(dropData, dragObj.uiindex);
    dragObj.node.replaceWith(dropItem.dom().addClass('draging'));
    dragItem = new Grid(dragData, dropObj.uiindex);
    dropObj.node.replaceWith(dragItem.dom().addClass('draging'));

    data_list.splice(drag.i, 1, dropItem);
    data_list.splice(drop.i, 1, dragItem);

    dragObj.removeClass('draging');
    dragObj.removeClass('notran');
    if (drag_node) {
        setTimeout(function() {
            dragItem.node.removeClass('draging');
            dropItem.node.removeClass('draging');
            // 持久化
            Dao.swapGridItem(drag.i, clearExtraAttr(dropData), drop.i, clearExtraAttr(dragData));
            resizeGridPositionAndIndex();
            clearDragNode();
            drop_node.remove();
        }, animation_time);
    }
}

function clearExtraAttr(data) {
    var obj = {
        title: data.title,
        image: data.image,
        url: data.url,
        isHot: data.isHot
    }
    if (!obj.image) {
        delete obj.image;
        obj.colorBlock = data.colorBlock;
    }
    return obj;
}

function onInsertGridItem(data, targetObj) { // 确保targetObj 存在
    var dataindex, container, list, grid, group, obj = targetObj || grid_add;
    list = data_list;
    dataindex = obj.uiindex;
    if (obj.isHot === true) {
        data.topuiindex = obj.topuiindex;
    }

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
        if (data.isHot === true) {
            data.topuiindex = obj.grid.topuiindex;
        }
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
    setTimeout(function() {
        grid.node.remove();
        if (j < 0) {
            data_list.splice(i, 1);
            if (grid.isHot === true) {
                var item;
                var uiindex = data_list.length;
                var lastGrid = data_list[uiindex - 1];
                if (!lastGrid.url && (lastGrid.title === 'Add' || lastGrid.title === 'Empty')) {
                    item = new Grid({ 'title': 'Empty', 'isHot': true }, uiindex);
                } else {
                    item = new Grid({ 'title': 'Add', 'isHot': true }, uiindex);
                }
                item.topuiindex = grid.topuiindex;
                data_list.splice(uiindex, 0, item);
                $top_container.append(item.dom());
            }
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
        resizeGridPositionAndIndex();
    }, animation_time);
}

function setGroupGirdNodeSize(node, index, xy) {

    var top = 8,
        left = 12,
        sxy = getScroll();
    if (index > 1) {
        top += 50;
    }
    if (index % 2 == 1) {
        left += 72;
    }
    top += xy.top + sxy.top;
    left += xy.left + sxy.left;
    node.removeClass('notran');
    setTimeout(function() {
        node.addClass('small');
        setTimeout(function() {
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

module.exports = {
    getGridList: getGridList,
    getGridItem: getGridItem,
    onUpdateGridItem: onUpdateGridItem,
    onInsertGridItem: onInsertGridItem
}
