MyGame.gameState = (function() {
    'use strict';

    let balls = [];
    let bricks = [];

    let particleSystems = [];

    let props = {
        countdown: 3,
        state: 'countdown',
        newGame: true,
        numBricksRemoved: 0,
        initialBallVelocityMagnitude: 0.3,
        extraPaddles: 2,
        score: 0,
        paddleDecrementsNeeded: 0,
        paddleShrunk: false,
        extraBallAtX100: 0,
        bricksBrokenByRow: [0, 0, 0, 0, 0, 0, 0, 0]
    };

    function getExtraBallAtX100() {
        return props.extraBallAtX100;
    }

    function setExtraBallAtX100(value) {
        props.extraBallAtX100 = value;
    }

    function getPaddleShrunk() {
        return props.paddleShrunk;
    }

    function setPaddleShrunk(value) {
        props.paddleShrunk = value;
    }

    function getPaddleDecrementsNeeded() {
        return props.paddleDecrementsNeeded;
    }

    function setPaddleDecrementsNeeded(value) {
        props.paddleDecrementsNeeded = value;
    }

    function addToScore(value) {
        props.score += value;
    }

    function getScore() {
        return props.score;
    }

    function upInitialBallVelocityMagnitude() {
        props.initialBallVelocityMagnitude += 0.1 * 1.4142136;
    }

    function getNumBricksRemoved() {
        return props.numBricksRemoved;
    }

    function setNumBricksRemoved(value) {
        props.numBricksRemoved = value;
    }

    let paddle = {
        x: 500,
        length: 100,
        velocity: 0.8,
        visible: true
    };

    function decrementPaddleLength() {
        paddle.length--;
    }

    function wipeGameState() {
        balls.splice(0, balls.length);
        bricks.splice(0, bricks.length);

        for (let i = 0; i < props.bricksBrokenByRow.length; i++) {
            props.bricksBrokenByRow[i] = 0;
        }

        props.countdown = 3;
        props.state = 'countdown';
        props.initialBallVelocityMagnitude = 0.3;
        props.numBricksRemoved = 0;
        props.extraPaddles = 2;
        props.score = 0;
        props.paddleShrunk = false;
        props.paddleDecrementsNeeded = 0;
        props.extraBallAtX100 = 0;

        paddle.x = 500;
        paddle.length = 100;
        paddle.visible = true;
    }

    function setNewGameProperty(value) {
        props.newGame = value;
    }

    function getNewGameProperty() {
        return props.newGame;
    }

    function getState() {
        return props.state;
    }

    function setState(state) {
        props.state = state;
    }

    function countdown() {
        if (props.countdown >= 0) {
            props.countdown--;
        }
    }

    function getCountdown() {
        return props.countdown;
    }

    function resetCountdown() {
        props.countdown = 3;
    }

    function getExtraPaddleCount() {
        return props.extraPaddles;
    }

    function setExtraPaddleCount(value) {
        props.extraPaddles = value;
    }

    //
    // Takes a spec with attributes points, x, and y
    function Brick(spec) {
        let that = {
            visible: true,
            points: spec.points,
            position: {
                x: spec.x,
                y: spec.y
            }
        }
        return that;
    }

    function initializeBricks() {
        let NUM_ROWS = 8;
        let NUM_COLS = 14;
        let BRICK_WIDTH = 65;
        let BRICK_HEIGHT = 30;
        let SPACE = 5;
        let FIRST_BRICKS_X_OFFSET = SPACE + 7;

        let pointsPerBrickByRow = [5, 5, 3, 3, 2, 2, 1, 1];

        let rowHeight = 200; // Set to height of first row
        for (let rowIndex = 0; rowIndex < NUM_ROWS; rowIndex++) {
            let row = [];
        
            let colX = FIRST_BRICKS_X_OFFSET;
            for (let col = 0; col < NUM_COLS; col++) {
                let spec = {
                    points: pointsPerBrickByRow[rowIndex],
                    x: colX,
                    y: rowHeight
                }
                row.push(Brick(spec));
                colX += (SPACE + BRICK_WIDTH);
            }
            bricks.push(row);
            rowHeight += (SPACE + BRICK_HEIGHT);
        }
    }
    
    function Ball() {

        let innerVelocity = {
            x: 0,
            y: 0
        };

        innerVelocity.setMagnitude = function(newMag) {
            let direction = innerVelocity.x / innerVelocity.y;
            let signX = innerVelocity.x > 0 ? 1 : -1;
            let signY = innerVelocity.y > 0 ? 1 : -1;
            innerVelocity.y = (newMag / Math.sqrt(direction * direction + 1)) * signY;
            innerVelocity.x = Math.abs(direction * innerVelocity.y) * signX;
        };

        innerVelocity.getMagnitude = function() {
            return Math.sqrt((innerVelocity.x * innerVelocity.x) + (innerVelocity.y * innerVelocity.y));
        };

        let that = {
            sideLength: 10,
            position: {
                x: 0,
                y: 0 
            },
            velocity: {
                get x() { return innerVelocity.x; },
                get y() { return innerVelocity.y; }
            },
            increaseVelocity: function() {
                if (innerVelocity.x > 0) {
                    innerVelocity.x += 0.1;
                }
                else {
                    innerVelocity.x -= 0.1;
                }

                if (innerVelocity.y > 0) {
                    innerVelocity.y += 0.1;
                }
                else {
                    innerVelocity.y -= 0.1;
                }
            },
            reflect: function(yReflection) {
                if (yReflection) {
                    innerVelocity.y = 0 - innerVelocity.y;
                }
                else {
                    innerVelocity.x = 0 - innerVelocity.x;
                }
            },
            paddleBounce: function(posZValue) {
                let oldMagnitude = innerVelocity.getMagnitude();
                let directionY = -1;
                let directionX = posZValue;
                innerVelocity.x = directionX;
                innerVelocity.y = directionY;
                innerVelocity.setMagnitude(oldMagnitude);
            },
            serve: function() {
                let signSelector = Math.floor(Math.random() * 2); // will be a 1 or a 0
                let randomSign = signSelector < 1 ? -1 : 1;
                let randomXVelocity = (Math.random() + 0.2) * randomSign;

                // Set direction
                innerVelocity.x = randomXVelocity;
                innerVelocity.y = -1; // y initial velocity needs to be negative

                // Set magnitude
                innerVelocity.setMagnitude(props.initialBallVelocityMagnitude);
            }
        }

        // initialize ball position to be on paddle
        let PADDLE_START_Y = 930;
        that.position.x = paddle.x - (that.sideLength / 2);
        that.position.y = PADDLE_START_Y - that.sideLength;

        return that;
    }

    function makeNewBall() {
        balls.push(Ball());
    }

    function getPaddleX() {
        return paddle.x;
    }

    function setPaddleX(value) {
        paddle.x = value;
    }

    function getPaddleLength() {
        return paddle.length;
    }

    function setPaddleLength(value) {
        paddle.length = value;
    }

    function getPaddleVisibility() {
        return paddle.visible;
    }

    function setPaddleVisibility(value) {
        paddle.visible = value;
    }

    function getPaddleVelocity() {
        return paddle.velocity;
    }

    return {
        getPaddleX: getPaddleX,
        setPaddleX: setPaddleX,
        getPaddleLength: getPaddleLength,
        setPaddleLength: setPaddleLength,
        getPaddleVisibility: getPaddleVisibility,
        setPaddleVisibility: setPaddleVisibility,
        getPaddleVelocity: getPaddleVelocity,
        getCountdown: getCountdown,
        resetCountdown: resetCountdown,
        getExtraPaddleCount: getExtraPaddleCount,
        setExtraPaddleCount: setExtraPaddleCount,
        countdown: countdown,
        makeNewBall: makeNewBall,
        getState: getState,
        setState: setState,
        balls: balls,
        bricks: bricks,
        initializeBricks: initializeBricks,
        wipeGameState: wipeGameState,
        setNewGameProperty: setNewGameProperty,
        getNewGameProperty: getNewGameProperty,
        getNumBricksRemoved: getNumBricksRemoved,
        setNumBricksRemoved: setNumBricksRemoved,
        upInitialBallVelocityMagnitude: upInitialBallVelocityMagnitude,
        addToScore: addToScore,
        getScore: getScore,
        bricksBrokenByRow: props.bricksBrokenByRow,
        getPaddleShrunk: getPaddleShrunk,
        setPaddleShrunk: setPaddleShrunk,
        getPaddleDecrementsNeeded: getPaddleDecrementsNeeded,
        setPaddleDecrementsNeeded: setPaddleDecrementsNeeded,
        getExtraBallAtX100: getExtraBallAtX100,
        setExtraBallAtX100: setExtraBallAtX100,
        particleSystems: particleSystems
    };
}());