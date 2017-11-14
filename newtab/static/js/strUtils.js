/**
 * 
 * @author guotingjie@maxthon.net
 * @ctime 2016-6-8
 */
'use strict';
// 我的站点
define('static/js/strUtils', function(require, exports, module) {

    /**
     * 比较两个字符串大小
     * @param  {[type]} strA [description]
     * @param  {[type]} strB [description]
     * @return {[type]}      [description]
     */
    function compare(strA, strB) {
        var i, diff;
        var regExStrip0 = /(\.0+)+$/;
        var segmentsA = strA.replace(regExStrip0, '').split('.');
        var segmentsB = strB.replace(regExStrip0, '').split('.');
        var l = Math.min(segmentsA.length, segmentsB.length);

        for (i = 0; i < l; i++) {
            diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
            if (diff) {
                return diff;
            }
        }
        return segmentsA.length - segmentsB.length;
    }

    module.exports = {
        compare: compare
    };
});
