/**
 * maxthon浏览器接口调用
 * @author guotingjie@maxthon.net
 * @ctime 2016-6-8
 */
'use strict';
// 我的站点
define('static/js/tools', function(require, exports, module) {

    var api = require('static/js/api');

    /**
     * 获取客户端语言
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function getLocale(cb) {
        api.useApi('getLocale', {}, function(result) {
            cb && cb(result);
        });
    }

    /**
     * 函数节流方法
     * @param Function fn 延时调用函数
     * @param Number delay 延迟多长时间
     * @param Number atleast 至少多长时间触发一次
     * @return Function 延迟执行的方法
     */
    function throttle(fn, delay, atleast) {
        var timer = null,
            previous = null;

        return function() {
            var now = +new Date();
            if (!previous) previous = now;
            if (now - previous > atleast) {
                fn();
                // 重置上一次开始时间为本次结束时间
                previous = now;
            } else {
                clearTimeout(timer);
                timer = setTimeout(function() {
                    fn();
                }, delay);
            }
        }
    }

    /**
     * 判断本地是否存在截图
     * @param url 
     * @param cb
     */
    function isThumbExists(url, cb) {
        api.useApi('quickaccess.isThumbExists', { 'urls': url }, function(data) {
            cb && cb(data);
        })
    }

    /**
     * 判断客户端是否支持webp格式
     * @return {Boolean} [description]
     */
    function isSupportWebp() {
        return !!!navigator.userAgent.match(/Intel Mac OS X/);
    }

    module.exports = {
        throttle: throttle,
        getLocale: getLocale,
        isThumbExists: isThumbExists,
        isSupportWebp: isSupportWebp
    };
    // exports.Api = Api;
});
