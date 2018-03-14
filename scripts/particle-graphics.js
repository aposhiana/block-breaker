MyGame.graphics = (function() {
    function drawImage(context, center, size, rotation, image) {
        context.save();
        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);
    
        context.drawImage(
            image,
            center.x - size / 2,
            center.y - size / 2,
            size, size);
    
        context.restore();
    }

    return {
		drawImage: drawImage
	};
}());
