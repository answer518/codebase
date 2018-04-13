var Api = require('static/js/api.js');
var dataCode = require('static/js/datacode.js');
var Dao = require('widget/main/dao');
var Tools = require('static/js/tools.js');
var list = [], isLoad = false;

function init() {
    if(isLoad === true) return;
    Dao.getGridList().then(function (grid_list) {
        Api.useApi('common.getLastClosedList', {}, function(data) {
            data.forEach(function (item, i) {
                var itemCount = Tools.getCountByItem(grid_list, item);
                if (itemCount < 1) {
                    list.push(item);
                }
            });
            // list = data;
            onGetBrowserUnclosedTabsLastComplete();
            isLoad = true;
        });
    });
}

/**
 * 操作区
 */
function func(id , i, added) {
    if(added === true) {
        return `<button class="list-del" id="del" val="${id}">×</button>`;
    } else {
        return `<button class="list-add" id="add" val="${id}" curindex="${i}" title="添加至快速拨号">+</button>
        <button class="list-del" id="del" val="${id}" curindex="${i}">×</button>`;
    }
}

function substr(str) {
    if(str.length > 50) {
        return str.substr(0, 50);
    }
    return str;
}

function onGetBrowserUnclosedTabsLastComplete() {
    
    var $lastVisit = $('#lastsession');
    var tpl = '';
    list.forEach(function (d, i) {
        tpl += `<li>
                <input type="checkbox" name="urls" id="id_${i}" value="${d.id}" url="${d.url}"/>
                <a href="${d.url}" class="ls-list-a" title="${d.title}" url="${d.url}">
                    <img src="mx://favicon/${d.url}" alt="${d.title}" class="nav-icon" onerror="this.src='//pc-newtab.maxthonimg.com/static/img/icon/6000.png'">
                    <span class="ls-list-text">${substr(d.title)}</span>
                    <span class="ls-list-link">${d.url.slice(0, 50)}</span>
                </a>
                ${func(d.id, i, d.added)}
            </li>`;
    });
    $lastVisit.find('.ls-list').empty().append(tpl);
    $lastVisit.on('click', '#input', function () {
        if ($(this).prop("checked") ) {
            $lastVisit.find("input[name='urls']").prop("checked", true);
        } else {
            $lastVisit.find("input[name='urls']").prop("checked", false);
        }
    });

    var checkbox_url = $lastVisit.find('input[name="urls"]');

    $lastVisit.on('click', 'input[name="urls"]', function () {
        if ($(this).prop("checked")) {
            if(checkbox_url.length === checkbox_url.filter(':checked').length) {
                $lastVisit.find('#input').prop("checked", true);
            }
        } else {
            $lastVisit.find('#input').prop("checked", false);
        }
    });

    $lastVisit.on('click', '.ls-list>li>button', function () {
        var $this = $(this);
        var bid = $this.attr('id');
        var ueip = {m: 'recentVisit'};
        if (bid === 'add') {
            var $lsListA = $this.prev('.ls-list-a');
            var item = {
                'title': $lsListA.attr('title'),                                  // 标题
                'url': $lsListA.attr('url')                                     // url链接
            }

            Api.getMeanColor(item.url, function (bgColor) {
                item.bgColor = bgColor;
                require('widget/main/main').onInsertGridItem(item);
                $this.remove();
                // webworker 计算
            });
            ueip.n = 'add';
        } else {
            $this.parents('li').remove();
            // del
            Api.useApi('common.removeLastClosedList', {'ids': [parseInt($this.attr('val'))]}, function() {});
            ueip.n = 'delete';
        }
        dataCode.statistic(ueip);
    });

    $lastVisit.on('click', '.ls-menu button', function () {
        var $this = $(this);
        var bid = $this.attr('id');

        var ueip = {m: 'recentVisit'};
        switch (bid) {
            case 'open_all':
                var urls = [];
                $lastVisit.find('input[name="urls"]:checked').each(function () {
                    urls.push($(this).attr('url'));
                });
                Api.useApi('openUrl', { 'urls': urls, 'mode': 'BackgroundTab' });
                ueip.n = 'batchOpen';
                break;
            case 'delete_all':
                var ids = [];
                $lastVisit.find('input[name="urls"]:checked').each(function (i, n) {
                    $(n).parents('li').remove();
                    ids.push($(n).val());
                });
                Api.useApi('common.removeLastClosedList', {'ids': ids}, function() {});
                ueip.n = 'batchDelete';
                break;
            case 'clear_all':
                $lastVisit.find('.ls-list').empty();
                Api.useApi('common.removeAllLastClosedList', {}, function() {});
                ueip.n = 'empty';
                break;
            case 'open_history':
                Api.useApi('openUrl', { 'url': 'mx://history', 'mode': 'BackgroundTab' });
                ueip.n = 'openHistoryRecord';
                break;
        }
        
        dataCode.statistic(ueip);
    });
}

module.exports = {
    init: init
}