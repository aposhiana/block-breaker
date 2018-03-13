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

        // Draw bricks
        let BRICK_WIDTH = 65;
        let BRICK_HEIGHT = 30;
        let brickColors = [
            '#42f46b', '#42f46b',
            '#494cfc', '#494cfc',
            '#ff9000', '#ff9000',
            '#fffa35', '#fffa35'
        ];
        for (let row = 0; row < gameState.bricks.length; row++) {
            for (let col = 0; col < gameState.bricks[row].length; col++) {
                let brickPos = gameState.bricks[row][col].position;
                context.beginPath();
                context.strokeStyle = brickColors[row];
                context.lineWidth = 1;
                context.moveTo(brickPos.x, brickPos.y);
                context.lineTo(brickPos.x + BRICK_WIDTH, brickPos.y);
                context.lineTo(brickPos.x + BRICK_WIDTH, brickPos.y + BRICK_HEIGHT);
                context.lineTo(brickPos.x, brickPos.y + BRICK_HEIGHT);
                context.closePath();
                context.fillStyle = brickColors[row];
                context.fill();
                context.stroke();
            } 
        }
        
        // Draw paddle
        let PADDLE_START_Y = 930;
        let PADDLE_HEIGHT = 20;
        let paddleLen = gameState.getPaddleLength();
        let startPaddle = gameState.getPaddleX() - (paddleLen / 2);
        context.beginPath();
        context.strokeStyle = '#FFFFFF';
        context.lineWidth = 1;
        context.moveTo(startPaddle, PADDLE_START_Y);
        context.lineTo(startPaddle + paddleLen, PADDLE_START_Y);
        context.lineTo(startPaddle + paddleLen, PADDLE_START_Y + PADDLE_HEIGHT);
        context.lineTo(startPaddle, PADDLE_START_Y + PADDLE_HEIGHT);
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