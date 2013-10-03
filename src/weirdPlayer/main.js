;window.weirdPlayer.main = (function (window) {
    "use strict";
    var exports = {},
        log     = window.console.log,

        actions   = window.weirdPlayer.actions,
        doNothing = actions.doNothing,

        parse = window.weirdPlayer.parse.parse;


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

    function getJson(req) {
        var jsonData;
        if (req.responseType !== "json") {
            jsonData = window.JSON.parse(req.responseText);
        } else {
            jsonData = req.response;
        }
        return jsonData;
    }

    function createWcpModel(apiUrl) {
        var w = {},
            ac = actions.createActionChain(),
            ec = actions.createEventCoordinator(),

            wantsToPlay = false,
            playing = false,
            currentSong = undefined,
            upcomingSongs = [],
            audioNode = undefined;


        function loadRandomSongs() {  // Action
            var params = {
                "count": "1",
                "page": "3"  // This should be random...
            };
            function okCallback(req) {
                parse(getJson(req)).foreach(function (song) {
                    upcomingSongs.push(song);
                });
                ac.doneAction();
            }
            function failCallback(req) {
                log("The AJAX request failed, pal.");
                ac.doneAction();
            }
            load(apiUrl, params, okCallback, failCallback);
        }

        function loadAtLeastOneSong() {  // Action
            var originalSongCount = upcomingSongs.length;
            function keepLoadingUntilYouGotSomeSongs() {
                var todo = [];
                if (upcomingSongs.length === originalSongCount) {
                    todo = [loadRandomSongs, keepLoadingUntilYouGotSomeSongs];
                }
                ac.doActions(todo);
            }
            ac.doActions([keepLoadingUntilYouGotSomeSongs]);
        }

        function queueNextSong() {  // Action
            if (upcomingSongs.length > 0) {
                currentSong = upcomingSongs.shift();
                ec.notify("songChanged");
            }
            ac.doneAction();
        }

        function setupAudioNode() {
            var audioNode = document.createElement("audio"),
                sourceNode = document.createElement("source");
            sourceNode.src = currentSong.url;
            audioNode.appendChild(sourceNode);
            playerNode.appendChild(audioNode);
        }

        function setup() {
            ac.doActions([loadAtLeastOneSong, queueNextSong]);
        }
        w.setup = setup;

        function getCurrentSong() {
            return currentSong;
        }
        w.getCurrentSong = getCurrentSong;

        w.observe = ec.observe;

        return w;
    }

    function createWcpView(wcpModel, playerNode) {
        wcpModel.observe("songChanged", function () {
            log("song changed, yo");
        });
    }

    function setup(playerNode, apiUrl) {
        var weirdPlayer = createWeirdPlayer(playerNode, apiUrl);
        weirdPlayer.setup();
    }
    exports.setup = setup;

    return exports;
})(window);
