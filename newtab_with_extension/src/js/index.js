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
            if(target.className === 'mv-x') {
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
                showNotification();
            }
        })
    })
}

let topSites = [],
    recoSites = [];
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
        // { 'rid': 33, 'title': '京东', url: 'http://www.jd.com/', logo: 'jd' },
        { 'rid': 41, 'title': '新浪网', url: 'http://www.sina.com/', logo: 'sina' }
    ],
    'en-us': [1, 2]
}

let getRecoSites = function() {

    recoSites = default_data[navigator.language.toLocaleLowerCase()];
    let html = createDataItem(recoSites, 4);
    mv_recos.innerHTML = html;

    let links = mv_recos.querySelectorAll('.mv-tile');
    links.forEach((node, i) => {
        node.on('click', function(event) {
            var target = event.target;
            if(target.className === 'mv-x') {
                event.preventDefault();

                var parent = target.parentNode;
                parent.classList.add(CLASSES.GRID_MOVED);
                parent.addEventListener('transitionend', function(ev) {
                    if (ev.propertyName != 'width')
                        return;
                    parent.remove();
                    recoSites.splice(i, 1);
                    mv_recos.innerHTML = createDataItem(recoSites, 4);
                });
            }
        })
    })

    let emptys = mv_recos.querySelectorAll('.mv-empty-tile');
    emptys.forEach((node, i) => {
        node.on('click', function(event) {
            let dialog = new Modal();
        })
    })
}

getTopSites();
getRecoSites();
