;window.weirdPlayer.translate = (function (window) {
    var exports = {},

        util  = window.weirdPlayer.util,
        query = util.query,
        attr  = util.attr;

    var translations = {
        fr: {"Now playing:": "Joue maintenant:"},
        de: {"Now playing:": "Jetzt spielt:"}
    };

    function translate(translations, rootNode, targetLang) {
        var trans = attr(translations, targetLang, {});
        query(rootNode, ".tr").forEach(function (node) {
            var origHTML
                    = node.tr_origHTML
                    = attr(node, "tr_origHTML", node.innerHTML);
            node.innerHTML = attr(trans, origHTML, origHTML);
        });
    }
    exports.translate = translate;

    return exports;
})(window);
