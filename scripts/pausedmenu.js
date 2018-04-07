// ------------------------------------------------------------------
// 
// The paused menu screen
//
// ------------------------------------------------------------------
MyGame.screens['paused-menu'] = (function(game, gameState) {
    'use strict';

    let props = {
        lastTimeStamp: performance.now(),
        cancelNextRequest: false,
        focus: 0
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
        keyboard.registerCommand(Input.keyCodes.DOM_VK_DOWN, function() {
            if (props.focus < 1) {
                props.focus++;
            } 
        }, false, true);
        keyboard.registerCommand(Input.keyCodes.DOM_VK_UP, function() {
            if (props.focus > 0) {
                props.focus--;
            } 
        }, false, true);
    }

    function signalLoop(time) {
        keyboard.handleEvents(time - props.lastTimeStamp);
        props.lastTimeStamp = time;
        if (!props.cancelNextRequest) {
            requestAnimationFrame(signalLoop);
        }
        if (props.focus === 0) {
            document.getElementById('button-resume').focus();
        }
        else if (props.focus === 1) {
            document.getElementById('button-quit-game').focus();
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