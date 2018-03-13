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
     * 判断客户端是否支持webp格式
     * @return {Boolean} [description]
     */
    function isSupportWebp() {
        return !!!navigator.userAgent.match(/Intel Mac OS X/);
    }

    /**
     * 数组中查找重复项
     * @param {*} objects 
     * @param {*} item 
     */
    function getCountByItem(objects, item) {
        var count = 0;
        for (var i = 0; i < objects.length; i++) {
            if (objects[i] === null) continue;
            if(objects[i].children) {
                count += getCountByItem(objects[i].children, item);
                continue;
            }
            if(!objects[i].url || !item.url) continue;
            if (objects[i].url.replace(/^https?:\/\//,'') === item.url.replace(/^https?:\/\//,'')) {
                count++;
            }
        }
        return count;
    }

    /**
     * 设置cookie
     * @param {*} c_name 
     * @param {*} value 
     * @param {*} expiredays 
     */
    function setCookie(c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays)
        document.cookie = c_name + "=" + escape(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
    }

    /**
     * 读取cookie
     * @param {*} name 
     */
    function getCookie(name) {  
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");  
        if(arr=document.cookie.match(reg))  
            return unescape(arr[2]);   
        else   
            return null;   
    }

    module.exports = {
        throttle: throttle,
        getLocale: getLocale,
        setCookie: setCookie,
        getCookie: getCookie,
        isSupportWebp: isSupportWebp,
        getCountByItem: getCountByItem
    };
});
