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
            title: language.getLang("AddSite"),
            okText: language.getLang("Confirm"),
            cancelText: language.getLang("Cancel"),
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
                        <label id="paper-input-label-1" htmlfor="title">${language.getLang("Title")}</label>
                        <input type="input" name="title" id="title"/>
                        <span class="paper-input-error"></span>
                    </div>
                    <div class="underline">
                        <div class="unfocused-line"></div>
                        <div class="focused-line"></div>
                    </div>
                </div>
                <div class="modal-input">
                    <div class="input-content">
                        <label id="paper-input-label-2" htmlfor="url">${language.getLang("Url")}</label>
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
                <button class="cancel-btn">${opt.cancelText}</button>
                <button class="ok-btn">${opt.okText}</button>
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
                let title = modal.querySelector('#title').value.replace(/\s/, ''),
                    url = modal.querySelector('#url').value.replace(/\s/, '');

                if (url.length === 0) {
                    let next = inputs[1].nextSibling;
                    next = next.nextSibling;
                    next.innerHTML = language.getLang("EnterUrl");
                    let parent = inputs[1].parentNode;
                    parent.classList.add(CLASSES.IS_INVALID);
                    parent = parent.parentNode;
                    let underline = parent.querySelector('.' + CLASSES.UNDERLINE);
                    underline.classList.add(CLASSES.IS_INVALID);
                    return;
                }

                if (title.length > 10) {
                    let next = inputs[0].nextSibling;
                    next = next.nextSibling;
                    next.innerHTML = language.getLang("TitleTooLong");
                    
                    let parent = inputs[0].parentNode;
                    parent.classList.add(CLASSES.IS_INVALID);
                    parent = parent.parentNode;
                    let underline = parent.querySelector('.' + CLASSES.UNDERLINE);
                    underline.classList.add(CLASSES.IS_INVALID);
                    return;
                }

                if (title.length === 0) {
                    title = url;
                }

                if (url.indexOf('http://') !== 0) {
                    url = 'http://' + url;
                }
                
                _this.onSuccess && _this.onSuccess({
                    url: url,
                    title: title
                })

                _this.close();
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
