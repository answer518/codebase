Element.prototype.on = Element.prototype.addEventListener
const $ = selector => document.querySelector(selector) || null;
const log = {
    i: console.log,
    e: console.error,
    w: console.warn
}
Element.prototype.addClass = function(classStr) {

    if (this.classList.contains(classStr)) {
        return true
    }
    this.classList.add(classStr)
}

Element.prototype.removeClass = function(classStr) {
    this.classList.contains(classStr) && this.classList.remove(classStr)
}
Element.prototype.hasClass = function(classStr) {
    return this.classList.contains(classStr)
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
            title: 'Message',
            btnTxt: 'OK',
            msg: '',
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
        modal.className = 'modal'
        this.timer && clearTimeout(this.timer)
        let addWebsiteItem = `
            <p class="input_wrap">
                <input type="text" placeholder="Website Name" name="websiteName">
            </p>
            <p class="input_wrap">
                <input type="text" placeholder="Website Url" name="websiteUrl">
            </p>
            <p class="input_wrap">
                <input type="text" placeholder="Website Icon" name="websiteIcon">
            </p>
            <p class="input_wrap">
                <input type="text" placeholder="Website Icon background, E.g: #eeeeee" name="websiteBg">
            </p>
        `
        let addFrameItem = `
            <p class="input_wrap frame_input_wrap">
                <input type="text" placeholder="Website Url" name="iframeUrl">
            </p>
        `
        let inner = `<div class="inner">
            <div class="title">${opt.title}</div>
            <span class="delete" data-action="modal_close"></span>
            <div class="content">
                ${opt.type === 0 ? opt.msg : opt.type === 1 ? addWebsiteItem : addFrameItem}
            </div>
            <div class="footer_place"></div>
            <div class="footer">
                <button class="btn" data-action="modal_btn">${opt.btnTxt}</button>
            </div>
        </div>`
        modal.innerHTML = inner
        document.body.appendChild(modal)
        opt.mounted && opt.mounted(modal)

        if (opt.time !== 0) {
            this.timer = setTimeout(e => {
                that.close()
            }, opt.time * 1e3)
        }

        modal.on('click', e => {
            let target = e.target
            let action = target.getAttribute('data-action')
            if (action === 'modal_close') {
                that.close()
            } else if (action === 'modal_btn') {
                let flag = opt.callback && opt.callback(modal);
                !flag && (that.close())
            }
        }, !1)
    }
    close() {
        this.modal.addClass('move-out')
        this.opt.destroy && this.opt.destroy()
        this.modal.on('animationend', e => {
            document.body.removeChild(this.modal)
        }, false)
    }
}
let createWebItem = function(dataArray) {
    let html = '';
    if (dataArray.length === 0) {
        return html;
    }
    dataArray.forEach(item => {
        html += `<li draggable="true" data-name="${item.name}">
                    <a href="${item.url}" target="${item.target ||  '_self'}">
                        <span class="icon" style="background-color:${item.bgc || '#fff'}">
                            <img src="${item.icon || 'asset/Website.png'}">
                        </span>
                        <p class="name">${item.name}</p>
                    </a>
                    <span class="delete" data-name="${item.name}"></span>
                    <span class="edit" data-name="${item.name}"></span>
                </li>`
    });
    return html;
}
let createFrameItem = function(dataArray) {
    let html = '';
    if (dataArray.length === 0) {
        return html;
    }
    dataArray.forEach(item => {
        html += `<div class="cell">
                    <span class="delete" data-url="${item}"></span>
                    <iframe src="${item}" frameborder="0"></iframe>
                </div>`
    });
    return html;
}

let inArray = (valObj, array) => {
    let ret = -1;
    if (typeof valObj === 'string') {
        array.forEach((item, index) => {
            if (valObj === item) {
                ret = index
            }
        })

    } else {
        let key = Object.keys(valObj)[0]
        let val = valObj[key]
        array.forEach((item, index) => {
            if (val === item[key]) {
                ret = index
            }
        })
    }
    return ret
}
class Verify {
    constructor() {
        this.cache = [];
        this.strategy = {
            text(val, errMsg) {
                if (!val || /^\s+$/g.test(val)) {
                    return errMsg;
                }
            }
        };
    };
    add(el, rule, errMsg) {
        this.cache.push(() => {
            return this.strategy[rule].apply(el, [el.value, errMsg]);
        });
    };
    startVerify() {
        var index = 0;
        while (index < this.cache.length) {
            var errMsg = this.cache[index++]();
            if (errMsg) return errMsg;
        }
    }
}

var mv_tiles = $('#mv-tiles');

function createDataItem(ret) {

    let html = ''
    ret.forEach(item => {
        if (item.title) {
            html += `<a href="${item.url}" title="${item.title}" class="mv-tile">
                        <div class="mv-favicon">
                            <img src="chrome-search://favicon/size/16@1x/1/4" alt="${item.title}" />
                        </div>
                        <div class="mv-title">${item.title}</div>
                        <div class="mv-thumb">
                            <img alt="${item.title}" src="/images/logo/baidu.png"/>
                        </div>
                        <button class="mv-x" title="不要在本页上显示"></button>
                    </a>`
        }
    })

    var e = 8 - ret.length;

    for (e; e > 0; e--) {
        html += `<a class="mv-empty-tile"></a>`
    }
    mv_tiles.innerHTML = html;
}

let getTopSites = () => {
    chrome.topSites.get(ret => {
        createDataItem(ret)
    })
}

getTopSites();
