var Api = require('static/js/api.js');
var MY_SITE = 'my_site';

function saveOrUpdate(cb) {
    Api.getSyncValue(MY_SITE, function(data_list) {
        if ($.isEmptyObject(data_list)) {
            data_list = DEFAULT_MY_SITE;
        }
        cb && cb(data_list);
        Api.setSyncValue(MY_SITE, data_list);
    });
}

function insertGridItem(i, j, item) {

    saveOrUpdate(function(data_list) {
        if (j < 0) {
            data_list.splice(i, 0, item);
        } else {
            data_list[j].children.splice(data_list[j].children.length, 0, data_list.splice(i, 1)[0]);
        }
    });
}

function moveGridItem(drag, drop) {
    saveOrUpdate(function(data_list) {
        if (drop.j < 0 && drag.j < 0) {
            data_list.splice(drop.i, 0, data_list.splice(drag.i, 1)[0]);
        } else if (drop.j < 0 && drag.j >= 0) {
            data_list.splice(drop.i, 0, data_list[drag.i].children.splice(drag.j, 1)[0]);
            if (data_list[drag.i].children.length === 0) {
                data_list.splice(drag.i, 1);
            }
        } else {
            data_list[drag.i].children.splice(drop.j, 0, data_list[drag.i].children.splice(drag.j, 1)[0]);
        }
    });
}

function removeGridItem(i, j) {
    saveOrUpdate(function(data_list) {
        if (j < 0) {
            data_list.splice(i, 1);
        } else {
            data_list[i].children.splice(j, 1);
            if (data_list[i].children.length === 0) { // 删除空文件夹
                data_list.splice(i, 1);
            }
        }
    });
}

function updateGridItem(i, j, item) {
    saveOrUpdate(function(data_list) {
        if (j < 0) {
            data_list[i] = item;
        } else {
            data_list[i].children[j] = item;
        }
    });
}

function swapGridItem(drag_index, dropItem, drop_index, dragItem) {
    saveOrUpdate(function(data_list) {
        data_list.splice(drag_index, 1, dropItem);
        data_list.splice(drop_index, 1, dragItem);
    });
}

function addGridGroup(uiindex, drag_index, drop_index, group_name) {
    saveOrUpdate(function(data_list) {
        var group = { title: group_name, children: [] };
        var list = group.children;
        if (drag_index > drop_index) {
            list[1] = data_list.splice(drag_index, 1)[0];
            list[0] = data_list.splice(drop_index, 1)[0];
        } else {
            list[0] = data_list.splice(drop_index, 1)[0];
            list[1] = data_list.splice(drag_index, 1)[0];
        }
        data_list.splice(uiindex, 0, group);
    });
}

function updateGridGroup(group_index, group_name) {
    saveOrUpdate(function(data_list) {
        data_list[group_index].title = group_name;
    });
}

function getGridList(callback) {
    Api.getSyncValue(MY_SITE, function(dataList) {

        if (Object.keys(dataList).length === 0) {
            dataList = DEFAULT_MY_SITE;
        }

        callback && callback(dataList);
    });
}

module.exports = {
    addGridGroup: addGridGroup,
    updateGridGroup: updateGridGroup,
    moveGridItem: moveGridItem,
    swapGridItem: swapGridItem,
    insertGridItem: insertGridItem,
    updateGridItem: updateGridItem,
    removeGridItem: removeGridItem,
    getGridList: getGridList
}