;window.weirdPlayer.main = (function (window) {
    "use strict";
    var exports = {},
        log     = window.console.log,

        util    = window.weirdPlayer.util,
        query   = util.query,
        empty   = util.empty,
        append  = util.append,
        defined = util.defined,

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

            currentSong = undefined,
            upcomingSongs = [];

        function loadRandomSongs() {  // Action
            var params = {
                "count": "1",
                "page": "3"  // This should be random...
            };
            function okCallback(req) {
                parse(getJson(req)).forEach(function (song) {
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
            if (empty(upcomingSongs)) {
                ac.doActions([loadAtLeastOneSong, queueNextSong]);
            } else {
                currentSong = upcomingSongs.shift();
                ec.notify("songChanged");
                ac.doneAction();
            }
        }

        function skip() {
            ac.doActions([queueNextSong]);
        }
        w.skip = skip;

        function getCurrentSong() {
            return currentSong;
        }
        w.getCurrentSong = getCurrentSong;

        w.observe = ec.observe;

        return w;
    }

    function createWcpView(wcpModel, playerNode) {
        var audioNode,
            shouldAutoplay = false;

        wcpModel.observe("songChanged", function () {
            log("song changed, yo");
            setupAudioNode();
        });

        function setupAudioNode() {
            if (defined(audioNode)) {
                audioNode.pause();
                audioNode.remove();
            }
            audioNode = document.createElement("audio");
            wcpModel.getCurrentSong().sources.forEach(function (s) {
                audioNode.appendChild(s);
            });
            playerNode.appendChild(audioNode);
            audioNode.load();
            if (shouldAutoplay) {
                shouldAutoplay = false;
                audioNode.play();
            }
        }

        query(playerNode, ".wcp-play").forEach(function (node) {
            node.onclick = function () {
                if (defined(audioNode)) {
                    audioNode.play();
                }
                return false;
            };
        });
        query(playerNode, ".wcp-pause").forEach(function (node) {
            node.onclick = function () {
                if (defined(audioNode)) {
                    audioNode.pause();
                }
                return false;
            };
        });
        query(playerNode, ".wcp-skip").forEach(function (node) {
            node.onclick = function () {
                if (defined(audioNode)) {
                    audioNode.pause();
                }
                shouldAutoplay = true;
                wcpModel.skip();
                return false;
            };
        });

        playerNode.wcpModel = wcpModel;
        wcpModel.skip();
    }

    function setup(playerNode, apiUrl) {
        createWcpView(createWcpModel(apiUrl), playerNode);
    }
    exports.setup = setup;

    return exports;
})(window);
