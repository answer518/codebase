/**
 * 格子类
 */
let chrome = chrome || {}

chrome.mx = {
    snap : (url, options, callback) => {
        setTimeout(() => {
            callback && callback(true, '/img/logo/sina.png');
        }, 1000);
    }
}


class Grid {

    constructor(data) {
        Object.assign(this, data)
    }

    dom() {
    	let _this = this;
        let link = document.createElement('a');
        
        if(_this.title && _this.url) {
        	link.setAttribute('href', _this.url);
        	link.setAttribute('title', _this.title)
        	link.setAttribute('class', 'mv-tile');
        	link.innerHTML = `
				<div class="mv-favicon">
	                <img src="chrome://favicon/${_this.url}" alt="${_this.title}" />
	            </div>
	            <div class="mv-title">${_this.title}</div>
	            <div class="mv-thumb loading">
	                <div class="ring"></div>
	            </div>
	            <button class="mv-x" title=""></button>
	        `
        } else {
        	link.setAttribute('class', 'mv-empty-tile');
        }

        let thumb = link.querySelector('.mv-thumb')
        // 开始截图
        if(!_this.snapurl) {
            chrome.mx.snap(_this.url, {}, (success, data_url) => {
                if(success && thumb) {
                     thumb.innerHTML = `<img alt="${_this.title}" src="${data_url}"/>`;
                     _this.snapurl = data_url;
                }
            });
        } else {
            if(thumb) {
                thumb.innerHTML = `<img alt="${_this.title}" src="${_this.snapurl}"/>`;
            }
        }

        let handle = (event) => {
            var target = event.target;
            if (target.className === 'mv-x') {
                event.preventDefault();

                var parent = target.parentNode;
                parent.classList.add(CLASSES.GRID_MOVED);
                parent.addEventListener('transitionend', function(ev) {
                    if (ev.propertyName != 'width')
                        return;
                    // off event click
                    link.off('click', handle);
                    parent.remove();
                    _this.onSuccess && _this.onSuccess(_this.index);
                });
            }

            if(target.className === 'mv-empty-tile') {
                var parent = target.parentNode;
                // condition is true then return.
                if(parent === mv_tiles) return;
                let dialog = new Modal();
                dialog.onSuccess = function(obj) {
                    storage_reco.add(_this.index, obj, () => {
                        getRecoSites();
                    });
                }
            }
        }
        
        link.on('click', handle);
        return link
    }
}
