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

    test("parse html from a html", function () {
        var html = parse.htmlContent(post);
        ok(defined(html), "html defined");
    });

    test("parse audio nodes from html", function () {
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
        eq(songTitles[0], "Au Parc Jarry");
        eq(songTitles[1], "Combustible");
    });

    test("parse release image from html", function () {
        var imageNode = parse.parseImage(html);
        ok(defined(imageNode), "image node came out");
        eq(imageNode.src, "http://weirdcanada.com/wp-content/uploads/2013/09/Nouveau_Zodiaque-web-300x300.jpg");
    });

    test("parse link to post", function () {
        var url = parse.parsePostUrl(post);
        ok(defined(url), "got the url");
    });

    test("parse songs from a complete json response", function () {
        var songs = parse.parse(fixture.aJsonResponse);
        eq(songs.length, 2, "got two songs");
        eq(songs[0].artist, "Nouveau Zodiaque", "got artist");
        eq(songs[1].release, "Nouveau Zodiaque EP", "got release");
        eq(songs[0].sources.length, 2, "got audio sources");
        ok(defined(songs[1].image), "got an image");
        eq(songs[0].title, "Au Parc Jarry", "got song title");
    });

})(window);
