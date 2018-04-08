
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

let searchForm = $('f')

function setEngine(data) {
	var arrTmp = data.url.split('?');
    var action = arrTmp[0];
    if (arrTmp[1]) {
        var nameParam = arrTmp[1].match(/[\w\-]+=%[\w\-]+/g);
        var keywordName = nameParam[0].split('=')[0];
        var reg = new RegExp('&*' + nameParam + '&*', 'g');
        var param = arrTmp[1].replace(reg, '&').replace(/^&+|&+$/g, '');

        inputbox.setAttribute('name', keywordName);
        // 添加搜索额外参数
        param = param.replace(/^&+|&+$/g, ''); // 矫正首尾无效值
        var arr = param.split('&');
        var extraParam = document.createElement('div');
        extraParam.className = 'extra-param'
        var tmpl = '';
        for (var i = 0; i < arr.length; i++) {
            var n = arr[i].indexOf('=');
            var key = arr[i].substring(0, n);
            var value = arr[i].substring(n + 1);
            tmpl += '<input type="hidden" name="' + key + '" value="' + value + '">';
        }
        searchForm.querySelector('.extra-param').remove();
        searchForm.appendChild(extraParam);
        extraParam.innerHTML = tmpl
    }
}

// 默认搜索引擎
setEngine({
    'name': '百度',
    'key': 'baidu.com',
    'url': 'https://www.baidu.com/?ie=utf-8&wd=%s'
});

// inputbox.on('blur', function() {
//     if (isFakeboxFocused()) { 
//         setFakeboxFocus(true);
//     }
// })