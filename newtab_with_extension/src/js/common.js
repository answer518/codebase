const $ = selector => document.querySelector(selector) || null;

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

Element.prototype.toggleClass = function(classStr) {
    if (this.hasClass(classStr)) {
        this.removeClass(classStr)
    } else {
        this.addClass(classStr)
    }
}

Element.prototype.on = Element.prototype.addEventListener
Element.prototype.off = Element.prototype.removeEventListener

let chrome = chrome || {}

chrome.livesone = {
    snap: (url, options, callback) => {
        setTimeout(() => {
            callback && callback({ success: true, data_url: '/img/logo/sina.png' });
        }, 1000);
    },
    search_engine: {
        'default': function() {
            return {
                'name': '百度',
                'key': 'baidu.com',
                'url': 'https://www.baidu.com/?ie=utf-8&wd=%s'
            }
        },
        'onChange': function(data) {
            // data == { name: ##, key: ##, url: ## }
        }
    },
    topSites: {
        set: function(list) {

        }
    }
}
