;window.weirdPlayer = window.weirdPlayer || {};
window.weirdPlayer.util = (function (window) {
    var exports = {};

    function defined(v) {
        return v !== undefined;
    }
    exports.defined = defined;

    function coerce(v, d) {
        if (defined(v)) return v;
        else return d;
    }
    exports.coerce = coerce;

    return exports;
})(window);