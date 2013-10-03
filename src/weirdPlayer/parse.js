;window.weirdPlayer = window.weirdPlayer || {};
window.weirdPlayer.parse = (function (window) {
    "use strict";
    var exports = {},
        RegExp  = window.RegExp,
        util    = window.weirdPlayer.util,
        defined = util.defined;

    function singlePost(jsonResponse) {
        return jsonResponse.posts[0];
    }
    exports.singlePost = singlePost;

    function nodeListToArray(nl) { // NodeList -> Array
        var arr = [];
        for (var n of nl) arr.push(n);
        return arr;
    }

    function htmlContent(post) { // WpJsonResponse -> HTMLDivElement
        var htmlStr = post.content,
            div     = document.createElement("div");
        div.innerHTML = htmlStr;
        return div;
    }
    exports.htmlContent = htmlContent;

    function parseAudioNodes(html) { // HTMLElement -> [[AudioSourceNode]]
        var audioNodes  = nodeListToArray(html.querySelectorAll("audio")),
            sourceLists = audioNodes
                .map(function (aNode) {
                    return nodeListToArray(aNode.querySelectorAll("source"));
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
        return nodeListToArray(html.querySelectorAll("p.audioTrack a"))
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

    return exports;
})(window);
