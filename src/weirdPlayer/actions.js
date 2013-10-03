;window.weirdPlayer.actions = (function (window) {
    "use strict";
    var exports = {},

        util = window.weirdPlayer.util,
        coerce = util.coerce;

    function createActionChain() {
        var actions = [],
            running = false,
            ac      = {};

        function pushAction(action) {
            actions.push(action);
        }

        function doActions(newActions) {
            newActions.reverse().forEach(pushAction);
            if (! running) doneAction();
        }
        ac.doActions = doActions;

        function doneAction() {
            if (actions.length > 0) {
                running = true;
                var nextAction = actions.pop();
                window.setTimeout(nextAction, 0);
            } else {
                running = false;
            }
        }
        ac.doneAction = doneAction;

        function asAction(f) {
            return function () {
                f.apply(undefined, arguments);
                doneAction();
            };
        }
        ac.asAction = asAction;

        return ac;
    }
    exports.createActionChain = createActionChain;

    function doNothing() {}
    exports.doNothing = doNothing;

    function createEventCoordinator() {
        var ec       = {},
            handlers = {};

        function observe(evtName, callback) {
            handlers[evtName] = coerce(ec[evtName], []);
            handlers[evtName].push(callback);
        }
        ec.observe = observe;

        function notify(evtName) {
            coerce(handlers[evtName], []).forEach(function (c) { c(); });
        }
        ec.notify = notify;

        return ec;
    }
    exports.createEventCoordinator = createEventCoordinator;

    return exports;
})(window);