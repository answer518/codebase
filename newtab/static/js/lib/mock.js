'use strict';
// mock数据
define('static/js/lib/mock', function(require, exports, module) {

    module.exports = {
        'account.getCurrentAccount': {
            id: 1001,
            vipLevel: 3,
            syncTime: 'xxxx-xx-xx xx:xx:xx',
            email: 'guest',
            avatarUrl: '',
            avatarPath: '../../static/images/multi-icon.png',
            totalSpace: '40',
            usedSpace: '5',
            country: '中国',
            hashKey: '',
            securityUrl: 'https://pc-uc.uu.me/i/security.html?uid=40664840&ln=zh-cn&mxver=5.1.4.1300&mxpn=',
            personalUrl: 'https://pc-uc.uu.me/i/?uid=40664840&ln=zh-cn&mxver=5.1.4.1300&mxpn=',
            nickname: '测试二十',
            phoneNumber: '1111222333'
        },
        'account.logout': true
    }
});
