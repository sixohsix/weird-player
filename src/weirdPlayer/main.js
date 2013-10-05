;window.weirdPlayer.main = (function (window) {
    "use strict";
    var exports = {},

        util    = window.weirdPlayer.util,
        query   = util.query,
        empty   = util.empty,
        append  = util.append,
        defined = util.defined,
        attr    = util.attr,
        coerce  = util.coerce,
        choose  = util.choose,
        log     = util.log,

        actions = window.weirdPlayer.actions,

        createLoader     = window.weirdPlayer.loader.createLoader,
        createTestLoader = window.weirdPlayer.loader.createTestLoader,

        translate_         = window.weirdPlayer.translate,
        createTranslator   = translate_.createTranslator,
        translations       = translate_.translations,
        getBrowserLanguage = translate_.getBrowserLanguage;

    function createWcpModel(loader) {
        var w = {},
            ac = actions.createActionChain(),
            ec = actions.createEventCoordinator(),

            currentSong = undefined,
            useAllSongsPerPost = true,
            upcomingSongs = [];

        function loadRandomSong() {  // Action
            loader.loadSongs(function (songs) {
                if (! empty(songs)) {
                    var songsToAdd =
                            useAllSongsPerPost ? songs : [choose(songs)];
                    append(upcomingSongs, songsToAdd);
                }
                ac.doneAction();
            });
        }

        function loadAtLeastOneSong() {  // Action
            var originalSongCount = upcomingSongs.length;
            function keepLoadingUntilYouGotASong() {
                if (upcomingSongs.length === originalSongCount) {
                    ac.doActions([
                        loadRandomSong,
                        keepLoadingUntilYouGotASong]);
                } else {
                    ec.notify("gotNewSongs");
                    ac.doneAction();
                }
            }
            ac.doActions([keepLoadingUntilYouGotASong]);
        }

        function queueNextSong() {  // Action
            if (empty(upcomingSongs)) {
                ac.doActions([loadAtLeastOneSong, queueNextSong]);
            } else {
                currentSong = upcomingSongs.shift();
                ec.notify("songChanged");
                if (empty(upcomingSongs)) {
                    ac.doActions([loadAtLeastOneSong]);
                } else {
                    ac.doneAction();
                }
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

    function setSongData(playerNode, song) {
        function setInnerHTML(sel, value) {
            query(playerNode, sel).forEach(function (node) {
                node.innerHTML = value;
            });
        }
        setInnerHTML(".wcp-artist", song.artist);
        setInnerHTML(".wcp-title", song.title);
        setInnerHTML(".wcp-release", song.release);
        query(playerNode, ".wcp-postUrl").forEach(function (node) {
            node.href = song.postUrl; });
        query(playerNode, ".wcp-img").forEach(function (node) {
            node.innerHTML = "";
            node.appendChild(song.image);
        });
    }

    function loadedAudioNode(sources) {
        var audioNode = document.createElement("audio");
        sources.forEach(function (s) {
            audioNode.appendChild(s);
        });
        audioNode.load();
        return audioNode;
    }

    function fmtTime(time) {
        var mins = (time / 60)|0,
            secs = (time % 60)|0;
        if (secs < 10) secs = "0" + secs;
        return "" + mins + ":" + secs;
    }

    function createWcpView(wcpModel, playerNode, autoplay) {
        var audioNode,
            shouldAutoplay = defined(autoplay) ? autoplay : false,
            waitingOnSkip  = false,

            progressBars   = query(playerNode, ".wcp-progress"),
            curTimeNodes   = query(playerNode, ".wcp-curTime"),
            totTimeNodes   = query(playerNode, ".wcp-totTime");

        wcpModel.observe("songChanged", function () {
            log("song changed, yo");
            var song = wcpModel.getCurrentSong();
            setupAudioNode(song.sources);
            setSongData(playerNode, song);
            updateSongProgress();
        });

        function setupAudioNode(sources) {
            if (defined(audioNode)) {
                audioNode.pause();
                playerNode.removeChild(audioNode);
            }
            audioNode = loadedAudioNode(sources);
            playerNode.appendChild(audioNode);
            if (shouldAutoplay) {
                shouldAutoplay = false;
                audioNode.play();
            }
            waitingOnSkip = false;
        }

        query(playerNode, ".wcp-play").forEach(function (node) {
            node.onclick = function () {
                if (defined(audioNode) && audioNode.paused) {
                    audioNode.play();
                }
                return false;
            };
        });
        query(playerNode, ".wcp-pause").forEach(function (node) {
            node.onclick = function () {
                if (defined(audioNode) && ! audioNode.paused) {
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
        query(playerNode, ".wcp-playPause").forEach(function (node) {
            node.onclick = function () {
                if (defined(audioNode)) {
                    audioNode.paused
                        ? audioNode.play()
                        : audioNode.pause();
                }
                return false;
            };
        });

        function updateSongProgress() {
            var totTime = attr(audioNode, "duration", 0)|0,
                curTime = attr(audioNode, "currentTime", 0)|0,
                ended   = attr(audioNode, "ended", false);
            progressBars.forEach(function (n) {
                n.max   = totTime;
                n.value = curTime;
            });
            curTimeNodes.forEach(function (n) {
                n.innerHTML = fmtTime(curTime);
            });
            totTimeNodes.forEach(function (n) {
                n.innerHTML = fmtTime(totTime);
            });
            if (ended && ! waitingOnSkip) {
                waitingOnSkip = true;
                shouldAutoplay = true;
                wcpModel.skip();
            }
        }

        wcpModel.skip();
        window.setInterval(updateSongProgress, 1000);
    }

    function setup(playerNode, options) {
        var debug         = attr(options, "debug", false),
            useTestLoader = attr(options, "useTestLoader", false),
            autoplay      = attr(options, "autoplay", false);

        util.debug = debug;

        var loader =
                useTestLoader
                ? createTestLoader(window.tests.fixture.responses)
                : createLoader({apiUrl: options.apiUrl, jsonp: options.jsonp}),

            model  = createWcpModel(loader),
            view   = createWcpView(model, playerNode, autoplay),
            translator = createTranslator(translations, document);

        translator.setLang(getBrowserLanguage());

        ["en", "fr"].forEach(function (lang) {
            query(document, ".setLang-" + lang).forEach(function (node) {
                node.onclick = function () {
                    translator.setLang(lang);
                    return false;
                };
            });
        });

        playerNode.wcpModel = model;
        playerNode.wcpView  = view;
        playerNode.wcpTranslator = translator;
        return view;
    }
    exports.setup = setup;

    return exports;
})(window);
