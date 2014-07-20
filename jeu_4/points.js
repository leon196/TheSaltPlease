
function Points() {}
Points.prototype = new MovieClip();

Points.prototype.startTime = 0;
Points.prototype.amount = "";
Points.prototype.delay = 1;
Points.prototype.offsetY = -60;

Points.prototype.initialize = function(x, y, amount)
{
	this.x = this.xInitiale = x;
	this.y = this.yInitiale = y;
	this.startTime = timeElapsed;
	this.amount = amount;
}

Points.prototype.update = function()
{		
	// Stop
	if (this.startTime + this.delay < timeElapsed)
		return false;

	// Update Position
	this.y = this.yInitiale + this.offsetY * (timeElapsed - this.startTime) / this.delay;
	
	// Opacity
	this.alpha = 1 - (timeElapsed - this.startTime) / this.delay;
	
	// Continue
	return true;
}

function drawPoints(points)
{
	ctx.font = "40px subaccuznormal";
	ctx.textAlign = "center";
	for (var i = 0; i < points.length; i++) {
		// Shadow
		ctx.fillStyle = "rgba(61, 61, 61, " + points[i].alpha * 0.5 + ")";
		ctx.fillText((points[i].amount), points[i].x + 1, points[i].y + 1);
		// Text
		ctx.fillStyle = "rgba(245, 255, 250, " + points[i].alpha + ")";
		ctx.fillText((points[i].amount), points[i].x, points[i].y);
		// Clean
		if (points[i].update() == false) {
			points.splice(i, 1);
			i = Math.max(0, i - 1);
		}
	}
}