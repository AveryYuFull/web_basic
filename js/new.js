/**
 * new方法
 * @param {Function} constructor 构造方法
 * @returns {Object} 
 */
function myNew (constructor) {
    let _res = {};
    if (constructor.prototype !== null) {
        _res.__proto__ = constructor.prototype;
    }
    let _tmp = constructor.apply(_res, Array.prototype.slice.call(arguments, 1));
    if (_tmp != null && (typeof _tmp === 'object' || typeof _tmp === 'function')) {
        _res = _tmp;
    }

    return _res;
}

function Person (name, age) {
    this.name = name;
    this.age = age;
}
Person.prototype.sayName = function () {
    console.log('name-->', this.name);
}

let _person = myNew(Person, 'avery', 21);
