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
                }
            }
        })
    }

    getLang(key) {
        var result = this.lang[key];
        return result ? ((result[this.locale]) ? result[this.locale] : (result = result['en-us']) ? result : key) : key;
    }
}

let language = new Language()