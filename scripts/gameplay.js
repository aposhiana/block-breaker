MyGame.screens['game-play'] = (function(game, input, gameState, renderer) {
    'use strict';

    let props = {
        lastTimeStamp: null,
        cancelNextRequest: false,
        canvas: null,
        context: null,
        update: countdownUpdate,
        accumulatingSecond: 0,
    };

    let keyboard = input.Keyboard();

    let stateChanges = {
        paddleX: 0
    };

    function updateHighScores(myScore) {
        let highScores = localStorage.getItem('highScores');
        if (highScores !== null) {
            highScores = JSON.parse(highScores);
        }
        else {
            highScores = [];
        }


        // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        function compareNumbers(a, b) {
            return a - b;
          }

        highScores.push(myScore);
        highScores.sort(compareNumbers);
        highScores.reverse();

        for (let i = 5; i < highScores.length; i++) {
            highScores.pop();
        }

        localStorage['highScores'] = JSON.stringify(highScores);
    }

    function startNewGame() {
        props.cancelNextRequest = false;

        props.update = countdownUpdate;
        
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

    function gameOverUpdate(elapsedTime) {
        stateChanges.paddleX = 0;
    }

    //
    // Updates ball velocities if there were any wall collisions
    // Returns true if there was a wall collision otherwise returns false
    function handleWallCollisions() {
        let anyWallCollisions = false;
        for (let i = 0; i < gameState.balls.length; i++) {
            let ball = gameState.balls[i];

            let wallCollision = false;
            let yReflection = false;

            if ((ball.position.x + ball.sideLength) > 990) {
                wallCollision = true;

                // Set the ball position outside of the wall
                ball.position.x -= (ball.position.x + ball.sideLength) - 990;
            }
            else if (ball.position.x < 10) {
                wallCollision = true;

                // Set the ball position outside of the wall
                ball.position.x += (10 - ball.position.x);
            }
            else if (ball.position.y < 10) {
                wallCollision = true;

                // Set the ball position outside of the wall
                ball.position.y += (10 - ball.position.y);

                yReflection = true;
            }

            if (wallCollision) {
                ball.reflect(yReflection);
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
    function handlePaddleCollisions() {
        let halfPaddleDist = Math.floor(gameState.getPaddleLength() / 2)
        let paddleCenter = gameState.getPaddleX();
        let PADDLE_START_Y = 930;
        let PADDLE_HEIGHT = 20;

        let anyPaddleCollisions = false;

        for (let i = 0; i < gameState.balls.length; i++) {
            let ball = gameState.balls[i];
            let bottomBallY = ball.position.y + ball.sideLength;

            let paddleCollision = false;
            let timeToEscape = null;
            

            if ((bottomBallY > PADDLE_START_Y) && (bottomBallY < (PADDLE_START_Y + PADDLE_HEIGHT))) {
                if ((ball.position.x < (paddleCenter + halfPaddleDist)) && ((ball.position.x + ball.sideLength) > (paddleCenter - halfPaddleDist))) {
                    paddleCollision = true;

                    // Set the ball position outside of the wall
                    ball.position.y -= (PADDLE_START_Y - ball.position.y);

                    let posZValue = (ball.position.x - paddleCenter) / halfPaddleDist;
                    ball.paddleBounce(posZValue);
                }
            }
        }

        if (anyPaddleCollisions) {
            return true;
        }
        else {
            return false;
        }
    }

    //
    // Updates ball velocities if there were any brick collisions
    // Returns true if there was a wall collision otherwise returns false
    function handleBrickCollisions() {

        let BRICK_HEIGHT = 30;
        let SPACE = 5;

        let anyBrickCollisions = false;

        for (let ballIndex = 0; ballIndex < gameState.balls.length; ballIndex++) {
            let ball = gameState.balls[ballIndex];
            let topBallY = ball.position.y;
            let bottomBallY = topBallY + ball.sideLength;


            // Find the rows that the ball intersects with
            let rowsToCheck = [];
            let rowTop = 200; // Initialize to top of first row
            let rowBottom = rowTop + BRICK_HEIGHT;
            for (let i = 0; i < gameState.bricks.length; i++) {
                if (topBallY < rowBottom && bottomBallY > rowTop) {
                    rowsToCheck.push(i);
                }
                rowTop += (BRICK_HEIGHT + SPACE);
                rowBottom += (BRICK_HEIGHT + SPACE);
            }

            let bricksCollidedWith = [];
            let BRICK_WIDTH = 65;
            let FIRST_BRICKS_X_OFFSET = SPACE + 7;
            let ballLeft = ball.position.x;
            let ballRight = ballLeft + ball.sideLength;

            // Find the bricks that the ball intersects with
            for (let i = 0; i < rowsToCheck.length; i++) {
                let brickLeft = FIRST_BRICKS_X_OFFSET;
                let brickRight = brickLeft + BRICK_WIDTH;
                let rowIndex = rowsToCheck[i];
                for (let j = 0; j < gameState.bricks[rowIndex].length; j++) {
                    let brick = gameState.bricks[rowIndex][j];
                    if (brick.visible) {
                        if (ballLeft < brickRight && ballRight > brickLeft) {
                            bricksCollidedWith.push(brick);
                            anyBrickCollisions = true;
                            if ((rowIndex === 0) && !gameState.getPaddleShrunk()) {
                                gameState.setPaddleDecrementsNeeded(50);
                                gameState.setPaddleShrunk(true);
                            }
                            gameState.bricksBrokenByRow[rowIndex]++;
                            gameState.addToScore(brick.points);
                            if (gameState.bricksBrokenByRow[rowIndex] === 14) {
                                gameState.addToScore(25);
                            }

                            if (Math.floor(gameState.getScore() / 100) > gameState.getExtraBallAtX100()) {
                                gameState.setExtraBallAtX100(gameState.getExtraBallAtX100() + 1);
                                gameState.makeNewBall();
                                gameState.balls[gameState.balls.length - 1].serve();
                            }
                        }
                    }
                    brickLeft += (BRICK_WIDTH + SPACE);
                    brickRight += (BRICK_WIDTH + SPACE);
                }
            }

            // Handle the collisions
            for (let i = 0; i < bricksCollidedWith.length; i++) {
                let brick = bricksCollidedWith[i];

                // Only perform the reflection on the first brick collided with
                if (i === 0) {
                    let yLine = null;

                    if (ball.velocity.y < 0) {
                        yLine = brick.position.y + BRICK_HEIGHT;
                    }
                    else {
                        yLine = brick.position.y;
                    }

                    // Use point-slope line formula to calculate intersection
                    let trajectorySlope = ball.velocity.y / ball.velocity.x;
                    let yLineCross = ((yLine - ball.position.y) / trajectorySlope) + ball.position.x;

                    // Test if intersection is in the brick wall, if not then it came through the perpendicular wall
                    if ((yLineCross >= brick.position.x) && (yLineCross <= (brick.position.x + BRICK_WIDTH))) {
                        ball.reflect(true);
                    }
                    else {
                        ball.reflect(false);
                    }
                }

                // Perform other necessary actions for brick collision
                brick.visible = false;

                gameState.setNumBricksRemoved(gameState.getNumBricksRemoved() + 1);

                let increasePoints = [4, 12, 36, 62];
                if (increasePoints.includes(gameState.getNumBricksRemoved())) {
                    for (let ballI = 0; ballI < gameState.balls.length; ballI++) {
                        gameState.balls[ballI].increaseVelocity();
                    }
                    gameState.upInitialBallVelocityMagnitude();
                }
            }
        }
        if (anyBrickCollisions) {
            return true;
        }
        else {
            return false;
        }
    }

    //
    // Updates the position of the balls and paddle
    function updatePositions(elapsedTime) {
        let RIGHT_LIMIT = 990;
        let LEFT_LIMIT = 10;
        let xChange = null;
        let temp = stateChanges.paddleX * gameState.getPaddleVelocity();
        (temp > 0) ? xChange = Math.floor(temp) : xChange = Math.ceil(temp);
        let oldX = gameState.getPaddleX();
        let paddleBuffer = gameState.getPaddleLength() / 2;

        if ((paddleBuffer + oldX + xChange) > RIGHT_LIMIT) {
            gameState.setPaddleX(RIGHT_LIMIT - paddleBuffer);
        }
        else if ((oldX + xChange - paddleBuffer) < LEFT_LIMIT) {
            gameState.setPaddleX(LEFT_LIMIT + paddleBuffer);
        }
        else {
            gameState.setPaddleX(oldX + xChange);
        }

        stateChanges.paddleX = 0;

        for (let i = 0; i < gameState.balls.length; i++) {
            let ball = gameState.balls[i];
            ball.position.x = Math.floor(ball.position.x + ball.velocity.x * elapsedTime);
            ball.position.y = Math.floor(ball.position.y + ball.velocity.y * elapsedTime);
        }
    }

    function shrinkPaddle() {
        gameState.setPaddleLength(gameState.getPaddleLength() - 1);
        if (gameState.getPaddleLength() <= 0) {
            gameState.setPaddleVisibility(false);
        }
    }

    function loadNewPaddle() {
        gameState.setPaddleLength(100);
        gameState.setPaddleX(500);
        gameState.setPaddleVisibility(true);

        if (gameState.getExtraPaddleCount() > 0) {
            gameState.setExtraPaddleCount(gameState.getExtraPaddleCount() - 1);
        }
        else {
            gameState.setPaddleVisibility(false);
            return false;     
        }  

        gameState.setPaddleShrunk(false);
        return true;
    }

    function gamePlayUpdate(elapsedTime) {
        if (!handleWallCollisions()) {
            if (!handlePaddleCollisions()) {
                handleBrickCollisions();
            }
        }

        let allBallsOut = true;
        let ballsToDelete = [];
        for (let i = 0; i < gameState.balls.length; i++) {
            if (gameState.balls[i].position.y < 1000) {
                allBallsOut = false;
            }
            else {
                ballsToDelete.push(i);
            }
        }

        for (let i = 0; i < ballsToDelete.length; i++) {
            gameState.balls.splice(ballsToDelete[i], 1);
        }


        for (let i = 0; i < gameState.getPaddleDecrementsNeeded(); i++) {
            shrinkPaddle();
            gameState.setPaddleDecrementsNeeded(gameState.getPaddleDecrementsNeeded() - 1);
        }

        if (allBallsOut) {
            if (loadNewPaddle()) {
                props.update = countdownUpdate;
                gameState.setState('countdown');
                gameState.resetCountdown();

                // This must be done after loadNewPaddle so that the ball is made on the new paddle
                gameState.makeNewBall();
            }
            else {
                props.update = gameOverUpdate;
                gameState.setState('gameover');
                updateHighScores(gameState.getScore());
            }
        }

        updatePositions(elapsedTime);
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