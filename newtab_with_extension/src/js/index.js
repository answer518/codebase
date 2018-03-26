const $ = selector => document.querySelector(selector) || null;

const CLASSES = {
    DELAYED_HIDE_NOTIFICATION: 'mv-notice-delayed-hide',
    HIDE_NOTIFICATION: 'mv-notice-hide',
    GRID_MOVED: 'removed'
}

const notification = $('#mv-notice');

const mv_notice_x = notification.querySelector('#mv-notice-x'),
    mv_undo = notification.querySelector('#mv-undo'),
    mv_restore = notification.querySelector('#mv-restore');

mv_notice_x.addEventListener('click', function() {
    hideNotification();
})

mv_undo.addEventListener('click', function() {
    hideNotification();
})

mv_restore.addEventListener('click', function() {
    hideNotification();
})

function showNotification() {
    notification.classList.remove(CLASSES.HIDE_NOTIFICATION);
    notification.classList.remove(CLASSES.DELAYED_HIDE_NOTIFICATION);
    notification.scrollTop;
    notification.classList.add(CLASSES.DELAYED_HIDE_NOTIFICATION);
}

function hideNotification() {
    notification.classList.add(CLASSES.HIDE_NOTIFICATION);
    notification.classList.remove(CLASSES.DELAYED_HIDE_NOTIFICATION);
}

var mv_tiles = $('#mv-tiles');

function createDataItem(ret) {
    //chrome-search://favicon/size/16@1x/1/4
    let html = ''
    ret.forEach(item => {
        if (item.title) {
            html += `<a _href="${item.url}" title="${item.title}" class="mv-tile">
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

    var e = 8 - ret.length;

    for (e; e > 0; e--) {
        html += `<a class="mv-empty-tile"></a>`
    }
    mv_tiles.innerHTML = html;
}

function bindEvent() {

    // let links = mv_tiles.querySelectorAll('.mv-tile');
    // links.addEventListener('click', function(event) {
    //     var target = event.target;
    //     return false;
    //     // let dialog = new Modal();
    // });

    let buttons = mv_tiles.querySelectorAll('.mv-x');
    buttons.forEach((node, i) => {
        node.addEventListener('click', function(event) {
            var parent = this.parentNode;
            parent.classList.add(CLASSES.GRID_MOVED);
            parent.addEventListener('transitionend', function(ev) {
                if (ev.propertyName != 'width')
                    return;
                parent.remove();
                
            });
            showNotification();
        });
    });
}

let getTopSites = function() {
    chrome.topSites.get(ret => {
        createDataItem(ret);
        bindEvent();
    })
}

getTopSites();
