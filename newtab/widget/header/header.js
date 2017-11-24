
var Api = require('static/js/api.js');
var $header = $('.header');

var initUser = function() {
	// 获取当前用户
	Api.useApi('account.getCurrentAccount', {}, function(data) {
		login(data);
	});
}

initUser();

// 用户注销事件
$header.on('click', '.logout, .login', function() {
    Api.useApi('account.logout', {}, function(data) {});
});

$header.on('click', 'li.fl > a', function(e) {
	e.preventDefault();
	Api.useApi('openUrl', { 'url': $(this).attr('href'), 'mode': 'BackgroundTab' });
});

/**
 * 登录状态监听
 * @param  {[type]} data) {}          [description]
 * @return {[type]}       [description]
 */
Api.useApi('account.profileChanged', {}, function(data) {
	initUser();
});

/**
 * [description]
 * @param  {[type]} data)  int type, 	// sidebar(0)
    					   int action, 	//get(0) set(1)    
 * @return {[type]}        int result, //show(0), hide(1)
 */
// Api.useApi('common.UIStatus', {type:0,action:0}, function(data) {
// 	console.log(data);
// });

/**
 * 用户登录
 * @return {[type]} [description]
 */
function login(data) {
	if(data.id === -1) {
		logout();
		return ;
	};
	var lang = navigator.language.toLocaleLowerCase();
	data.securityUrl = `https://pc-uc.uu.me/i/security.html?uid=${data.id}&ln=${lang}&mxver=${Api.max_version}&mxpn=`;
    data.personalUrl = `https://pc-uc.uu.me/i/?uid=${data.id}&ln=${lang}&mxver=${Api.max_version}&mxpn=`;
    data.progress = data.vipLevel * 10;
    render(data);
}

/**
 * 用户注销
 * @return {[type]} [description]
 */
function logout() {
    $header.find('.header-action').replaceWith(`<ul class="header-action fr">
								<li class="fl">
									<a href="mx://note/index.htm?id=-1" target="_blank">傲游笔记</a>
								</li>
								<li class="fl">
									<a href="xxx" target="_blank">密码大师</a>
								</li>
								<li class="fl">
									<a href="xxx" target="_blank">百变邮箱</a>
								</li>
								<li class="fl profile">
									<span class="line">|</span>
									<a href="javascript:void(0);" class="login">登录</a>
									<div class="profile-dropdown">
										<img src="../../static/images/default.png" alt="头像"/>
									</div>
								</li>
							</ul>`);
}

/**
 * 渲染template
 * @return {[type]} [description]
 */
function render(data) {

	var tpl = `<ul class="header-action fr">
					<li class="fl">
						<a href="mx://note/index.htm?id=${data.id}" target="_blank">傲游笔记</a>
					</li>
					<li class="fl">
						<a href="mx://password" target="_blank">密码大师</a>
					</li>
					<li class="fl">
						<a href="https://pc-uc.uu.me" target="_blank">百变邮箱</a>
					</li>
					<li class="fl profile">
						<span class="line">|</span>
						<a href="javascript:void(0);" class="login">${data.nickname}</a>
						<div class="profile-dropdown">
							<img src="${data.avatarPath}" alt="头像" onerror="../../static/images/default.png"/>
							<div class="profile-continer">
								<div class="profile-detail">
									<h4>
										<span class="user">${data.nickname}</span>
										<span class="grade">VIP${data.vipLevel}</span>
									</h4>
									<p class="use-space-info">
										云空间：已用<span class="used-space">${(data.usedSpace/(1024*1024)).toFixed(2)}</span>M, 总共<span class="total-space">${data.totalSpace/(1024*1024*1024)}</span>G
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
						</div>
					</li>
				</ul>`;
	$header.find('.header-action').replaceWith(tpl);
}