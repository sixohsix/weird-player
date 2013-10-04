;(function (window) {
    var test = window.QUnit.test,
        eq   = window.QUnit.strictEqual,
        ok   = window.QUnit.ok,

        util  = window.weirdPlayer.util,
        query = util.query,

        translate = window.weirdPlayer.translate.translate,
        createTranslator = window.weirdPlayer.translate.createTranslator;


    window.QUnit.module("translate");

    test("translate some text", function () {
        var node = window.document.createElement("div"),
            translations = {
                'pi': {"translated if in tr": "totally translated"}};
        node.innerHTML = "<div class='tr'>translated if in tr</div><div>translated if in tr</div>";

        translate(translations, node, "pi");

        eq(query(node, "div")[0].innerHTML, "totally translated");
        eq(query(node, "div")[0].tr_origHTML, "translated if in tr");
        eq(query(node, "div")[1].innerHTML, "translated if in tr");
    });

    test("translator object", function () {
        var node = window.document.createElement("div"),
            translations = {
                'pi': {"translated if in tr": "totally translated"}};
        node.innerHTML = "<div class='tr'>translated if in tr</div><div>translated if in tr</div>";
        var t = createTranslator(translations, node);
        t.setLang("pi");
        eq(query(node, "div")[0].innerHTML, "totally translated");
        t.setLang("en");
        eq(query(node, "div")[0].innerHTML, "translated if in tr");
        t.setLang("qq");
        eq(query(node, "div")[0].innerHTML, "translated if in tr");
    });

})(window);
