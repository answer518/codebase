/**
 * @author guotingjie
 * @homepage 
 * @since 20/07/2017
 */

const _self = this;
const HOST_NAME = location.host;
const VERSION_NAME = 'CACHE-v1';
const CACHE_NAME = HOST_NAME + '-' + VERSION_NAME;

const version = 'pc-newtab-20170727';
const __DEVELOPMENT__ = false;
const __DEBUG__ = true;

const CACHE_LIST = [
	'https://pc-newtab.maxthonimg.com/static/img/bg/preview/light.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/bg/light.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/bg/preview/deep.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/bg/deep.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/bg/sky.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/bg/preview/sky.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/bg/preview/bridge.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/bg/bridge.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/bg/preview/dandelion.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/bg/dandelion.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/bg/preview/sundown.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/bg/sundown.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/bg/preview/old.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/bg/old.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/bg/preview/night.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/bg/night.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/bg/preview/balloon.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/bg/balloon.jpg.webp',
	'https://pc-newtab.maxthonimg.com/static/img/icon/6000.png',
	'https://pc-newtab.maxthonimg.com/static/img/icon/delete.png',
	'https://pc-newtab.maxthonimg.com/static/img/icon/delete_hover.png',
	'https://pc-newtab.maxthonimg.com/static/img/icon/edit.png',
	'https://pc-newtab.maxthonimg.com/static/img/icon/edit_hover.png',
	'https://pc-newtab.maxthonimg.com/static/img/icon/refresh.png',
	'https://pc-newtab.maxthonimg.com/static/img/icon/refresh_hover.png',
	'https://pc-newtab.maxthonimg.com/static/img/icon/selected.png',
	'https://pc-newtab.maxthonimg.com/static/img/icon/radio.png',
	'https://pc-newtab.maxthonimg.com/static/img/icon/radio_disable.png',
	'https://pc-newtab.maxthonimg.com/static/img/icon/radio_selected.png',
	'https://pc-newtab.maxthonimg.com/static/img/grey.gif',
	'https://pc-newtab.maxthonimg.com/static/v1.1/image/logo/Re/offline.png.webp',
	'https://pc-newtab.maxthonimg.com/static/v1.1/image/logo/Sq/offline.png.webp'
];

const ignoreCache = [
	/https?:\/\/pc-newtab.maxthon.com\/view\/app.js/,
	/https?:\/\/pc-newtab.maxthon.com\/view\/index.html\?t=/
];

/**
 * common function
 */

function developmentMode() {
	return __DEVELOPMENT__ || __DEBUG__;
}

function cacheKey() {
	return [version , ...arguments].join(':');
}

function log() {
	if (developmentMode()) {
		console.log("SW:", ...arguments);
	}
}

const sentMessage = function (msg) {
	_self.clients.matchAll().then(function (clients) {
		clients.forEach(function (client) {
			client.postMessage(msg);
		})
	});
};

const onInstall = function (event) {
	event.waitUntil(
		caches
			.open(cacheKey('offline'))
			.then(function (cache) {
				cache.addAll(CACHE_LIST.map(function (url) {
					return new Request(url, { mode: 'no-cors' });
				})).then(function () {
					log('All resources have been fetched and cached.');
				}).catch(function(err) {
					log(err);
				});

				return cache;//.addAll(['/static/v1.1/image/logo/Re/offline.png.webp','/static/v1.1/image/logo/Sq/offline.png.webp', '/view/index.html']);
			})
			.then(function () { _self.skipWaiting(); })
			.then(function () { log('Install success! version: ' + version); })
	);
};

/**
 * Activate
 */

function removeOldCache() {
    return caches
        .keys()
        .then(keys =>
            Promise.all( // 等待所有旧的资源都清理完成
                keys
                .filter(key => !key.startsWith(version)) // 过滤不需要删除的资源
                .map(key => caches.delete(key)) // 删除旧版本资源，返回为 Promise 对象
            )
        )
        .then(() => {
            log('removeOldCache completed.');
        });
}

const onActive = function (event) {
	log('activate event in progress.');
	event.waitUntil(Promise.all([
		// 更新客户端
		_self.clients.claim(),
		removeOldCache()
	]));
};

const onMessage = function (event) {
	log(event.data);
};

/**
 * Fetch
 */

// 当网络离线或请求发生了错误，使用离线资源替代 request 请求
function offlineResponse(request) {
	log('(offline)', request.method, request.url);

	if (request.url.match(/\.(jpg|png|gif|svg|jpeg|webp)(\?.*)?$/)) {
		if(request.url.match(/\/image\/logo\/Sq\/([A-Za-z\.\_\d]+).webp/)) {
			return caches.match('https://pc-newtab.maxthonimg.com/static/v1.1/image/logo/Sq/offline.png.webp');
		} else {
			return caches.match('https://pc-newtab.maxthonimg.com/static/v1.1/image/logo/Re/offline.png.webp');
		}
	} else {
		return caches.match('/view/index.html');
	}
}

// 从缓存读取或使用离线资源替代
function cachedOrOffline(request) {
	return caches
		.match(request)
		.then((response) => response || offlineResponse(request));
}

// 从网络请求，并将请求成功的资源缓存
function networkedAndCache(request) {
	return fetch(request)
		.then(response => {
			const copy = response.clone();

			caches.open(cacheKey('resources'))
				.then(cache => {
					cache.put(request, copy);
				});
			log("(network: cache write)", request.method, request.url);
			return response;
		});
}

// 优先从 cache 读取，读取失败则从网络请求并缓存。网络请求也失败，则使用离线资源替代
function cachedOrNetworked(request) {
	return caches.match(request)
		.then((response) => {
			log(response ? '(cached)' : '(network: cache miss)', request.method, request.url);
			return response ||
				networkedAndCache(request)
					.catch(() => offlineResponse(request));
		});
}

// 不需要缓存的请求
function shouldAlwaysFetch(request) {
	return __DEVELOPMENT__ ||
		request.method !== 'GET' ||
		ignoreCache.some(regex => request.url.match(regex));
}

// 跳过service worker
function shouldAlwaysSkip(request) {
	return __DEVELOPMENT__ ||
		request.method !== 'GET' ||
		[/https?:\/\/pc-newtab.maxthonimg.com\/static\/img\/bg\/video\/([A-Za-z]+).mp4/,
		/https?:\/\/pc-newtab.maxthonimg.com\/static\/img\/bg\/([A-Za-z\-0-9]+).mp4/,
		/https?:\/\/i.maxthon.cn\/api\/data\?api=/,
		/https?:\/\/47.93.8.193\/badjs\?id=/,
        /https?:\/\/g.dcs.maxthon.com\/mx4\/web\?rnd=/,
        /https?:\/\/pc-newtab.maxthon.com\/v1.1\/api\/data/,
		/https?:\/\/pc-newtab.maxthon.com\/api\/data\/misc.php/,
		/https?:\/\/pc-newtab.maxthon.com\/api\/data\/convert.php/].some(regex => request.url.match(regex));
}

// 缓存 html 页面
function shouldFetchAndCache(request) {
	return (/text\/html/i).test(request.headers.get('Accept'));
}

// 优先从网络请求，失败则使用离线资源替代
function networkedOrOffline(req) {
	const request = new Request(req.url, { mode: 'no-cors' });
	return fetch(request)
		.then(response => {
			log('(network)', request.method, request.url);
			return response;
		})
		.catch(() => offlineResponse(request));
}

const onFetch = function (event) {
	const request = event.request;

	if(shouldAlwaysSkip(request)) {
		return;
	}

	// 应当永远从网络请求的资源
	if (shouldAlwaysFetch(request)) {
		log('AlwaysFetch request: ', request.url);
		// 如果请求失败，则使用离线资源替代
		event.respondWith(networkedOrOffline(request));
		return;
	}

	// 应当从网络请求并缓存的资源
	// 如果请求失败，则尝试从缓存读取，读取失败则使用离线资源替代
	event.respondWith(
		networkedAndCache(request).catch(() => cachedOrOffline(request))
	);
};

_self.addEventListener('install', onInstall);

_self.addEventListener('activate', onActive);

_self.addEventListener('message', onMessage);

_self.addEventListener('fetch', onFetch);