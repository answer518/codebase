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

        initData(dataList);
        callback && callback(data_list);
    });
}

var data_list = [];

function initData(data) {
    var top_data_list = [],
        topuiindex = 0;
    data.forEach(function(item, i) {
        if (item) {
            // 过滤无效数据： Add 增加按钮 Empty:占位格子
            if (item.title === 'Add' || item.title === 'Empty') {
                return true;
            }
            if (item.group) delete item.group;
            if (item.uiindex) delete item.uiindex;
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
    addGridGroup: addGridGroup,
    updateGridGroup: updateGridGroup,
    moveGridItem: moveGridItem,
    swapGridItem: swapGridItem,
    insertGridItem: insertGridItem,
    updateGridItem: updateGridItem,
    removeGridItem: removeGridItem,
    getGridItem: getGridItem,
    getGridList: getGridList
}
