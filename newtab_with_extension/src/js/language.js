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
                'Confirm': {
                    'zh-cn': '确定',
                    'en-us': 'Confirm'
                },
                'Cancel': {
                    'zh-cn': '取消',
                    'en-us': 'Cancel'
                },
                'Title': {
                    'zh-cn': '标题',
                    'en-us': 'Title'
                },
                'Url': {
                    'zh-cn': '网址',
                    'en-us': 'Url'
                },
                'EnterUrl': {
                    'zh-cn': '请输入网址',
                    'en-us': 'Enter the URL'
                },
                'TitleTooLong': {
                    'zh-cn': '标题过长',
                    'en-us': 'The title is too long'
                },
                'AddSite': {
                    'zh-cn': '添加站点',
                    'en-us': 'Add Site'
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
