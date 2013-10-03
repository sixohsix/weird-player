;window.weirdPlayer.parse = (function (window) {
    "use strict";
    var exports = {},
        RegExp  = window.RegExp,
        util    = window.weirdPlayer.util,
        defined = util.defined,
        query   = util.query;

    function singlePost(jsonResponse) {
        return jsonResponse.posts[0];
    }
    exports.singlePost = singlePost;

    function htmlContent(post) { // WpJsonResponse -> HTMLDivElement
        var htmlStr = post.content,
            div     = document.createElement("div");
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
        return sourceLists;
    }
    exports.parseAudioNodes = parseAudioNodes;

    var titleRe = new RegExp("^New Canadiana :: (.+) &#8211; (.+)$");

    function parseArtistData(post) { // WpPost -> {artist, release}|undefined
        if (! defined(post.title)) return undefined;

        var title = post.title,
            match = titleRe.exec(title);

        if (match === null) return undefined;

        return {artist: match[1], release: match[2]};
    };
    exports.parseArtistData = parseArtistData;

    var songLinkRe = new RegExp("^.*– (.+)$");  // Note the special dash!

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
        var img = html.querySelector("img");
        if (img === null) return undefined;
        return img;
    }
    exports.parseImage = parseImage;

    function parsePostUrl(post) {
        return post.url;
    }
    exports.parsePostUrl = parsePostUrl;

    function parse(jsonResponse) { // WpJsonResponse -> [{artist, release, image, sources, title, postUrl}]
        var post = singlePost(jsonResponse),
            html = htmlContent(post),
            artistData = parseArtistData(post),
            sourceLists = parseAudioNodes(html),
            songTitles = parseSongTitleLinks(html),
            imgNode = parseImage(html),
            url = parsePostUrl(post);

        if (! (defined(artistData)
               && defined(sourceLists)
               && defined(songTitles)
               && defined(imgNode)
               && sourceLists.length === songTitles.length))
            return [];

        var songs = [];
        for (var i = 0; i < songTitles.length; i++)
            songs.push({
                artist: artistData.artist,
                release: artistData.release,
                image: imgNode,
                sources: sourceLists[i],
                title: songTitles[i],
                postUrl: url});
        return songs;
    }
    exports.parse = parse;

    return exports;
})(window);
