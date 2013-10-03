;window.weirdPlayer = window.weirdPlayer || {};
window.weirdPlayer.util = (function (window) {
    var exports     = {},
        actuallyLog = window.console.log.bind(window.console);

    exports.debug = false; // true;

    function log(msg) {
        if (exports.debug) actuallyLog(msg);
    }
    exports.log = log;

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
        return defined(o) && defined(o[an]) ? o[an] : d;
    }
    exports.attr = attr;

    function nodeListToArray(nl) { // NodeList -> Array
        var arr = [];
        for (var i = 0; i < nl.length; i++) arr.push(nl[i]);
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

    function choose(arr) {
        return arr[(Math.random() * arr.length)|0];
    }
    exports.choose = choose;

    return exports;
})(window);
