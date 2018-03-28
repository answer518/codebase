let merge = function(target) {
    for (var i = 1, j = arguments.length; i < j; i++) {
        var source = arguments[i];
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                var value = source[prop];
                if (value !== undefined) {
                    target[prop] = value;
                }
            }
        }
    }
    return target;
};

class Modal {
    constructor(option) {
        let opt = {
            type: 0,
            title: '添加站点',
            okText: '确认',
            cancelText: '取消',
            time: 0
        }
        this.modal = null
        this.opt = merge(opt, option)
        this.init(opt)
    }

    init(opt) {
        let modal = this.modal = document.createElement('div')
        let that = this
        modal.className = 'modal-container'

        let inner = `<div class="modal-body">
            <div class="modal-title"> ${opt.title} </div>
            <span class="modal-close"></span>
            <div class="modal-content">
                <div class="modal-input">
                    <div class="input-content">
                        <label id="paper-input-label-1" htmlfor="name">名称</label>
                        <input type="input" name="name" id="name"/>
                        <span class="paper-input-error"></span>
                    </div>
                    <div class="underline">
                        <div class="unfocused-line"></div>
                        <div class="focused-line"></div>
                    </div>
                </div>
                <div class="modal-input">
                    <div class="input-content">
                        <label id="paper-input-label-2" htmlfor="url">网址</label>
                        <input type="input" name="url" id="url"/>
                        <span class="paper-input-error"></span>
                    </div>
                    <div class="underline">
                        <div class="unfocused-line"></div>
                        <div class="focused-line"></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn">取消</button>
                <button class="ok-btn">确定</button>
            </div> 
        </div>`
        modal.innerHTML = inner
        document.body.appendChild(modal)

        this.bindEvent();
    }

    bindEvent() {
        let _this = this,
            modal = _this.modal,
            modal_close = modal.querySelector('.modal-close'),
            ok_btn = modal.querySelector('.ok-btn'),
            cancel_btn = modal.querySelector('.cancel-btn');

        modal.on('click', e => {
            let target = e.target

            if (target === ok_btn) {
                let name = modal.querySelector('#name').value.replace(/\s/, ''),
                    url = modal.querySelector('#url').value.replace(/\s/, '');

                if (url.length === 0) {
                    let next = inputs[1].nextSibling;
                    next = next.nextSibling;
                    next.innerHTML = '请输入网址';
                    let parent = inputs[1].parentNode;
                    parent.classList.add(CLASSES.IS_INVALID);
                    parent = parent.parentNode;
                    let underline = parent.querySelector('.' + CLASSES.UNDERLINE);
                    underline.classList.add(CLASSES.IS_INVALID);
                    return;
                }

                if (name.length > 10) {
                    let next = inputs[0].nextSibling;
                    next = next.nextSibling;
                    next.innerHTML = '标题过长';
                    
                    let parent = inputs[0].parentNode;
                    parent.classList.add(CLASSES.IS_INVALID);
                    parent = parent.parentNode;
                    let underline = parent.querySelector('.' + CLASSES.UNDERLINE);
                    underline.classList.add(CLASSES.IS_INVALID);
                    return;
                }

                if (name.length === 0) {
                    name = url;
                }

                if (url.indexOf('http://') !== 0) {
                    url = 'http://' + url;
                }

                console.log({
                    url: url,
                    name: name
                })
            }

            if (target !== modal_close && target !== cancel_btn) 
                return;

            _this.close();
        }, false);

        let inputs = modal.querySelectorAll('input');
        inputs.forEach((node, i) => {

            node.addEventListener('focus', function() {
                let parent = this.parentNode;
                parent = parent.parentNode;
                let underline = parent.querySelector('.' + CLASSES.UNDERLINE);
                underline.classList.add(CLASSES.IS_HIGHLIGHTED);
            }, false);

            node.addEventListener('blur', function() {
                let next = this.nextSibling;
                next = next.nextSibling;
                next.innerHTML = '';// clear erro message

                let parent = this.parentNode;
                parent.classList.remove(CLASSES.IS_INVALID);
                parent = parent.parentNode;
                let underline = parent.querySelector('.' + CLASSES.UNDERLINE);
                underline.classList.remove(CLASSES.IS_HIGHLIGHTED);
                underline.classList.remove(CLASSES.IS_INVALID);
            }, false);
        })
    }

    close() {
        // this.modal.addClass('move-out')
        this.opt.destroy && this.opt.destroy()
            // this.modal.on('animationend', e => {
        document.body.removeChild(this.modal)
            // }, false)
    }
}
