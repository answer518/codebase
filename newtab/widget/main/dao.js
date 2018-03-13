var Api = require('static/js/api.js');
var Tools = require('static/js/tools.js');

var MY_SITE = 'my_site';
var BLACK_LIST = 'black_list';
var NEW_MY_SITE = 'new_my_site';

//window.Api.Maxthon.getSyncValue('new_my_site', function(data) { console.log(data) });
//require('static/js/api').setSyncValue('NEW_MY_SITE', {});
//require('static/js/api').setSyncValue('black_list', []);
var LOCAL_MY_SITE, grid_list, black_list;

function setGridList(data) {
    grid_list = data;
}

function saveOrUpdate(cb) {

    cb && cb(grid_list);
    // console.log(grid_list);
    Api.getUserProfile(function (profile) {
        // 默认开启了数据同步
        if (profile['open-async-data'] !== false) {
            console.log('async data .....');
            Api.setSyncValue(NEW_MY_SITE, grid_list);
        }
        setLocalData(grid_list);
    });
}

function setLocalData(data) {
    setTimeout(function () {
        localStorage.setItem('local_my_site', JSON.stringify(data));
    }, 0);
}

function handlerError() {
    LOCAL_MY_SITE = DEFAULT_DATA[navigator.language.toLocaleLowerCase()];
    console.log('save to local.... handlerError');
    setLocalData(LOCAL_MY_SITE);
}

function isEmpty(data) {
    if(data) {
        return Object.prototype.toString.call(data).slice(8, -1) === 'Object' && Object.keys(data).length === 0;
    }
    return true;
}

// 新版快速拨号数据
function getMySiteV3List() {
    return new Promise(function (resolve, reject) {
        Api.getSyncValue(NEW_MY_SITE, function (data) {
            // 这里有两种情况：
            //  1、第一次新版数据为空，取旧版数据初始化
            //  2、用户手动清空新版数据重新登录，此时数据未同步下来
            console.log(data);
            if (isEmpty(data)) {
                getMySiteList().then(function(ddata) {
                    resolve(ddata);
                    // 写入MY_SITE_V3
                    // Api.setSyncValue(NEW_MY_SITE, ddata);
                });
            } else {
                resolve(data);
            }
        });
    });
}
// 旧版快速拨号数据
function getMySiteList() {
    return new Promise(function (resolve, reject) {
        Api.getSyncValue(MY_SITE, function (mx5_layout) {
            if (isEmpty(mx5_layout)) {
                mx5_layout = DEFAULT_DATA[navigator.language.toLocaleLowerCase()];
            }
            
            Api.getSyncValue('needImport', function (data) {
                // 需要导入MX4 guest数据
                if (data.needImport && data.needImport == true) {
                    Api.getMX4Layout('qa_layout_guest', 'qa_widget_guest', function (mx4_layout_guest) {
                        Api.mx4_2_mx5({
                            'mx4_layout_guest': JSON.stringify(mx4_layout_guest),
                            'mx5_layout': JSON.stringify(mx5_layout),
                            'import': 'mx4'
                        }, function (result) {
                            // 设置为已导入
                            Api.setSyncValue('needImport', { 'needImport': false });
                            // setLocalData(result);
                            // console.log('save to local.... needImport4');
                            resolve(result);
                            Api.setSyncValue(NEW_MY_SITE, result);
                            // require('widget/main/main').getGridDataList();
                        });
                    });
                    return false;
                }
                // 需要导入MX5 guest数据
                if (data.needImport5 && data.needImport5 == true) { 
                    Api.getSyncValue('my_site_guest', function (mx5_layout_guest) {
                        Api.mx4_2_mx5({
                            'mx5_layout_guest': JSON.stringify(mx5_layout_guest),
                            'mx5_layout': JSON.stringify(mx5_layout),
                            'import': 'mx5'
                        }, function (result) {
                            // 设置为已导入
                            Api.setSyncValue('needImport', { 'needImport5': false });
                            // setLocalData(result);
                            resolve(result);
                            Api.setSyncValue(NEW_MY_SITE, result);
                        });
                    });
                    return false;
                }
                resolve(mx5_layout || []);
            });
        });
    });
}

/**
 * 当前版本是新版
 */
function isNewVersion() {
    return new Promise(function(resolve, reject) {
        var old_and_new_version = Tools.getCookie('old_and_new_version');
        if(old_and_new_version === null) { // 默认新版
            resolve();
        } else {
            Api.getSyncValue('isNewVersion', function (data) {
                if (isEmpty(data) || (data && data.isNewVersion === false)) {
                    reject();
                } else {
                    resolve();
                }
            });
        }
    });
}

function getGridList() {
    return new Promise((resolve, reject) => {
        // 重新获取
        LOCAL_MY_SITE = localStorage.getItem('local_my_site');
        if (LOCAL_MY_SITE != null) { // 本地有数据
            console.log(' get from local');
            try {
                if (typeof LOCAL_MY_SITE !== 'object') {
                    LOCAL_MY_SITE = JSON.parse(LOCAL_MY_SITE);
                }
            } catch (error) {
                console.error(error);
                handlerError();
            }
            if (!LOCAL_MY_SITE) {
                handlerError();
            }
            resolve(LOCAL_MY_SITE);
            return;
        }
        isNewVersion().then(function() {
            return getMySiteV3List();
        }, function() {
            return getMySiteList();
        }).then(function(data){
            resolve(data);
            // setLocalData(data);
        });
    });
}

function getMyFavoriteList(grid_list) {
    return new Promise((resolve, reject) => {
        Api.useApi('history.search', { num: 50, fromTime: 0, toTime: 0 }, function (dataList) {
            // 1.http://i.maxthon.cn/   2.http://i.maxthon.com/  域名 从新版新标签页-最常访问中过滤。
            dataList = dataList.filter(function (item) {
                return !/^https?:\/\/i.maxthon.(cn|com)/.test(item.url);
            });

            // 默认商务推荐数据
            if(dataList.length === 0) {
                dataList = MOST_VISITE[navigator.language.toLocaleLowerCase()];
                resolve(dataList);
                return;
            }
            var group = {};
            /**
             * 统计同一域名下每个url的访问次数
             */
            dataList.forEach(function (item, i) {
                var domain = item.url.match(/https?:\/\/([^\/]+)\//i);
                if (domain) {
                    domain = domain[0];
                    if (!group[domain]) {
                        group[domain] = [];
                    }

                    var has = false;
                    group[domain].forEach(function (item2, j) {
                        if (item2.url === item.url) {
                            item2.count++;
                            has = true;
                            return false;
                        }
                    });
                    // 没有重复项
                    if (has === false) {
                        item.count = 1;
                        group[domain].push(item);
                    }
                }
            });

            var filter_list = [];
            for (var arr in group) {
                var max = { count: 0 };
                group[arr].forEach(function (item, i) {
                    if (max.count < item.count) {
                        max.item = item;
                        max.count = item.count;
                    }
                });
                filter_list.push(max.item);
            }

            var new_list = [];
            filter_list.forEach(function (item, i) {
                var itemCount = Tools.getCountByItem(grid_list, item);
                if (itemCount < 1) {
                    new_list.push(item);
                }
            });

            getBlankList().then(function (black_list) {
                black_list.forEach(function (black_item, i) {
                    new_list = new_list.filter(function (item) {
                        return black_item.url !== item.url;
                    });
                });

                // 按访问次数排序：次数相同按时间最近的排序
                new_list.sort(function (a, b) {
                    return (b.count - a.count) || (b.visitTime - a.visitTime);
                });
                resolve(new_list);
            });
        });
    });
}

function getBlankList() {
    return new Promise((resolve, reject) => {
        Api.getSyncValue(BLACK_LIST, function (black_list) {
            if ($.isEmptyObject(black_list)) {
                black_list = [];
            }
            resolve(black_list || []);
        });
    });
}

function addToBlackList(data) {
    getBlankList().then(function (black_list) {
        // 过滤一下重复数据
        var itemCount = Tools.getCountByItem(black_list, data);
        if (itemCount == 0) {
            black_list.push(data);
            Api.setSyncValue(BLACK_LIST, black_list);
        }
    });
}

function removeBlackList(data) {
    getBlankList().then(function (black_list) {
        black_list = black_list.filter(function (item) {
            return item.url !== data.url || item.title !== data.title;
        });
        Api.setSyncValue(BLACK_LIST, black_list);
    });
}

function insertGridItem(i, j, item) {
    saveOrUpdate(function (data_list) {
        if (j < 0) {
            data_list.splice(i, 0, item);
        } else {
            data_list[j].children.splice(data_list[j].children.length, 0, data_list.splice(i, 1)[0]);
        }
    });
}

function moveGridItem(drag, drop) {
    saveOrUpdate(function (data_list) {
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
    saveOrUpdate(function (data_list) {
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
    saveOrUpdate(function (data_list) {
        if (j < 0) {
            data_list[i] = item;
        } else {
            data_list[i].children[j] = item;
        }
    });
}

function addGridGroup(uiindex, drag_index, drop_index, group_name) {
    saveOrUpdate(function (data_list) {
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
    saveOrUpdate(function (data_list) {
        data_list[group_index].title = group_name;
    });
}

module.exports = {
    addToBlackList: addToBlackList,
    removeBlackList: removeBlackList,
    addGridGroup: addGridGroup,
    updateGridGroup: updateGridGroup,
    moveGridItem: moveGridItem,
    insertGridItem: insertGridItem,
    updateGridItem: updateGridItem,
    removeGridItem: removeGridItem,
    getMyFavoriteList: getMyFavoriteList,
    getGridList: getGridList,
    setGridList: setGridList
}