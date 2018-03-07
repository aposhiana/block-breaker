// ------------------------------------------------------------------
// 
// The top-level game object
//
// ------------------------------------------------------------------
MyGame.game = (function(screens) {
    'use strict';

    //
    // This function changes which screen is displayed
    function showScreen(id) {
        let activeElements = document.getElementsByClassName('active');

        // Remove the active state from any active screens
        for (let i = 0; i < activeElements.length; i++) {
            activeElements[i].classList.remove('active');
        }

        screens[id].run();
        document.getElementById(id).classList.add('active');
    }

    //
    // This function does the one-time game initialization
    function initialize() {
        for (let screen in screens) {
            if (screens.hasOwnProperty(screen)) {
                screens[screen].initialize();
            }
        }

        showScreen('main-menu');
    }

    return {
        showScreen: showScreen,
        initialize: initialize
    };
}(MyGame.screens));
