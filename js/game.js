// Assets
// var assetsToLoad = [ "img/bull.png", "img/plate1.png", "img/plate2.png", "img/plate3.png", "img/stuff1.png", "img/stuff2.png", "img/salt.png", "img/pepper.png", "img/moutarde.png", "img/arm1.png", "img/arm2.png", "img/arm3.png", "img/arm4.png", "img/handCatch1.png", "img/handOpen1.png", "img/handCatch2.png", "img/handOpen2.png", "img/head1.png", "img/head2.png", "img/head3.png", "img/head4.png" ];
var assetsToLoad = [ "img/background.png", "img/spriteSheet.json" ];

var textureArms, textureHandOpens, textureHandCatchs, textureHeads, textureStuffs, texturePlates, textureCondiments, textureBull;

// Const
var defaultSize = 722;
var minDistToCollide = 40;
var dimension = 10;

// Setup PIXI
var stage = new PIXI.Stage(0xeddfb4);
var minSize = Math.min(window.innerWidth, window.innerHeight);
var globalScale = minSize / defaultSize;
var windowWidth = minSize;
var windowHeight = minSize;
var renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight);

// Setup game
var playing = false;
var onMenu = true;
var modeRandom = false;
var condimentCount;
var wantings;
var currentWanting;

var mouse = { x: 0, y: 0 };
var mouseRatio = { x: 0, y: 0 };
var mouseDown = false;

//
var game = document.getElementById("game");
game.appendChild(renderer.view);

// Load
loader = new PIXI.AssetLoader(assetsToLoad);
loader.onComplete = onAssetsLoaded;
loader.load();

// Layers
var layerStuffs = new PIXI.DisplayObjectContainer();
var layerCondiments = new PIXI.DisplayObjectContainer();
var layerArms = new PIXI.DisplayObjectContainer();
var layerHeads = new PIXI.DisplayObjectContainer();
var layerBulls = new PIXI.DisplayObjectContainer();
var layerUI = new PIXI.DisplayObjectContainer();
stage.addChild(layerStuffs);
stage.addChild(layerCondiments);
stage.addChild(layerArms);
stage.addChild(layerHeads);
stage.addChild(layerBulls);
stage.addChild(layerUI);

// Timing
var timeTaking = 1;
var timeReturning = 1;
var timeAppear = 2;

var wantTimeStarted;
var wantTimeDelay;
var wantTimeDuration;
var wanters;
var wanting = false;
var wanter = undefined;

// UI
var background;
var title, click1, click2, nextLevel, showBottom, showTop, keys, info1, info2, button1, button2, bravo;

// Hard Coded Level Design
currentLevel = 0;
var levels = [{
	arms:[
		// g
		{ 	x:3/10, y:0, rot:90, start: 0, end:1 },
		// y
		{ 	x:7/10, y:1, rot:270, start: 0, end:1 },
		// b
		{ 	x:1, y:3/10, rot:180, start: 0, end:1 },
		// y
		{	x:0, y:7/10, rot:0, start: 0, end:1 }
	], 
	condiments:[
		{ x: 7/10, y: 3/10 }
	],
	wantings:[
		{ wanterID: 2, condimentID: 0 },
		{ wanterID: 0, condimentID: 0 },
		{ wanterID: 1, condimentID: 0 },
		{ wanterID: 2, condimentID: 0 },
		{ wanterID: 3, condimentID: 0 }
	]
},
{
	arms:[
		// y
		{ 	x:1/10, y:1, rot:270, start: 0.1, end:1 },
		// g
		{ 	x:3/10, y:0, rot:90, start: 0, end:0.8 },
		// b light
		{ 	x:1/2, y:1, rot:270, start: 0.3, end:1 },
		// o
		{	x:7/10, y:0, rot:90, start: 0, end:0.8 },
		// b dark
		{	x:1, y:3/10, rot:180, start: 0.1, end:1 },
		// v
		{	x:0, y:6/10, rot:0, start: 0, end:0.7 },
		// r
		{	x:1, y:8/10, rot:180, start: 0.1, end:1 },
	], 
	condiments:[
		{ x: 6/10, y: 6/10 },
		{ x: 5/10, y: 6/10 }
	],
	wantings:[
		{ wanterID: 4, condimentID: 1 },
		{ wanterID: 1, condimentID: 0 },
		{ wanterID: 0, condimentID: 0 },
		{ wanterID: 5, condimentID: 1 },
		{ wanterID: 6, condimentID: 0 },
		{ wanterID: 2, condimentID: 1 }
	]
},
{
	arms:[
		// g
		{ 	x:3/10, y:0, rot:90, start: 0, end:0.8 },
		// b light
		{ 	x:5/10, y:1, rot:270, start: 0.7, end:1 },
		// y
		{ 	x:7/10, y:1, rot:270, start: 0, end:1 },
		// b dark
		{	x:1, y:3/10, rot:180, start: 0.5, end:1 },
		// v
		{	x:0, y:5/10, rot:0, start: 0, end:0.7 },
		// r
		{	x:1, y:7/10, rot:180, start: 0.1, end:1 },
	], 
	condiments:[
		{ x: 7/10, y: 3/10 },
		{ x: 3/10, y: 3/10 }
	],
	wantings:[
		{ wanterID: 3, condimentID: 1 },
		{ wanterID: 1, condimentID: 0 },
		{ wanterID: 0, condimentID: 0 },
		{ wanterID: 1, condimentID: 0 },
		{ wanterID: 4, condimentID: 1 },
		{ wanterID: 2, condimentID: 0 },
		{ wanterID: 5, condimentID: 1 }
	]
},
{
	arms:[
		// g
		{ 	x:3/10, y:0, rot:90, start: 0, end:0.5 },
		// gray
		{ 	x:4/10, y:1, rot:270, start: 0.6, end:1},
		// b light
		{ 	x:6/10, y:1, rot:270, start: 0.5, end:1 },
		// y
		{ 	x:7/10, y:0, rot:90, start: 0, end:0.5 },
		// b dark
		{	x:1, y:3/10, rot:180, start: 0.5, end:1 },
		// v
		{	x:0, y:5/10, rot:0, start: 0, end:0.7 },
		// o
		{	x:1, y:6/10, rot:180, start: 0.5, end:1 },
		// r
		{	x:0, y:7/10, rot:0, start: 0, end:0.7 }
	], 
	condiments:[
		{ x: 6/10, y: 3/10 },
		{ x: 4/10, y: 6/10 },
		{ x: 5/10, y: 6/10 }
	],
	wantings:[
		{ wanterID: 0, condimentID: 2 },
		{ wanterID: 7, condimentID: 0 },
		{ wanterID: 1, condimentID: 1 },
		{ wanterID: 5, condimentID: 2 },
		{ wanterID: 2, condimentID: 1 },
		{ wanterID: 3, condimentID: 0 },
		{ wanterID: 6, condimentID: 1 },
		{ wanterID: 4, condimentID: 2 }
	]
},
{
	arms:[
		// b light
		{ 	x:3/10, y:1, rot:270, start: 0.6, end:1 },
		// y
		{ 	x:5/10, y:0, rot:90, start: 0, end:0.4 },
		// g
		{ 	x:7/10, y:0, rot:90, start: 0, end:0.6 },
		// gray
		{ 	x:8/10, y:1, rot:270, start: 0.7, end:1},
		// v
		{	x:0, y:2/10, rot:0, start: 0, end:0.5 },
		// b dark
		{	x:1, y:3/10, rot:180, start: 0.5, end:1 },
		// o
		{	x:1, y:6/10, rot:180, start: 0.3, end:1 },
		// r
		{	x:0, y:8/10, rot:0, start: 0, end:0.8 }
	], 
	condiments:[
		{ x: 8/10, y: 6/10 },
		{ x: 5/10, y: 8/10 },
		{ x: 3/10, y: 2/10 }
	],
	wantings:[
		{ wanterID: 0, condimentID: 2 },
		{ wanterID: 7, condimentID: 0 },
		{ wanterID: 1, condimentID: 1 },
		{ wanterID: 5, condimentID: 2 },
		{ wanterID: 2, condimentID: 1 },
		{ wanterID: 3, condimentID: 0 },
		{ wanterID: 6, condimentID: 1 },
		{ wanterID: 4, condimentID: 2 }
	]
}];

function onAssetsLoaded()
{
	// Textures
	textureArms = [];
	textureHandCatchs = [];
	textureHandOpens = [];
	textureHeads = [];
	texturePlates = [];
	textureStuffs = [];
	textureCondiments = [];
	for (var i = 1; i <= 6; i++) { textureArms.push(PIXI.Texture.fromFrame("arm" + i)); }
	for (var i = 1; i <= 2; i++) { textureHandCatchs.push(PIXI.Texture.fromFrame("handCatch" + i)); }
	for (var i = 1; i <= 2; i++) { textureHandOpens.push(PIXI.Texture.fromFrame("handOpen" + i)); }
	for (var i = 1; i <= 7; i++) { textureHeads.push(PIXI.Texture.fromFrame("head" + i)); }
	for (var i = 1; i <= 4; i++) { texturePlates.push(PIXI.Texture.fromFrame("plate" + i)); }
	for (var i = 1; i <= 3; i++) { textureStuffs.push(PIXI.Texture.fromFrame("stuff" + i)); }
	for (var i = 1; i <= 5; i++) { textureCondiments.push(PIXI.Texture.fromFrame("condiment" + i)); }
	textureBull = PIXI.Texture.fromFrame("bull");
	
	// Background
	background = new PIXI.Sprite(PIXI.Texture.fromImage("img/background.png"));
	background.anchor.x = background.anchor.y = 0.5;
	background.scale.x = background.scale.y = globalScale * 0.38;
	background.x = windowWidth / 2;
	background.y = windowHeight / 2;
	stage.addChildAt(background, 0);

	// UI
	title = new PIXI.Sprite(PIXI.Texture.fromFrame("title"));
	nextLevel = new PIXI.Sprite(PIXI.Texture.fromFrame("nextLevel"));
	showBottom = new PIXI.Sprite(PIXI.Texture.fromFrame("showBottom"));
	showTop = new PIXI.Sprite(PIXI.Texture.fromFrame("showTop"));
	keys = new PIXI.Sprite(PIXI.Texture.fromFrame("keys"));
	info1 = new PIXI.Sprite(PIXI.Texture.fromFrame("info1"));
	info2 = new PIXI.Sprite(PIXI.Texture.fromFrame("info2"));
	button1 = new PIXI.Sprite(PIXI.Texture.fromFrame("button1"));
	button2 = new PIXI.Sprite(PIXI.Texture.fromFrame("button2"));
	bravo = new PIXI.Sprite(PIXI.Texture.fromFrame("bravo"));
	click1 = new PIXI.Sprite(PIXI.Texture.fromFrame("click"));
	click2 = new PIXI.Sprite(PIXI.Texture.fromFrame("click"));
	// bravo
	bravo.alpha = 0;
	layerUI.addChild(bravo);
	bravo.anchor.x = 0.5
	bravo.anchor.y = 0.5;
	bravo.scale.x = bravo.scale.y = globalScale;
	bravo.x = windowWidth / 2;
	bravo.y = windowHeight / 2;
	// Title
	layerUI.addChild(title);
	title.anchor.x = 0.5
	title.anchor.y = 1;
	title.scale.x = title.scale.y = globalScale;
	title.x = windowWidth / 2;
	title.y = windowHeight / 2;
	// Keys
	layerUI.addChild(keys);
	keys.anchor.x = 0.5;
	keys.anchor.y = 0;
	keys.scale.x = keys.scale.y = globalScale * 0.5;
	keys.x = windowWidth / 2;
	keys.y = windowHeight * 3.3 / 5;
	// infos
	layerUI.addChild(info1);
	info1.anchor.x = 0.5
	info1.anchor.y = 1;
	info1.scale.x = info1.scale.y = globalScale * 0.5;
	info1.x = windowWidth / 2;
	info1.y = windowHeight * 3.3 / 5 - keys.height;
	layerUI.addChild(info2);
	info2.anchor.x = 0.5
	info2.anchor.y = 1;
	info2.scale.x = info2.scale.y = globalScale * 0.5;
	info2.x = windowWidth / 2;
	info2.y = windowHeight * 3.3 / 5;
	// Buttons
	layerUI.addChild(button1);
	button1.interactive = true;
	button1.anchor.x = 0.5;
	button1.anchor.y = 1;
	button1.scale.x = button1.scale.y = globalScale * 0.6;
	button1.x = windowWidth * 2 / 7;
	button1.y = windowHeight * 7 / 8;
	// Buttons
	layerUI.addChild(button2);
	button2.interactive = true;
	button2.anchor.x = 0.5;
	button2.anchor.y = 1;
	button2.scale.x = button2.scale.y = globalScale * 0.6;
	button2.x = windowWidth * 5 / 7;
	button2.y = windowHeight * 7 / 8;
	// Clicks
	layerUI.addChild(click2);
	click2.interactive = true;
	click2.anchor.x = 0;
	click2.anchor.y = 0;
	click2.scale.x = -globalScale * 0.6;
	click2.scale.y = globalScale * 0.6;
	click2.x = windowWidth / 2;
	click2.y = windowHeight * 6 / 8;
	// Clicks
	layerUI.addChild(click1);
	click1.interactive = true;
	click1.anchor.x = 0;
	click1.anchor.y = 0;
	click1.scale.x = click1.scale.y = globalScale * 0.6;
	click1.x = windowWidth / 2 - click1.width * 1 / 4;
	click1.y = windowHeight * 6 / 8;

	// Mouse Events
	game.addEventListener('mousemove', onMouseMove);
	game.addEventListener('mousedown', onMouseDown);
	game.addEventListener('mouseup', onMouseUp);

	// Keyboard Event
	window.addEventListener('keydown', onKeyDown, true);
	window.addEventListener('keyup', onKeyUp, true);

	// Start Game Loop
	requestAnimFrame( animate );

}

function ClicButton1()
{
	// 
	var onComplete = function()
	{
		SetupLevel(levels[0]);
		StartGame();	
	}

	modeRandom = false;
	onMenu = false;

	HideMenu(onComplete);
}

function ClicButton2()
{
	// 
	var onComplete = function()
	{
		SetupRandomLevel();
		StartGame();	
	}

	modeRandom = true;
	onMenu = false;

	HideMenu(onComplete);
}

function StartGame()
{
    playing = false;

    var onUpdate = function(ratio) {
	    for (var c = 0; c < characters.length; c++) {
	    	var character = characters[c];
	    	character.ReachMouse(ratio);
	    }
    }

	var onComplete = function() {
		playing = true;
		StartWanting();
	}

    for (var c = 0; c < characters.length; c++) {
    	var character = characters[c];
    	character.Appear();
    }

    for (var c = 0; c < condiments.length; c++) {
    	var condiment = condiments[c];
    	condiment.sprite.alpha = 0;
    	Tweener.addTween(condiment.sprite, { time: timeAppear * 3, alpha: 1});
    }

    for (var c = 0; c < stuffs.length; c++) {
    	var stuff = stuffs[c];
    	stuff.sprite.alpha = 0;
    	Tweener.addTween(stuff.sprite, { time: timeAppear * 3, alpha: 1});
    }

    Tweener.addTween({}, {time: timeAppear, onUpdate:onUpdate, onComplete:onComplete});
}

function NextRandomGame()
{
    playing = false;

	var onComplete = function() {
		ResetRandomLevel();
	}

    for (var c = 0; c < characters.length; c++) {
    	var character = characters[c];
    	character.Disappear();
    }

    for (var c = 0; c < condiments.length; c++) {
    	var condiment = condiments[c];
    	Tweener.addTween(condiment.sprite, { time: timeAppear * 3, alpha: 0});
    }

    for (var c = 0; c < stuffs.length; c++) {
    	var stuff = stuffs[c];
    	Tweener.addTween(stuff.sprite, { time: timeAppear * 3, alpha: 0});
    }

    Tweener.addTween({}, {time: timeAppear, onComplete:onComplete});
}

function NextGame()
{
    playing = false;

	var onComplete = function() {
		currentLevel++;
		if (currentLevel >= levels.length) {

    		playing = false;
			bravo.alpha = 0;
			Tweener.addTween(bravo, { time: 3, alpha: 1, onComplete:function() {
				HideMenu();				
			}});
			Tweener.addTween({}, {delay:3, time:0, onComplete:function()
				{
					ResetGame();
				}})
		} else {
		    ResetLevel();
		    SetupLevel(levels[currentLevel]);
		    StartGame();
		}
	}

    for (var c = 0; c < characters.length; c++) {
    	var character = characters[c];
    	character.Disappear();
    }

    for (var c = 0; c < condiments.length; c++) {
    	var condiment = condiments[c];
    	Tweener.addTween(condiment.sprite, { time: timeAppear * 3, alpha: 0});
    }

    for (var c = 0; c < stuffs.length; c++) {
    	var stuff = stuffs[c];
    	Tweener.addTween(stuff.sprite, { time: timeAppear * 3, alpha: 0});
    }

    Tweener.addTween({}, {time: timeAppear, onComplete:onComplete});
}

function ResetGame()
{
    playing = false;
    currentLevel = 0;
    ResetLevel();
    ShowMenu(function() {onMenu = true;});
}

function ResetRandomLevel()
{
    playing = false;
    ResetLevel();
    SetupRandomLevel();
    StartGame();
}

function ResetCurrentLevel()
{
    playing = false;
    ResetLevel();
    SetupLevel(levels[currentLevel]);
    StartGame();
}

// Game Loop
function animate() {

    requestAnimFrame( animate );

    if (playing)
    {
	    for (var c = 0; c < characters.length; c++) {
	    	var character = characters[c];
	    	if (character.usingCondiment == false) {
		    	character.Update(mouseRatio);
		    }
	    }

	    var wantElapsed = (new Date() - wantTimeStarted) / 1000;
	    if (wantElapsed > wantTimeDelay)
	    {
    		var ratio = Math.max(Math.min(1, 2 * (wantElapsed - wantTimeDelay)), 0);
	    	if (!wanting)
	    	{
		    	Want();
		    	wanting = true;
	    	}
	    	if (wanter != undefined) {
	    		wanter.Want(ratio * (1 + Math.cos(wantElapsed * 10) * 0.1));
			}
	    }
	}

    // render the stage  
    renderer.render(stage);
}