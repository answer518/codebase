class Language {
    constructor() {
        document.title = this.getLang('DocumentTitle')
    }

    getLang(key) {
        return chrome.i18n.getMessage(key);
    }
}

let language = new Language()
