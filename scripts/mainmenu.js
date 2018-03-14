// ------------------------------------------------------------------
// 
// Screen for main-menu
//
// ------------------------------------------------------------------
MyGame.screens['main-menu'] = (function(game) {
    'use strict';

    let props = {
        lastTimeStamp: performance.now(),
        cancelNextRequest: false,
        focus: 0
    };

    let keyboard = Input.Keyboard();

    function cancelReq() {
        props.cancelNextRequest = true;
    }

    function initialize() {
        keyboard.registerCommand(Input.keyCodes.DOM_VK_DOWN, function() {
            if (props.focus < 20) {
                props.focus++;
            } 
        });
        keyboard.registerCommand(Input.keyCodes.DOM_VK_UP, function() {
            if (props.focus > 0) {
                props.focus--;
            } 
        });

        document.getElementById('mm-new').addEventListener('click', cancelReq);
        document.getElementById('mm-high').addEventListener('click', cancelReq);
        document.getElementById('mm-credits').addEventListener('click', cancelReq);
    }
    
    function signalLoop(time) {
        keyboard.handleEvents(time - props.lastTimeStamp);
        props.lastTimeStamp = time;
        if (!props.cancelNextRequest) {
            requestAnimationFrame(signalLoop);
        }
        if (props.focus < 5) {
            document.getElementById('mm-new').focus();
        }
        else if (props.focus < 10) {
            document.getElementById('mm-high').focus();
        }
        else if (props.focus < 15) {
            document.getElementById('mm-credits').focus();
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
}(MyGame.game));