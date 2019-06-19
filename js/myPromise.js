function MyPromise (constructor)  {
    const _that = this;
    _that.status = 'pending';
    _that.value = undefined;
    _that.reason = undefined;
    _that.fulfilledCbs = [];
    _that.rejectedCbs = [];

    function resolve (value) {
        if (_that.status === 'pending') {
            _that.value = value;
            _that.status = 'fulfilled';
            _that.fulfilledCbs.forEach((cb) => {
                cb(_that.value) ;
            });
        }
    }

    function reject(reason) {
        if (_that.status === 'pending') {
            _that.reason = reason;
            _that.status = 'rejected';
            _that.rejectedCbs.forEach((cb) => {
                cb(_that.reason);
            });
        }
    }

    try {
        constructor(resolve, reject);
    } catch (err) {
        reject(err);
    }
}

function resolvePromise(promise, x, resolve, reject) {
    if (x === promise) {
        throw new TypeError('promise loop');
    }
    let isUsed;
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            const _then = x.then;
            if (typeof _then === 'function') {
                _then.call(x, function (y) {
                    if (isUsed) {
                        return;
                    }
                    isUsed = true;
                    resolvePromise(promise, y, resolve, reject);
                }, (err) => {
                    if (isUsed) return;
                    isUsed = true;
                    reject(err);
                });
            } else {
                resolve(x);
            }
        } catch (err) {
            if (isUsed) return;
            isUsed = true;
            reject(err);
        }
    } else {
        resolve(x);
    }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
    const _that = this;
    let _promise;
    switch (_that.status) {
        case 'pending':
            _promise = new MyPromise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        _that.fulfilledCbs.push((value) => {
                            let tmp = onFulfilled(value);
                            resolvePromise(_promise, tmp, resolve, reject);
                        });
                        _that.rejectedCbs.forEach((reason) => {
                            let tmp = onRejected(reason);
                            resolvePromise(_promise, tmp, resolve, reject);
                        });
                    } catch (err) {
                        reject(err);
                    }
                });
            });
            break;
        case 'fulfilled':
            _promise = new MyPromise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        let tmp = onFulfilled(_that.value);
                        resolvePromise(_promise, tmp, resolve, reject);
                    } catch (err) {
                        reject(err);
                    }
                });
            });
            break;
        case 'rejected':
            _promise = new MyPromise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        let tmp = onRejected(_that.reason);
                        resolvePromise(_promise, tmp, resolve, reject);
                    } catch (err) {
                        reject(err);
                    }
                });
            });
            break;
    }
    return _promise;
}