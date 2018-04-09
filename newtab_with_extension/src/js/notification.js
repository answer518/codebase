 class Notification {

     constructor() {}

     init() {
         let _this = this
         _this.notification = $(IDS.NOTIFICATION)
         $(IDS.NOTIFICATION_CLOSE_BUTTON).on('click', function() {
             _this.hideNotification();
         })

         $(IDS.UNDO_LINK).on('click', function() {
             _this.hideNotification();
         })

         $(IDS.RESTORE_ALL_LINK).on('click', function() {
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

 const notification = new Notification();
 notification.init();
