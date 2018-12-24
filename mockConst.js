
var window = {};
function mockConst (data, value) {
    window[data] = value;
    Object.defineProperty(window, data, {
        enumerable: false,
        configurable: false,
        set: function (val) {
            if (val == value) {
                return val;
            }
            throw new TypeError("connot be changed");
        },
        get: function () {
            return value;
        }
    });
}


mockConst("person", "dfsfs");
// throw new error
window.person = "fqwe";
