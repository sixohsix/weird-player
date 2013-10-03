;(function (window) {
    var test = window.QUnit.test,
        ok   = window.QUnit.ok,
        eq   = window.QUnit.strictEqual,

        util    = window.weirdPlayer.util,
        defined = util.defined,

        parse   = window.weirdPlayer.parse,

        fixture = window.tests.fixture;

    test("The test system is running", function () {
        ok(true, "yup, it works.");
        ok(fixture !== undefined, "I can see the fixture");
    });

    test("parse html from a json response", function () {
        var html = parse.htmlContent(fixture.aJsonResponse);
        ok(defined(html), "html defined");
    });

    test("parse audio nodes from json response", function () {
        var el          = parse.htmlContent(fixture.aJsonResponse),
            sourceLists = parse.parseAudioNodes(el);
        eq(sourceLists.length, 2, "two nodes were parsed");
        eq(sourceLists[1][1].src, "http://weirdcanada.com/binary/Weird_Canada-Nouveau_Zodiaque-Combustible.mp3",
           "got the right src");
    });

})(window);
