class Storage {
    constructor(data) {
        Object.assign(this, data);
        this.onChange();
    }

    getRecoSites() {
        let _this = this
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['reco_sites'], (result) => {
                let data = result['reco_sites'] || {};
                if(typeof data === 'string') {
                    data = JSON.parse(data);
                }
                
                if (data && Object.keys(data).length === 0) {
                    data = DEFAULT_DATA[navigator.language.toLocaleLowerCase()];
                    _this.set(data);
                }

                _this['reco_sites'] = data;
                resolve(data)
            })
        });
    }

    del(index, callback) {
        let _this = this
        _this['reco_sites'].splice(index, 1);
        _this.set(_this['reco_sites']);
    }

    add(index, item, callback) {
        let _this = this
        _this['reco_sites'].push(item);
        _this.set(_this['reco_sites']);
    }

    update(index, item, callback) {
        let _this = this
        _this['reco_sites'][index] = item
        _this.set(_this['reco_sites']);
    }

    set(value) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({'reco_sites': value}, () => {
                resolve(value)
            })
        });
    }

    getTopsites(key) {
        let _this = this;
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('top_sites', (result) => {
                _this['top_sites'] = result['top_sites'] || {};

                if(_this['top_sites'][key]) {
                    resolve(_this['top_sites'][key])
                } else {
                    reject()
                }
            })
        });
    }

    setTopsites(key, value) {
        let _this = this;
        return new Promise((resolve, reject) => {
            _this['top_sites'][key] = value
            chrome.storage.local.set({'top_sites': _this['top_sites']}, () => {
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