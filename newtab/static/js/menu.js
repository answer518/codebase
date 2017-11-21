/**
 *
 * js右键菜单
 * @author guotingjie@maxthon.net
 * @ctime 2016-6-8
 */
'use strict';
/**
 * @require ../css/menu.css
 */
define('static/js/menu', function(require, exports, module) {

    function genPopupMenuLi(item) {
        return '<li class="menu-item" event-id="' + item.id + '">' +
            '<div class="menu-item-icon"></div>' +
            '<div class="menu-item-title">' + item.label + '</div>' +
            '</li>';
    }

    function genPopupMenuLiDisable(item) {
        return '<li class="menu-item-disabled" event-id="' + item.id + '">' +
            '<div class="menu-item-icon"></div>' +
            '<div class="menu-item-title">' + item.label + '</div>' +
            '</li>';
    }

    function genPopupMenuSeparator() {
        return '<li class="menu-item-separator"></li>';
    }

    function hideAndRemovePopupMenu() {
        var popupMenu = document.getElementById('pop_menu');
        if (popupMenu == null) return;
        document.body.removeChild(popupMenu);
        popupMenu = null;
        document.onclick = null;
    }

    function calculateMinHeight() {
        var height = 6;
        for (var i = 0, len = menu.length; i < len; i++) {
            if (menu[i].visible == false) continue;
            height += menu[i].type ? 1 : 30;
        }
        return height;
    }

    function genPopupMenu(menu) {
        var popupMenu = '<ul class="menu-content">';

        for (var i = 0, len = menu.length; i < len; i++) {
            if (menu[i].visible == false) continue;
            if (menu[i].type) {
                popupMenu += genPopupMenuSeparator();
                continue;
            }
            if (menu[i].disabled == true) {
                popupMenu += genPopupMenuLiDisable(menu[i]);
            } else {
                popupMenu += genPopupMenuLi(menu[i]);
            }
        };
        popupMenu += '</ul>';
        return popupMenu;
    }

    function createPopupMenu() {
        var node = document.createElement("div");
        node.setAttribute('id', 'pop_menu');
        node.setAttribute('class', 'pop-menu');
        document.body.appendChild(node);
        return node;
    }

    function showPopupMenu(clientX, clientY, menu, callback) {

        hideAndRemovePopupMenu();
        var menuContent = createPopupMenu();
        menuContent.innerHTML = genPopupMenu(menu);
        var scrollTop = document.body.scrollTop,
            scrollLeft = document.body.scrollLeft,
            browserWidth = document.documentElement.clientWidth,
            offsetWidth = menuContent.offsetWidth,
            left, top = clientY;

        if (clientX + offsetWidth >= browserWidth) {
            left = clientX - offsetWidth;
        } else {
            left = clientX;
        }

        menuContent.style.cssText = 'left:' + (left + scrollLeft) + 'px; top:' + (top + scrollTop) + 'px;width:' + (offsetWidth + 10) + 'px; z-index:999;';

        var items = $(menuContent).find('.menu-item');
        for (var i = 0, len = items.length; i < len; i++) {
            items[i].onclick = function(e) {
                hideAndRemovePopupMenu();
                var value = this.attributes['event-id'].value;
                setTimeout(function() {
                    callback(value);
                }, 200);
            };
            items[i].oncontextmenu = function() {
                hideAndRemovePopupMenu();
                var value = this.attributes['event-id'].value;
                setTimeout(function() {
                    callback(value);
                }, 200);
            }
        }
        var items = $(menuContent).find('.menu-item-disabled');
        for (var i = 0, len = items.length; i < len; i++) {
            items[i].onclick = function() {
                hideAndRemovePopupMenu();
            };
            items[i].oncontextmenu = function() {
                hideAndRemovePopupMenu();
            }
        }

        document.onclick = function(e) {
            hideAndRemovePopupMenu();
        }
        menuContent.onclick = function(e) {
            return false;
        }
        menuContent.oncontextmenu = function(e) {
            return false;
        }
        return "none";
    }

    module.exports = {
        hideAndRemovePopupMenu: hideAndRemovePopupMenu,
        showPopupMenu: showPopupMenu
    }
});
