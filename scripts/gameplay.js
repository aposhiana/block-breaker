MyGame.screens['game-play'] = (function(input, gameState, renderer) {
    'use strict';

    let props = {
        lastTimeStamp: performance.now(),
        cancelNextRequest: false,
        update: countdownUpdate
    };

    let keyboard = input.Keyboard();

    let stateChanges = {
        paddleX: 0,
    };

    function initialize() {
        keyboard.registerCommand(input.keyCodes.DOM_VK_ESCAPE, function() {
            props.cancelNextRequest = true;
            game.showScreen('main-menu');
        });
        keyboard.registerCommand(input.keyCodes.DOM_VK_RIGHT, function(elapsedTime) {
            stateChanges.paddleRight += elapsedTime;
        });
        keyboard.registerCommand(input.keyCodes.DOM_VK_LEFT, function(elapsedTime) {
            stateChanges.paddleLeft -= elapsedTime;
        });
    }

    function processInput(elapsedTime) {
        keyboard.handleEvents(elapsedTime);
    }

    function countdownUpdate(elapsedTime) {
        stateChanges.paddleX = 0;
    }

    function gamePlayUpdate(elapsedTime) {
        let xChange = stateChanges.paddleX * gameState.getPaddleVelocity();
        gameState.setPaddleX(gameState.getPaddleX += xChange);
        stateChanges.paddleX = 0;
    }

    function gameOverUpdate(elapsedTime) {
        stateChanges.paddleX = 0;
    }

    function render(elapsedTime) {

    }

    function gameLoop(time) {
        let elapsedTime = time - props.lastTimeStamp;
        props.update(elapsedTime);
        processInput(elapsedTime);
        render(elapsedTime);
        if (!props.cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function run() {
        props.cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize: initialize,
        run: run
    };
}(Input, MyGame.gameState, MyGame.renderer));