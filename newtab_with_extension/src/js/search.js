
class Search {
    constructor() {
        let opts = {}
        Object.assign(this, opts)
    }

    init() {

        this.registerKeyHandler($(IDS.SEARCH_FORM), KEYCODE.ENTER, this.onSubmit.bind(this))

        $(IDS.FAKEBOX_INPUT).on('focus', this.onInputStart.bind(this))
        $(IDS.FAKEBOX_INPUT).on('input', this.generateSearchUrl.bind(this))
        $(IDS.FAKEBOX_INPUT).on('blur', this.onInputCancel.bind(this))

        this.setFakeBoxText()
        this.generateSearchUrl()
        this.onDefaultChanged()
    }

    generateSearchUrl() {
        // clear time
        if (this.inputTimer) {
            clearTimeout(this.inputTimer)
        }
        this.inputTimer = setTimeout(function () {
            let searchForm = $(IDS.SEARCH_FORM),
                key = $(IDS.FAKEBOX_INPUT).value;
            chrome.livesone.searchEngine.generateSearchUrl(key, (suc, url) => {
                if (suc === true) {
                    searchForm.action = url
                }
            })
        }, 300);
    }

    onInputStart() {
        if (!this.isFakeboxFocused()) {
            this.setFakeboxFocus(false);
        }
    }

    onInputCancel(e) {
        if (this.isFakeboxFocused()) {
            this.setFakeboxFocus(true);
            this.setFakeBoxText()
        }
    }

    setFakeBoxText() {
        let inputText = $(IDS.FAKEBOX_INPUT).value.replace(/\s+/, '');
        if(inputText.length === 0) {
            inputText = language.getLang('searchText')
        }
        $(IDS.FAKEBOX_TEXT).textContent = inputText
    }

    onDefaultChanged() {
        let _this = this;
        chrome.livesone.searchEngine.onDefaultChanged.addListener(() => {
            _this.generateSearchUrl()
        });
    }

    registerKeyHandler(element, keycode, handler) {
        element.addEventListener('keydown', function (event) {
            if (event.keyCode == keycode)
                handler(event);
        });
    }

    onSubmit(element) {
        $(IDS.SEARCH_FORM).submit();
    }

    /**
     * @param {boolean} focus True to focus the fakebox.
     */
    setFakeboxFocus(focus) {
        document.body.toggleClass(CLASSES.FAKEBOX_FOCUS, focus);
    }


    /**
     * @return {boolean} True if the fakebox has focus.
     */
    isFakeboxFocused() {
        return document.body.hasClass(CLASSES.FAKEBOX_FOCUS);
    }
}

let search = new Search()
search.init()