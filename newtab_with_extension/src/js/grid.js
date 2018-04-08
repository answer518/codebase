/**
 * 格子类
 */

function countLoad() {
    loadedCounter -= 1;

    if (loadedCounter <= 0) {
        // Create empty tiles until we have NUMBER_OF_TILES.
        while (mv_tiles.childNodes.length < 8) {
            var grid = new Grid({});
            mv_tiles.append(grid.dom());
        }

        while (mv_recos.childNodes.length < 4) {
            var grid = new Grid({});
            mv_recos.append(grid.dom());
        }
        loadedCounter = 1;
    }
}

class Grid {

    constructor(data, index) {
        data.index = index
        Object.assign(this, data)
    }

    dom() {
        let _this = this;
        let link = document.createElement('a');

        if (_this.title && _this.url) {
            link.setAttribute('href', _this.url);
            link.setAttribute('title', _this.title)
            link.setAttribute('class', 'mv-tile');

            let favicon = document.createElement('div')
            favicon.className = 'mv-favicon'
            let fi = document.createElement('img')
            fi.src = `chrome://favicon/${_this.url}`
            fi.title = fi.alt = `${_this.title}`

            loadedCounter += 1
            fi.on('load', countLoad)

            fi.on('error', () => {
                favicon.addClass('failed-favicon')
                countLoad()
            })

            favicon.appendChild(fi)
            link.appendChild(favicon)

            let title = document.createElement('div');
            title.className = 'mv-title';
            title.innerText = _this.title;
            link.appendChild(title)

            let thumb = document.createElement('div');
            thumb.className = 'mv-thumb';
            let ring = document.createElement('div');
            ring.className = 'ring'
            thumb.appendChild(ring)
            link.appendChild(thumb)
                // 开始截图
            if (!_this.thumbnailUrl) {
                thumb.addClass('loading')
                chrome.livesone.snap(_this.url, { thumb_width: 154, thumb_height: 128}, (result) => {
                    if (result.success && thumb) {
                        _this.thumbnailUrl = result.data_url;
                        thumb.innerHTML = `<img alt="${_this.title}" src="${_this.thumbnailUrl}"/>`;
                        thumb.removeClass('loading')
                        // important
                        countLoad();
                    }
                });

                loadedCounter += 1;
            } else {
                var img = document.createElement('img');
                img.title = _this.title;
                img.src = _this.thumbnailUrl;

                thumb.empty()
                thumb.appendChild(img)
                img.on('load', () => {
                    // console.log('loaded')
                })
                img.on('error', () => {
                    thumb.classList.add('failed-img');
                })
            }

            var mvx = document.createElement('button');
            mvx.className = 'mv-x';
            mvx.title = '%E4%B8%8D%E8%A6%81%E5%9C%A8%E6%9C%AC%E9%A1%B5%E4%B8%8A%E6%98%BE%E7%A4%BA'
            link.appendChild(mvx)
        } else {
            link.className = 'mv-empty-tile'
        }

        link.setAttribute('rid', _this.index)

        let handle = (event) => {
            let target = event.target,
                parent = target.parentNode;

            if (target.className === 'mv-x') {
                event.preventDefault();

                parent.classList.add(CLASSES.GRID_MOVED);
                parent.addEventListener('transitionend', function(ev) {
                    if (ev.propertyName != 'width')
                        return;
                    // off event click
                    link.off('click', handle);
                    parent.remove();
                    countLoad()
                    _this.onSuccess && _this.onSuccess(link.getAttribute('rid'));
                });
            }

            if (target.className === 'mv-empty-tile') {
                // condition is true then return.
                if (parent === mv_tiles) return;
                let dialog = new Modal();
                dialog.onSuccess = function(obj) {
                    let index = link.getAttribute('rid')
                    let newLink = new Grid(obj, index)
                    newLink.onSuccess = function(index) {
                        storage_reco.del(index)
                    }
                    parent.replaceChild(newLink.dom(), link);
                    storage_reco.add(index, obj, () => {
                        // getRecoSites()
                    });
                }
            }
        }

        link.on('click', handle);
        return link
    }
}
