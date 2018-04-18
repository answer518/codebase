
class Modal {
    constructor(option) {
        let opt = {
            title: language.getLang("AddSite"),
            okText: language.getLang("Confirm"),
            cancelText: language.getLang("Cancel"),
            onSuccess: function() {}
        }
        this.modal = null
        this.opt = Object.assign(opt, option)
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
            modal = this.modal,
            modal_close = modal.querySelector('.modal-close'),
            ok_btn = modal.querySelector('.ok-btn'),
            cancel_btn = modal.querySelector('.cancel-btn')

        modal.on('click', this.onClose.bind(this), false);
        modal_close.on('click', this.onHide.bind(this), false);
        cancel_btn.on('click', this.onHide.bind(this), false);
        ok_btn.on('click', this.onOk.bind(this), false);

        let inputs = modal.querySelectorAll('input');
        inputs.forEach((node, i) => {
            node.addEventListener('focus', function () {
                let parent = this.parentNode;
                parent = parent.parentNode;
                let underline = parent.querySelector('.' + CLASSES.UNDERLINE);
                underline.classList.add(CLASSES.IS_HIGHLIGHTED);
            }, false);

            node.addEventListener('blur', function () {
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
        });

        this.registerKeyHandler(KEYCODE.ENTER, this.onOk.bind(this));
        this.registerKeyHandler(KEYCODE.ESC, this.onHide.bind(this));
    }

    show() {
        this.modal.style = 'display:block';
    }

    onOk(event) {
        event.stopPropagation()
        let inputs = this.modal.querySelectorAll('input'),
            title = this.modal.querySelector('#title').value.replace(/\s/, ''),
            url = this.modal.querySelector('#url').value.replace(/\s/, '');

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

        this.onSuccess && this.onSuccess({
            url: url,
            title: title
        })

        this.onHide();
    }

    onClose(event) {
        event.stopPropagation();
        let target = event.target

        if(target !== this.modal) return;
        this.onHide()
    }

    onHide() {
        // this.modal.addClass('move-out')
        // this.modal.on('animationend', e => {
        // document.body.removeChild(this.modal)
        // }, false)
        this.modal.style = '';
    }

    registerKeyHandler(keycode, handler) {
        document.addEventListener('keydown', function (event) {
            // console.log(event.keyCode)
            if (event.keyCode == keycode)
                handler(event);
        });
    }
}

let dialog = new Modal();