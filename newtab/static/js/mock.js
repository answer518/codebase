'use strict';
// mock数据
define('static/js/mock', function(require, exports, module) {

    module.exports = {
        'account.getCurrentAccount': {
            id: 1001,
            vipLevel: 3,
            syncTime: 'xxxx-xx-xx xx:xx:xx',
            email: 'guest',
            avatarPath: '../../static/images/multi-icon.png',
            totalSpace: '40',
            usedSpace: '5',
            country: '中国',
            hashKey: '',
            nikename: '测试二十',
            phoneNumber: '1111222333'
        },
        'account.logout': true
    }
});
