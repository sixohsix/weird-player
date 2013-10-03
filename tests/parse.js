;(function (window) {
    var test = window.QUnit.test,
        ok   = window.QUnit.ok,
        eq   = window.QUnit.strictEqual,

        util    = window.weirdPlayer.util,
        defined = util.defined,

        parse      = window.weirdPlayer.parse,
        singlePost = parse.singlePost,

        fixture = window.tests.fixture,

        post    = singlePost(fixture.aJsonResponse);

    window.QUnit.module("parse");

    test("The test system is running", function () {
        ok(true, "yup, it works.");
        ok(fixture !== undefined, "I can see the fixture");
    });

    test("parse html from a json response", function () {
        var html = parse.htmlContent(post);
        ok(defined(html), "html defined");
    });

    test("parse audio nodes from json response", function () {
        var el          = parse.htmlContent(post),
            sourceLists = parse.parseAudioNodes(el);
        eq(sourceLists.length, 2, "two nodes were parsed");
        eq(sourceLists[1][1].src, "http://weirdcanada.com/binary/Weird_Canada-Nouveau_Zodiaque-Combustible.mp3",
           "got the right src");
    });


    test("parse artist and release from post title", function () {
        var postData = parse.parseArtistData(post);
        ok(defined(postData), "postData came out");
        eq(postData.artist, "Nouveau Zodiaque");
        eq(postData.release, "Nouveau Zodiaque EP");
    });

})(window);
