
// Classe Follower encapsulant un MovieClip
function Follower(daltonIndex){

	// Le movieclip de la classe
	this.clip = new MovieClip();
	
	// Le numero correspondant au frere Dalton
	this.index = daltonIndex;

	// Action :
	// 0 running
	// 1 jumping
	// 2 ducking
	this.action = 0; 
	this.velocity = 0;

	// State
	this.hitted = false;
	this.healed = false;

	// Timing
	this.hittedStart = 0;
	this.healingStart = 0;
	this.duckStart = 0;
	this.jumpStart = 0;
	this.daltonDelay = 0.1;
	
	// Boolean helpers for delayed setup
	this.duckSetuped = false;
	this.jumpSetuped = false;
	this.runSetuped = false;
	this.fallSetuped = false;
	this.fallPlayedOnce = false;
	
	// Boolean helpers for delayed action
	this.rejump = false;
	this.reduck = false;
	
	this.positionSave = { x:0, y:0 };
	this.positionSaveHit = { x:0, y:0 };
	this.positionSaveHeal = { x:0, y:0 };
	
	// Reset
	this.reset = function()
	{
		this.action = 0;
		this.alpha = 1;
		this.frame = 0;
		this.rotation = 0;
		this.life = 3;
		
		this.hitted = false;
		this.healed = false;
		
		this.duckSetuped = false;
		this.runSetuped = false;
		this.jumpSetuped = false;
		this.fallSetuped = false;
		this.rejump = false;
		this.reduck = false;
	}

	// Main Loop
	this.update = function()
	{
		// Draw clip
		this.clip.draw();
	
		switch (this.action) {
		
			// RUN
			case 0 : default :
			
				// Relancement du sautait
				// (si le frere Dalton etait dans les airs pendant que le joueur sautait)
				if (this.rejump)
				{
					this.rejump = false;
					this.DelayJump();
				}
				// Idem avec l'accroupissement
				else if (this.reduck)
				{
					this.reduck = false;
					this.DelayDuck();
				}
				
			break;
		
			// JUMP
			case 1 :
			
				// Delay
				if (this.jumpStart < timeElapsed) {
			
					// Setup Animation (once)
					if (this.jumpSetuped == false) {
						this.SetupAnimJump();
						this.clip.y = posGround.y - 1 - this.clip.height * this.clip.scaleX;
						this.velocity = objPlayer.jumpImpulse;
					}
					
					// Clip touch ground (stop jump)
					if (this.clip.y >= posGround.y - this.clip.height * this.clip.scaleX) 
						this.Run();
				}
			
			break;
			
			// DUCK
			case 2 :
				
				// Animation Delay
				if (this.hitted == false && this.duckStart < timeElapsed && this.duckSetuped == false)
					this.SetupAnimDuck();
				
				// End of animation
				if (this.duckSetuped == true && this.duckStart + objPlayer.duckDelay < timeElapsed)
					this.Run();
			
			break;
		}
		
		// Clip in the air
		if (this.clip.y < posGround.y - this.clip.height * this.clip.scaleX) {
			// Falling
			this.velocity -= objPlayer.gravity * deltaTime;
			this.clip.y = Math.min(this.clip.y - this.velocity, posGround.y - this.clip.height * this.clip.scaleX);
		}
		
		// Healed
		if (this.healed)
		{
			// Delay
			if (this.healingStart + objPlayer.healingDelay > timeElapsed)
			{
				// Scroll accelerate
				var ratio = (timeElapsed - this.healingStart) / objPlayer.healingDelay;
				this.clip.x = this.positionSaveHeal.x + ratio * distanceBetweenDalton;
			}
			else
			{
				// Reset state
				this.healed = false;
			}
		}
		// Hitted
		else if (this.hitted)
		{
			// Animation Delay
			if (this.fallPlayedOnce == false
				&& this.hittedStart < timeElapsed
				&& this.fallSetuped == false)
					this.SetupAnimFall();
				
			// Animation Callback
			if (this.fallSetuped && this.clip.frame >= 40)
				this.SetupAnimRun();
			
			// Delay
			if (this.hittedStart - this.daltonDelay * this.index + objPlayer.hittedDelay > timeElapsed)
			{
				// Clignotement
				this.clip.alpha = 0.5 + (1 + Math.cos(timeElapsed*50)) * 0.25;
				
				// Scroll decelerate
				var ratio = (timeElapsed - this.hittedStart) / objPlayer.hittedDelay;
				this.clip.x = this.positionSaveHit.x - ratio * distanceBetweenDalton;
			}
			// Reset state
			else
			{
				this.clip.alpha = 1;
				this.hitted = false;
				this.fallPlayedOnce = false;
				this.Run();
			}
		}
	}	
	
	// Setup Run State
	this.Run = function()
	{
		this.action = 0;
		this.SetupAnimRun();
	}

	// Setup Delayed Jump State
	this.DelayJump = function()
	{
		// Si Brother Dalton n'est pas deja en train de sauter
		if (this.action != 1) {
			this.action = 1;
			this.jumpStart = timeElapsed + this.daltonDelay * this.index;
		// Brother Dalton resautera une fois atteri au sol
		} else this.rejump = true;
	}
	
	// Setup Delayed Duck State
	this.DelayDuck = function()
	{
		// Si Brother Dalton est en train de courir
		// if (this.action == 0) {
		if (this.hitted == false) {
			this.duckSetuped = false;
			this.duckStart = timeElapsed + this.daltonDelay * this.index;
			this.action = 2;
		}
		// Brother Dalton s'accroupira la prochaine fois
		// } else 
			// this.reduck = true;
	}

	// Setup Delayed Hurt
	this.DelayHurt = function()
	{
		// Lose one life
		this.life = Math.max(0, this.life - 1);
		
		// Seulement INGAME (pas pendant TransitionWin/Lost)
		if (levelState == 0) {
			this.hitted = true;
			this.hittedStart = timeElapsed + this.daltonDelay * this.index + (this.healed ? objPlayer.healingDelay : 0);
			this.positionSaveHit.x = this.clip.x;
		}
	}

	// Setup Heal
	this.RestoreOneLife = function()
	{
		// Add one life
		this.life = Math.min(this.life + 1, 3);
		
		// Seulement INGAME (pas pendant TransitionWin/Lost)
		if (levelState == 0) {
			this.healed = true;
			this.healingStart = timeElapsed + (this.hitted ? objPlayer.hittedDelay : 0);
			this.positionSaveHeal.x = this.clip.x;
		}
	}
	
	// Setup Animation Run
	this.SetupAnimRun = function()
	{
		this.clip.scaleX = this.clip.scaleY = 2/3 + ((this.index)*(1/9));
		this.clip.offset.x = 0;
		this.clip.offset.y = 0;
		this.clip.width = 103;
		this.clip.height = 156;
		this.clip.spriteSheetGrid = 8;
		this.clip.frameSkip = 2;
		this.clip.totalFrames = 36;
		this.clip.image = imgDaltonRun;
		this.clip.animate();
		this.clip.frame = Math.floor(Math.random() * this.clip.totalFrames);
		
		this.runSetuped = true;
		this.jumpSetuped = this.duckSetuped = this.fallSetuped = false;
	}

	// Setup Animtion Jump
	this.SetupAnimJump = function()
	{
		this.clip.scaleX = this.clip.scaleY = 2/3 + ((this.index)*(1/9));
		this.clip.offset.x = -28;
		this.clip.offset.y = 0;
		this.clip.width = 163;
		this.clip.height = 183;
		this.clip.frame = 0;
		this.clip.spriteSheetGrid = 8;
		this.clip.frameSkip = 2;
		this.clip.totalFrames = 19;
		this.clip.image = imgDaltonJump;
		this.clip.animate();
		this.clip.aLooping = false;
		
		this.jumpSetuped = true;
		this.runSetuped = this.duckSetuped = this.fallSetuped = false;
	}
	
	// Setup Animation Duck
	this.SetupAnimDuck = function()
	{	
		this.clip.offset.x = -20;
		this.clip.offset.y = 25 + this.index * 2;
		this.clip.scaleX = 4/5 + ((this.index)*(1/9));
		this.clip.scaleY = 3/5 + ((this.index)*(1/9));
		this.clip.width = 110;
		this.clip.height = 143;
		this.clip.spriteSheetGrid = 8;
		this.clip.frameSkip = 2;
		this.clip.image = imgDaltonDuck;
		this.clip.animate();
		this.clip.frame = 16;
		this.clip.totalFrames = 44;
		this.clip.aLooping = false;
		
		this.duckStart = timeElapsed;
		
		this.duckSetuped = true;
		this.runSetuped = this.jumpSetuped = this.fallSetuped = false;
	}

	// Setup Animation Fall
	this.SetupAnimFall = function()
	{
		this.clip.offset.x = -22;
		this.clip.offset.y = -24;
		this.clip.scaleX = this.clip.scaleY = 4/5 + ((this.index)*(1/9));
		this.clip.width = 121;
		this.clip.height = 156;
		this.clip.spriteSheetGrid = 8;
		this.clip.frameSkip = 2;
		this.clip.totalFrames = 42;
		this.clip.image = imgDaltonFall;
		this.clip.animate();
		this.clip.frame = 11;
		this.clip.aLooping = false;
		this.clip.aCb = this.SetupAnimRun;
		
		this.fallPlayedOnce = true;
		this.fallSetuped = true;
		this.runSetuped = this.jumpSetuped = this.duckSetuped = false;
	}

	// Setup Transition Win
	this.SetupWinState = function()
	{
		this.positionSave.x = this.clip.x;
		this.clip.alpha = 1;
	}
	// Transition Win
	this.TransitionWin = function()
	{
		var ratio = (timeElapsed - transitionStart) / transitionDelay;
		this.clip.x = this.positionSave.x + ratio * (screenWidth - this.positionSave.x + this.clip.width + distanceBetweenDalton * (4 - this.index));
	}

	this.SetupLostState = function()
	{
		this.positionSave.x = this.clip.x;
		this.clip.alpha = 1;
	}

	this.TransitionLost = function()
	{
		var ratio = (timeElapsed - transitionStart) / transitionDelay;
		this.clip.x = this.positionSave.x - ratio * (screenWidth - this.positionSave.x - this.clip.width);
	}
}