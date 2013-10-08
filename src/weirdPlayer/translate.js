;window.weirdPlayer.translate = (function (window) {
    var exports = {},

        util    = window.weirdPlayer.util,
        query   = util.query,
        attr    = util.attr,
        log     = util.log,
        defined = util.defined;

    var translations = {
        en: {},
        fr: {"Now playing:": "Joue maintenant:",
             "Play/Pause": "Commence/Pause",
             "Next song": "Prochaine chanson",
             "Visit Weird Canada": "Visitez Weird Canada",
             "from": "de",
             "Read the review": "Lisez la revue"},
        de: {"Now playing:": "Jetzt läuft:",
             "Play/Pause": "Abspielen/Pause",
             "Next song": "Nächstes Lied",
             "Visit Weird Canada": "Besuchen Sie Weird Canada",
             "from": "von",
             "Read the review": "Lesen Sie die Rezension"}
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
        query(rootNode, ".trt").forEach(function (node) {
            var origTitle
                    = node.tr_origTitle
                    = attr(node, "tr_origTitle", node.title);
            if (! defined(trans[origTitle]))
                log("missing " + targetLang + " translation for '"
                    + origTitle + "'");
            node.title = attr(trans, origTitle, origTitle);
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
