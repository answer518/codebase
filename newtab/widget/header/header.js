
var Api = require('static/js/api.js'),
	Siderbar = require('widget/sidebar/sidebar.js'),
	dataCode = require('static/js/datacode.js'),
	Language = require('static/js/language');
var $header = $('.header');

var initUser = function () {
	// 获取当前用户
	Api.useApi('account.getCurrentAccount', {}, function (data) {
		login(data);
	});
}

initUser();

// 保存状态
var uiStatus = {favbar: 1, sidebar: 1};
UIStatus({ type: 1, action: 0 }, function (favbar) { // 查询收藏栏状态
	// 需要显示展开
	if (favbar === 1) {
		UIStatus({ type: 0, action: 0 }, function (sidebar) {
			if (sidebar === 1) {
				$('.gl').addClass('gt').show();
			} else {
				$('.gl').addClass('lt').show();
			}
			uiStatus.sidebar = sidebar;
		});
	}
	uiStatus.favbar = favbar;
});

// 用户注销事件
$header.on('click', '.logout, .login', function (e) {
	e.preventDefault();
	Api.useApi('account.logout', {}, function (data) {});
	dataCode.statistic({m:'hoverPhoto', n: 'logout'});
});

$header.on('click', 'ul > li > a', function (e) {
	e.preventDefault();
	var href = this.getAttribute('href');
	if(href === '#') {
		var Tools = require('static/js/tools.js');
		Tools.setCookie('old_and_new_version', 'old', 365);
		Api.setSyncValue('isNewVersion', {'isNewVersion' : false});

		// 从新版本回到老版本
		dataCode.statistic({m: 'versionToggleButton', n: 'newToOld'});
		setTimeout(function() {
			window.location.reload(); // 重新载入页面
		}, 10);
		return;
	}
	Api.useApi('openUrl', { 'url': href, mode: 'ForceForegroundTab'});
	var data_n = this.getAttribute('data-n');
	var ueip = {m: this.getAttribute('data-m'), n: data_n};
	dataCode.statistic(ueip);

	// 心跳上报
	switch(data_n) {
		case 'maxNote':
			Api.useApi('common.reportLVTAction', { 'action': 'p-mx5Newtab_clickMolebox'});
			break;
		case 'passKeeper':
			Api.useApi('common.reportLVTAction', { 'action': 'p-mx5Newtab_clickPasskeeper'});
			break;
		case 'UUMail':
			Api.useApi('common.reportLVTAction', { 'action': 'p-mx5Newtab_clickUUmail'});
			break;
	}
});

$header.on('click', '.gl', function (e) {
	var $this = $(this);
	if ($this.hasClass('lt')) { // 收起来
		UIStatus({ action: 1, status: 1 }, function () {
			$this.removeClass('lt').addClass('gt');
		});
	} else {  // 展开
		UIStatus({ action: 1, status: 0 }, function () {
			$this.removeClass('gt').addClass('lt');
		});
	}
});

$header.on('click', '.setting', function(e) {
	e.stopPropagation();
	Siderbar.showSider();
	dataCode.statistic({m:'settingIcon'});
});

function UIStatus(param, cb) {
	Api.useApi('common.UIStatus', { type: param.type || 0, action: param.action || 0, status: param.status || 0 }, function (result) {
		cb && cb(result);
	});
}

/**
 * 登录状态监听
 * @param  {[type]} data) {}          [description]
 * @return {[type]}       [description]
 */
Api.useApi('account.profileChanged', {}, function (data) {
	initUser();
});

/**
 * 侧边栏发生变化时触发
 * @param  {[type]} data)  int type, 	// sidebar(0)
						   int action, 	//get(0) set(1)    
 * @return {[type]}        int result, //show(0), hide(1)
 */
Api.useApi('common.registerUIStatusChanged', {}, function (data) {
	// console.log(data);
	$('.gl').removeClass('gt').removeClass('lt').hide();
	if (data.type === 1) { // 0:sidebar  1:favbar
		if (data.status === 1) {
			if (uiStatus.sidebar === 1) {
				$('.gl').addClass('gt').show();
			} else {
				$('.gl').addClass('lt').show();
			}
		}
		uiStatus.favbar = data.status;
	} else {
		if (uiStatus.favbar === 1) {
			if (data.status === 1) {
				$('.gl').addClass('gt').show();
			} else {
				$('.gl').addClass('lt').show();
			}
		}
		uiStatus.sidebar = data.status;
	}
});

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
	if(data.nickname == '' + data.id) {
		data.nickname = data.email;
	}
	var lang = navigator.language.toLocaleLowerCase();
	data.suffix = `?uid=${data.id}ln=${lang}&mxver=${Api.max_version}&mxpn=${Api.pn}`;
	data.progress = toPercent(data.usedSpace, data.totalSpace);
	render(data);
}

/**
 * 渲染
 * @return {[type]} [description]
 */
function render(data) {
	var tpl = `<ul class="header-action fr">
				${linkHtml(data)}
				<li class="fl">
					<span class="line">|</span>
				</li>
				${profileHtml(data)}
				<li class="fl">
					<span class="line">|</span>
				</li>
				<li class="fl">
					<span class="setting">${Language.getLang('Settings')}</span>
				</li>\
			</ul>`;
	$header.find('.header-action').replaceWith(tpl);
}

function linkHtml(data) {
	var html = `
		<li class="fl">
			<a href="#" target="_blank" data-m="back-to-old" data-n="" data-step="4" data-intro="${Language.getLang('user-guide-step4')}">${Language.getLang('OldVersion')}</a>
		</li>
		<li class="fl">
			<span class="line">|</span>
		</li>
		<li class="fl">
			<a href="mx://note/index.htm?id=${data.id}" target="_blank" data-m="builtInpage" data-n="maxNote">${Language.getLang('Maxnote')}</a>
		</li>
		<li class="fl">
			<a href="mx://password" target="_blank" data-m="builtInpage" data-n="passKeeper">${Language.getLang('Passkeeper')}</a>
		</li>`;
	
	if(data.id !== -1) {
		html += `<li class="fl">
					<a href="https://pc-uc.uu.me/mail/${data.suffix}" target="_blank" data-m="builtInpage" data-n="UUMail">${Language.getLang('UUMail')}</a>
				</li>`;
	}
	return html;
}

function profileHtml(data) {

	return data.id === -1 ?
		`<li class="fl profile">
			<span class="login">${Language.getLang('Login')}</span>
			<div class="profile-dropdown">
				<img src="//pc-newtab.maxthonimg.com/static/img/guest.png" alt="photo"/>
			</div>
		</li>` :
		`<li class="fl profile">
			<span class="login-user">${data.nickname}</span>
			<div class="profile-dropdown">
				<img src="${data.avatarUrl.replace(/^(https?:\/\/.+\.maxthon)/, 'https://avatar.maxthon')}" alt="头像" onerror="//pc-newtab.maxthonimg.com/static/img/icon/default.png"/>
				<div class="profile-continer">
					<div class="profile-detail">
						<h4>
							<span class="user">${data.nickname}</span>
							${(data.vipLevel > 0 ? '<span class="grade">VIP' + data.vipLevel + '</span>' : '')}
						</h4>
						<p class="use-space-info">${Language.getLang('CloudUseInfo').replace('$used$', (data.usedSpace / (1024 * 1024)).toFixed(2)).replace('$total$', data.totalSpace / (1024 * 1024 * 1024))}</p>
						<p class="progress">
							<span class="extend" style="width: ${data.progress};"></span>
						</p>
						<p class="async-date">
							${Language.getLang('LastSyncDate')}：<span>${data.syncTime}</span>
						</p>
					</div>
					<ul>
						<li>
							<a href="https://pc-uc.uu.me/i/${data.suffix}" target="_blank" data-m="hoverPhoto" data-n="userInformation">${Language.getLang('AccountInfo')}</a>
						</li>
						<li>
							<a href="https://pc-uc.uu.me/i/security.html${data.suffix}" target="_blank" data-m="hoverPhoto" data-n="userSafe">${Language.getLang('AccountSecur')}</a>
						</li>
						<li>
							<p class="logout">${Language.getLang('Logout')}</p>
						</li>
					</ul>
				</div>
			</div>
		</li>`;
}