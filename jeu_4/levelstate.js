function drawScroll()
{
	// Background
	scrollXBackground();

	var move = scrollSpeed.x * deltaTime * speeds[niveau];
	
	// Score
	score += move / 100;
	
	switch (currentObstacle)
	{
		/* SPAWN */
		
		// None
		case 0 : default :
		
			// Wait for start
			if (gameStart + gameStartDelay > timeElapsed) return;
			
			// Spawn new random obstacle
			else
			{
				// Bonus One Life Up
				if (objPlayer.life < 3 && Math.random() < 0.2) currentObstacle = 2;
				
				// Sinus Bonus (score) 
				else if (Math.random() < 0.2) currentObstacle = 3;
				
				// Obstacles
				else currentObstacle = 1;
				
				// currentObstacle = 1;
				
				switch (currentObstacle)
				{
					// Obstacle
					case 1 : 
						// Spawn
						spawnObstacle();
						// Warning
						objWarning.scaleX = objWarning.scaleY = 0.01;
						objWarning.visible = true;
					break;
					// Bonus
					case 2 : spawnBonus(); break;
					// Sinus Bonus
					case 3 : spawnSinusBonus(); break;
					
					default : break;
				}
			}
		break;
		
		/* SCROLL */
		
		// Obstacle
		case 1 :
		
			var len = obstacles.length;
			var warned = -1;
			// Si le dernier obstacle sort de l'ecran
			if (obstacles[len-1].clip.x + 200 > 0)
			{
				for (var i = 0; i < len; i++)
				{
					// Warning
					if (warned == -1 && obstacles[i].clip.x > screenWidth)
					{
						objWarning.image = (obstacles[i].jumpType ? imgWarningUp : imgWarningDown);
						obstacles[i].SetupWarning();
						warned = i;
					}
				
					// Scroll Obstacle
					if (obstacles[i].clip.x + 200 > 0)
						obstacles[i].clip.x -= move * (obstacles[i].fleche ? flecheSpeedRatio : 1);
					// Out of screen animation
					if (obstacles[i].clip.x <= 0 && obstacles[i].clip.collided == false)
						obstacleOutOfScreen(i);
				}
			}
			// Ready for new obstacle
			else
			{
				currentObstacle = 0;
				obstacles = new Array();
			}
			
			// Warning Grow
			if (warned != -1)
			{
				var ratio = (obstacles[warned].positionSaveX - obstacles[warned].clip.x) / (obstacles[warned].positionSaveX - screenWidth);
				objWarning.scaleX = objWarning.scaleY = 0.01 + ratio;
			} 
			// Hide Warning
			else if (objWarning.visible)
				objWarning.visible = false;
			
		break;
		
		// Bonus
		case 2 :
			// Scroll
			if (objBonus.x + 128 > 0) objBonus.x -= move;
			// Ready for new obstacle
			else  currentObstacle = 0;
		break;
		
		// Sinus Bonus
		case 3 :
			//  Scroll
			if (sinusBonus[sinusBonusNum-1].x + 64 > 0)
				for (var i = 0; i < sinusBonusNum; i++)
					sinusBonus[i].x -= move;
			// Ready for new obstacle
			else {
				currentObstacle = 0;
				sinusBonus = new Array();
			}
		break;
	}
}

// Scroll background
function scrollXBackground()
{
	var move = scrollSpeed.x * deltaTime * speeds[niveau];
	posBackground1.x -= move;
	posBackground2.x -= move;
	var width = imgBackgrounds[niveau].width;
	if (posBackground1.x <= -width) posBackground1.x = posBackground2.x + width;
	if (posBackground2.x <= -width) posBackground2.x = posBackground1.x + width;
}

// Setup obstacle out of screen
function obstacleOutOfScreen(index)
{
	var obs = obstacles[index].clip;
	obs.collided = true;
	
	// Score
	score += 100;
	// Feedback Score
	var pountos = new Points();
	pountos.initialize(obs.x + obs.width, obs.y, "+100");
	points.push(pountos);
}

/* WAIT FOR SCORE */
function waitForScore() { if (waitStart + waitDelay < timeElapsed) gameState = 3; }

/* CHECK COLLISION */
function checkCollisions()
{
	if (objPlayer.hitted == false) {
	
		// Arranged bounds (PlayerBounds() -> Player.js)
		var playerBounds = objPlayer.PlayerBounds();

		switch (currentObstacle)
		{
			// Obstacle
			case 1 :
				for (var i = 0; i < obstacles.length; i++)
					if (!obstacles[i].clip.collided
					&& hitTestBounds(playerBounds, obstacles[i].clip.getBoundsRect()))
						collideObstacle(i);
			break;
			
			// Bonus
			case 2 :
				if (!objBonus.collided && objBonus.x <= 0)
					collideBonus();
			break;
			
			// Sinus Bonus
			case 3 :
				for (var i = 0; i < sinusBonus.length; i++)
					if (!sinusBonus[i].collided
					&&(hitTestBounds(playerBounds, sinusBonus[i].getBoundsRect())
					|| hitTestBounds(objDaltons[0].clip.getBoundsRect(), sinusBonus[i].getBoundsRect())
					|| hitTestBounds(objDaltons[1].clip.getBoundsRect(), sinusBonus[i].getBoundsRect())
					|| hitTestBounds(objDaltons[2].clip.getBoundsRect(), sinusBonus[i].getBoundsRect())))
						collideSinusBonus(i);
			break;
		}
	}
}

// Setup Obstacle Collision
function collideObstacle(index)
{
	obstacles[index].clip.collided = true;
	// Hurt Player
	if (objPlayer.cinematicMode == false) objPlayer.Hurt();
}

// Setup Bonus Collision
function collideBonus()
{
	objBonus.collided = true;
	// Hide Bonus
	objBonus.x = -objBonus.width;
	
	// Heal Player
	objPlayer.RestoreOneLife();
	
	// Score
	score += 1000;
	// Feedback Score
	var pountos = new Points();
	pountos.initialize(objRantanplan.x + objRantanplan.width, objPlayer.y + objPlayer.height * 0.5, "+1000");
	points.push(pountos);
}

// Setup Sinus Bonus Collision
function collideSinusBonus(index)
{
	sinusBonus[index].collided = true;
	sinusBonus[index].visible = false;
	
	// Score
	score += 200;
	// Feedback Score
	var pountos = new Points();
	pountos.initialize(sinusBonus[index].x, sinusBonus[index].y + sinusBonus[index].height * 0.5, "+200");
	points.push(pountos);
}

/* SPAWN OBSTACLE */
function spawnObstacle()
{
	// Nombre d'obstacle de la prochaine serie (de 1 a 3)
	var numObstacle = Math.floor(1 + Math.random() * MAX_OBSTACLES);
	var w = 0;
	var h = 0;
	var rand = 0;
	obstacles = new Array();
	
	for (var i = 0; i < numObstacle; i++)
	{
		var obstacle = new Obstacle();
		// Binary Random (jump or duck)
		var typeJump = (Math.random() > 0.5);
		
		// Jumping obstacle
		if (typeJump)
		{
			// Random image
			rand = Math.floor(Math.random() * MAX_IMG_OBSTACLES);
			// Setup obstacle
			obstacle.clip.image = imgObstacles[rand];
			w = imgObstacles[rand].width;
			h = imgObstacles[rand].height;
			obstacle.clip.SetPivot(w * 0.5, h * 0.5);
			obstacle.clip.SetRect(screenWidth + w + distanceBetweenObstacle * (i+1), posGround.y, w, h);
		}
		// Ducking Obstacle
		else
		{
			// Fleche
			if (Math.random() > 0.5)
			{
				// Random image
				rand = Math.floor(Math.random() * MAX_IMG_FLECHES);
				// Setup obstacle
				obstacle.clip.image = imgFleches[rand];
				w = imgFleches[rand].width;
				h = imgFleches[rand].height;
				// Special setup (for more speed)
				obstacle.fleche = true;
				// For Warning
				obstacle.jumpType = false;
				// Position & Dimension
				obstacle.clip.SetPivot(w * 0.5, h * 0.5);
				obstacle.clip.SetRect(screenWidth + w + distanceBetweenObstacle * (i+1), posGround.y - offsetFlecheY, w, h);
			}
			// Vautour
			else
			{
				w = 151; h = 80;
				
				// Animation
				obstacle.clip.width = w;
				obstacle.clip.height = h;
				obstacle.clip.spriteSheetGrid = 5;
				obstacle.clip.frameSkip = 2;
				obstacle.clip.totalFrames = 25;
				obstacle.clip.image = imgVautour;
				obstacle.clip.animate();
				
				// Special setup (for more speed)
				obstacle.fleche = true;
				// For Warning
				obstacle.jumpType = false;
				
				// Position & Dimension
				obstacle.clip.SetPivot(w * 0.5, h * 0.5);
				obstacle.clip.SetRect(screenWidth + w + distanceBetweenObstacle * (i+1), posGround.y - offsetVautourY, w, h);
			}
		}
		// Add to list
		obstacles.push(obstacle);
	}
}

/* SPAWN BONUS */
function spawnBonus()
{
	objBonus.SetPosition(screenWidth*1.5, posBackground1.y + posGround.y - objBonus.height);
	objBonus.collided = false;
}


function spawnSinusBonus()
{
	sinusBonus = new Array();
	// Position de base
	var anchor = { x:screenWidth + screenWidth * Math.random(), y:posGround.y - sinusBonusHeight };
	for (var i = 0; i < sinusBonusNum; i++) {
		var bonus = new MovieClip();
		bonus.image = imgBonusSinus;
		bonus.SetPivot(32, 32);
		bonus.SetRect(
			anchor.x + (i*sinusBonusWaves/sinusBonusNum) * sinusBonusWidth,
			anchor.y - Math.abs(Math.sin((i*sinusBonusWaves/sinusBonusNum)*Math.PI*2)) * sinusBonusHeight,
			64, 64);
		bonus.rotation = Math.random() * Math.PI * 2;
		sinusBonus.push(bonus);
	}
}