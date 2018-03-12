// ------------------------------------------------------------------
// 
// The paused menu screen
//
// ------------------------------------------------------------------
MyGame.screens['paused-menu'] = (function(game, gameState) {
    'use strict';

    let props = {
        lastTimeStamp: performance.now(),
        cancelNextRequest: false
    };

    let keyboard = Input.Keyboard();

    function initialize() {
        document.getElementById('button-resume').addEventListener('click', function() {
            game.showScreen('game-play');
            props.cancelNextRequest = true;
        });
        document.getElementById('button-quit-game').addEventListener('click', function() {
            gameState.setNewGameProperty(true);
            game.showScreen('main-menu');
            props.cancelNextRequest = true;
        });
    }

    function signalLoop(time) {
        keyboard.handleEvents(time - props.lastTimeStamp);
        props.lastTimeStamp = time;
        if (!props.cancelNextRequest) {
            requestAnimationFrame(signalLoop);
        }
    }

    function run() {
        props.cancelNextRequest = false;
        requestAnimationFrame(signalLoop);
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game, MyGame.gameState));