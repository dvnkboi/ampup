(function setTimeoutModule(global, partial, setInterval, setTimeout, slice) {
    'use strict';

    function dogfooder() {
        if (arguments.length) { // no need to polyfill
            return;
        }

        global[setInterval] = partial(global[setInterval], slice);
        global[setTimeout] = partial(global[setTimeout], slice);
    }

    global[setTimeout](dogfooder, 0, global);

}(this, function setTimeoutPolyfill(method, slice) {
    'use strict';

    return function definition(callback, timeout) {
        var
            args = slice.call(arguments, 2);

        return method(function application() {
            callback.apply(this, args);
        }, timeout);
    };
}, 'setInterval', 'setTimeout', Array.prototype.slice));

/**
 * window.setImmediate polyfill for IE < 10
 */
(function setImmediateModule(global, slice) {
    'use strict';

    var
        document,
        handlers,
        html,
        uid;

    if (global.setImmediate) {
        return;
    }

    function clearImmediate(handler) {
        delete handlers[handler];
    }

    function setImmediate() {
        var
            args = slice.call(arguments),
            handle = 'handle_' + uid,
            script = document.createElement('script');

        function onreadystatechange() {
            this.onreadystatechange = null;
            html.removeChild(this);
            if (handlers.hasOwnProperty(handle)) {
                delete handlers[handle];
                args[0].apply(global, args.slice(1));
            }
        }

        uid += 1;
        handlers[handle] = true;
        script.onreadystatechange = onreadystatechange;
        html.appendChild(script); // triggers readystatechange event

        return handle;
    }

    document = global.document;
    handlers = {};
    html = document.documentElement;
    uid = 1;

    global.clearImmediate = clearImmediate;
    global.setImmediate = setImmediate;

}(this, Array.prototype.slice));

/**
 * window.requestAnimationFrame and window.cancelAnimationFrame polyfill for IE < 10
 * Monkey patches iOS 6
 * Attempts to return sub-millisecond timestamps using window.performance (which may well be polyfilled in and of itself)
 */
(function requestAnimationFrameModule(global) {
    'use strict';

    var
        counter,
        hasPerformance = !!(global.performance && global.performance.now),
        lastTime = 0,
        now = Date.now || function now() { return (new Date()).getTime(); },
        rAFOld,
        startTime = now(),
        vendors = ['webkit', 'moz'];

    function cancelAnimationFrame(id) {
        global.clearTimeout(id);
    }

    function requestAnimationFrame(callback) {
        var
            currTime = now(),
            delay = 16 - Math.abs(currTime - lastTime),
            id,
            next = currTime + delay;

        if (delay < 0) {
            delay = 0;
        }

        id = global.setTimeout(function () {
            callback(next);
        }, delay);

        lastTime = next;

        return id;
    }

    counter = vendors.length;
    while (counter && !global.requestAnimationFrame) {
        counter -= 1;
        global.requestAnimationFrame = global[vendors[counter] + 'RequestAnimationFrame'];
    }

    if (!global.requestAnimationFrame || /iP(?:[ao]d|hone).*OS 6/.test(global.navigator.userAgent)) {
        global.requestAnimationFrame = requestAnimationFrame;
    } else {
        global.cancelAnimationFrame = global[vendors[counter] + 'CancelAnimationFrame'] || global[vendors[counter] + 'CancelRequestAnimationFrame'];
    }

    if (!global.cancelAnimationFrame) {
        global.cancelAnimationFrame = cancelAnimationFrame;
    }

    if (!hasPerformance) {
        rAFOld = global.requestAnimationFrame;
        global.requestAnimationFrame = function (callback) {
            function wrapped(timestamp) {
                var
                    performanceTimestamp = (timestamp < 1e12) ? timestamp : timestamp - startTime;

                return callback(performanceTimestamp);
            }

            rAFOld(wrapped);
        };
    }

}(this));