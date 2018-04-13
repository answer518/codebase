class Language {
    constructor() {
        Object.assign(this, {
            lang: {
                'undoThumbnailRemove': {
                    'zh-cn': '撤销',
                    'en-us': 'Undo'
                },
                'restoreThumbnailsShort': {
                    'zh-cn': '全部恢复',
                    'en-us': 'Restore all'
                },
                'thumbnailRemovedNotification': {
                    'zh-cn': '已删除缩略图。',
                    'en-us': 'Thumbnail removed.'
                },
                'removeTooltip': {
                    'zh-cn': '不要在本页上显示',
                    'en-us': 'Don\'t show on this page'
                },
                'searchText': {
                    'zh-cn': '请在这里输入搜索内容',
                    'en-us': 'Please enter the search content here'
                },
                'DocumentTitle': {
                    'zh-cn': '新标签页',
                    'en-us': 'New tab'
                }
            }
        })
        document.title = this.getLang('DocumentTitle')
    }

    getLang(key) {
        var result = this.lang[key];
        return result ? ((result[this.locale]) ? result[this.locale] : (result = result['en-us']) ? result : key) : key;
    }
}

let language = new Language()
