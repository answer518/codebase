const notification = $('#mv-notice');

const mv_notice_x = notification.querySelector('#mv-notice-x'),
    mv_undo = notification.querySelector('#mv-undo'),
    mv_restore = notification.querySelector('#mv-restore');

mv_notice_x.on('click', function() {
    hideNotification();
})

mv_undo.on('click', function() {
    hideNotification();
})

mv_restore.on('click', function() {
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