
// Classe Obstacle encapuslant un MovieClip

function Obstacle()
{
	this.init = false;
	this.clip = new MovieClip();
	this.jumpType = true;
	this.velocity = 17;
	this.gravity = 50;
	this.timeStarted = 0;
	
	this.warninged = false;
	this.positionSaveX = 0;
	
	// Si vrai, la vitesse de scroll est augmente
	this.fleche = false;

	// Animation de chute
	this.fall = function ()
	{
		// Setup initialization
		if (!this.init)
		{
			this.timeStarted = timeElapsed;
			this.init = true;
		}
		// Falling
		if (this.clip.y < screenHeight + this.clip.height)
		{
			this.velocity -= this.gravity * deltaTime;
			this.clip.y -= this.velocity;
			this.clip.rotation = ((timeElapsed - timeStarted) % 1) * Math.PI * 2;
		}
		// Stop
		else
		{
			this.clip.visible = false;
		}
	}
	
	this.SetupWarning = function()
	{
		if (this.warninged == false)
		{
			this.positionSaveX = this.clip.x;
			this.warninged = true;
		}
	}

}