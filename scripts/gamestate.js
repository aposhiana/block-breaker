MyGame.gameState = (function() {
    let paddle = {
        x: 0,
        length: 40,
        velocity: 10
    }

    function getPaddleX() {
        return paddle.x;
    }

    function setPaddleX(value) {
        paddle.x = value;
    }

    function getPaddleVelocity() {
        return paddle.velocity;
    }

    return {
        getPaddleX: getPaddleX,
        setPaddleX: setPaddleX,
        getPaddleVelocity: getPaddleVelocity
    }
}());