;window.weirdPlayer.translate = (function (window) {
    var exports = {},

        util    = window.weirdPlayer.util,
        query   = util.query,
        attr    = util.attr,
        log     = util.log,
        defined = util.defined;

    var translations = {
        fr: {"Now playing:": "Joue maintenant:",
             "Play": "Commence",
             "Stop": "Arret",
             "Next": "Prochaine"},
        de: {"Now playing:": "Jetzt spielt:",
             "Play": "Spiel",
             "Next": "Nexte",
             "Stop": "Halt"}
    };
    exports.translations = translations;

    function translate(translations, rootNode, targetLang) {
        var trans = attr(translations, targetLang, {});
        query(rootNode, ".tr").forEach(function (node) {
            var origHTML
                    = node.tr_origHTML
                    = attr(node, "tr_origHTML", node.innerHTML);
            if (! defined(trans[origHTML]))
                log("missing " + targetLang + " translation for '"
                    + origHTML + "'");
            node.innerHTML = attr(trans, origHTML, origHTML);
        });
    }
    exports.translate = translate;

    function createTranslator(translations, rootNode) {
        var t = {},
            currentLang = "en";

        function setLang(lang) {
            if (lang === currentLang) return;

            currentLang = lang;
            translate(translations, rootNode, lang);
        }
        t.setLang = setLang;

        return t;
    }
    exports.createTranslator = createTranslator;

    var langDashRe = new window.RegExp("(..)-..");

    function getBrowserLanguage() {
        var language = window.navigator.userLanguage
                || window.navigator.language,
            match = langDashRe.exec(language);
        if (match !== null)
            language = match[1];
        return language;
    }
    exports.getBrowserLanguage = getBrowserLanguage;

    return exports;
})(window);
