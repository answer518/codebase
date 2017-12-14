
var Api = require('static/js/api.js'),
	Language = require('static/js/language');
var $header = $('.header');

var initUser = function () {
	// 获取当前用户
	Api.useApi('account.getCurrentAccount', {}, function (data) {
		login(data);
	});
}

initUser();

// 用户注销事件
$header.on('click', '.logout, .login', function (e) {
	e.preventDefault();
	Api.useApi('account.logout', {}, function (data) { });
});

$header.on('click', 'ul > li > a', function (e) {
	e.preventDefault();
	Api.useApi('openUrl', { 'url': $(this).attr('href'), mode: 'ForceForegroundTab'});
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

// 计算两个整数的百分比值 
function toPercent(num, total) {
	num = parseFloat(num);
	total = parseFloat(total);
	if (isNaN(num) || isNaN(total) || total <= 0) {
		return '1%';
	}
	var percent = Math.round(num / total * 10000) / 100.00;
	return percent <= 0 ? '1%' : ( percent + '%');
}
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
	$header.find('.header-action').replaceWith('<ul class="header-action fr">\
						<li class="fl">\
							<a href="mx://note/index.htm?id=-1" target="_blank">' + Language.getLang('Maxnote') + '</a>\
						</li>\
						<li class="fl">\
							<a href="mx://password" target="_blank">' + Language.getLang('Passkeeper') + '</a>\
						</li>\
						<li class="fl profile">\
							<span class="line">|</span>\
							<span class="login">' + Language.getLang('Login') + '</span>\
							<div class="profile-dropdown">\
								<img src="//pc-newtab.maxthonimg.com/static/img/default.png" alt="photo"/>\
							</div>\
						</li>\
					</ul>');
}

/**
 * 渲染template
 * @return {[type]} [description]
 */
function render(data) {
	var tpl = '<ul class="header-action fr">\
				<li class="fl">\
					<a href="mx://note/index.htm?id='+ data.id + '" target="_blank">' + Language.getLang('Maxnote') + '</a>\
				</li>\
				<li class="fl">\
					<a href="mx://password" target="_blank">' + Language.getLang('Passkeeper') + '</a>\
				</li>\
				<li class="fl">\
					<a href="'+ data.uuMailUrl + '" target="_blank">' + Language.getLang('UUMail') + '</a>\
				</li>\
				<li class="fl profile">\
					<span class="line">|</span>\
					<span class="login-user">' + data.nickname + '</span>\
					<div class="profile-dropdown">\
						<img src="'+ data.avatarUrl.replace(/^(https?:\/\/.+\.maxthon)/, 'https://avatar.maxthon') + '" alt="头像" onerror="//pc-newtab.maxthonimg.com/static/img/icon/default.png"/>\
						<div class="profile-continer">\
							<div class="profile-detail">\
								<h4>\
									<span class="user">' + data.nickname + '</span>\
									' + (data.vipLevel > 0 ? '<span class="grade">VIP' + data.vipLevel + '</span>' : '') + '\
								</h4>\
								<p class="use-space-info">' + Language.getLang('CloudUseInfo').replace('$used$', (data.usedSpace / (1024 * 1024)).toFixed(2)).replace('$total$', data.totalSpace / (1024 * 1024 * 1024)) + '</p>\
								<p class="progress">\
									<span class="extend" style="width: ' + data.progress + ';"></span>\
								</p>\
								<p class="async-date">\
									' + Language.getLang('LastSyncDate') + '：<span>' + data.syncTime + '</span>\
								</p>\
							</div>\
							<ul>\
								<li>\
									<a href="' + data.personalUrl + '" target="_blank">' + Language.getLang('AccountInfo') + '</a>\
								</li>\
								<li>\
									<a href="' + data.securityUrl + '" target="_blank">' + Language.getLang('AccountSecur') + '</a>\
								</li>\
								<li>\
									<a href="javascript:void(0);" class="logout">' + Language.getLang('Logout') + '</a>\
								</li>\
							</ul>\
						</div>\
					</div>\
				</li>\
			</ul>';
	$header.find('.header-action').replaceWith(tpl);
}