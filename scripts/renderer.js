MyGame.renderer = (function(gameState) {
    'use strict';

    // Hard coded strings to sources of images - initialize changes these to actual images
    let images = {
        backgroundImg: 'images/mountain-clouds.jpg'
    };

    function render(context, elapsedTime) {
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

        // Draw extra paddles
        let EXTRA_PADDLE_Y = 980;
        let EXTRA_PADDLE_WIDTH = 20;
        let EXTRA_PADDLE_HEIGHT = 10;
        let extraPaddleX = 20;

        for (let i = 0; i < gameState.getExtraPaddleCount(); i++) {
            context.beginPath();
            context.strokeStyle = 'lightgrey';
            context.lineWidth = 1;
            context.moveTo(extraPaddleX, EXTRA_PADDLE_Y);
            context.lineTo(extraPaddleX + EXTRA_PADDLE_WIDTH, EXTRA_PADDLE_Y);
            context.lineTo(extraPaddleX + EXTRA_PADDLE_WIDTH, EXTRA_PADDLE_Y + EXTRA_PADDLE_HEIGHT);
            context.lineTo(extraPaddleX, EXTRA_PADDLE_Y + EXTRA_PADDLE_HEIGHT);
            context.closePath();
            context.fillStyle = 'lightgrey';
            context.fill();
            context.stroke();
            extraPaddleX += EXTRA_PADDLE_WIDTH + 10;
        }

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
                if (!gameState.bricks[row][col].visible) {
                    continue;
                }
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
        if (gameState.getPaddleVisibility()) {
            let PADDLE_START_Y = 930;
            let PADDLE_HEIGHT = 25;
            let paddleLen = gameState.getPaddleLength();
            let startPaddle = gameState.getPaddleX() - (paddleLen / 2);

            context.beginPath();
            context.strokeStyle = '#665d47';
            context.lineWidth = 1;
            context.moveTo(startPaddle, PADDLE_START_Y);
            context.lineTo(startPaddle + paddleLen, PADDLE_START_Y);
            context.lineTo(startPaddle + paddleLen, PADDLE_START_Y + PADDLE_HEIGHT);
            context.lineTo(startPaddle, PADDLE_START_Y + PADDLE_HEIGHT);
            context.closePath();
            context.fillStyle = '#665d47';
            context.fill();
            context.stroke();

            // Draw paddle top
            context.beginPath();
            context.strokeStyle = 'white';
            context.lineWidth = 6;
            context.moveTo(startPaddle, PADDLE_START_Y + 3);
            context.lineTo(startPaddle + paddleLen, PADDLE_START_Y + 3);
            context.stroke();
        }
        
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

        // Render score
        context.font = '20px sans-serif';
        context.fillStyle = '#ccff15';
        context.fillText('Score: ' + gameState.getScore(), 880, 985);

        // Render countdown if in countdown
        if (gameState.getState() === 'countdown') {
            let countValue = gameState.getCountdown();
            if (countValue > 0) {
                context.font = '200px sans-serif';
                context.fillStyle = 'black';
                let halfTextWidth = context.measureText(countValue).width / 2;
                context.fillText(countValue, 500 - halfTextWidth, 560);
            }  
        }

        // Render GAME OVER if in gameover
        if (gameState.getState() === 'gameover') {
            context.save();
            context.translate(0,0);
            context.font = 'bold 120px sans-serif';
            context.fillStyle = 'black';
            context.shadowColor = 'darkslategrey';
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 10;
            let halfTextWidth = context.measureText('GAME OVER').width / 2;
            context.fillText('GAME OVER', 500 - halfTextWidth, 525);
            context.font = 'bold 42px sans-serif';
            halfTextWidth = context.measureText('press ESC to exit').width / 2;
            context.fillText('press ESC to exit', 500 - halfTextWidth, 620);
            context.restore();
        }

        // Render particles
        for (let i = 0; i < gameState.particleSystems.length; i++) {
            gameState.particleSystems[i].update(elapsedTime);
            gameState.particleSystems[i].render();
        }
    }

    return {
        render: render,
        images: images
    };
}(MyGame.gameState));