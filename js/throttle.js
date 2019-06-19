/**
 * 防抖／节流方法
 * @param {Function} fn 目标执行方法
 * @param {Number} delay 延迟事件
 * @param {Context} context 执行上下文
 * @param {Boolean} isDebounce 防抖／节流
 * @returns {Function}
 */
function throttle (fn, delay, context, isDebounce) {
    let timer;
    let lastCall = 0;
    return function (...args) {
        if (isDebounce) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                _magic();
            }, delay);
        } else {
            const _nowTime = Date.now();
            if (_nowTime - lastCall > delay) {
                _magic();
            }
        }

        function _magic () {
            timer = null;
            lastCall = Date.now();
            fn.apply(context, args);
        }
    };
}
