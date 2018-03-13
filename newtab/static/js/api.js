/**
 * maxthon浏览器接口调用
 * @author guotingjie@maxthon.net
 * @ctime 2016-6-8
 */
'use strict';
// 我的站点
define('static/js/api', function(require, exports, module) {
    var MY_SITE = 'my_site';
    var SYNC_KEY_QA = 'qa_layout';
    var SYNC_KEY_QA_WIDGET = 'qa_widget';
    var MAP_LIST = {};
    var mock = require('static/js/lib/mock');

    /**
     * API使用
     * @param  {[type]}   conf [description]
     * @param  {Function} cb   [description]
     * @return {[type]}        [description]
     */
    function useApi(name, params, cb) {
        try {
            window.maxthon.webSend(name, params, function(data) {
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
        }, function(data) {
            if (data && !data.status) {
                // console.error('setSyncValue', key, value);
            }
        });
    }
    /**
     * 读出浏览器值
     * @param {[type]} key   [description]
     * @param {[type]} value [description]
     */
    function getSyncValue(key, next) {

        useApi('quickaccess.getSyncValue', {
            key: key
        }, function(result) {
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
            useApi('account.getBrowserCurrentAccountInfo', {}, function(result) {
                callback && callback({ uid: result.id });
            });
        } catch (e) {
            console.error('[maxthon]未定义, 请使用傲游浏览器');
        }
    }

    /**
     * 获取浏览器版本号
     */
    var max_version = (function() {
        try {
            return external && external.max_version 
                    ? external.max_version : typeof external.maxVersion === 'function' 
                    ? external.maxVersion() : '5.0.0.0';
        } catch (e) {
            return 0;
        }
    })();

    var Api = {
        useApi: useApi,
        getSyncValue: getSyncValue,
        setSyncValue: setSyncValue,
        max_version: max_version,
        pn: typeof external.GetPN === 'function' ? external.GetPN() : '',
        platform: navigator.userAgent.match('Macintosh;.*Mac.*') ? 'Mac' : 'Win',
    };

    module.exports = Api;
});
