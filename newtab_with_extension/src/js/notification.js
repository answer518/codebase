 class Notification {

    constructor() {
        let notification = $('#mv-notice');
        let h = {
            notification: notification,
            mv_notice_x: notification.querySelector('#mv-notice-x'),
            mv_undo: notification.querySelector('#mv-undo'),
            mv_restore: notification.querySelector('#mv-restore')
        }

        Object.assign(this, h)
    }

    init() {
        let _this = this;

        _this.mv_notice_x.on('click', function() {
            _this.hideNotification();
        })

        _this.mv_undo.on('click', function() {
            _this.hideNotification();
        })

        _this.mv_restore.on('click', function() {
            _this.hideNotification();
        })
    }

    showNotification() {
        let _this = this;
        _this.notification.classList.remove(CLASSES.HIDE_NOTIFICATION);
        _this.notification.classList.remove(CLASSES.DELAYED_HIDE_NOTIFICATION);
        _this.notification.scrollTop;
        _this.notification.classList.add(CLASSES.DELAYED_HIDE_NOTIFICATION);
    }

    hideNotification() {
        let _this = this;
        _this.notification.classList.add(CLASSES.HIDE_NOTIFICATION);
        _this.notification.classList.remove(CLASSES.DELAYED_HIDE_NOTIFICATION);
    }
}
