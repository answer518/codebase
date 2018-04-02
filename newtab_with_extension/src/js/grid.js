/**
 * 格子类
 */
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
	            <div class="mv-thumb">
	                <img alt="${_this.title}" src="/img/logo/baidu.png"/>
	            </div>
	            <button class="mv-x" title=""></button>
	        `
        } else {
        	link.setAttribute('class', 'mv-empty-tile');
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

                    storage_reco.del(_this.index, (value) => {
                        getRecoSites();
                    })
                });
            }

            if(target.className === 'mv-empty-tile') {
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
