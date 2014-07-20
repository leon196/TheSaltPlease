// Score
var score = 0;
// Niveau en cours
var niveau = 0;
// Etat du jeu
// 0 - Intro
// 1 - Choix du niveau
// 2 - En jeu
var gameState = 0;
// Etat du niveau
// 0 - jeu
// 1 - transition win
// 2 - transition lost
var levelState = 0;

// Player
var imgDaltonRun = new Image();
var imgDaltonJump = new Image();
var imgDaltonDuck = new Image();
var imgDaltonFall = new Image();
var objPlayer = new Player();
// Les daltons
var objDaltons = new Array();
const distanceBetweenDalton = 56;

// Rantanplan
var imgRantanplan = new Image();
var objRantanplan = new MovieClip();
var posRantanplan = { x:-75, y:0 };

// Obstacles
var imgObstacles = new Array();
var imgFleches = new Array();
var imgVautour = new Image();
var obstacles = new Array();
var offsetFlecheY = 100;
var offsetVautourY = 120;
var flecheSpeedRatio = 1.1;
// Nombre d'image d'obstacle a recuperer
const MAX_IMG_OBSTACLES = 8;
const MAX_IMG_FLECHES = 5;
// Nombre d'obstacle pouvant etre affiche a l'ecran
const MAX_OBSTACLES = 3;
// Type obstacle
// 0 : none (spawn)
// 1 : obstacle
// 2 : bonus
// 3 : sinus bonus
var currentObstacle = 0;
const distanceBetweenObstacle = 550;

// Bonus
var imgBonus = new Image();
var imgBonusSinus = new Image();
var objBonus = new MovieClip();
var sinusBonus = new Array();
var points = new Array();
const sinusBonusNum = 25;
const sinusBonusHeight = 125;
const sinusBonusWidth = 800;
const sinusBonusWaves = 3;

// Timing
var timeStarted = new Date().getTime() / 1000;
var timeElapsed = 0;
var timeElapsedLastFrame = 0;
var deltaTime = 0.1;
var timeLeft = [30, 45, 60];
var speeds = [0.7, 0.8, 0.9];
var gameStart = 0;
const gameStartDelay = 3;
var transitionStart = 0;
var transitionDelay = 2;
var waitStart = 0;
var waitDelay = 1;

// Slides
var imgSlideIntro = new Image();
var imgSlideNext = new Image();
var imgSlideWin = new Image();
var imgSlideLost = new Image();

// HUD
var imgLife = new Image();
var lifes = new Array();
var imgLogos = new Image();
var imgBarreDeVie = new Image();
var imgScore = new Image();
var imgNiveau = new Image();
var imgCopyright = new Image();

var imgWarningDown = new Image();
var imgWarningUp = new Image();
var objWarning = new MovieClip();

// Bouton Start
var imgStart = new Image();
var imgStartHover = new Image();
var btnStart = new MovieClip();

// Bouton Restart
var imgRestart = new Image();
var imgRestartHover = new Image();
var btnRestart = new MovieClip();

// Bouton Next
var imgNext = new Image();
var imgNextHover = new Image();
var btnNext = new MovieClip();

// Background
var imgBackgrounds = new Array();
var posBackground1 = { x:0, y:0 };
var posBackground2 = { x:0, y:0 };

// Position du sol
const posGround = { x:320, y:525 };

// Scroll
var scrollSpeed = { x:500, y:0 };
const MIN_SPEED_SCROLL = 10;
const MAX_SPEED_SCROLL = 1000;

// Debug
var debug = "poin poin";

// Initialise le jeu
function init() 
{
	// Intro
	gameState = 0;
	score = 0;
	niveau = 0;
	
	// Charge les images
	loadImages();
}

// Charge les images
function loadImages()
{
	// Background
	for (var i = 0; i < 3; i++) {
		imgBackgrounds[i] = new Image();
		loadImage(imgBackgrounds[i], "images/decor_"+(i+1)+".png");
	}
	
	/* UI */
	
	// Slides
	loadImage(imgSlideIntro, "images/00_accueil.jpg");
	loadImage(imgSlideNext, "images/slide_niveau_suivant.jpg");
	loadImage(imgSlideLost, "images/slide_dommage.png");
	loadImage(imgSlideWin, "images/slide_bravo.png");

	// Bouton Start
	loadImage(imgStart, "images/bt_jouer_0001.png", btnStart, true);
	loadImage(imgStartHover, "images/bt_jouer_0002.png");
	btnStart.SetPosition(250, 365);
	btnStart.hoverImage = imgStartHover;
	
	// Bouton Restart
	loadImage(imgRestart, "images/bt_rejouer_0001.png", btnRestart, true);
	loadImage(imgRestartHover, "images/bt_rejouer_0002.png");
	btnRestart.SetPosition(215, 320);
	btnRestart.hoverImage = imgRestartHover;
	
	// Bouton Next
	loadImage(imgNext, "images/bt_continuer0001.png", btnNext, true);
	loadImage(imgNextHover, "images/bt_continuer0002.png");
	btnNext.SetPosition(185, 244);
	btnNext.hoverImage = imgNextHover;

	// HUD
	loadImage(imgLife, "images/pointDeVie.png");
	for (var i = 0; i < 3; i++) {
		lif = new MovieClip();
		lif.image = imgLife;
		lif.SetRect(204 + 16 * i, 36, 15, 15);
		lifes.push(lif);
	}
	
	loadImage(imgBarreDeVie, "images/barreDeVie.png");
	loadImage(imgLogos, "images/logos.png");
	loadImage(imgScore, "images/mc_score.png");
	loadImage(imgNiveau, "images/mc_niveau.png");
	loadImage(imgCopyright, "images/copyright.png");
	
	// Warning
	loadImage(imgWarningDown, "images/warning_down.png");
	loadImage(imgWarningUp, "images/warning_up.png", objWarning, false);
	objWarning.SetPivot(43, 43);
	objWarning.SetRect(screenWidth, posGround.y, 86, 86);
	objWarning.visible = false;
	
	/* Game Elements */
	
	// Player
	loadImage(imgDaltonRun, "images/dalton_3_run.png", objPlayer, false);
	loadImage(imgDaltonJump, "images/dalton_3_jump.png");
	loadImage(imgDaltonDuck, "images/dalton_esquive.png");
	loadImage(imgDaltonFall, "images/dalton_tombe.png");
	objPlayer.SetRect(posGround.x, posGround.y - 100, 103, 156);
	objPlayer.scaleX = objPlayer.scaleY = 2/3;
	objPlayer.reset();
	objPlayer.SetupAnimRun();

	// Les 3 Daltons qui suivent le joueur
	for (var i = 0; i < 3; i++) {
		objDaltons[i] = new Follower(i+1);
		objDaltons[i].clip.image = imgDaltonRun;
		objDaltons[i].clip.scaleX = objDaltons[i].clip.scaleY = 2/3 + ((i+1)*(1/9));
		objDaltons[i].clip.SetRect(posGround.x - ((1 + i) * distanceBetweenDalton), posGround.y, 103, 156);
		objDaltons[i].reset();
		objDaltons[i].SetupAnimRun();
	}
	
	// Rantanplan
	loadImage(imgRantanplan, "images/rantanplan_run.png", objRantanplan, false);
	objRantanplan.SetRect(posRantanplan.x, posGround.y - 71, 152, 71);
	objRantanplan.frame = 0;
	objRantanplan.spriteSheetGrid = 5;
	objRantanplan.frameSkip = 2;
	objRantanplan.totalFrames = 13;
	objRantanplan.animate();
	
	// Obstacles Jump
	for (var i = 0; i < MAX_IMG_OBSTACLES; i++) {
		imgObstacles[i] = new Image();
		loadImage(imgObstacles[i], "images/obstacle_"+i+".png");
	}
	// Obstacles Fleches
	for (var i = 0; i < MAX_IMG_FLECHES; i++) {
		imgFleches[i] = new Image();
		loadImage(imgFleches[i], "images/fleche"+(i+1)+".png");
	}
	// Obstacle Vautour
	loadImage(imgVautour, "images/vautour.png");
	
	// Bonus
	loadImage(imgBonusSinus, "images/bonus_5.png");
	loadImage(imgBonus, "images/mc_bonus.png", objBonus, true);
	objBonus.SetPosition(screenWidth * 2, posGround.y);
}

function ImagesReady()
{
	// Rend le bouton start clickable
	btnStart.addClickCallback(clickStart);
	btnStart.visible = true;
	
	// Restart Button
	btnRestart.addClickCallback(clickRestart);
	btnRestart.visible = false;
	
	// Next Button
	btnNext.addClickCallback(clickNext);
	btnNext.visible = false;
		
	// Mets en place la boucle de draw
	setInterval(draw, 1000/60);
}

// Démarre un nouveau stage
function newLevel()
{
	// Background
	posBackground1.x = 0;
	posBackground2.x = imgBackgrounds[niveau].width;
	
	// Buttons
	btnStart.visible = false;
	btnRestart.visible = false;
	btnNext.visible = false;
	
	// Timing
	timeStarted = new Date().getTime() / 1000.0;
	timeElapsed = new Date().getTime() / 1000.0 - timeStarted;
	timeElapsedLastFrame = timeElapsed + 0.1;
	
	// levelstate.js
	transitionStart = timeElapsed;
	
	points = new Array();
	
	gameState = 1;
}

// Boucle d'affichage
function draw()
{
	// Temps ecoule en secondes
	timeElapsed = new Date().getTime() / 1000.0 - timeStarted;
	
	deltaTime = timeElapsed - timeElapsedLastFrame;
	
	// Nettoye l'écran (dessine un rectangle blanc de la taille du canvas)
	ctx.fillStyle = "#ffd940";
	ctx.fillRect(0, 0, screenWidth, screenHeight);
					
	// Draw Background
	ctx.drawImage(imgBackgrounds[niveau], posBackground1.x, 0);
	ctx.drawImage(imgBackgrounds[niveau], posBackground2.x, 0);
	ctx.drawImage(imgCopyright, 0, 0);
	
	// Draw Player
	objPlayer.draw();
	
	// Draw Daltons
	for (var i = 0; i < 3; i++)
		objDaltons[i].update();	
	
	// Rantanplan
	objRantanplan.draw();
	
	// On affiche selon l'état
	switch (gameState)
	{
		case 0: // Intro
		
			// Background
			ctx.drawImage(imgSlideIntro, 0, 0);
			// Boutton Start
			btnStart.draw();
			
		break;
		
		
		case 1: // Transition Game
		
			var ratio = (timeElapsed - transitionStart) / transitionDelay;
			
			// Wait for Daltons to enter screen
			if (ratio < 1) {
				
				// Player
				objPlayer.x = ratio * (posGround.x + distanceBetweenDalton * 0.5) - distanceBetweenDalton * 0.5;
				
				// Daltons
				for (var i = 0; i < 3; i++) 
					objDaltons[i].clip.x = ratio * (posGround.x - ((1 + i) * distanceBetweenDalton * 0.5)) - ((1 + i) * distanceBetweenDalton * 0.5) ;
				
				// Rantanplan
				objRantanplan.x = ratio * (posRantanplan.x + 175) - 175;
				
				// Scroll background
				drawScroll();
				
			}
			// Start Game
			else
			{
				timeStarted = new Date().getTime() / 1000.0;
				timeElapsed = 0;
				gameStart = 0;
				gameState = 2;
			}
		
		break;
		
		
		case 2: // En Jeu
			
			/* MAIN GAME LOOP */
			objPlayer.update();
			drawScroll();
			checkCollisions();
		
			// var bounds = objPlayer.PlayerBounds();
			// ctx.strokeStyle = "red";
			// ctx.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);
		
			// Draw obstacles
			for (var i = 0; i < obstacles.length; i++) {
				if (obstacles[i].clip.visible) {
					obstacles[i].clip.draw();
					// drawColliders(i);
					if (obstacles[i].clip.collided)
						obstacles[i].fall();
				}
			}
			// Draw Bonus
			objBonus.draw();
			for (var i = 0; i < sinusBonus.length; i++) {
				if (sinusBonus[i].visible) {
					sinusBonus[i].draw();
					// var b = sinusBonus[i].getBoundsRect();
					// ctx.strokeStyle = "red";
					// ctx.strokeRect(b.x, b.y, b.w, b.h);
				}
			}
					
			// (levelstate.js)
			switch (levelState) {
			
			case 0 :
				
				// Timeleft
				if (timeElapsed > timeLeft[niveau] && currentObstacle != 3) {
					// Player
					objPlayer.SetupWinState();
					// Daltons
					for (var i = 0; i < 3; i++) objDaltons[i].SetupWinState();
					transitionStart = timeElapsed;
					levelState = 1;
				}
				
			break;
			
			// Transition Win
			case 1 :
				// Delay
				if (transitionStart + transitionDelay > timeElapsed) {
					// Rantanplan
					var ratio = (timeElapsed - transitionStart) / transitionDelay;
					objRantanplan.x = posRantanplan.x - ratio * 75;
					// Player
					objPlayer.TransitionWin();
					// Daltons
					for (var i = 0; i < 3; i++) objDaltons[i].TransitionWin();
				}
				// Show score
				else gameState = 3;
				
			break;
			
			// Transition Lost
			case 2 :
			
				// Delay
				if (transitionStart + transitionDelay > timeElapsed) {
					// Rantanplan
					var ratio = (timeElapsed - transitionStart) / transitionDelay;
					objRantanplan.x = posRantanplan.x - ratio * 75;
					// Player
					objPlayer.TransitionLost();
					// Daltons
					for (var i = 0; i < 3; i++) objDaltons[i].TransitionLost();
				}
				// Game Over
				else {
					btnRestart.visible = true;
					score = Math.floor(score);
					gameState = 5;
				}
			break;
			}
			
			
		break;
		
		case 3: // Transition vers les slides
		
			score = Math.floor(score);
			
			// Niveau Suivant
			if (niveau < 2) {
				gameState = 4;
				btnNext.visible = true;
			}
			
			// End of game
			else {
				gameState = 6;
				btnRestart.visible = true;
			}
			
		break;
		
		case 4: // Niveau suivant
		
			// Background
			ctx.drawImage(imgSlideNext, 0, 0);
			
			// Boutton Start
			btnNext.draw();
		
			// Score
			// ctx.font = "30px subaccuznormal";
			// ctx.fillStyle = "black";
			// ctx.textAlign = "center";
			// ctx.fillText("SCORE : " + score, 320, 264);
			
		break;
		
		case 5: // Game over
		
			// Background
			ctx.drawImage(imgSlideLost, 0, 0);
			
			// Boutton Start
			btnRestart.draw();
		
			// Score
			ctx.font = "32px subaccuznormal";
			ctx.fillStyle = "black";
			ctx.textAlign = "center";
			ctx.fillText(score, 320, 305);
			
		break;
		
		case 6: // Victory
		
			// Background
			ctx.drawImage(imgSlideWin, 0, 0);
			
			// Boutton Start
			btnRestart.draw();
		
			// Score
			ctx.font = "32px subaccuznormal";
			ctx.fillStyle = "black";
			ctx.textAlign = "center";
			ctx.fillText(score, 320, 305);
			
		break;
	}
	
	/* Draw HUD */
	
	if (gameState == 1 || gameState == 2) {
	
		ctx.drawImage(imgLogos, 0, 0);
		ctx.drawImage(imgBarreDeVie, 160, 31);
		ctx.drawImage(imgNiveau, 270, 31);
		ctx.drawImage(imgScore, 360, 31);
		for (var i = 0; i < objPlayer.life; i++) lifes[i].draw();
		// Points
		drawPoints(points);
		// Textes
		ctx.font = "20px subaccuznormal";
		ctx.textAlign = "left";
		ctx.fillStyle = "white";
		// Niveau
		ctx.fillText((niveau+1), 327, 51);
		// Score
		ctx.fillText(Math.floor(score), 412, 51);
		// Debug
		// ctx.fillText(debug, 396,101);
		
		// Warning
		if (objWarning.visible) objWarning.draw();
	
	}
	
	timeElapsedLastFrame = timeElapsed;
}

// Callbacks
function clickStart()
{
	btnStart.visible = false;
	//
	resetGame();
	score = 0;
	niveau = 0;
	//
	newLevel();
}

function clickNext()
{
	btnNext.visible = false;
	//
	resetGame();
	//
	niveau++;
	newLevel();
}

function clickRestart()
{
	btnRestart.visible = false;
	//
	resetGame();
	score = 0;
	niveau = 0;
	//
	newLevel();
}

function resetGame()
{
	//
	levelState = 0;
	gameState = 2;
	
	// Player
	objPlayer.SetPosition(posGround.x, posGround.y - 155 * objPlayer.scaleX);
	objPlayer.reset();
	objPlayer.SetupAnimRun();
	
	// Rantanplan
	objRantanplan.x = posRantanplan.x;

	// Background
	posBackground1.x = 0;
	posBackground2.x = imgBackgrounds[niveau].width;
	
	// Bonus
	objBonus.x = screenWidth * 2 + Math.random() * screenWidth;
	objBonus.y = posGround - objBonus.height;
	objBonus.collided = false;
	
	// SinusBonus
	sinusBonus = new Array();
	
	// Obstacles
	obstacles = new Array();
	currentObstacle = 0;
	
	// Points
	points = new Array();
	
	// Daltons
	for (var i = 0; i < 3; i++) {
		objDaltons[i].clip.SetPosition(posGround.x - ((1 + i) * distanceBetweenDalton), posGround.y - 155 * objDaltons[i].clip.scaleX);
		objDaltons[i].SetupAnimRun();
		objDaltons[i].reset();
	}
	
	// Warning
	objWarning.scaleX = objWarning.scaleY = 1;
	objWarning.visible = false;
}

function drawColliders(index)
{					
	// Debug
	var bounds = obstacles[index].clip.getBoundsRect();
	ctx.strokeStyle = 'red';
	ctx.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);
}