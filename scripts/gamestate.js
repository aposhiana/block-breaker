MyGame.gameState = (function() {

    let balls = [];

    let props = {
        countdown: 5,
        state: 'countdown'
    };

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

    let paddle = {
        x: 500,
        length: 100,
        velocity: 1
    };
    
    function Ball() {

        let innerVelocity = {
            x: 0,
            y: 0
        };

        innerVelocity.setMagnitude = function(newMag) {
            let direction = innerVelocity.x / innerVelocity.y;
            let signX = innerVelocity.x > 0 ? 1 : -1;
            let signY = innerVelocity.y > 0 ? 1 : -1;
            innerVelocity.y = (newMag * newMag / Math.sqrt(direction * direction + 1)) * signY;
            innerVelocity.x = Math.abs(direction * innerVelocity.y) * signX;
        };

        innerVelocity.getMagnitude = function() {
            return Math.sqrt((innerVelocity.x * innerVelocity.x) + (innerVelocity.y * innerVelocity.y));
        };

        let that = {
            sideLength: 10,
            collisionImmunity: 0.0,
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
            reflect: function(positiveReflection) {
                let oldX = innerVelocity.x;
                if (positiveReflection) {
                    innerVelocity.x = innerVelocity.y;
                    innerVelocity.y = 0 - oldX;
                }
                else {
                    innerVelocity.x = 0 - innerVelocity.y;
                    innerVelocity.y = oldX;
                }
            },
            paddleBounce: function(posZValue) {

            },
            serve: function() {
                let signSelector = Math.floor(Math.random() * 2); // will be a 1 or a 0
                let randomSign = signSelector < 1 ? -1 : 1;
                let randomXVelocity = (Math.floor(Math.random() * 3) + 1) * randomSign;

                // Random Y initial velocity should always be negative
                let randomYVelocity = 0 - (Math.floor(Math.random() + 1) * 10);

                // Set direction
                innerVelocity.x = randomXVelocity;
                innerVelocity.y = randomYVelocity;

                // Set magnitude
                let initialVelocityMagnitude = 0.5;
                innerVelocity.setMagnitude(initialVelocityMagnitude);
            }
        }

        // initialize ball position to be on paddle
        that.position.x = paddle.x - (that.sideLength / 2);
        that.position.y = 940; // TODO: fix this magic number

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
        balls, balls
    };
}());