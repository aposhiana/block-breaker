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
        for (let screen of screens) {
            if (screens.hasOwnProperty(screen)) {
                screen.initialize();
            }
        }

        showScreen('main-menu');
    }
}(MyGame.screens));

// ------------------------------------------------------------------
// 
// A screen to be used by credits and high-scores
//
// ------------------------------------------------------------------
let defaultScreen = (function(game) {
    'use strict';

    let keyboard = Input.Keyboard();

    function initialize() {
        keyboard.registerCommand(Input.keyCodes.DOM_VK_ESCAPE, game.showScreen('main-menu'));
    }

    function run() {
        // Does nothing
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game));

MyGame.screens['credits'] = defaultScreen;
MyGame.screens['high-scores'] = defaultScreen;

// ------------------------------------------------------------------
// 
// Screen for main-menu
//
// ------------------------------------------------------------------
MyGame.screens['main-menu'] = (function(game) {
    'use strict';

    function initialize() {
        // Does nothing
    }

    function run() {
        // Does nothing
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game));;