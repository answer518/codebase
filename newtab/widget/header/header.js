// window.Api.Maxthon.useApi('account.getCurrentAccount', {}, function(data) {
// 	console.log(data);
// });
var Api = require('static/js/api.js');
var $profile = $('.profile');

// 用户注销事件
$profile.on('click', '.logout', function() {
    Api.useApi('account.logout', {}, function(data) {
        if (data === true) {
            logout();
        }
    });
});

// 获取当前用户
Api.useApi('account.getCurrentAccount', {}, function(data) {
	login(data);
});

/**
 * 登录状态监听
 * @param  {[type]} data) {}          [description]
 * @return {[type]}       [description]
 */
// Api.useApi('account.profileChanged', {}, function(data) {
// 	login(data);
// });


// Api.useApi('common.UIStatus', {}, function(data) {});

/**
 * 用户登录
 * @return {[type]} [description]
 */
function login(data) {
    data.progress = data.vipLevel * 10;
    var lang = navigator.language.toLocaleLowerCase();

    data.securityUrl = `https://pc-uc.uu.me/i/security.html?uid=${data.id}&ln=${lang}&mxver=${Api.max_version}&mxpn=`;
    data.personalUrl = `https://pc-uc.uu.me/i/?uid=${data.id}&ln=${lang}&mxver=${Api.max_version}&mxpn=`;
    var tpl = `<div class="profile-dropdown">
				<img src="${data.avatarPath}" alt="头像" onerror=""/>
				<div class="profile-continer">
					<div class="profile-detail">
						<h4>
							<span class="user">${data.nikename}</span>
							<span class="grade">VIP${data.vipLevel}</span>
						</h4>
						<p class="use-space-info">
							云空间：已用<span class="used-space">${data.usedSpace}</span>M, 总共<span class="total-space">${data.totalSpace}</span>G
						</p>
						<p class="progress">
							<span class="extend" style="width: ${data.progress}%;"></span>
						</p>
						<p class="async-date">
							最后同步时间：<span>${data.syncTime}</span>
						</p>
					</div>
					<ul>
						<li>
							<a href="${data.personalUrl}" target="_blank">个人信息</a>
						</li>
						<li>
							<a href="${data.securityUrl}" target="_blank">账户安全</a>
						</li>
						<li>
							<a href="javascript:void(0);" class="logout">注销账户</a>
						</li>
					</ul>
				</div>
			</div>`;

    $profile.find('.login').text(data.nikename);
    $profile.find('.profile-dropdown').empty().append(tpl);
}

/**
 * 用户注销
 * @return {[type]} [description]
 */
function logout() {
    $profile.find('.login').text('游客');
    $profile.find('.profile-dropdown').empty();
}
