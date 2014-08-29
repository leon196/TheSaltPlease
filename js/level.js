// Level Elements
var levelDesign;
var characters;
var condiments;
var stuffs;

function ResetLevel()
{
	layerHeads.removeChildren();
	layerArms.removeChildren();
	layerCondiments.removeChildren();
	layerStuffs.removeChildren();
	layerBulls.removeChildren();
}

function SetupLevel(level)
{
	characters = [];
	levelDesign = [];
	condiments = [];
	stuffs = [];

	var condimentCount = level.condiments.length;
	var randomStuffCount = Math.floor(2 + Math.random() * 6);

	var min = 1/area.dimension;
	var max = 1 - min;
	var arms = level.arms;

	for (var c = 0; c < arms.length; c++) {
		var armLevel = arms[c];
		var rot = armLevel.rot;
		var pos = armLevel.pos;

		var arm = { x: 0, y: 0, pos: pos, rot: rot, start: armLevel.start, end: armLevel.end};

		if (rot == 90 || rot == 270) {
			arm.x = positionArea(pos, 0).x;
			if (rot == 90) {
				arm.y = 0;
			} else {
				arm.y = windowHeight;
			}
		} else {
			arm.y = positionArea(0, pos).y;
			if (rot == 0) {
				arm.x = 0;
			} else {
				arm.x = windowWidth;
			}
		}
		levelDesign.push(arm);
		characters.push(new Character(arm.x, arm.y, arm.pos, arm.rot, arm.start, arm.end));
	}

	// Condiments
	for (var c = 0; c < condimentCount; c++)
	{
		var condimentsInfos = level.condiments[c];
		var sprite = new PIXI.Sprite(textureCondiments[c]);
		sprite.anchor.x = sprite.anchor.y = 0.5;
		sprite.alpha = 0;
		layerCondiments.addChild(sprite);

		sprite.x = area.x + condimentsInfos.x * area.cellSize - area.cellSize/2;
		sprite.y = area.y + condimentsInfos.y * area.cellSize - area.cellSize/2;

		var condiment = { caught: false, type: c, sprite: sprite };
		condiments.push(condiment);
	}

	// Random Stuff
	SprayRandomStuff(Math.floor(4 + Math.random() * 8));

	// Setup Random Wanters
	SetupWanting(level);
}

function SetupRandomLevel()
{
	characters = [];
	levelDesign = [];
	condiments = [];
	stuffs = [];

	var characterCount = Math.floor(4 + (Math.random() * 5) * 2);
	condimentCount = Math.min(textureCondiments.length, 3 + Math.floor(Math.random() * (textureCondiments.length)));

	var min = 1/dimension;
	var max = 1 - min;
	var pos = (1 / (characterCount/2 + 1)); 
	var start = min;
	var end = max;

	var initialRot = 0;
	var initialPos = Math.floor(1 + Math.random() * (dimension-2)) / dimension;
	var initialStart = Math.floor(1 + Math.random() * (dimension)/2) / dimension;
	var initialEnd = Math.floor((dimension)/2 + Math.random() * (dimension)/2) / dimension;

	var previousPos, previousStart, previousEnd;
	previousPos = initialPos;
	previousStart = initialStart;
	previousEnd = initialEnd;

	for (var c = 0; c < characterCount; c++) {

		var rndRot = (initialRot + 90 * (c+1)) % 360;
		var rndPos;
		var rndStart = Math.max(1/dimension, previousPos - Math.floor(2 + Math.random() * (dimension-2)/2) / dimension);
		var rndEnd = Math.min(1 - 1/dimension, previousPos + Math.floor(2 + Math.random() * (dimension-2)/2) / dimension);

		var arm = { x: 0, y: 0, rot: rndRot, start: rndStart, end: rndEnd};

		if (rndRot == 90 || rndRot == 270) {
			rndPos = ((c+2)/2 / (characterCount/2 + 1));
			arm.x = rndPos * windowWidth;
			if (rndRot == 90) {
				arm.y = 0;
			} else {
				arm.y = windowHeight;
			}
		} else {
			rndPos = ((c+1)/2 / (characterCount/2 + 1));
			arm.y = rndPos * windowHeight;
			if (rndRot == 0) {
				arm.x = 0;
			} else {
				arm.x = windowWidth;
			}
		}
		
		levelDesign.push(arm);
		characters.push(new Character(arm.x, arm.y, arm.rot, arm.start, arm.end));

		previousPos = rndPos;
		previousStart = rndStart;
		previousEnd = rndEnd;
	}

	// Condiments
	for (var c = 0; c < condimentCount; c++)
	{
		var arm = levelDesign[Math.floor(Math.random() * characterCount)];
		var sprite = new PIXI.Sprite(textureCondiments[c]);
		sprite.scale.x = sprite.scale.y = globalScale * 0.8;
		sprite.anchor.x = sprite.anchor.y = 0.5;
		sprite.alpha = 0;
		layerCondiments.addChild(sprite);

		if (arm.rot == 90 || arm.rot == 270) {
			sprite.x = arm.x;
			sprite.y = (arm.start + Math.random() * (arm.end - arm.start)) * windowHeight;
		} else {
			sprite.x = (arm.start + Math.random() * (arm.end - arm.start)) * windowWidth;
			sprite.y = arm.y;
		}

		var condiment = { caught: false, type: c, sprite: sprite };
		condiments.push(condiment);
	}

	SprayRandomStuff(Math.floor(4 + Math.random() * 8));

	// Setup Random Wanters
	SetupRandomWanting();
}

function SetupRandomWanting()
{
	wanters = [];
	for (var i = 0; i < characters.length; i++) {
		 wanters.push(i);
	}
	shuffle(wanters);
}
function SetupWanting(level) 
{
	wanters = [];
	wantings = level.wantings;
	currentWanting = 0;
	for (var w = 0; w < wantings.length; w++) {
		var wish = wantings[w];
		wanters.push(wish.wanterID);
	}
}

function StartWanting()
{
	wanting = false;
	wantTimeStarted = new Date();
	wantTimeDelay = 1;//3;//3 + Math.random() * 6;
	wantTimeDuration = 6 + Math.random() * 6;
}

function Want()
{
	if (modeRandom) {
		if (wanters.length > 0) {
			wanter = characters[wanters.pop()];
			wanter.StartWant(Math.floor(Math.random() * condimentCount));
		} else {
			NextRandomGame();
		}
	} else {
		if (currentWanting < wanters.length) {
			var wanterID = wanters[currentWanting];
			wanter = characters[wanterID];
			var wish = wantings[currentWanting];
			wanter.StartWant(wish.condimentID);
			currentWanting++;
		} else {
			NextGame();
		}
	}
}

function WantComplete()
{
	if (modeRandom) {
		if (wanters.length <= 0) {
			NextRandomGame();
		}
	} else {
		if (currentWanting >= wanters.length) {
			NextGame();
		}
	}

	//
	StartWanting();
}