 class Notification {

     constructor() {}

     init() {

         let undoLink = $(IDS.UNDO_LINK),
             restoreAllLink = $(IDS.RESTORE_ALL_LINK);

         $(IDS.NOTIFICATION_MESSAGE).textContent = language.getLang('thumbnailRemovedNotification');
         undoLink.textContent = language.getLang('undoThumbnailRemove');
         restoreAllLink.textContent = language.getLang('restoreThumbnailsShort');

         let hideNotification = this.hideNotification.bind(this)
         $(IDS.NOTIFICATION).addEventListener('transitionend', hideNotification);
         $(IDS.NOTIFICATION_CLOSE_BUTTON).on('click', hideNotification)

         let onUndo = this.onUndo.bind(this)
         undoLink.on('click', onUndo)
         this.registerKeyHandler(undoLink, KEYCODE.ENTER, onUndo);
         this.registerKeyHandler(undoLink, KEYCODE.SPACE, onUndo);

         let onRestoreAll = this.onRestoreAll.bind(this)
         restoreAllLink.on('click', onRestoreAll)
         this.registerKeyHandler(restoreAllLink, KEYCODE.ENTER, onRestoreAll);
         this.registerKeyHandler(restoreAllLink, KEYCODE.SPACE, onRestoreAll);
     }

     showNotification() {
         let notification = $(IDS.NOTIFICATION);
         notification.classList.remove(CLASSES.HIDE_NOTIFICATION);
         notification.classList.remove(CLASSES.DELAYED_HIDE_NOTIFICATION);
         notification.scrollTop;
         notification.classList.add(CLASSES.DELAYED_HIDE_NOTIFICATION);
     }

     hideNotification() {
         let notification = $(IDS.NOTIFICATION);
         notification.classList.add(CLASSES.HIDE_NOTIFICATION);
         notification.classList.remove(CLASSES.DELAYED_HIDE_NOTIFICATION);
     }

     onUndo() {
         this.hideNotification();
         if (lastBlacklistedTile != null) {
             chrome.livesone.topSites.removeBlacklistedUrl(lastBlacklistedTile.url)
             getTopSites()
         }
     }

     onRestoreAll() {
         this.hideNotification();
         chrome.livesone.topSites.clearBlacklistedUrls()

         getTopSites()
     }

     registerKeyHandler(element, keycode, handler) {
         element.addEventListener('keydown', function(event) {
             if (event.keyCode == keycode)
                 handler(event);
         });
     }
 }

 const notification = new Notification();
 notification.init();
