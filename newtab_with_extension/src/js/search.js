
/**
 * @param {boolean} focus True to focus the fakebox.
 */
function setFakeboxFocus(focus) {
  document.body.toggleClass(CLASSES.FAKEBOX_FOCUS, focus);
}


/**
 * @return {boolean} True if the fakebox has focus.
 */
function isFakeboxFocused() {
  return document.body.hasClass(CLASSES.FAKEBOX_FOCUS);
}

let inputbox = $(IDS.FAKEBOX_INPUT)

inputbox.on('focus', function() {
    if (!isFakeboxFocused()) { 
        setFakeboxFocus(false);
    }
})

// inputbox.on('blur', function() {
//     if (isFakeboxFocused()) { 
//         setFakeboxFocus(true);
//     }
// })