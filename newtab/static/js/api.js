/**
 * maxthon浏览器接口调用
 * @author guotingjie@maxthon.net
 * @ctime 2016-6-8
 */
'use strict';
// 我的站点
define('static/js/api', function (require, exports, module) {
    var MY_SITE = 'my_site';
    var SYNC_KEY_QA = 'qa_layout';
    var SYNC_KEY_QA_WIDGET = 'qa_widget';
    var MAP_LIST = {};
    var mock = require('static/js/mock');

    // argb值中获得颜色 
    function hex2rgb(val) {
        var red = (val >> 16) & 0xFF,
            green = (val >> 8) & 0xFF,
            blue = val & 0xFF;
        return 'rgb(' + red + ',' + green + ',' + blue + ')';
    }

    function getMeanColor(url, cb) {
        useApi('common.getMeanColor', { url: url }, function (data) {
            var bgColor = '#458FF3';
            if (!isNaN(data)) {
                bgColor = hex2rgb(data);
            }
            cb && cb(bgColor);
        });
    }
    /**
     * API使用
     * @param  {[type]}   conf [description]
     * @param  {Function} cb   [description]
     * @return {[type]}        [description]
     */
    function useApi(name, params, cb) {
        try {
            window.maxthon.webSend(name, params, function (data) {
                if (cb && data.status && data.status === true) {
                    cb(data.result);
                } else {
                    cb && cb(mock[name] || {});
                }
            });
        } catch (e) {
            cb && cb(mock[name] || {});
        }
    }

    var userProfile = {};
    /**
     * 读取用户配置
     */
    function getUserProfile(next) {
        if ($.isEmptyObject(userProfile)) {
            getSyncValue('noSyncData', function (data) {
                userProfile = data;
                next(userProfile);
            });
        } else {
            next(userProfile);
        }
    }

    /**
     * 更新用户配置
     * @param {*} key 
     * @param {*} value 
     */
    function setUserProfile(key, value) {
        userProfile[key] = value;
        setSyncValue('noSyncData', userProfile);
    }

    /**
     * 写入浏览器值
     * @param {[type]} key   [description]
     * @param {[type]} value [description]
     */
    function setSyncValue(key, value) {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }

        useApi('quickaccess.setSyncValue', {
            key: key,
            json: value
        }, function (data) {});
    }
    /**
     * 读出浏览器值
     * @param {[type]} key   [description]
     * @param {[type]} value [description]
     */
    function getSyncValue(key, next) {

        useApi('quickaccess.getSyncValue', {
            key: key
        }, function (result) {
            if (typeof result === 'string') {
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    result = {};
                }
            }

            next(result);
        });
    }

    /**
     * 获取用户设备信息
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function getUserInfo(callback) {
        try {
            useApi('account.getBrowserCurrentAccountInfo', {}, function (result) {
                callback && callback({ uid: result.id });
            });
        } catch (e) {
            console.error('[maxthon]未定义, 请使用傲游浏览器');
        }
    }

    /**
     * 获取页面信息
     * @param  
     * @return 
     */
    function getMX4Layout(layout, widget, callback) {
        var _this = this;
        _this.getSyncValue(layout, function (mx4_layout) {
            _this.getSyncValue(widget, function (mx4_widget) {
                _this.getSyncValue('mx4_image_mapping', function (mx4_image_mapping) {
                    try {
                        if (!$.isEmptyObject(mx4_layout)) {
                            var page = mx4_layout.page || [];
                            // 此处加上预置、截图、色块标识
                            for (var i = 0; i < page.length; i++) {
                                for (var j = 0; j < mx4_layout.page[i].content.length; j++) {
                                    var item = mx4_layout.page[i].content[j];

                                    for (var mapping in mx4_image_mapping) {
                                        if (mapping === item.url) {
                                            item.thumbType = mx4_image_mapping[mapping] === 'default' ? 0 : mx4_image_mapping[mapping] === 'snap' ? 1 : 2; //0预置1抓图2色块3自定义
                                            break;
                                        }
                                    }

                                    if (!$.isEmptyObject(mx4_widget)) {
                                        for (var attr in mx4_widget) {

                                            if (attr == item.templateDataId) { // 个性盒子
                                                mx4_layout.page[i].content = mx4_layout.page[i].content.concat(mx4_widget[attr]);
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            callback(mx4_layout);
                        } else {
                            callback({});
                        }
                    } catch (e) {
                        callback({});
                    }
                });
            });
        });
    }

    /**
     * mx4 数据转换 mx5
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function mx4_2_mx5(data, callback) {
        getUserInfo(function (result) {
            data.uid = result.uid;
            data.lang = navigator.language;
            data.pn = external.GetPN && external.GetPN();
            data.platform = navigator.userAgent.match('Macintosh;.*Mac.*') ? 'Mac' : 'Win';
            $.ajax({
                type: "post",
                async: true,
                url: '/api/data/convert.php',
                data: data,
                success: function (data) {
                    if (data.status && data.result && data.result.length > 0) {
                        // 验证数据完整性
                        if (data.result[data.result.length - 1].title && data.result[0].title) {
                            callback && callback(data.result);
                        }
                    } else {
                        callback && callback(URL_LIBRARY[navigator.language.toLocaleLowerCase()]);
                    }
                },
                error: function (a, b, c) {
                    callback && callback(JSON.parse(data.mx5_layout));
                }
            });
        });
    }

    /**
     * 获取浏览器版本号
     */
    var max_version = (function () {
        try {
            return external && external.max_version
                ? external.max_version : typeof external.maxVersion === 'function'
                    ? external.maxVersion() : '5.0.0.0';
        } catch (e) {
            return 0;
        }
    })();

    module.exports = {
        useApi: useApi,
        getMeanColor: getMeanColor,
        getMX4Layout: getMX4Layout,
        mx4_2_mx5: mx4_2_mx5,
        getSyncValue: getSyncValue,
        setSyncValue: setSyncValue,
        getUserProfile: getUserProfile,
        setUserProfile: setUserProfile,
        max_version: max_version,
        pn: typeof external.GetPN === 'function' ? external.GetPN() : '',
        platform: navigator.userAgent.match('Macintosh;.*Mac.*') ? 'Mac' : 'Win',
    };
});
