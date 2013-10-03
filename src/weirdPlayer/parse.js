;window.weirdPlayer = window.weirdPlayer || {};
window.weirdPlayer.parse = (function (window) {
    "use strict";
    var exports = {};

    function nodeListToArray(nl) {
        var arr = [];
        for (var n of nl) arr.push(n);
        return arr;
    }

    function htmlContent(jsonResponse) { // WpJsonResponse -> HTMLDivElement
        var htmlStr = jsonResponse.posts[0].content,
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

    return exports;
})(window);
