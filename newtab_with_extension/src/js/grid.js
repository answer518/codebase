/**
 * 格子类
 */
class Grid {

    constructor(data, index) {
        this.data = data
        this.index = index
    }

    dom() {
        let _this = this,
            _data = _this.data,
            link = document.createElement('a');

        if (_data.title && _data.url) {
            link.setAttribute('href', _data.url);
            link.setAttribute('title', _data.title)
            link.setAttribute('class', 'mv-tile');

            let favicon = document.createElement('div')
            favicon.className = 'mv-favicon'
            let fi = document.createElement('img')
            fi.src = `chrome://favicon/${_data.url}`
            fi.title = fi.alt = `${_data.title}`

            fi.on('load', _this.countLoad)
            fi.on('error', () => {
                favicon.addClass('failed-favicon')
            })

            favicon.appendChild(fi)
            link.appendChild(favicon)

            let title = document.createElement('div');
            title.className = 'mv-title';
            title.innerText = _data.title;
            link.appendChild(title)

            let thumb = document.createElement('div');
            thumb.className = 'mv-thumb';
            let ring = document.createElement('div');
            ring.className = 'ring'
            thumb.appendChild(ring)
            link.appendChild(thumb)

            // 开始截图
            if (!_data.thumbnailUrl) {
                thumb.addClass('loading')
                _this.onHandleImage && _this.onHandleImage(thumb, _data)
            } else {
                var img = document.createElement('img');
                img.title = _data.title;
                img.src = _data.thumbnailUrl;

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
                    _this.onDelete && _this.onDelete();
                });

                return;
            }
            // condition is true then return.
            _this.onAdd && _this.onAdd()
        }

        link.on('click', handle);
        return link
    }
}
