var mv_recos = $(IDS.RECOS),
    mv_tiles = $(IDS.TILES);

let topSites = [];
let getTopSites = function() {
    let loadedCounter = 1;
    chrome.topSites.get(result => {
        topSites = result;

        mv_tiles.empty()

        result.forEach((item, i) => {
            var grid = new Grid(item, i);

            loadedCounter += 1;
            grid.countLoad = function() {
                loadedCounter -= 1;
                if (loadedCounter <= 0) {
                    // Create empty tiles until we have NUMBER_OF_TILES.
                    while (mv_tiles.childNodes.length < 8) {
                        var grid = new Grid({});
                        mv_tiles.append(grid.dom());
                    }
                    loadedCounter = 1;
                }
            }
            grid.onDelete = function(index) {
                topSites.splice(index, 1);
                notification.showNotification();
            }
            mv_tiles.append(grid.dom());
        })

        // init;
        while (mv_tiles.childNodes.length < 8) {
            var grid = new Grid({});
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
        { 'title': 'YouTube', url: 'https://www.youtube.com/' },
        { 'title': 'Amazon', url: 'https://www.amazon.cn/' }
    ]
}

let storage_reco = new Storage({ key: 'reco_sites' });
let getRecoSites = function() {
    let loadedCounter = 1;
    storage_reco.get().then((result) => {

        mv_recos.empty()
        result.forEach((item, i) => {
            var grid = new Grid(item, i);
            loadedCounter += 1;

            grid.countLoad = function() {
                loadedCounter -= 1;
                if (loadedCounter <= 0) {
                    // Create empty tiles until we have NUMBER_OF_TILES.
                    while (mv_recos.childNodes.length < 4) {
                        var grid = new Grid({});
                        mv_recos.append(grid.dom());
                    }
                    loadedCounter = 1;
                }
            }
            grid.onUpdate = function(data) {
                storage_reco.update(i, data);
            }
            grid.onDelete = function() {
                storage_reco.del(i)
            }
            mv_recos.append(grid.dom());
        })

        // Create empty tiles until we have NUMBER_OF_TILES.
        while (mv_recos.childNodes.length < 4) {
            let i = mv_recos.childNodes.length
            var grid = new Grid({}, i);
            grid.onAdd = function() {
                let dialog = new Modal();
                dialog.onSuccess = function(obj) {

                    grid = new Grid(obj, i)
                    grid.onDelete = function() {
                        storage_reco.del(i)
                    }
                    grid.onUpdate = function(data) {
                        storage_reco.update(i, data);
                    }
                    mv_recos.replaceChild(grid.dom(), mv_recos.childNodes[i]);
                    storage_reco.add(i, obj);
                }
            }
            mv_recos.append(grid.dom());
        }
    });
}

getTopSites();
getRecoSites();
