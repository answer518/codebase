function isFunction(fn) {
    return 'function' === typeof fn
}
var isArray = function (obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
}
function isPromise(obj) {
    return obj && isFunction(obj['then'])
}
Function.prototype.bind = function (context) {
    const _this = this
    return function () {
        _this.apply(context, arguments)
    }
}

function Promise(handle) {
    if (!(this instanceof Promise)) throw new Error('should be called with the new !')
    this.status = 'pending'
    this.value = undefined

    this.transition = function (status, value) {
        // 保证状态一旦发生变化后就不能再改变
        if (this.status !== 'pending') {
            return
        }

        this.status = status
        this.value = value

        // 取出异步队列任务并执行
        let fn, queues = this[this.status === 'fulfilled' ? '_resolves' : '_rejects']
        // 封装成异步
        setTimeout(() => {
            while (fn = queues.shift()) {
                fn(value)
            }
        })
    }
    this._resolves = []
    this.resolve = function (value) {
        this.transition('fulfilled', value)
    }
    this._rejects = []
    this.reject = function (err) {
        this.transition('rejected', err)
    }

    try {
        handle(this.resolve.bind(this), this.reject.bind(this))
    } catch (err) {
        console.log(err)
        this.catch(err)
    }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
    let status = this.status
    // then 链式调用，需要返回一个新的Promise实例
    return new Promise((resolve, reject) => {
        let success = (value) => {
            var ret = isFunction(onFulfilled) ? onFulfilled(value) : value;
            try {
                if (isPromise(ret)) {
                    ret.then(function (value) {
                        resolve(value)
                    }, function (err) {
                        reject(err)
                    })
                } else {
                    resolve(ret)
                }
            } catch (error) {
                reject(error)
            }
        }

        let failed = (err) => {
            err = (isFunction(onRejected) && onRejected(err)) || err
            reject(err)
        }
        switch (status) {
            case 'pending':
                this._resolves.push(success)
                this._rejects.push(failed)
                break
            case 'fulfilled':
                success(this.value)
                break
            case 'rejected':
                failed(this.value)
                break
        }
    })
}

Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)
}

Promise.prototype.finally = function () {}

Promise.all = function (promises) {
    if (!isArray(promises)) {
        throw new TypeError('You must pass an array to all.')
    }

    return new Promise(function(resolve, reject) {
        let result = []
        let allResolve = function(index, value) {
            result[index] = value
            if (index === promises.length - 1) {
                resolve(result)
            }
        }
        let nextResolve = function(index) {
            return function(value) {
                allResolve(index, value)
            }
        }
        let onReject = function(err) {
            reject(err)
        }

        promises.forEach(function(item, i) {
            item.then(nextResolve(i), onReject)
        })
    })
}

/**
 * 选取最快完成的Promise
 */
Promise.race = function (promises) {
    if (!isArray(promises)) {
        throw new TypeError('You must pass an array to all.');
    }

    return new Promise(function(resolve, reject) {
        let oneResolve = function(res) {
            resolve(res)
        }
        let oneReject = function(err) {
            reject(err)
        }
        for (const item of promises) {
            item.then(oneResolve, oneReject)
        }
    })
}