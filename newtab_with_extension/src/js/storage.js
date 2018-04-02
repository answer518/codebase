class Storage {
    constructor(data) {
        Object.assign(this, data);
        this.onChange();
    }

    get() {
        let _this = this,
            key = _this.key;

        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(['reco_sites'], (result) => {
                let data = result[key];
                console.log(data)
                if (Object.keys(data).length === 0) {
                    data = default_data[navigator.language.toLocaleLowerCase()];
                    _this.set(data);
                }

                _this.result = data;
                resolve(data)
            })
        });
    }

    del(index, callback) {
        let _this = this
        _this.result.splice(index, 1);
        _this.set(_this.result).then((value) => {
            callback && callback(value)
        });
    }

    add(index, item, callback) {
        let _this = this
        _this.result.push(item);
        _this.set(_this.result).then((value) => {
            callback && callback(value)
        });
    }

    set(value) {
        let _this = this,
            key = _this.key;
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({'reco_sites': value}, () => {
                resolve(value)
            })
        });
    }

    onChange() {
        chrome.storage.onChanged.addListener(function callback(){
            console.log(arguments)
        }) 
    }
}