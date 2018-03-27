const $ = selector => document.querySelector(selector) || null;

const CLASSES = {
    DELAYED_HIDE_NOTIFICATION: 'mv-notice-delayed-hide',
    HIDE_NOTIFICATION: 'mv-notice-hide',
    GRID_MOVED: 'removed',
    UNDERLINE:'underline',
    IS_HIGHLIGHTED: 'is-highlighted',
    IS_INVALID: 'is-invalid'
}

let merge = function(target) {
    for (var i = 1, j = arguments.length; i < j; i++) {
        var source = arguments[i];
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                var value = source[prop];
                if (value !== undefined) {
                    target[prop] = value;
                }
            }
        }
    }
    return target;
};

class Modal {
    constructor(option) {
        let opt = {
            type: 0,
            title: '添加站点',
            okText: '确认',
            cancelText: '取消',
            time: 0
        }
        this.modal = null
        merge(opt, option)
        this.opt = opt
        this.init(opt)
    }

    init(opt) {
        let modal = this.modal = document.createElement('div')
        let that = this
        modal.className = 'modal-container'

        let inner = `<div class="modal-body">
            <div class="modal-title"> ${opt.title} </div>
            <span class="modal-close"></span>
            <div class="modal-content">
                <div class="modal-input">
                    <label id="paper-input-label-1" htmlfor="name">名称</label>
                    <input type="input" name="name" id="name"/>
                    <span class="paper-input-error"></span>
                    <div class="underline">
                        <div class="unfocused-line"></div>
                        <div class="focused-line"></div>
                    </div>
                </div>
                <div class="modal-input">
                    <label id="paper-input-label-2" htmlfor="url">网址</label>
                    <input type="input" name="url" id="url"/>
                    <span class="paper-input-error"></span>
                    <div class="underline">
                        <div class="unfocused-line"></div>
                        <div class="focused-line"></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn">取消</button>
                <button class="ok-btn">确定</button>
            </div> 
        </div>`
        modal.innerHTML = inner
        document.body.appendChild(modal)
        opt.mounted && opt.mounted(modal)

        let _this = this,
            modal_close = modal.querySelector('.modal-close'),
            cancel_btn = modal.querySelector('.cancel-btn');
        modal.addEventListener('click', e => {
            let target = e.target
            if (target !== modal 
                    && target !== modal_close 
                    && target !== cancel_btn) return;

            _this.close();
        }, false);

        modal.querySelector('.ok-btn').addEventListener('click', function() {
            let name = modal.querySelector('#name').value.replace(/\s/, ''),
                url = modal.querySelector('#url').value.replace(/\s/, '');

            if(url.length === 0) {
                let next = inputs[1].nextSibling;
                next = next.nextSibling;
                next.innerHTML = '请输入网址';
                next = next.nextSibling;
                next = next.nextSibling;
                next.classList.add(CLASSES.IS_INVALID);
                return;
            }

            if(name.length > 100) {
                console.log('标题过长');
                return;
            }

            if(name.length === 0) {
                name = url;
            }

            if(url.indexOf('http://') !== 0) {
                url = 'http://' + url;
            }

            console.log({
                url: url,
                name: name
            })
        }, false);

        let inputs = modal.querySelectorAll('input');

        inputs.forEach((node, i) => {

            node.addEventListener('focus', function() { 
                let next = this.nextSibling;
                next = next.nextSibling;
                next = next.nextSibling;
                next = next.nextSibling;
                next.classList.add(CLASSES.IS_HIGHLIGHTED);
            }, false);

            node.addEventListener('blur', function() {
                let next = this.nextSibling;
                next = next.nextSibling;
                next = next.nextSibling;
                next = next.nextSibling;
                next.classList.remove(CLASSES.IS_HIGHLIGHTED);
            }, false);
        })
    }

    close() {
        // this.modal.addClass('move-out')
        this.opt.destroy && this.opt.destroy()
            // this.modal.on('animationend', e => {
        document.body.removeChild(this.modal)
            // }, false)
    }
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

var mv_recos = $('#mv-recos'),
    mv_tiles = $('#mv-tiles');

function createDataItem(ret, max) {
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

    var e = max - ret.length;

    for (e; e > 0; e--) {
        html += `<a class="mv-empty-tile"></a>`
    }

    return html;
}

function bindEvent() {

    let links = mv_tiles.querySelectorAll('.mv-tile');
    links.forEach((node, i) => {
        node.addEventListener('click', function(event) {
            var target = event.target;
            return false;
            // let dialog = new Modal();
        })
    })

    let buttons = mv_tiles.querySelectorAll('.mv-x');
    buttons.forEach((node, i) => {
        node.addEventListener('click', function(event) {
            var parent = this.parentNode;
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
        });
    });
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

    let buttons = mv_recos.querySelectorAll('.mv-x');
    buttons.forEach((node, i) => {
        node.addEventListener('click', function(event) {
            var parent = this.parentNode;
            parent.classList.add(CLASSES.GRID_MOVED);
            parent.addEventListener('transitionend', function(ev) {
                if (ev.propertyName != 'width')
                    return;
                parent.remove();
                recoSites.splice(i, 1);
                mv_recos.innerHTML = createDataItem(recoSites, 4);
            });
        });
    });

    let emptys = mv_recos.querySelectorAll('.mv-empty-tile');
    emptys.forEach((node, i) => {
        node.addEventListener('click', function(event) {
            var target = event.target;
            let dialog = new Modal();
        })
    })
}

getTopSites();
getRecoSites();
