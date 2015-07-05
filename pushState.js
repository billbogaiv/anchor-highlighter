(function(window) {
    'use strict';

    window.history.pushState = (function(pushState) {
        return function() {
            pushState.apply(this, arguments);

            window.postMessage('pushState', '*');
        };
    })(window.history.pushState);
})(window);
