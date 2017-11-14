/**
 * 默认初始化文件夹
 */
var DEFAULT_MY_SITE = [
	{
		'title': 'VK-Maxthon RU',
		'url': 'https://vk.com/maxthon_ru',
		'image': staticServer + '/v1.1/image/logo/Re/vk_maxthonru.png'
	},
	{
		'title': 'Facebook-Maxthon RU',
		'url': 'https://facebook.com/maxthon.org.ru',
		'image': staticServer + '/v1.1/image/logo/Re/facebook_maxthonorgru.png'
	},
	{
		'title': 'Облачный Макстон',
		'url': 'http://www.maxthon2.ru',
		'image': staticServer + '/v1.1/image/logo/Re/maxthon2_ru.png'
	},
	{
		'title': 'Русская сборка Maxthon',
		'url': 'http://maxthon.org.ru',
		'image': staticServer + '/v1.1/image/logo/Re/maxthon_org_ru.png'
	},
	{
		'title': 'Yandex.Mail',
		'url': 'https://mail.yandex.com/',
		'image': staticServer + '/v1.1/image/logo/Re/yandex.png'
	},
	{
		'title': 'AliExpress',
		'url': 'https://www.aliexpress.com/',
		'image': staticServer + '/v1.1/image/logo/Re/Aliexpress.png'
	},
	{
		'title': 'Bing',
		'url': 'http://www.bing.com/?pc=cosp&ptag=A91255CDCDA&conlogo=CT3210127',
		'image': staticServer + '/v1.1/image/logo/Re/Bing.png'
	},
	{
		'title': 'Yahoo',
		'url': 'https://www.yahoo.com/',
		'image': staticServer + '/v1.1/image/logo/Re/yahoo.png'
	},
	{
		'title': 'Gmail',
		'url': 'https://gmail.google.com/ ',
		'image': staticServer + '/v1.1/image/logo/Re/gmail.png'
	},
	{
		'title': 'Maxthon Fan Page',
		'url': 'http://go.maxthon.com/redir/mx5/qa.htm?f=fbmx5 ',
		'image': staticServer + '/v1.1/image/logo/Re/facebook_maxthon.png'
	},
	{
		"folderId": typeof guid === 'function' ? guid() : '2b92c466-53d0-1968-71bf-210f6dbdde4e',
		'title': 'News',
		"children": [
			{
				'title': 'MSN',
				'url': 'http://www.msn.com',
				'image': staticServer + '/v1.1/image/logo/Re/msn.png'
			},
			{
				'title': 'CNN',
				'url': 'http://www.cnn.com/',
				'image': staticServer + '/v1.1/image/logo/Re/cnn.png'
			},
			{
				'title': 'BBC',
				'url': 'http://www.bbc.com/',
				'image': staticServer + '/v1.1/image/logo/Re/bbc.png'
			},
			{
				'title': 'ESPN',
				'url': 'http://www.espn.com/',
				'image': staticServer + '/v1.1/image/logo/Re/espn.png'
			}
		],
		"isHot": false
	},
	{
		'title': 'Google',
		'url': 'https://www.google.com/',
		'image': staticServer + '/v1.1/image/logo/Sq/Google.png', isHot: true
	},
	{
		'title': 'eBay',
		'url': 'http://rover.ebay.com/rover/1/711-53200-19255-0/1?icep_ff3=1&pub=5575044537&toolid=10001&campid=5337264385&customid=&ipn=psmain&icep_vectorid=229466&kwid=902099&mtid=824&kw=lg',
		'image': staticServer + '/v1.1/image/logo/Sq/ebay.png', isHot: true
	},
	{
		'title': 'Amazon',
		'url': 'https://www.amazon.com/?&_encoding=UTF8&tag=wwwmaxthoncom-20&linkCode=ur2&linkId=03c18e2e974eec1d1c03438460a881af&camp=1789&creative=9325',
		'image': staticServer + '/v1.1/image/logo/Sq/amazon.png', isHot: true
	},
	{
		'title': 'Facebook',
		'url': 'https://www.facebook.com/',
		'image': staticServer + '/v1.1/image/logo/Sq/facebook.png', isHot: true
	},
	{
		'title': 'Twitter',
		'url': 'https://twitter.com/',
		'image': staticServer + '/v1.1/image/logo/Sq/twitter.png', isHot: true
	},
	{
		'title': 'YouTube',
		'url': 'https://www.youtube.com/',
		'image': staticServer + '/v1.1/image/logo/Sq/youtube.png', isHot: true
	},
	{
		'title': 'LinkedIn',
		'url': 'https://www.linkedin.com',
		'image': staticServer + '/v1.1/image/logo/Sq/Linkedin.png', isHot: true
	},
	{
		'title': 'Maxthon Now',
		'url': 'http://i.maxthon.com',
		'image': staticServer + '/v1.1/image/logo/Sq/maxthonnow.png', isHot: true
	}
];

/**
 * 推荐站点
 */
var SITE_LIST = [
	{
		'categroy': 'Featured',
		'list': [{
			'title': 'Google',
			'url': 'https://www.google.com/',
			'image': staticServer + '/v1.1/image/logo/Re/Google.png', isHot: true
		},
		{
			'title': 'eBay',
			'url': 'http://rover.ebay.com/rover/1/711-53200-19255-0/1?icep_ff3=1&pub=5575044537&toolid=10001&campid=5337264385&customid=&ipn=psmain&icep_vectorid=229466&kwid=902099&mtid=824&kw=lg',
			'image': staticServer + '/v1.1/image/logo/Re/ebay.png', isHot: true
		},
		{
			'title': 'Amazon',
			'url': 'https://www.amazon.com/?&_encoding=UTF8&tag=wwwmaxthoncom-20&linkCode=ur2&linkId=03c18e2e974eec1d1c03438460a881af&camp=1789&creative=9325',
			'image': staticServer + '/v1.1/image/logo/Re/amazon.png', isHot: true
		},
		{
			'title': 'Facebook',
			'url': 'https://www.facebook.com/',
			'image': staticServer + '/v1.1/image/logo/Re/facebook.png', isHot: true
		},
		{
			'title': 'Twitter',
			'url': 'https://twitter.com/',
			'image': staticServer + '/v1.1/image/logo/Re/twitter.png', isHot: true
		},
		{
			'title': 'YouTube',
			'url': 'https://www.youtube.com/',
			'image': staticServer + '/v1.1/image/logo/Re/youtube.png', isHot: true
		},
		{
			'title': 'LinkedIn',
			'url': 'https://www.linkedin.com',
			'image': staticServer + '/v1.1/image/logo/Re/Linkedin.png', isHot: true
		},
		{
			'title': 'Maxthon Now',
			'url': 'http://i.maxthon.com',
			'image': staticServer + '/v1.1/image/logo/Re/maxthonnow.png', isHot: true
		},
		{
			'title': 'Bing',
			'url': 'http://www.bing.com/?pc=cosp&ptag=A91255CDCDA&conlogo=CT3210127',
			'image': staticServer + '/v1.1/image/logo/Re/Bing.png'
		},
		{
			'title': 'Yahoo',
			'url': 'https://www.yahoo.com/',
			'image': staticServer + '/v1.1/image/logo/Re/yahoo.png'
		},
		{
			'title': 'Gmail',
			'url': 'https://gmail.google.com/ ',
			'image': staticServer + '/v1.1/image/logo/Re/gmail.png'
		},
		{
			'title': 'Maxthon Fan Page',
			'url': 'http://go.maxthon.com/redir/mx5/qa.htm?f=fbmx5 ',
			'image': staticServer + '/v1.1/image/logo/Re/facebook_maxthon.png'
		}]
	},
	{
		'categroy': 'Social',
		'list': [{
			'title': 'Facebook',
			'url': 'https://www.facebook.com/',
			'image': staticServer + '/v1.1/image/logo/Re/facebook.png'
		}, {
			'title': 'Twitter',
			'url': 'https://twitter.com/',
			'image': staticServer + '/v1.1/image/logo/Re/twitter.png'
		}, {
			'title': 'LinkedIn',
			'url': 'https://www.linkedin.com',
			'image': staticServer + '/v1.1/image/logo/Re/Linkedin.png'
		}, {
			'title': 'Pinterest',
			'url': 'https://www.pinterest.com/',
			'image': staticServer + '/v1.1/image/logo/Re/pinterest.png'
		}, {
			'title': 'Google+',
			'url': 'https://plus.google.com/',
			'image': staticServer + '/v1.1/image/logo/Re/Googleplus.png'
		}, {
			'title': 'Tumblr',
			'url': 'https://www.tumblr.com/',
			'image': staticServer + '/v1.1/image/logo/Re/tumblr.png'
		}, {
			'title': 'Instagram',
			'url': 'https://www.instagram.com/',
			'image': staticServer + '/v1.1/image/logo/Re/instagram.png'
		}, {
			'title': 'Reddit',
			'url': 'https://www.reddit.com/',
			'image': staticServer + '/v1.1/image/logo/Re/reddit.png'
		}, {
			'title': 'VK',
			'url': 'https://vk.com/',
			'image': staticServer + '/v1.1/image/logo/Re/vk.png'
		}, {
			'title': 'Flickr',
			'url': 'https://www.flickr.com/',
			'image': staticServer + '/v1.1/image/logo/Re/Flickr.png'
		}, {
			'title': 'Meetup',
			'url': 'https://www.meetup.com/',
			'image': staticServer + '/v1.1/image/logo/Re/Meetup.png'
		}, {
			'title': 'ASKfm',
			'url': 'http://ask.fm/',
			'image': staticServer + '/v1.1/image/logo/Re/askfm.png'
		}]
	},
	{
		'categroy': 'News&Media',
		'list': [{
			'title': 'Yahoo',
			'url': 'https://www.yahoo.com/',
			'image': staticServer + '/v1.1/image/logo/Re/yahoo.png'
		}, {
			'title': 'Google News',
			'url': 'https://news.google.com/',
			'image': staticServer + '/v1.1/image/logo/Re/googlenews.png'
		}, {
			'title': 'Huffington Post',
			'url': 'http://www.huffingtonpost.com/',
			'image': staticServer + '/v1.1/image/logo/Re/huffpost.png'
		}, {
			'title': 'The New York Times',
			'url': 'http://www.nytimes.com/',
			'image': staticServer + '/v1.1/image/logo/Re/nytimes.png'
		}, {
			'title': 'Daily Mail Online',
			'url': 'http://www.dailymail.co.uk/',
			'image': staticServer + '/v1.1/image/logo/Re/dailymail.png'
		}, {
			'title': 'Washington Post',
			'url': 'http://www.washingtonpost.com/',
			'image': staticServer + '/v1.1/image/logo/Re/washingtonPost.png'
		}, {
			'title': 'The Guardian',
			'url': 'https://www.theguardian.com/',
			'image': staticServer + '/v1.1/image/logo/Re/the_Guardian.png'
		}, {
			'title': 'BBC',
			'url': 'http://www.bbc.com/',
			'image': staticServer + '/v1.1/image/logo/Re/bbc.png'
		}, {
			'title': 'MSN',
			'url': 'http://www.msn.com',
			'image': staticServer + '/v1.1/image/logo/Re/msn.png'
		}, {
			'title': 'IGN',
			'url': 'http://www.ign.com/',
			'image': staticServer + '/v1.1/image/logo/Re/ign.png'
		}, {
			'title': 'CNET',
			'url': 'https://www.cnet.com/',
			'image': staticServer + '/v1.1/image/logo/Re/cnet.png'
		}, {
			'title': 'Yahoo Sports',
			'url': 'http://sports.yahoo.com/',
			'image': staticServer + '/v1.1/image/logo/Re/yahoo_sports.png'
		}, {
			'title': 'ESPN',
			'url': 'http://www.espn.com/',
			'image': staticServer + '/v1.1/image/logo/Re/espn.png'
		}, {
			'title': 'HowStuffWorks',
			'url': 'http://www.howstuffworks.com/',
			'image': staticServer + '/v1.1/image/logo/Re/howstuffworks.png'
		}, {
			'title': 'theCHIVE',
			'url': 'http://thechive.com/',
			'image': staticServer + '/v1.1/image/logo/Re/theChive.png'
		}, {
			'title': 'IMDb',
			'url': 'http://www.imdb.com/',
			'image': staticServer + '/v1.1/image/logo/Re/imdb.png'
		}, {
			'title': 'TMZ',
			'url': 'http://www.tmz.com/',
			'image': staticServer + '/v1.1/image/logo/Re/tmz.png'
		}, {
			'title': 'EW',
			'url': 'http://www.ew.com/',
			'image': staticServer + '/v1.1/image/logo/Re/ew.png'
		}, {
			'title': 'YouTube',
			'url': 'https://www.youtube.com/',
			'image': staticServer + '/v1.1/image/logo/Re/youtube.png'
		}, {
			'title': 'Netflix',
			'url': 'https://www.netflix.com/',
			'image': staticServer + '/v1.1/image/logo/Re/netflix.png'
		}, {
			'title': 'Vimeo',
			'url': 'https://vimeo.com/',
			'image': staticServer + '/v1.1/image/logo/Re/vimeo.png'
		}, {
			'title': 'Dailymotion',
			'url': 'http://www.dailymotion.com/',
			'image': staticServer + '/v1.1/image/logo/Re/dailymotion.png'
		}, {
			'title': 'Hulu',
			'url': 'http://www.hulu.com/',
			'image': staticServer + '/v1.1/image/logo/Re/hulu.png'
		}, {
			'title': 'Vine',
			'url': 'https://vine.co/',
			'image': staticServer + '/v1.1/image/logo/Re/vine.png'
		}]
	},
	{
		'categroy': 'Shopping',
		'list': [{
			'title': 'Amazon',
			'url': 'https://www.amazon.com/?&_encoding=UTF8&tag=wwwmaxthoncom-20&linkCode=ur2&linkId=03c18e2e974eec1d1c03438460a881af&camp=1789&creative=9325',
			'image': staticServer + '/v1.1/image/logo/Re/amazon.png'
		}, {
			'title': 'eBay',
			'url': 'http://rover.ebay.com/rover/1/711-53200-19255-0/1?icep_ff3=1&pub=5575044537&toolid=10001&campid=5337264385&customid=&ipn=psmain&icep_vectorid=229466&kwid=902099&mtid=824&kw=lg',
			'image': staticServer + '/v1.1/image/logo/Re/ebay.png'
		}, {
			'title': 'Walmart',
			'url': 'http://linksynergy.walmart.com/fs-bin/click?id=Z53*jNXOGFw&subid=&offerid=223073.1&type=10&tmpid=1082&RD_PARM1=http%3A%2F%2Fwww.walmart.com%2F',
			'image': staticServer + '/v1.1/image/logo/Re/walmart.png'
		}, {
			'title': 'Alibaba',
			'url': 'https://www.alibaba.com/',
			'image': staticServer + '/v1.1/image/logo/Re/alibaba.png'
		}, {
			'title': 'Target',
			'url': 'http://www.target.com/',
			'image': staticServer + '/v1.1/image/logo/Re/target.png'
		}, {
			'title': 'Flipkart',
			'url': 'https://www.flipkart.com/',
			'image': staticServer + '/v1.1/image/logo/Re/flipkart.png'
		}, {
			'title': 'Best Buy',
			'url': 'http://www.bestbuy.com',
			'image': staticServer + '/v1.1/image/logo/Re/bestbuy.png'
		}, {
			'title': 'Newegg',
			'url': 'http://www.newegg.com',
			'image': staticServer + '/v1.1/image/logo/Re/newegg.png'
		}, {
			'title': 'Overstock',
			'url': 'https://www.overstock.com',
			'image': staticServer + '/v1.1/image/logo/Re/overstock.png'
		}, {
			'title': 'SHOP.COM',
			'url': 'http://www.shop.com/',
			'image': staticServer + '/v1.1/image/logo/Re/shop.png'
		}, {
			'title': 'AliExpress',
			'url': 'https://www.aliexpress.com/',
			'image': staticServer + '/v1.1/image/logo/Re/Aliexpress.png'
		}, {
			'title': 'RetailMeNot',
			'url': 'https://www.retailmenot.com/',
			'image': staticServer + '/v1.1/image/logo/Re/retailmenot.png'
		}, {
			'title': 'Groupon',
			'url': 'https://www.groupon.com/',
			'image': staticServer + '/v1.1/image/logo/Re/groupon.png'
		}]
	},
	{
		'categroy': 'Tools',
		'list': [{
			'title': 'Google',
			'url': 'https://www.google.com/',
			'image': staticServer + '/v1.1/image/logo/Re/Google.png'
		},
		{
			'title': 'Bing',
			'url': 'http://www.bing.com/?pc=cosp&ptag=A91255CDCDA&conlogo=CT3210127',
			'image': staticServer + '/v1.1/image/logo/Re/Bing.png'
		},
		{
			'title': 'Yahoo Search',
			'url': 'https://search.yahoo.com/',
			'image': staticServer + '/v1.1/image/logo/Re/yahoosearch.png'
		},
		{
			'title': 'Ask',
			'url': 'http://www.ask.com/',
			'image': staticServer + '/v1.1/image/logo/Re/ask.png'
		},
		{
			'title': 'AOL Search',
			'url': 'https://search.aol.com',
			'image': staticServer + '/v1.1/image/logo/Re/aolsearch.png'
		},
		{
			'title': 'DuckDuckGo',
			'url': 'https://duckduckgo.com/',
			'image': staticServer + '/v1.1/image/logo/Re/duckduckgo.png'
		},
		{
			'title': 'Maxthon Now',
			'url': 'http://i.maxthon.com',
			'image': staticServer + '/v1.1/image/logo/Re/maxthonnow.png'
		},
		{
			'title': 'Gmail',
			'url': 'https://gmail.google.com/ ',
			'image': staticServer + '/v1.1/image/logo/Re/gmail.png'
		},
		{
			'title': 'Outlook',
			'url': 'https://www.outlook.com/',
			'image': staticServer + '/v1.1/image/logo/Re/outlook.png'
		},
		{
			'title': 'Yahoo Mail',
			'url': 'https://mail.yahoo.com/',
			'image': staticServer + '/v1.1/image/logo/Re/yahoomail.png'
		},
		{
			'title': 'AOL Mail',
			'url': 'https://mail.aol.com/',
			'image': staticServer + '/v1.1/image/logo/Re/aolmail.png'
		},
		{
			'title': 'Zoho Mail',
			'url': 'https://www.zoho.com/mail/',
			'image': staticServer + '/v1.1/image/logo/Re/zohomail.png'
		},
		{
			'title': 'Mail.com',
			'url': 'https://www.mail.com/mail/',
			'image': staticServer + '/v1.1/image/logo/Re/mail_com.png'
		},
		{
			'title': 'Yandex.Mail',
			'url': 'https://mail.yandex.com/',
			'image': staticServer + '/v1.1/image/logo/Re/yandex.png'
		}]
	},
	{
		'categroy': '推荐站点',
		'list': [{ 'title': '百度', 'url': 'https://www.baidu.com/index.php?tn=maxthon2&ch=2', 'match': ['www.baidu.com'], 'image': staticServer + '/v1.1/image/logo/Re/baidu.png' },
		{ 'title': '天猫精选', 'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=tmall', 'match': ['jx.tmall.com', 'www.tmall.com'], 'image': staticServer + '/v1.1/image/logo/Re/Tmall.png' },
		{ 'title': '京东商城', 'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=jd', 'match': ['www.jd.com'], 'image': staticServer + '/v1.1/image/logo/Re/JD.png' },
		{ 'title': '爱淘宝', 'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=aitaobao', 'match': ['ai.taobao.com'], 'image': staticServer + '/v1.1/image/logo/Re/simba_taobao.png' },
		{ 'title': '知乎', 'url': 'http://www.zhihu.com', 'image': staticServer + '/v1.1/image/logo/Re/zhihu.png' },
		{ 'title': '携程旅行网', 'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=ctrip', 'match': ['www.ctrip.com'], 'image': staticServer + '/v1.1/image/logo/Re/ctrip.png' },
		{ 'title': '优酷', 'url': 'http://www.youku.com/', 'image': staticServer + '/v1.1/image/logo/Re/youku.png' },
		{ 'title': '傲游今日', 'url': 'http://i.maxthon.cn/', 'image': staticServer + '/v1.1/image/logo/Re/i_maxthon.png' },
		{
			'title': '新浪微博',
			'url': 'http://weibo.com/',
			'match': ['www.weibo.com'],
			'image': staticServer + '/v1.1/image/logo/Re/weibo.png'
		}, {
			'title': '亚马逊',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=amazon',
			'match': ['www.amazon.cn'],
			'image': staticServer + '/v1.1/image/logo/Re/amazon.png'
		}, {
			'title': '唯品会',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=vipshop',
			'match': ['www.vip.com'],
			'image': staticServer + '/v1.1/image/logo/Re/vip.png'
		}, {
			'title': '淘宝网',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=taobao',
			'match': ['www.taobao.com'],
			'image': staticServer + '/v1.1/image/logo/Re/taobao.png'
		}, {
			'title': '途牛旅游网',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=tuniu',
			'match': ['www.tuniu.com'],
			'image': staticServer + '/v1.1/image/logo/Re/tuniu.png'
		}, {
			'title': '58同城',
			'url': 'http://www.58.com/?path=?utm_source%3d5uad%26utm_campaign%3d5uad-109',
			'image': staticServer + '/v1.1/image/logo/Re/58.png'
		}, {
			'title': '傲游哈哈',
			'url': 'http://www.haha.mx/?qamx5',
			'image': staticServer + '/v1.1/image/logo/Re/haha_mx.png'
		}, {
			'title': '哔哩哔哩',
			'url': 'http://www.bilibili.com/',
			'image': staticServer + '/v1.1/image/logo/Re/bilibili.png'
		}, {
			'title': 'hao123',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=hao123',
			'match': ['www.hao123.com'],
			'image': staticServer + '/v1.1/image/logo/Re/hao123.png'
		}]
	},
	{
		'categroy': '新闻资讯',
		'list': [{
			'title': '凤凰网',
			'url': 'http://www.ifeng.com/#_zbs_maxthon',
			'image': staticServer + '/v1.1/image/logo/Re/ifeng.png'
		}, {
			'title': '新浪',
			'url': 'http://www.sina.com.cn/',
			'image': staticServer + '/v1.1/image/logo/Re/sina.png'
		}, {
			'title': '腾讯',
			'url': 'http://www.qq.com/',
			'image': staticServer + '/v1.1/image/logo/Re/qq.png'
		}, {
			'title': '网易',
			'url': 'http://www.163.com/#frp10',
			'image': staticServer + '/v1.1/image/logo/Re/163.png'
		}, {
			'title': '搜狐',
			'url': 'http://www.sohu.com/',
			'image': staticServer + '/v1.1/image/logo/Re/sohu.png'
		}, {
			'title': '东方财富网',
			'url': 'http://www.eastmoney.com/',
			'image': staticServer + '/v1.1/image/logo/Re/eastmoney.png'
		}, {
			'title': '中华网',
			'url': 'http://www.china.com/',
			'image': staticServer + '/v1.1/image/logo/Re/china.png'
		}, {
			'title': '人民网',
			'url': 'http://www.people.com.cn/',
			'image': staticServer + '/v1.1/image/logo/Re/people.png'
		}, {
			'title': '环球网',
			'url': 'http://www.huanqiu.com/',
			'image': staticServer + '/v1.1/image/logo/Re/huanqiu.png'
		}, {
			'title': '新华网',
			'url': 'http://www.xinhuanet.com/',
			'image': staticServer + '/v1.1/image/logo/Re/xinhuanet.png'
		}]
	}, {
		'categroy': '影视频道',
		'list': [{
			'title': '优酷',
			'url': 'http://www.youku.com/',
			'image': staticServer + '/v1.1/image/logo/Re/youku.png'
		}, {
			'title': '搜狐视频',
			'url': 'http://tv.sohu.com/?lcode=AAAAI8cJIH0zbD_j7vM06mKU-H-ufrd6-IyD4U7nXbj2ixyHWYs9o_-LUX-.cf6&lqd=10217',
			'image': staticServer + '/v1.1/image/logo/Re/tv_sohu.png'
		}, {
			'title': '土豆',
			'url': 'http://www.tudou.com/',
			'image': staticServer + '/v1.1/image/logo/Re/tudou.png'
		}, {
			'title': '爱奇艺',
			'url': 'http://www.iqiyi.com/',
			'image': staticServer + '/v1.1/image/logo/Re/iqiyi.png'
		}, {
			'title': '乐视网',
			'url': 'http://www.le.com/',
			'image': staticServer + '/v1.1/image/logo/Re/le.png'
		}, {
			'title': '腾讯视频',
			'url': 'http://v.qq.com/',
			'image': staticServer + '/v1.1/image/logo/Re/v_qq.png'
		}, {
			'title': '凤凰视频',
			'url': 'http://v.ifeng.com/',
			'image': staticServer + '/v1.1/image/logo/Re/v_ifeng.png'
		}, {
			'title': '哔哩哔哩',
			'url': 'http://www.bilibili.com/',
			'image': staticServer + '/v1.1/image/logo/Re/bilibili.png'
		}, {
			'title': 'AcFun',
			'url': 'http://www.acfun.tv/',
			'image': staticServer + '/v1.1/image/logo/Re/acfun.png'
		}, {
			'title': '风行网',
			'url': 'http://www.fun.tv/',
			'image': staticServer + '/v1.1/image/logo/Re/fun.png'
		}, {
			'title': '响巢看看',
			'url': 'http://www.kankan.com/',
			'image': staticServer + '/v1.1/image/logo/Re/kankan.png'
		}, {
			'title': 'PPTV',
			'url': 'http://www.pptv.com/',
			'image': staticServer + '/v1.1/image/logo/Re/PPTV.png'
		}, {
			'title': 'PPS',
			'url': 'http://www.pps.tv/',
			'image': staticServer + '/v1.1/image/logo/Re/PPS.png'
		}, {
			'title': '斗鱼TV',
			'url': 'http://www.douyu.com/',
			'image': staticServer + '/v1.1/image/logo/Re/douyu.png'
		}, {
			'title': '熊猫TV',
			'url': 'http://www.panda.tv/',
			'image': staticServer + '/v1.1/image/logo/Re/panda.png'
		}]
	}, {
		'categroy': '网上购物',
		'list': [{
			'title': '天猫精选',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=tmall',
			'image': staticServer + '/v1.1/image/logo/Re/Tmall.png'
		}, {
			'title': '京东',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=jd',
			'image': staticServer + '/v1.1/image/logo/Re/JD.png'
		}, {
			'title': '淘宝网',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=taobao',
			'image': staticServer + '/v1.1/image/logo/Re/taobao.png'
		}, {
			'title': '爱淘宝',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=aitaobao',
			'image': staticServer + '/v1.1/image/logo/Re/simba_taobao.png'
		}, {
			'title': '亚马逊',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=amazon',
			'image': staticServer + '/v1.1/image/logo/Re/amazon.png'
		}, {
			'title': '唯品会',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=vipshop',
			'image': staticServer + '/v1.1/image/logo/Re/vip.png'
		}, {
			'title': '1号店',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=yhd',
			'match': ['www.yhd.com'],
			'image': staticServer + '/v1.1/image/logo/Re/yhd.png'
		}, {
			'title': '聚美优品',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=jumei',
			'match': ['bj.jumei.com'],
			'image': staticServer + '/v1.1/image/logo/Re/jumei.png'
		}, {
			'title': '苏宁易购',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=suning',
			'match': ['www.suning.com'],
			'image': staticServer + '/v1.1/image/logo/Re/suning.png'
		}, {
			'title': '糯米',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=nuomi',
			'match': ['www.nuomi.com'],
			'image': staticServer + '/v1.1/image/logo/Re/nuomi.png'
		}, {
			'title': '国美在线',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=gome',
			'match': ['www.gome.com.cn'],
			'image': staticServer + '/v1.1/image/logo/Re/gome.png'
		}, {
			'title': '聚划算',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=juhuasuan',
			'image': staticServer + '/v1.1/image/logo/Re/ju_taobao.png'
		}, {
			'title': '小米',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=mi',
			'match': ['www.mi.com'],
			'image': staticServer + '/v1.1/image/logo/Re/mi.png'
		}, {
			'title': '乐视商城',
			'url': 'http://www.lemall.com/',
			'image': staticServer + '/v1.1/image/logo/Re/lemall.png'
		}, {
			'title': '当当网',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=dangdang',
			'match': ['www.dangdang.com/'],
			'image': staticServer + '/v1.1/image/logo/Re/dangdang.png'
		}, {
			'title': '美团',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=meituan',
			'match': ['bj.meituan.com', 'www.meituan.com'],
			'image': staticServer + '/v1.1/image/logo/Re/meituan.png'
		}, {
			'title': '什么值得买',
			'url': 'www.smzdm.com/',
			'image': staticServer + '/v1.1/image/logo/Re/smzdm.png'
		}, {
			'title': '乐蜂网',
			'url': 'http://www.lefeng.com/',
			'image': staticServer + '/v1.1/image/logo/Re/lefeng.png'
		}, {
			'title': '凡客诚品',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=vancl',
			'match': ['www.vancl.com'],
			'image': staticServer + '/v1.1/image/logo/Re/vancl.png'
		}]
	}, {
		'categroy': '社交网络',
		'list': [{
			'title': '傲游哈哈',
			'url': 'http://www.haha.mx/?qamx5',
			'image': staticServer + '/v1.1/image/logo/Re/haha_mx.png'
		}, {
			'title': 'QQ空间',
			'url': 'http://qzone.qq.com/',
			'image': staticServer + '/v1.1/image/logo/Re/qq_zone.png'
		}, {
			'title': '新浪微博',
			'url': 'http://weibo.com/',
			'image': staticServer + '/v1.1/image/logo/Re/weibo.png'
		}, {
			'title': '百度贴吧',
			'url': 'http://tieba.baidu.com/',
			'image': staticServer + '/v1.1/image/logo/Re/tieba_baidu.png'
		}, {
			'title': '知乎',
			'url': 'http://www.zhihu.com/',
			'image': staticServer + '/v1.1/image/logo/Re/zhihu.png'
		}, {
			'title': 'LOFTER乐乎',
			'url': 'http://www.lofter.com/',
			'image': staticServer + '/v1.1/image/logo/Re/lofter.png'
		}, {
			'title': '天涯社区',
			'url': 'http://www.tianya.cn/',
			'image': staticServer + '/v1.1/image/logo/Re/tianya.png'
		}, {
			'title': '猫扑',
			'url': 'http://www.mop.com/',
			'image': staticServer + '/v1.1/image/logo/Re/mop.png'
		}, {
			'title': '豆瓣网',
			'url': 'http://www.douban.com/',
			'image': staticServer + '/v1.1/image/logo/Re/douban.png'
		}, {
			'title': '开心网',
			'url': 'http://www.kaixin001.com/',
			'image': staticServer + '/v1.1/image/logo/Re/kanxin001.png'
		}, {
			'title': '世纪佳缘',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=jiayuan',
			'match': ['www.jiayuan.com'],
			'image': staticServer + '/v1.1/image/logo/Re/jiayuan.png'
		}, {
			'title': '百合网',
			'url': 'http://www.baihe.com/betatest/betatest_newlandpage.html?policy=1&Channel=xmkj-pc&Code=4',
			'match': ['www.jiayuan.com'],
			'image': staticServer + '/v1.1/image/logo/Re/baihe.png'
		}, {
			'title': '珍爱网',
			'url': 'http://www.zhenai.com/',
			'image': staticServer + '/v1.1/image/logo/Re/zhenai.png'
		}, {
			'title': '水木社区',
			'url': 'http://www.newsmth.net/',
			'image': staticServer + '/v1.1/image/logo/Re/newsmth.png'
		}]
	}, {
		'categroy': '文学小说',
		'list': [{
			'title': '起点中文网',
			'url': 'http://www.qidian.com/',
			'image': staticServer + '/v1.1/image/logo/Re/qidian.png'
		}, {
			'title': '红袖添香',
			'url': 'http://www.hongxiu.com/',
			'image': staticServer + '/v1.1/image/logo/Re/hongxiu.png'
		}, {
			'title': '纵横中文网',
			'url': 'http://www.zongheng.com/',
			'image': staticServer + '/v1.1/image/logo/Re/zongheng.png'
		}, {
			'title': '潇湘书院',
			'url': 'http://www.xxsy.net/',
			'image': staticServer + '/v1.1/image/logo/Re/xxsy.png'
		}, {
			'title': '新浪读书',
			'url': 'http://book.sina.com.cn/',
			'image': staticServer + '/v1.1/image/logo/Re/book_sina.png'
		}, {
			'title': '简书',
			'url': 'http://www.jianshu.com/',
			'image': staticServer + '/v1.1/image/logo/Re/jianshu.png'
		}, {
			'title': 'QQ阅读',
			'url': 'http://ebook.qq.com/',
			'image': staticServer + '/v1.1/image/logo/Re/ebook.png'
		}]
	}, {
		'categroy': '游戏娱乐',
		'list': [{
			'title': '傲游游戏',
			'url': 'http://www.007.mx/',
			'image': staticServer + '/v1.1/image/logo/Re/007_mx.png'
		}, {
			'title': '4399小游戏',
			'url': 'http://www.4399.com/',
			'image': staticServer + '/v1.1/image/logo/Re/4399.png'
		}, {
			'title': '腾讯游戏',
			'url': 'http://game.qq.com/',
			'image': staticServer + '/v1.1/image/logo/Re/game_qq.png'
		}, {
			'title': '网易游戏',
			'url': 'http://game.163.com/',
			'image': staticServer + '/v1.1/image/logo/Re/game_163.png'
		}, {
			'title': '17173游戏网',
			'url': 'http://www.17173.com/',
			'image': staticServer + '/v1.1/image/logo/Re/17173.png'
		}, {
			'title': '3DMGAME',
			'url': 'http://www.3dmgame.com/',
			'image': staticServer + '/v1.1/image/logo/Re/3dmgame.png'
		}, {
			'title': '多玩游戏',
			'url': 'http://www.duowan.com/',
			'image': staticServer + '/v1.1/image/logo/Re/duowan.png'
		}, {
			'title': '电玩巴士',
			'url': 'http://www.tgbus.com/',
			'image': staticServer + '/v1.1/image/logo/Re/tgbus.png'
		}, {
			'title': '空中网',
			'url': 'http://www.kongzhong.com/',
			'image': staticServer + '/v1.1/image/logo/Re/kongzhong.png'
		}, {
			'title': '游民星空',
			'url': 'http://www.gamersky.com/',
			'image': staticServer + '/v1.1/image/logo/Re/gamersky.png'
		}, {
			'title': '腾讯动漫',
			'url': 'http://ac.qq.com/',
			'image': staticServer + '/v1.1/image/logo/Re/ac_qq.png'
		}, {
			'title': '网易云音乐',
			'url': 'http://music.163.com/',
			'image': staticServer + '/v1.1/image/logo/Re/music_163.png'
		}, {
			'title': 'QQ音乐',
			'url': 'http://y.qq.com/',
			'image': staticServer + '/v1.1/image/logo/Re/qq_music.png'
		}, {
			'title': '虾米音乐',
			'url': 'http://www.xiami.com/',
			'image': staticServer + '/v1.1/image/logo/Re/xiami.png'
		}, {
			'title': '酷狗音乐',
			'url': 'http://www.kugou.com/',
			'image': staticServer + '/v1.1/image/logo/Re/kugou.png'
		}, {
			'title': '酷我音乐',
			'url': 'http://www.kuwo.cn/',
			'image': staticServer + '/v1.1/image/logo/Re/kuwo.png'
		}, {
			'title': '音悦台',
			'url': 'http://www.yinyuetai.com/',
			'image': staticServer + '/v1.1/image/logo/Re/yinyuetai.png'
		}, {
			'title': '糗事百科',
			'url': 'http://www.qiushibaike.com/',
			'image': staticServer + '/v1.1/image/logo/Re/qiushibaike.png'
		}]
	}, {
		'categroy': '生活服务',
		'list': [{
			'title': '百度',
			'url': 'https://www.baidu.com/index.php?tn=maxthon2&ch=2',
			'image': staticServer + '/v1.1/image/logo/Re/baidu.png'
		},
		{
			'title': '傲游今日',
			'url': 'http://i.maxthon.cn/',
			'image': staticServer + '/v1.1/image/logo/Re/i_maxthon.png'
		}, {
			'title': 'hao123',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=hao123',
			'image': staticServer + '/v1.1/image/logo/Re/hao123.png'
		}, {
			'title': '大众点评',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=dianping',
			'match': ['www.dianping.com'],
			'image': staticServer + '/v1.1/image/logo/Re/dianping.png'
		}, {
			'title': '12306火车票',
			'url': 'http://www.12306.cn',
			'image': staticServer + '/v1.1/image/logo/Re/12306.png'
		}, {
			'title': '汽车之家',
			'url': 'http://www.autohome.com.cn/?pvareaid=101581',
			'image': staticServer + '/v1.1/image/logo/Re/autohome.png'
		}, {
			'title': '携程旅行网',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=ctrip',
			'image': staticServer + '/v1.1/image/logo/Re/ctrip.png'
		}, {
			'title': '去哪儿',
			'url': 'http://www.qunar.com/?ex_track=auto_4f59af02',
			'image': staticServer + '/v1.1/image/logo/Re/qunar.png'
		}, {
			'title': '途牛旅游网',
			'url': 'http://go.maxthon.cn/redir/mx5/qa.htm?f=tuniu',
			'image': staticServer + '/v1.1/image/logo/Re/tuniu.png'
		}, {
			'title': '驱动之家',
			'url': 'http://www.mydrivers.com',
			'image': staticServer + '/v1.1/image/logo/Re/mudrivers.png'
		}, {
			'title': '中国银行',
			'url': 'http://www.boc.cn/',
			'image': staticServer + '/v1.1/image/logo/Re/boc.png'
		}, {
			'title': '中国工商银行',
			'url': 'http://www.icbc.com.cn/',
			'image': staticServer + '/v1.1/image/logo/Re/icbc.png'
		}, {
			'title': '中国建设银行',
			'url': 'http://www.ccb.com/',
			'image': staticServer + '/v1.1/image/logo/Re/ccb.png'
		}, {
			'title': '中国农业银行',
			'url': 'http://www.abchina.com/',
			'image': staticServer + '/v1.1/image/logo/Re/abchina.png'
		}, {
			'title': '招商银行',
			'url': 'http://www.cmbchina.com/',
			'image': staticServer + '/v1.1/image/logo/Re/cmbchina_z.png'
		}, {
			'title': '交通银行',
			'url': 'http://www.bankcomm.com/',
			'image': staticServer + '/v1.1/image/logo/Re/cmbchina_j.png'
		}, {
			'title': '中信银行',
			'url': 'http://bank.ecitic.com/',
			'image': staticServer + '/v1.1/image/logo/Re/ecitic.png'
		}, {
			'title': '房天下',
			'url': 'http://www.fang.com/',
			'image': staticServer + '/v1.1/image/logo/Re/fang.png'
		}, {
			'title': '58同城',
			'url': 'http://www.58.com/?path=?utm_source%3d5uad%26utm_campaign%3d5uad-109',
			'image': staticServer + '/v1.1/image/logo/Re/58.png'
		}, {
			'title': '赶集网',
			'url': 'http://www.ganji.com/?ca_name=dh_cpc_mingzhan/',
			'image': staticServer + '/v1.1/image/logo/Re/ganji.png'
		}]
	}];