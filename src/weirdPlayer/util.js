;window.weirdPlayer = window.weirdPlayer || {};
window.weirdPlayer.util = (function (window) {
    var exports = {};

    function defined(v) {
        return v !== undefined;
    }
    exports.defined = defined;

    function coerce(v, d) {
        return defined(v) ?  v : d;
    }
    exports.coerce = coerce;

    function maybe(m, f, d) {
        return defined(m) ? f(m) : d;
    }
    exports.maybe = maybe;

    function attr(o, an, d) {
        return defined(o) ? o[an] : d;
    }
    exports.attr = attr;

    function nodeListToArray(nl) { // NodeList -> Array
        var arr = [];
        for (var n of nl) arr.push(n);
        return arr;
    }

    function query(node, selector) {
        return nodeListToArray(node.querySelectorAll(selector));
    }
    exports.query = query;

    function empty(arr) {
        return arr.length === 0;
    }
    exports.empty = empty;

    function append(arr0, arr1) {
        arr1.forEach(function (el) { arr0.push(el); });
    }
    exports.append = append;

    return exports;
})(window);