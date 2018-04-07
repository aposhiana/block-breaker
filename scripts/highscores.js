// ------------------------------------------------------------------
// 
// The high scores screen
//
// ------------------------------------------------------------------
MyGame.screens['high-scores'] = (function(game) {
    'use strict';

    let props = {
        lastTimeStamp: performance.now(),
        cancelNextRequest: false,
        focus: 0
    };

    let keyboard = Input.Keyboard();

    function resetHighScores() {
        localStorage['highScores'] = JSON.stringify([]);
        let htmlNode = document.getElementById('ol-scores');
        htmlNode.innerHTML = ''; 
    }

    function goBack() {
        game.showScreen('main-menu');
        props.cancelNextRequest = true;
    }

    function initialize() {
        keyboard.registerCommand(Input.keyCodes.DOM_VK_ESCAPE, function() {
            props.cancelNextRequest = true;
            game.showScreen('main-menu');
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

        document.getElementById('high-scores-back').addEventListener('click', goBack);
        document.getElementById('high-scores-reset').addEventListener('click', resetHighScores);
    }

    function signalLoop(time) {
        let highScores = localStorage.getItem('highScores');

        if (highScores !== null) {
            highScores = JSON.parse(highScores);
        }
        else {
            highScores = [];
        }

        if (props.focus === 0) {
            document.getElementById('high-scores-back').focus();
        }
        else if (props.focus === 1) {
            document.getElementById('high-scores-reset').focus();
        }

        let htmlNode = document.getElementById('ol-scores');

        htmlNode.innerHTML = '';
        for (let i = 0; i < highScores.length; i++) {
			htmlNode.innerHTML += ('<li>' + highScores[i] + '</li>'); 
        }

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
}(MyGame.game));