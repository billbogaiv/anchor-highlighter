(function(chrome, window) {
    'use strict';

    var document = window.document;
    var highlighter = null;

    addChromeEvents(chrome, document);
    addWindowEvents(window, document);
    addPushStateScript(chrome, document);

    function addChromeEvents(chrome, document) {
        chrome.storage.sync.get('highlighter', function(value) {
            if (value.highlighter !== undefined && value.highlighter !== null) {
                highlighter = value.highlighter;
            }

            if (document.readyState !== 'loading') {
                highlightComment(window, document);
            }
            else {
                document.addEventListener('load', function() {
                    highlightComment(window, document);
                });
            }
        });

        chrome.storage.onChanged.addListener(function(changes) {
            var highlighterChanges = changes['highlighter'];

            if (highlighterChanges !== null) {
                highlighter = highlighterChanges.newValue;
            }
        });
    }

    function addWindowEvents(window, document) {
        window.addEventListener("message", function(event) {
            if (event.source !== window) {
                return;
            }

            if (event.data.type !== undefined && event.data === 'pushState') {
                highlightComment(window, document);
            }
        });

        window.addEventListener('popstate', function(event) {
            highlightComment(window, document);
        });
    }

    function highlightComment(window, document) {
        var hash = window.location.hash.substr(1);

        if (hash.length > 0) {
            var container = document.querySelector('#' + hash + ', [name="' + hash + '"]');

            if (container !== null) {
                var computedContainerStyle = window.getComputedStyle(container);

                var originalBackgroundColor = computedContainerStyle.backgroundColor;
                var originalTransition = computedContainerStyle.transition;

                container.style.backgroundColor = highlighter;

                var transitionEnd = function(event) {
                    if (event.propertyName == 'background-color') {
                        container.style.transition = originalTransition;

                        container.removeEventListener('transitionend', transitionEnd);
                    }
                };

                container.addEventListener('transitionend', transitionEnd);

                setTimeout(function() {
                    container.style.transition = 'background-color 2s ease-in';
                    container.style.backgroundColor = originalBackgroundColor;
                }, 1000);
            }
        }
    }

    function addPushStateScript(chrome, document) {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement('script');

        script.type = 'text/javascript';
        script.src = chrome.extension.getURL('pushState.js');

        head.appendChild(script);
    }
})(chrome, window);
