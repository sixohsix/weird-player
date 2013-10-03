;window.weirdPlayer = window.weirdPlayer || {};
window.weirdPlayer.parse = (function (window) {
    var exports = {};

    function parseAudioSources(jsonResponse) { // -> [[AudioSourceNode]]
        var htmlStr = jsonResponse.posts[0].content,
            div     = document.createElement("div");
        div.innerHTML = htmlStr;
        var url = div.querySelector("audio").src;
        return url;
    }

    return exports;
})(window);
