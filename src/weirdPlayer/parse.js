;window.weirdPlayer = window.weirdPlayer || {};
window.weirdPlayer.parse = (function (window) {
    "use strict";
    var exports = {},
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

    function parseAudioNodes(contentNode) { // HTMLElement -> [[AudioSourceNode]]
        var audioNodes  = nodeListToArray(contentNode.querySelectorAll("audio")),
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

    var titleRe = new window.RegExp("^New Canadiana :: (.+) &#8211; (.+)$");

    function parseArtistData(post) { // WpPost -> {artist, release}|undefined
        if (! defined(post.title)) return undefined;

        var title = post.title,
            match = titleRe.exec(title);

        if (match === null) return undefined;

        return {artist: match[1], release: match[2]};
    };
    exports.parseArtistData = parseArtistData;

    return exports;
})(window);
