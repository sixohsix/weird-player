;window.weirdPlayer.parse = (function (window) {
    "use strict";
    var exports = {},
        RegExp  = window.RegExp,
        util    = window.weirdPlayer.util,
        defined = util.defined,
        query   = util.query,
        empty   = util.empty,
        log     = util.log,
        attr    = util.attr,
        zip     = util.zip;

    function parseFail(msg, failV) {
        log("parseFail: " + msg);
        return failV;
    }

    function singlePost(jsonResponse) {
        return jsonResponse.posts[0];
    }
    exports.singlePost = singlePost;

    function htmlContent(post) { // WpJsonResponse -> HTMLDivElement
        var htmlStr = post.content,
            doc     = document.implementation.createHTMLDocument("jail"),
            div     = doc.createElement("div");
        div.innerHTML = htmlStr;
        return div;
    }
    exports.htmlContent = htmlContent;

    function parseAudioNodes(html) { // HTMLElement -> [[AudioSourceNode]]
        var audioNodes  = query(html, "audio"),
            sourceLists = audioNodes
                .map(function (aNode) {
                    return query(aNode, "source");
                })
                .filter(function (arr) {
                    return arr.length > 0;
                });
        if (empty(sourceLists))
            sourceLists = parseMp3Links(html);
        return sourceLists;
    }
    exports.parseAudioNodes = parseAudioNodes;

    var mp3LinkRe = new RegExp("^http://weirdcanada.com/wp-content/uploads/.+.mp3$"),
        songLinkRe = new RegExp("^.*– (.+)$");  // Note the special dash!

    var titleRe  = new RegExp(
        "^(?:New Canadiana|Review) :: (.+) &#8211; (.+)$");

    function parseArtistData(post) { // WpPost -> {artist, release}|undefined
        if (! defined(post.title))
            return parseFail("missing post title");

        var title = post.title,
            match = titleRe.exec(title);
        if (match === null)
            return parseFail("title match failed: " + post.title);

        return {artist: match[1], release: match[2]};
    };
    exports.parseArtistData = parseArtistData;

    function parseMp3Links(html) {
        return query(html, "a")
            .filter(function (a) { return mp3LinkRe.exec(a.href); })
            .map(function (a) {
                var match = songLinkRe.exec(a.innerHTML);
                return defined(match) ? [a.href, match[1]] : undefined;
            })
            .filter(defined)
            .map(function (x) {
                var source = document.createElement("source");
                source.src = x[0];
                source.type = 'audio/mpeg; codecs="mp3"';
                return {sources: [source], title: x[1]};
            });
    }
    exports.parseMp3Links = parseMp3Links;

    function parseSongData(html) {
        var sources = parseAudioNodes(html),
            titles = parseSongTitleLinks(html);

        if (! empty(sources)
            && (sources.length === titles.length))
            return zip(sources, titles).map(function (x) {
                return {sources: x[0], title: x[1]};
            });

        var ret = parseMp3Links(html);
        if (! empty(ret))
            return ret;

        return parseFail("no audio source nodes or mp3 links found", []);
    }

    function parseSongTitleLinks(html) {
        return query(html, "p.audioTrack a")
            .map(function (a) {
                var text  = a.innerHTML,
                    match = songLinkRe.exec(text);
                if (match === null) return undefined;
                return match[1];
            }).filter(defined);
    }
    exports.parseSongTitleLinks = parseSongTitleLinks;

    function parseImage(html) {
        var img = html.querySelector("img"),
            newImg = document.createElement("img");
        if (img !== null) {
            newImg.src = img.src;
        }
        return newImg;
    }
    exports.parseImage = parseImage;

    function parsePostUrl(post) {
        return post.url;
    }
    exports.parsePostUrl = parsePostUrl;

    function storeBadResponse(jsonResponse) {
        query(document, "#badResponses").forEach(function (n) {
            var baddies = n.baddies = attr(n, "baddies", []);
            baddies.push(jsonResponse);
        });
    }

    function parse(jsonResponse) { // WpJsonResponse -> [{artist, release, image, sources, title, postUrl}]
        var post = singlePost(jsonResponse);
        if (! defined(post)) return [];

        var html = htmlContent(post),
            artistData = parseArtistData(post),
            songData = parseSongData(html),
            imgNode = parseImage(html),
            url = parsePostUrl(post);

        if (! (defined(artistData)
               && (! empty(songData))
               && defined(imgNode))) {
            if (util.debug) storeBadResponse(jsonResponse);
            return [];
        }

        return songData.map(function (sd) {
            return {
                artist: artistData.artist,
                release: artistData.release,
                image: imgNode,
                sources: sd.sources,
                title: sd.title,
                postUrl: url};
        });
    }
    exports.parse = parse;

    return exports;
})(window);
