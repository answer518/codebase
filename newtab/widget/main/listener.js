var Api = require('static/js/api'),
    Dao = require('widget/main/dao');

function init(data_list) {
    Api.useApi('quickaccess.addEventListener', {}, function (res) {
        if ($.isEmptyObject(res)) return;
        console.log(res);
        switch (res.type) {
            case 'thumbUpdated': // 截图完成
                var dataurl = res.data;
                setTimeout(function (dataurl) {
                    for (var i = 0; i < data_list.length; i++) {
                        var item = data_list[i];
                        if (item.node.hasClass('loading') && dataurl === item.url) {
                            item.reload();
                            break;
                        }

                        if (item.children && item.children.length > 0) {
                            var children = item.children;
                            var childNodes = item.list_node.childNodes;
                            var len = Math.min(children.length, 4);
                            for (var j = 0; j < len; j++) {
                                var childNode = childNodes[j];
                                item = children[j];
                                if (childNode.className.indexOf('loading') !== -1 && dataurl === item.url) {
                                    childNode.className = 'thumbnail';
                                    childNode.style.cssText = 'background-image : url(' + newWin.getThumbsUrl(item.url, 0) + ')';
                                    break;
                                }
                            }
                        }
                    }
                }, 0, dataurl);
                break;
            case 'addNewSite':
                console.log('addNewSite');
                break;
            default:
                Dao.getGridDataList();
                break;
        }
    });
}

module.exports = {
    init: init
}