(function(chrome, document) {
    'use strict';

    document.addEventListener('DOMContentLoaded', function(event) {
        var colorPicker = document.getElementById('color-picker');

        chrome.storage.sync.get('highlighter', function(value) {
            colorPicker.value = value.highlighter;
        });

        colorPicker.addEventListener('change', function(event) {
            chrome.storage.sync.set({ 'highlighter': event.target.value });
        });
    });
})(chrome, document);
