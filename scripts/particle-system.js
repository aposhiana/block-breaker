// THIS CODE WAS ADAPTED FROM DR. MATHIAS'S EXAMPLE CODE
function ParticleSystem(spec, graphics, context) {
	let that = {};
	let particles = [];
	let image = new Image();
	image.onload = function () {
		that.render = function() {
			for (let i = 0; i < particles.length; i++) {
				if (particles[i].alive >= 100) {
					graphics.drawImage(
                        context,
						particles[i].position,
						particles[i].size,
						particles[i].rotation,
						image);
				}
			}
		};	
	};
    image.src = spec.image;
    
    that.initiate = function() {
        let keepMe = [];
        for (let i = 0; i < 250; i++) {
            let positionX = (Math.random() * (spec.position.xMax - spec.position.xMin)) + spec.position.xMin;
            let positionY = (Math.random() * (spec.position.yMax - spec.position.yMin)) + spec.position.yMin;

			let p = {
				position: { x: positionX, y: positionY },
				direction: Random.nextCircleVector(),
				speed: Random.nextGaussian( spec.speed.mean, spec.speed.stdev ),	// pixels per millisecond
				rotation: 0,
				lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// milliseconds
				alive: 0,
				size: Random.nextGaussian(spec.size.mean, spec.size.stdev),
				fill: spec.fill,
				stroke: 'rgb(0, 0, 0)'
			};
			keepMe.push(p);
		}
		particles = keepMe;
    }

	that.update = function(elapsedTime) {
		let keepMe = [];

		for (let i = 0; i < particles.length; i++) {
			particles[i].alive += elapsedTime;
			particles[i].position.x += (elapsedTime * particles[i].speed * particles[i].direction.x);
			particles[i].position.y += (elapsedTime * particles[i].speed * particles[i].direction.y);
			particles[i].rotation += particles[i].speed / 0.5;

			if (particles[i].alive <= particles[i].lifetime) {
				keepMe.push(particles[i]);
			}
		}
		particles = keepMe;
	};

	that.render = function() {};

	return that;
}
