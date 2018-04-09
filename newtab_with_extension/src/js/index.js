var mv_recos = $(IDS.RECOS),
    mv_tiles = $(IDS.TILES);

let topSites = [];
let getTopSites = function() {
    chrome.topSites.get(result => {
        topSites = result;

        mv_tiles.empty()

        result.forEach((item, i) => {
            var grid = new Grid(item, i);
            grid.onSuccess = function(index) {
                topSites.splice(index, 1);
                notification.showNotification();
            }
            mv_tiles.append(grid.dom());
        })

        // countLoad();
        while (mv_tiles.childNodes.length < 8) {
            var grid = new Grid({}, mv_tiles.childNodes.length);
            mv_tiles.append(grid.dom());
        }
    })
}

let default_data = {
    'zh-cn': [
        { 'title': '百度', url: 'https://www.baidu.com/index.php?tn=maxthon2&ch=12' },
        { 'title': '淘宝', url: 'https://www.taobao.com/' },
        { 'title': '微博', url: 'https://weibo.com/' },
        { 'title': 'hao123', url: 'http://www.hao123.com/?tn=55020201_2_hao_pg' }
    ],
    'en-us': [
        { 'title': 'Google', url: 'https://www.google.com' },
        { 'title': 'Facebook', url: 'https://www.facebook.com/' },
        { 'title': '京东', url: 'https://www.youtube.com/' },
        { 'title': '新浪网', url: 'https://www.amazon.cn/' }
    ]
}

let loadedCounter = 1;
let storage_reco = new Storage({ key: 'reco_sites' });
let getRecoSites = function() {

    storage_reco.get().then((result) => {

        mv_recos.empty()
        result.forEach((item, i) => {
            var grid = new Grid(item, i);
            grid.onSuccess = function(index) {
                storage_reco.del(index)
            }
            mv_recos.append(grid.dom());
        })

        // Create empty tiles until we have NUMBER_OF_TILES.
        while (mv_recos.childNodes.length < 4) {
            var grid = new Grid({}, mv_recos.childNodes.length);
            mv_recos.append(grid.dom());
        }
    });
}

getTopSites();
getRecoSites();