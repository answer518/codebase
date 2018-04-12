let mv_recos = $(IDS.RECOS),
    mv_tiles = $(IDS.TILES);

/**
 * The last blacklisted tile rid if any, which by definition should not be
 * filler.
 * @type {?number}
 */
let lastBlacklistedTile = null;
let storage = new Storage();
let getTopSites = function() {
    let loadedCounter = 1;

    let countLoad = () => {
        loadedCounter -= 1;
        if (loadedCounter <= 0) {
            show()
            loadedCounter = 1;
        }
    }

    let show = () => {
        // Create empty tiles until we have NUMBER_OF_TILES.
        while (mv_tiles.childNodes.length < 8) {
            var grid = new Grid({});
            mv_tiles.append(grid.dom());
        }
    }
    chrome.livesone.topSites.getAll(result => {
        mv_tiles.empty()
        result.forEach((item, i) => {
            var grid = new Grid(item, i);

            loadedCounter += 1;
            grid.onDelete = function() {
                lastBlacklistedTile = item;
                chrome.livesone.topSites.addBlacklistedUrl(item.url)

                countLoad();
                notification.showNotification();
            }

            grid.onHandleImage = function(el, _data) {
                storage.getTopsites().then((result) => {
                    el.removeClass('loading')
                    el.innerHTML = `<img alt="" src="${result[_data.url]}"/>`;
                }, () => {
                    chrome.livesone.thumb.snap(_data.url, { thumb_width: 154, thumb_height: 128 }, (result) => {
                        if (result.success && el) {
                            // _data.thumbnailUrl = result.data_url;
                            el.innerHTML = `<img alt="" src="${result.data_url}"/>`;
                            el.removeClass('loading')
                        }
                    });
                }).then(() => {
                    // important
                    countLoad()
                })
            }

            mv_tiles.append(grid.dom());
        })

        show()
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

// let storage_reco = new Storage({ key: 'reco_sites' });
let getRecoSites = function() {
    let loadedCounter = 1;
    let countLoad = () => {
        loadedCounter -= 1;
        if (loadedCounter <= 0) {
            show()
            loadedCounter = 1;
        }
    }

    let show = () => {
        // Create empty tiles until we have NUMBER_OF_TILES.
        while (mv_recos.childNodes.length < 4) {
            let i = mv_recos.childNodes.length
            var grid = new Grid({}, i);
            grid.onAdd = function() {
                let dialog = new Modal();
                dialog.onSuccess = function(obj) {

                    grid = new Grid(obj, i)
                    grid.onDelete = function() {
                        storage.del(i)
                    }
                    grid.onUpdate = function(data) {
                        storage.update(i, data);
                    }
                    mv_recos.replaceChild(grid.dom(), mv_recos.childNodes[i]);
                    storage.add(i, obj);
                }
            }
            mv_recos.append(grid.dom());
        }
    }
    storage.getRecoSites().then((result) => {

        mv_recos.empty()
        result.forEach((item, i) => {
            var grid = new Grid(item, i);

            grid.onHandleImage = function(el, _data) {
                chrome.livesone.thumb.snap(_data.url, { thumb_width: 154, thumb_height: 128 }, (result) => {
                    if (result.success && el) {
                        el.innerHTML = `<img alt="" src="${result.data_url}"/>`;
                        el.removeClass('loading')

                        _data.thumbnailUrl = result.data_url;
                        storage.update(i, _data);
                    }
                });

                loadedCounter += 1;
                countLoad()
            }

            grid.onDelete = function() {
                storage.del(i)
                countLoad()
            }
            mv_recos.append(grid.dom());
        })

        show();
    });
}

getTopSites();
getRecoSites();
