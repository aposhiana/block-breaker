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
        context.moveTo(0, 999);
        context.lineTo(0, 0);
        context.lineTo(999, 0);
        context.lineTo(999, 999);
        context.stroke();
        
        let paddleLen = gameState.getPaddleLength();
        let paddlePos = gameState.getPaddleX();
        let startPaddle = paddlePos - (paddleLen / 2);
        context.beginPath();
        context.strokeStyle = '#FFFFFF';
        context.lineWidth = 20;
        context.lineWidth = 20;
        context.moveTo(startPaddle, 975);
        context.lineTo(startPaddle + paddleLen, 975)
        context.stroke();
    }

    return {
        render: render,
        images: images
    };
}(MyGame.gameState));