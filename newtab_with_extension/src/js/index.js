var mv_recos = $('#mv-recos'),
    mv_tiles = $('#mv-tiles');

function createDataItem(ret, max) {
    let html = ''
    ret.forEach(item => {
        if (item.title) {
            html += `<a href="${item.url}" title="${item.title}" class="mv-tile" target="_blank">
                        <div class="mv-favicon">
                            <img src="chrome://favicon/${item.url}" alt="${item.title}" />
                        </div>
                        <div class="mv-title">${item.title}</div>
                        <div class="mv-thumb">
                            <img alt="${item.title}" src="/img/logo/baidu.png"/>
                        </div>
                        <button class="mv-x" title=""></button>
                    </a>`
        }
    })

    var e = max - ret.length;
    for (e; e > 0; e--) {
        html += `<a class="mv-empty-tile"></a>`
    }

    return html;
}

function bindEvent() {

    let links = mv_tiles.querySelectorAll('.mv-tile');
    links.forEach((node, i) => {
        node.on('click', function(event) {
            var target = event.target;
            if (target.className === 'mv-x') {
                event.preventDefault();

                var parent = target.parentNode;
                parent.classList.add(CLASSES.GRID_MOVED);
                parent.addEventListener('transitionend', function(ev) {
                    if (ev.propertyName != 'width')
                        return;
                    parent.remove();
                    topSites.splice(i, 1);
                    mv_tiles.innerHTML = createDataItem(topSites, 8);
                    bindEvent();
                });
                notification.showNotification();
            }
        })
    })
}

let topSites = [];
let getTopSites = function() {
    chrome.topSites.get(ret => {
        topSites = ret;
        let html = createDataItem(topSites, 8);
        mv_tiles.innerHTML = html;
        bindEvent();
    })
}

let default_data = {
    'zh-cn': [
        { 'rid': 11, 'title': '百度', url: 'http://www.baidu.com/', logo: 'baidu' },
        { 'rid': 21, 'title': '天猫', url: 'http://www.tmall.com/', logo: 'tmall' },
        { 'rid': 33, 'title': '京东', url: 'http://www.jd.com/', logo: 'jd' },
        { 'rid': 41, 'title': '新浪网', url: 'http://www.sina.com/', logo: 'sina' }
    ],
    'en-us': [1, 2]
}

class Storage {
    constructor(data) {
        Object.assign(this, data);
        this.onChange();
    }

    get() {
        let _this = this,
            key = _this.key;

        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(['reco_sites'], (result) => {
                let data = result[key];
                if (Object.keys(data).length === 0) {
                    data = default_data[navigator.language.toLocaleLowerCase()];
                    _this.set(data);
                }

                _this.result = data;
                resolve(data)
            })
        });
    }

    del(index, callback) {
        let _this = this
        _this.result.splice(index, 1);
        _this.set(_this.result).then((value) => {
            callback && callback(value)
        });
    }

    set(value) {
        let _this = this,
            key = _this.key;
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({'reco_sites': value}, () => {
                resolve(value)
            })
        });
    }

    onChange() {
        chrome.storage.onChanged.addListener(function callback(){
            console.log(arguments)
        }) 
    }
}

let storage_reco = new Storage({key : 'reco_sites'});

let getRecoSites = function() {

    storage_reco.get().then((result) => {

         //当elem下还存在子节点时 循环继续 
        while(mv_recos.lastChild)  
        {  
            mv_recos.removeChild(mv_recos.firstChild);  
        }

        result.forEach((item, i) => {
            item.index = i;
            var grid = new Grid(item);
            mv_recos.append(grid.dom());
        })

        // Create empty tiles until we have NUMBER_OF_TILES.
        while (mv_recos.childNodes.length < 4) {
            var grid = new Grid({});
            mv_recos.append(grid.dom());
        }
    });
}


getTopSites();
getRecoSites();

const notification = new Notification();
notification.init();