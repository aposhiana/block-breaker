MyGame.gameState = (function() {

    let props = {
        countdown: 5
    };

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

    let balls = [];
    
    function Ball() {
        let that = {
            sideLength: 20,
            position: {
                x: (paddle.x - (that.sideLength / 2)),
                y: 960 // TODO: fix this magic number
            },
            velocity: {
                x: 0,
                y: 0,
                get magnitude() {

                },
                set magnitude(value) {

                },
                get direction() {

                },
                set direction(value) {

                }
            }
        }

        // Initialize velocity

        
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
        makeNewBall: makeNewBall
    };
}());