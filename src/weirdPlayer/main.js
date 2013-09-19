;window.weirdPlayer = window.weirdPlayer || {};
(function (window) {
    "use strict";
    var exports = {};

    function wpApiParamStr(params) {
        var pStr = "?json=1";
        for (var key in params) {
            // yup, this seems safe...
            pStr += "&" + key + "=" + params[key];
        }
        return pStr;
    }

    function load(apiUrl, params, okCallback, errCallback) {
        var pStr = wpApiParamStr(params),
            req = new window.XMLHttpRequest();
        req.onload  = okCallback .bind(undefined, req);
        req.onerror = errCallback.bind(undefined, req);
        req.open("GET", apiUrl + pStr, true);
    }

    function setupPlayerNode(playerNode) {
        
    }

    function WeirdPlayer(playerNode, apiUrl) {
    }
    function setup(playerNode, apiUrl) {
        new WeirdPlayer(playerNode, apiUrl);
    }
    exports.setup = setup;

    window.weirdPlayer.main = exports;
})(window);
