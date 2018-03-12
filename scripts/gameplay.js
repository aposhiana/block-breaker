MyGame.screens['game-play'] = (function(game, input, gameState, renderer) {
    'use strict';

    let props = {
        lastTimeStamp: null,
        cancelNextRequest: false,
        canvas: null,
        context: null,
        update: countdownUpdate,
        accumulatingSecond: 0
    };

    let keyboard = input.Keyboard();

    let stateChanges = {
        paddleX: 0,
    };

    function startNewGame() {
        props.cancelNextRequest = false;
        
        // Set up new game
        gameState.wipeGameState();
        gameState.initializeBricks();
        gameState.makeNewBall();

        // Set or reset newGame flag to false
        gameState.setNewGameProperty(false);
        
        // Start game loop
        props.lastTimeStamp = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function resumeGame() {
        props.cancelNextRequest = false;

        // Start game loop
        props.lastTimeStamp = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function initialize() {
        console.log('game initializing...');

        let imgSources = Object.assign({}, renderer.images);
        for (let key in imgSources) {
            if (imgSources.hasOwnProperty(key)) {
                renderer.images[key] = new Image();
                renderer.images[key].isReady = false;
                renderer.images[key].onload = function() {
                    this.isReady = true;
                };
                renderer.images[key].src = imgSources[key];
            }
        }

        props.canvas = document.getElementById('canvas-main');
        props.context = props.canvas.getContext('2d');

        CanvasRenderingContext2D.prototype.clear = function() {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.clearRect(0, 0, props.canvas.width, props.canvas.height);
            this.restore();
        };

        keyboard.registerCommand(input.keyCodes.DOM_VK_ESCAPE, function() {
            props.cancelNextRequest = true;
            game.showScreen('paused-menu');
        });
        keyboard.registerCommand(input.keyCodes.DOM_VK_RIGHT, function(elapsedTime) {
            stateChanges.paddleX += elapsedTime;
        });
        keyboard.registerCommand(input.keyCodes.DOM_VK_LEFT, function(elapsedTime) {
            stateChanges.paddleX -= elapsedTime;
        });
    }

    function processInput(elapsedTime) {
        keyboard.handleEvents(elapsedTime);
    }

    function countdownUpdate(elapsedTime) {
        stateChanges.paddleX = 0;
        props.accumulatingSecond += elapsedTime;

        if (gameState.getCountdown() <= 0) {
            props.update = gamePlayUpdate;
            gameState.setState('gameplay');
            for (let i = 0; i < gameState.balls.length; i++) {
                gameState.balls[i].serve();
            }
        }
        else if (props.accumulatingSecond >= 1000) {
            gameState.countdown();
            console.log(gameState.getCountdown());
            props.accumulatingSecond = 0;
        }
    }

    //
    // Updates ball velocities if there were any wall collisions
    // Returns true if there was a wall collision otherwise returns false
    function handleWallCollisions(elapsedTime) {
        let anyWallCollisions = false;
        for (let i = 0; i < gameState.balls.length; i++) {
            let ball = gameState.balls[i];

            let wallCollision = false;
            let positiveReflection = false;

            if ((ball.position.x + ball.sideLength) > 990) {
                wallCollision = true;

                // Set the position outside of the wall
                ball.position.y -= (ball.position.x + ball.sideLength) - 990;

                if (ball.velocity.y < 0) {
                    positiveReflection = true;
                }
            }
            else if (ball.position.x < 10) {
                wallCollision = true;

                // Set the position outside of the wall
                ball.position.x += 10 - ball.position.x;

                if (ball.velocity.y > 0) {
                    positiveReflection = true;
                }
            }
            else if (ball.position.y < 10) {
                wallCollision = true;

                // Set the position outside of the wall
                ball.position.y += 10 - ball.position.y;

                if (ball.velocity.x < 0) {
                    positiveReflection = true;
                }
            }
            else if (ball.position.y > 990) {
                wallCollision = true;

                // Set the position outside of the wall
                ball.position.y -= ball.position.y - 990;

                if (ball.velocity.x > 0) {
                    positiveReflection = true;
                }
            }

            if (wallCollision) {
                ball.reflect(positiveReflection);
                anyWallCollisions = true;
            }
        }
        if (anyWallCollisions) {
            return true;
        }
        else {
            return false;
        }   
    }

    //
    // Updates ball velocities if there were any paddle collisions
    // Returns true if there was a wall collision otherwise returns false
    function handlePaddleCollisions(elapsedTime) {
        let halfPaddleDist = Math.floor(gameState.getPaddleLength() / 2)
        let paddleCenter = gameState.getPaddleX() - halfPaddleDist;
        let PADDLE_START_Y = 930;
        let PADDLE_HEIGHT = 20;

        let anyPaddleCollisions = false;

        for (let i = 0; i < gameState.balls.length; i++) {
            let ball = gameState.balls[i];

            let paddleCollision = false;
            let timeToEscape = null;
            

            if ((ball.position.y > PADDLE_START_Y) && (ball.position.y < PADDLE_START_Y + PADDLE_HEIGHT)) {
                if ((ball.position.x < (paddleCenter + halfPaddleDist)) && (ball.position.x > (paddleCenter - halfPaddleDist))) {
                    paddleCollision = true;
                    let posZValue = Math.floor((ball.position.x - paddleCenter) / halfPaddleDist);
                    ball.paddleBounce(posZValue);
                }
            }
        }
        
    }

    //
    // Updates ball velocities if there were any brick collisions
    // Returns true if there was a wall collision otherwise returns false
    function handleBrickCollisions(elapsedTime) {

    }

    //
    // Updates the position of the balls
    function updateBallPositions(elapsedTime) {
        let xChange = null;
        let temp = stateChanges.paddleX * gameState.getPaddleVelocity();
        (temp > 0) ? xChange = Math.floor(temp) : xChange = Math.ceil(temp);
        let oldX = gameState.getPaddleX();
        let paddleBuffer = gameState.getPaddleLength() / 2;
        if (!((paddleBuffer + oldX + xChange) > 990) && !((oldX + xChange - paddleBuffer) < 10)) {
            gameState.setPaddleX(oldX + xChange);
        }   
        stateChanges.paddleX = 0;

        for (let i = 0; i < gameState.balls.length; i++) {
            let ball = gameState.balls[i];
            ball.position.x = Math.floor(ball.position.x + ball.velocity.x * elapsedTime);
            ball.position.y = Math.floor(ball.position.y + ball.velocity.y * elapsedTime);
        }
    }

    function gamePlayUpdate(elapsedTime) {
        if (!handleWallCollisions(elapsedTime)) {
            if (!handlePaddleCollisions(elapsedTime)) {
                handleBrickCollisions(elapsedTime);
            }
        }
        updateBallPositions(elapsedTime);
    }

    function gameOverUpdate(elapsedTime) {
        stateChanges.paddleX = 0;
    }

    function render(elapsedTime) {
        renderer.render(props.context);
    }

    function gameLoop(time) {
        let elapsedTime = time - props.lastTimeStamp; 
        props.update(elapsedTime);
        processInput(elapsedTime);
        render(elapsedTime);
        props.lastTimeStamp = time;
        if (!props.cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function run() {
        if (gameState.getNewGameProperty()) {
            startNewGame();
        }
        else {
            resumeGame();
        }
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game, Input, MyGame.gameState, MyGame.renderer));