;window.weirdPlayer.loader = (function (window) {
    var exports = {},
        doNothing = window.weirdPlayer.util.doNothing,
        parse     = window.weirdPlayer.parse.parse;

    function wpApiParamStr(params) {
        var pStr = "?json=1";
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

    function createLoader(apiUrl) {
        var l = {};

        apiUrl = apiUrl || "/api";

        function loadSongs(callback) {
            var params = {
                "count": "1",
                "page": "3"  // This should be random...
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
            var fakeResponse = fixtureData[idx];
            idx = (idx + 1) % fixtureData.length;
            window.setTimeout(callback.bind(undefined, fakeResponse), 0);
        }
        l.loadSongs = loadSongs;

        return l;
    }

    return exports;
})(window);
