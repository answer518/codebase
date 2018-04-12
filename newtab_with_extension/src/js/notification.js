 class Notification {

     constructor() {}

     init() {
         let _this = this

         $(IDS.NOTIFICATION).addEventListener('transitionend', this.hideNotification.bind(this));
         $(IDS.NOTIFICATION_CLOSE_BUTTON).on('click', this.hideNotification.bind(this))
         $(IDS.UNDO_LINK).on('click', this.onUndo.bind(this))
         $(IDS.RESTORE_ALL_LINK).on('click', this.onRestoreAll.bind(this))
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
 }

 const notification = new Notification();
 notification.init();
