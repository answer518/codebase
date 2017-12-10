/**
 * @author guotingjie
 * PopupDiv v1.0 通用弹出层插件
 */
$.fn.Dialog = function(options) {
    //初始默认参数
    var Settings = {
        modal: true, //是否需要遮罩层
        title: "提示信息", //标题信息
        closeTitle: false, //是否不需要标题，默认显示
        close_btn: true, //是否启用右上的关闭按钮关闭,默认启用
        autoOpen: true, //自动弹出窗口
        ajaxUrl: null,
        close_fn_before: function() {},
        close_fn_later: function() {},
        start_fn_before: function() {},
        start_fn_later: function() {},
        open_fn_before: function() {},
        open_fn_later: function() {},
        remove_fn_before: function() {},
        remove_fn_later: function() {}
    }

    var container = this;
    bool = container.data("bool");
    if (bool == null) {
        bool = true;
    }
    if (options) {
        jQuery.extend(Settings, options);
    }

    function open() {
        Settings.open_fn_before();
        if (Settings.modal) {
            addMaskLayer();
        }
        container.show();
    }

    if (bool) {
        container.data("bool", false);
        if (Settings.ajaxUrl !== null) {
            $.ajax({
                type: "GET",
                url: Settings.ajaxUrl,
                success: function(mydata) {
                    container.html(mydata);
                    start();
                }
            })
        } else {
            start();
        }
    } else {
        open();
    }

    function start() {
    	Settings.start_fn_before();

    	if (Settings.modal) {
            addMaskLayer();
        }

        container.show();

        container.on('click', '.close', function() {
            container.trigger('dialog-close');
        });
    }

    //添加遮罩层
    function addMaskLayer() {
    	document.body.className += ' mask';
        var maskLayer = document.getElementById('mx_mask_layer');
    	maskLayer.style.display = 'block';

        if(!Settings.close_btn) {
            maskLayer.addEventListener('click', removeMaskLayer);
        }
    }

    function removeMaskLayer() {
        var maskLayer = document.getElementById('mx_mask_layer');
        if(maskLayer.style.display === 'none') return;
        maskLayer.style.display = 'none';
        document.body.className = document.body.className.replace(/\s*mask\s*/, '');
        maskLayer.removeEventListener('click', removeMaskLayer);
        container.hide();
    }

    // 关闭弹框
    function dialogClose() {
        Settings.close_fn_before();
        container.hide();
        removeMaskLayer();
        container.data("bool", false);
        Settings.close_fn_later();
    }

    // 自定义弹框关闭
    container.on('dialog-close', dialogClose);

    return container;
}
