MyGame.gameState = (function() {
    'use strict';

    let balls = [];
    let bricks = [];

    let props = {
        countdown: 3,
        state: 'countdown',
        newGame: true
    };

    let paddle = {
        x: 500,
        length: 100,
        velocity: 0.01
    };

    function wipeGameState() {
        balls.splice(0, balls.length);
        bricks.splice(0, bricks.length);

        props.countdown = 3;
        props.state = 'countdown';

        paddle.x = 500;
        paddle.length = 100;
        paddle.velocity = 1;
    }

    function setNewGameProperty(value) {
        props.newGame = value;
    }

    function getNewGameProperty() {
        return props.newGame;
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
        let pointsPerBrickByRow = [1, 2, 3, 5, 25];
        let SPACE = 5;

        let rowHeight = 200; // Set to height of first row
        for (let row = 0; row < NUM_ROWS; row++) {
            let row = [];
        
            let colX = SPACE + 7; // Set to the x offset of first bricks in a row
            for (let col = 0; col < NUM_COLS; col++) {
                let spec = {
                    points: pointsPerBrickByRow[row],
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
                innerVelocity.x += 5;
                innerVelocity.y += 5;
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
                let initialVelocityMagnitude = 0.3;
                innerVelocity.setMagnitude(initialVelocityMagnitude);
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

    function getPaddleVelocity() {
        return paddle.velocity;
    }

    return {
        getPaddleX: getPaddleX,
        setPaddleX: setPaddleX,
        getPaddleLength: getPaddleLength,
        getPaddleVelocity: getPaddleVelocity,
        getCountdown: getCountdown,
        countdown: countdown,
        makeNewBall: makeNewBall,
        setState: setState,
        balls: balls,
        bricks: bricks,
        initializeBricks: initializeBricks,
        wipeGameState: wipeGameState,
        setNewGameProperty: setNewGameProperty,
        getNewGameProperty: getNewGameProperty
    };
}());