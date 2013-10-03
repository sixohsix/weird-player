;(function (window) {
    var test = window.QUnit.test,
        ok   = window.QUnit.ok,
        eq   = window.QUnit.strictEqual,

        util    = window.weirdPlayer.util,
        defined = util.defined,
        fixture = window.tests.fixture,

        parse      = window.weirdPlayer.parse,

        post = parse.singlePost(fixture.aJsonResponse),
        html = parse.htmlContent(post);

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
        var sourceLists = parse.parseAudioNodes(html);
        eq(sourceLists.length, 2, "two nodes were parsed");
        eq(sourceLists[1][1].src, "http://weirdcanada.com/binary/Weird_Canada-Nouveau_Zodiaque-Combustible.mp3",
           "got the right src");
    });


    test("parse artist and release from post title", function () {
        var postData = parse.parseArtistData(post);
        ok(defined(postData), "postData came out");
        eq(postData.artist, "Nouveau Zodiaque");
        eq(postData.release, "Nouveau Zodiaque EP");

        ok(! defined(parse.parseArtistData({})), "undef on bad data");
    });

    test("parse song names from audio track links", function () {
        var songTitles = parse.parseSongTitleLinks(html);
        eq(songTitles.length, 2, "found two songs");
    });

})(window);
