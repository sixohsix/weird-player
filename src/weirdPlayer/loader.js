;window.weirdPlayer.loader = (function (window) {
    var exports = {},
        util      = window.weirdPlayer.util,
        doNothing = util.doNothing,
        attr      = util.attr,

        parse     = window.weirdPlayer.parse.parse;

    function wpApiParamStr(params) {
        var pStr = "?json=get_recent_posts";
        for (var key in params) {
            // yup, this seems safe...
            pStr += "&" + key + "=" + params[key];
        }
        return pStr;
    }

    function loadAjax(apiUrl, params, okCallback, errCallback) {
        var pStr = wpApiParamStr(params),
            req = new window.XMLHttpRequest();
        errCallback = errCallback || doNothing;
        req.onload  = okCallback .bind(undefined, req);
        req.onerror = errCallback.bind(undefined, req);
        req.open("GET", apiUrl + pStr);
        req.send();
    }

    function getJson(req) {
        var jsonData;
        if (req.responseType !== "json") {
            jsonData = window.JSON.parse(req.responseText);
        } else {
            jsonData = req.response;
        }
        return jsonData;
    }

    function createLoader(options) {
        var l = {};

        var apiUrl = attr(options, "apiUrl", "/category/content/newcanadiana/"),
            pages  = attr(options, "pages", 905);

        function loadSongs(callback) {
            var page = (Math.random() * pages)|0,
                params = {
                    count: "1",
                    page:  "" + page
                };
            function okCallback(req) {
                callback(parse(getJson(req)));
            }
            function failCallback(req) {
                callback([]);
            }
            loadAjax(apiUrl, params, okCallback, failCallback);
        }
        l.loadSongs = loadSongs;

        return l;
    }
    exports.createLoader = createLoader;

    function createTestLoader(fixtureData) {
        var l = {},
            idx = 0;

        function loadSongs(callback) {
            var songs = parse(fixtureData[idx]);
            idx = (idx + 1) % fixtureData.length;
            window.setTimeout(callback.bind(undefined, songs), 0);
        }
        l.loadSongs = loadSongs;

        return l;
    }
    exports.createTestLoader = createTestLoader;

    return exports;
})(window);
