

/**
 * The last blacklisted tile rid if any, which by definition should not be
 * filler.
 * @type {?number}
 */
let lastBlacklistedTile = null;
let storage = new Storage();

let mv_recos = $(IDS.RECOS),
    mv_tiles = $(IDS.TILES);

let _main = {
    getTopSites: function() {
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
                    storage.getTopsites(_data.url).then((result) => {
                        el.removeClass('loading')
                        el.innerHTML = `<img alt="" src="${result}"/>`;
                    }, () => {
                        chrome.livesone.thumb.snap(_data.url, { thumb_width: 154, thumb_height: 128 }, (result) => {
                            if (result.success && el) {
                                // _data.thumbnailUrl = result.data_url;
                                el.innerHTML = `<img alt="" src="${result.data_url}"/>`;
                                el.removeClass('loading')
                                //
                                storage.setTopsites(_data.url, result.data_url);
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
    },
    getRecoSites: function() {
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
                    dialog.show()
                    dialog.onSuccess = function(obj) {

                        grid = new Grid(obj, i)
                        grid.onDelete = function() {
                            storage.del(i)
                        }
                        grid.onUpdate = function(data) {
                            storage.update(i, data);
                        }
                        grid.onHandleImage = function(el, _data) {
                            chrome.livesone.thumb.snap(_data.url, { thumb_width: 154, thumb_height: 128 }, (result) => {
                                if (result.success && el) {
                                    el.innerHTML = `<img alt="" src="${result.data_url}"/>`;
                                    el.removeClass('loading')
        
                                    _data.thumbnailUrl = result.data_url;
                                    storage.update(i, _data);
                                }
                            });
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
    },
    start: function() {
        let _this = this;

        _this.getTopSites()
        _this.getRecoSites()
    }
}

_main.start()
