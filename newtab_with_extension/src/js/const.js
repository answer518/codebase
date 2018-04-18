/**
 * Enum for classnames.
 * @enum {string}
 * @const
 */
const CLASSES = {
    DELAYED_HIDE_NOTIFICATION: 'mv-notice-delayed-hide',
    HIDE_NOTIFICATION: 'mv-notice-hide',
    FAKEBOX_FOCUS: 'fakebox-focused',  // Applies focus styles to the fakebox
    GRID_MOVED: 'removed',
    UNDERLINE: 'underline',
    IS_HIGHLIGHTED: 'is-highlighted',
    IS_INVALID: 'is-invalid'
}


/**
 * Enum for HTML element ids.
 * @enum {string}
 * @const
 */
const IDS = {
    SEARCH_FORM: 'f',
    FAKEBOX: 'fakebox',
    FAKEBOX_INPUT: 'fakebox-input',
    FAKEBOX_TEXT: 'fakebox-text',
    FAKEBOX_SPCH: 'fkbx-spch',
    NOTIFICATION: 'mv-notice',
    NOTIFICATION_CLOSE_BUTTON: 'mv-notice-x',
    NOTIFICATION_MESSAGE: 'mv-msg',
    RESTORE_ALL_LINK: 'mv-restore',
    UNDO_LINK: 'mv-undo',
    TILES: 'mv-tiles',
    RECOS:'mv-recos'
}

/**
 * Enum for keycodes.
 * @enum {number}
 * @const
 */
const KEYCODE = {ENTER: 13, SPACE: 32, ESC: 27};

/**
 * default data set 
 * @type {Object}
 */
const DEFAULT_DATA = {
    'zh-cn': [
        { 'title': '百度', url: 'https://www.baidu.com/index.php?tn=maxthon2&ch=12' },
        { 'title': '淘宝', url: 'https://www.taobao.com/' },
        { 'title': '微博', url: 'https://weibo.com/' },
        { 'title': 'hao123', url: 'http://www.hao123.com/?tn=55020201_2_hao_pg' }
    ],
    'en-us': [
        { 'title': 'Google', url: 'https://www.google.com' },
        { 'title': 'Facebook', url: 'https://www.facebook.com/' },
        { 'title': 'YouTube', url: 'https://www.youtube.com/' },
        { 'title': 'Amazon', url: 'https://www.amazon.cn/' }
    ]
}
