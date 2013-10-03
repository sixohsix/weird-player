;window.weirdPlayer = window.weirdPlayer || {};
(function (window) {
    "use strict";
    var exports = {},
        log     = window.console.log,

        parse   = window.weirdPlayer.parse.parse,

        actions = [],
        running = false;

    function pushAction(action) {
        actions.push(action);
    }

    function doActions(newActions) {
        newActions.reverse().forEach(pushAction);
        if (! running) doneAction();
    }

    function doneAction() {
        if (actions.length > 0) {
            running = true;
            var nextAction = actions.pop();
            nextAction();
        } else {
            running = false;
        }
    }

    function asAction(f) {
        return function () {
            f.apply(undefined, arguments);
            doneAction();
        };
    }

    function doNothing() {}

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
        errCallback = errCallback || doNothing;
        req.onload  = okCallback .bind(undefined, req);
        req.onerror = errCallback.bind(undefined, req);
        req.open("GET", apiUrl + pStr);
        req.send();
    }

    function loadRandomSong(weirdPlayer) {
        var params = {
            "count": "1",
            "page": "3"
        };
        function okCallback(req) {
            var jsonData;
            if (req.responseType !== "json") {
                jsonData = window.JSON.parse(req.responseText);
            } else {
                jsonData = req.response;
            }
            weirdPlayer.currentSong = parse(jsonData);
        }
        function failCallback(req) {
            log("The AJAX request failed, pal.");
        }
        load(
            weirdPlayer.apiUrl,
            params,
            asAction(okCallback),
            asAction(failCallback));
    }

    function setupAudioNode(weirdPlayer) {
        var audioNode = document.createElement("audio"),
            sourceNode = document.createElement("source");
        sourceNode.src = weirdPlayer.currentSong.url;
        audioNode.appendChild(sourceNode);
        weirdPlayer.playerNode.appendChild(audioNode);
        audioNode.play();
    }

    function play(weirdPlayer) {
        if (weirdPlayer.playing) return false;

        doActions([
            loadRandomSong.bind(undefined, weirdPlayer),
            asAction(setupAudioNode).bind(undefined, weirdPlayer)
        ]);
        return false;
    }

    function setupPlayerNode(weirdPlayer) {
        var node = weirdPlayer.playerNode;
        node.querySelector(".wcp-play").onclick =
            play.bind(undefined, weirdPlayer);
    }

    function createWeirdPlayer(playerNode, apiUrl) {
        return {
            "playerNode": playerNode,
            "apiUrl": apiUrl,
            "playing": false,
            "currentSong": undefined,
            "audioNode": undefined
        };
    }
    function setup(playerNode, apiUrl) {
        var weirdPlayer = createWeirdPlayer(playerNode, apiUrl);
        setupPlayerNode(weirdPlayer);
    }
    exports.setup = setup;

    window.weirdPlayer.main = exports;
})(window);
