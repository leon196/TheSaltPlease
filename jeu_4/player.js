
function Player(){}
Player.prototype = new MovieClip();

// Action :
// 0 running
// 1 jumping
// 2 ducking
Player.prototype.action = 0; 

// Lifes
Player.prototype.life = 3;
Player.prototype.hitted = false;
Player.prototype.healed = false;

// Timing
Player.prototype.healingStart = 0;
Player.prototype.healingDelay = 2;
Player.prototype.hittedStart = 0;
Player.prototype.hittedDelay = 2;
Player.prototype.duckStart = 0;
Player.prototype.duckDelay = 0.5;

// Positions
Player.prototype.positionSave = { x:0, y:0 };
Player.prototype.positionSaveHeal = { x:0, y:0 };
Player.prototype.positionSaveHit = { x:0, y:0 };

// Velocity
Player.prototype.velocity = 0;
Player.prototype.jumpImpulse = 16;
Player.prototype.gravity = 50;

// Pour la transition de victoire,
// le joueur sort de l'ecran et pousse tout les obstacles restant
Player.prototype.cinematicMode = false;

// Reset
Player.prototype.reset = function()
{
	this.action = 0;
	this.alpha = 1;
	this.frame = 0;
	this.rotation = 0;
	this.life = 3;
	this.cinematicMode = false;
	this.healed = false;
	this.hitted = false;
}

// Main Loop
Player.prototype.update = function()
{		
	switch (this.action) {
		
		// Run
		case 0 : default :
		
				// Key Jump
				if (keyUp) this.Jump();
				
				// Key Duck
				else if (keyDown) this.Duck();
				
		break;
		
		// Jump
		case 1 :
			
			if (this.y >= posGround.y - this.height * this.scaleX) 
				this.Run();
			
		break;
		
		// Duck
		case 2 :
		
			if (this.duckStart + this.duckDelay < timeElapsed)
			// || keyDown == false) 
				this.Run();
			
		break;
	}
	
	// Player in air
	if (this.y < posGround.y - this.height * this.scaleX) {
		// Falling
		this.velocity -= this.gravity * deltaTime;
		this.y = Math.min(this.y - this.velocity, posGround.y - this.height * this.scaleX);
	}
	
	// Healed
	if (this.healed)
	{
		// Delay
		if (this.healingStart + this.healingDelay > timeElapsed)
		{
			// Scroll accelerate
			var ratio = (timeElapsed - this.healingStart) / this.healingDelay;
			this.x = this.positionSaveHeal.x + ratio * distanceBetweenDalton;
		}
		// Reset state
		else this.healed = false;
	}
	// Hitted
	else if (this.hitted)
	{
		// Delay
		if (this.hittedStart + this.hittedDelay > timeElapsed)
		{
			// Clignotement
			this.alpha = 0.5 + (1 + Math.cos(timeElapsed*50)) * 0.25;
			// Scroll decelerate
			var ratio = (timeElapsed - this.hittedStart) / this.hittedDelay;
			this.x = this.positionSaveHit.x - ratio * distanceBetweenDalton;
		}
		// Reset state
		else
		{
			this.alpha = 1;
			this.hitted = false;
			this.SetupAnimRun();
		}
	}
}

// Setup Run State
Player.prototype.Run = function()
{
	this.SetupAnimRun();
	this.action = 0;
}
// Setup Jump State
Player.prototype.Jump = function()
{
	this.SetupAnimJump();
	this.y = posGround.y - 1 - this.height * this.scaleX;
	this.velocity = this.jumpImpulse;
	this.action = 1;
	
	// Dalton Brothers Jump Delayed
	for (var i = 0; i < 3; i++) objDaltons[i].DelayJump();
}
// Setup Duck State
Player.prototype.Duck = function()
{
	this.SetupAnimDuck();
	this.duckStart = timeElapsed;
	this.action = 2;
	
	// Daltons Brothers Duck Delayed
	for (var i = 0; i < 3; i++) objDaltons[i].DelayDuck();
}

// Hurt Player
Player.prototype.Hurt = function()
{
	// Seulement INGAME (pas pendant TransitionWin/Lost)
	if (levelState == 0)
	{
		// Lose one life
		this.life = Math.max(0, this.life - 1);
		
		// Animation
		this.SetupAnimFall();
		
		// Save position
		this.positionSaveHit.x = this.x;
		
		// Game Over
		if (this.life == 0)
		{
			transitionStart = timeElapsed;
			this.SetupLostState();
			for (var i = 0; i < 3; i++) objDaltons[i].SetupLostState();
			// Transition Lost
			levelState = 2;
			
		// Hitted
		} else
		{
			this.hitted = true;
			this.hittedStart = timeElapsed + (this.healed ? this.healingDelay : 0);
		}
		
		// Dalton Brothers Hurt Delayed
		for (var i = 0; i < 3; i++) objDaltons[i].DelayHurt();
	}
}

// Heal Player
Player.prototype.RestoreOneLife = function()
{
	this.life = Math.min(this.life + 1, 3);
	
	// Seulement INGAME (pas pendant TransitionWin/Lost)
	if (levelState == 0) {
		this.healed = true;
		this.healingStart = timeElapsed + (this.hitted ? this.hittedDelay : 0);
		this.positionSaveHeal.x = this.x;
		
		// Heal Dalton Brothers Delayed
		for (var i = 0; i < 3; i++) objDaltons[i].RestoreOneLife();
	}
}

// Setup Transition Win
Player.prototype.SetupWinState = function()
{
	this.positionSave.x = this.x;
	this.cinematicMode = true;
	this.alpha = 1;
}
// Transition Win
Player.prototype.TransitionWin = function()
{
	var ratio = (timeElapsed - transitionStart) / transitionDelay;
	this.x = this.positionSave.x + ratio * (screenWidth - this.positionSave.x + this.width + distanceBetweenDalton * 4);
}

// Setup Transition Lost
Player.prototype.SetupLostState = function()
{
	this.positionSave.x = this.x;
	this.alpha = 1;
}
// Transition Lost
Player.prototype.TransitionLost = function()
{
	var ratio = (timeElapsed - transitionStart) / transitionDelay;
	this.x = this.positionSave.x - ratio * (screenWidth - this.positionSave.x - this.width);
}

// Setup Animation Run
Player.prototype.SetupAnimRun = function()
{
	this.scaleX = this.scaleY = 2/3;
	this.offset.x = 0;
	this.offset.y = 0;
	this.width = 103;
	this.height = 156;
	this.frame = 0;
	this.spriteSheetGrid = 8;
	this.frameSkip = 2;
	this.totalFrames = 36;
	this.image = imgDaltonRun;
	this.animate();
}

// Setup Animation Jump
Player.prototype.SetupAnimJump = function()
{	
	this.scaleX = this.scaleY = 2/3;
	this.offset.x = -28;
	this.offset.y = 0;
	this.width = 163;
	this.height = 183;
	this.frame = 0;
	this.spriteSheetGrid = 8;
	this.frameSkip = 2;
	this.totalFrames = 19;
	this.image = imgDaltonJump;
	this.animate();
	this.aLooping = false;
}

// Setup Animation Duck
Player.prototype.SetupAnimDuck = function()
{	
	this.offset.x = -20;
	this.offset.y = 20;
	this.scaleX = 4/5;
	this.scaleY = 3/5;
	this.width = 110;
	this.height = 143;
	this.spriteSheetGrid = 8;
	this.frameSkip = 2;
	this.totalFrames = 32;
	this.image = imgDaltonDuck;
	this.animate();
	this.frame = 16;
	this.aLooping = false;
}

// Setup Animation Fall
Player.prototype.SetupAnimFall = function()
{
	this.offset.x = -22;
	this.offset.y = -24;
	this.scaleX = this.scaleY = 4/5;
	this.width = 121;
	this.height = 156;
	this.spriteSheetGrid = 8;
	this.frameSkip = 2;
	this.totalFrames = 42;
	this.image = imgDaltonFall;
	this.animate();
	this.frame = 11;
	this.aLooping = false;
	this.aCb = this.SetupAnimRun;
}

// Hard coded bounds positions
Player.prototype.PlayerBounds = function()
{	
	var bounds = { x:0, y:0, w:0, h:0 };
	// Duck
	if (keyDown) {
		bounds.x = this.x + 15;
		bounds.y = this.y + 60;
		bounds.w = 35;
		bounds.h = 37;
	// Run / Jump
	} else {
		bounds.x = this.x + 15;
		bounds.y = this.y + 10;
		bounds.w = 35;
		bounds.h = 77;
	}
	return bounds;
}