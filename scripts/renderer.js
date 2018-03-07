MyGame.renderer = (function(gameState) {
    'use strict';

    // Hard coded strings to sources of images - initialize changes these to actual images
    let images = {
        backgroundImg: 'images/mountain-clouds.jpg'
    };

    function render(context) {
        context.clear();

        if (images.backgroundImg.isReady) {
	    	context.drawImage(images.backgroundImg, 0, 0, 1000, 1000);
        }

        // Draw outer walls
        context.beginPath();
        context.strokeStyle = '#1e1e1e';
        context.lineWidth = 10;
        context.moveTo(5, 1000);
        context.lineTo(5, 5);
        context.lineTo(995, 5);
        context.lineTo(995, 1000);
        context.stroke();
        
        // Draw paddle
        let paddleLen = gameState.getPaddleLength();
        let paddlePos = gameState.getPaddleX();
        let startPaddle = paddlePos - (paddleLen / 2);
        context.beginPath();
        context.strokeStyle = '#FFFFFF';
        context.lineWidth = 1;
        context.moveTo(startPaddle, 950);
        context.lineTo(startPaddle + paddleLen, 950);
        context.lineTo(startPaddle + paddleLen, 970);
        context.lineTo(startPaddle, 970);
        context.closePath();
        context.fillStyle = '#FFFFFF';
        context.fill();
        context.stroke();

        // Draw balls
        for (let i = 0; i < gameState.balls.length; i++) {
            let topLeftBallX = gameState.balls[i].position.x;
            let topLeftBallY = gameState.balls[i].position.y;
            let ballSideLength = gameState.balls[i].sideLength;

            context.beginPath();
            context.strokeStyle = '#FFFFFF';
            context.lineWidth = 1;
            context.moveTo(topLeftBallX, topLeftBallY);
            context.lineTo(topLeftBallX + ballSideLength, topLeftBallY);
            context.lineTo(topLeftBallX + ballSideLength, topLeftBallY + ballSideLength);
            context.lineTo(topLeftBallX, topLeftBallY + ballSideLength);
            context.closePath();
            context.fillStyle = '#ccff15';
            context.fill();
            context.stroke();
        }
    }

    return {
        render: render,
        images: images
    };
}(MyGame.gameState));