// chrome.livesone.searchEngine.getDefault((suc, res) => {
//     if (suc === true) {
//     }
// })

class Search {
    constructor() {
        let opts = {}
        Object.assign(this, opts)
    }

    init() {

        this.registerKeyHandler($(IDS.SEARCH_FORM), KEYCODE.ENTER, this.submit.bind(this))

        $(IDS.FAKEBOX_INPUT).on('focus', this.onInputStart.bind(this))
        $(IDS.FAKEBOX_INPUT).on('input', this.generateSearchUrl.bind(this))
        document.body.on('click', this.onInputCancel.bind(this))

        $(IDS.FAKEBOX_TEXT).textContent = language.getLang('searchText')
        this.generateSearchUrl()
        this.onDefaultChanged()
    }

    generateSearchUrl() {
        let searchForm = $(IDS.SEARCH_FORM),
            key = $(IDS.FAKEBOX_INPUT).value;
        chrome.livesone.searchEngine.generateSearchUrl(key, (suc, url) => {
            if (suc === true) {
                searchForm.action = url
            }
        })
    }

    onInputStart() {
        if (!this.isFakeboxFocused()) {
            this.setFakeboxFocus(false);
        }
    }

    onInputCancel(e) {
        let target = e.target,
            inputbox = $(IDS.FAKEBOX_INPUT),
            inputsearch = $(IDS.FAKEBOX_SPCH)

        if (target === inputbox || target === inputsearch) return
        if (this.isFakeboxFocused()) {
            this.setFakeboxFocus(true);
        }
    }

    onDefaultChanged() {
        let _this = this;
        chrome.livesone.searchEngine.onDefaultChanged.addListener(() => {
            _this.generateSearchUrl()
        });
    }

    registerKeyHandler(element, keycode, handler) {
         element.addEventListener('keydown', function(event) {
             if (event.keyCode == keycode)
                 handler(event);
         });
     }

    submit(element) {
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