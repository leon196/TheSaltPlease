// Utils
var pi = 3.1415926535897932384626433832795;
var pi2 = 6.283185307179586476925286766559;

// Simple Collision Test
function DistanceTest(bounds1, bounds2)
{
	var dist = distance(bounds1.x + bounds1.width * 0.5, bounds1.y + bounds1.height * 0.5, bounds2.x + bounds2.width * 0.5, bounds2.y + bounds2.height * 0.5);
	// return dist < Math.max(bounds1.width, Math.max(bounds1.height, Math.max(bounds2.width, bounds2.height)));
	return dist < bounds1.width * 0.5 || dist < bounds1.height * 0.5 || dist < bounds2.width * 0.5 || dist < bounds2.height * 0.5;
}

function BoundsCollisionTest(bounds1, bounds2)
{
	if (PointCollisionTest(bounds1.x, bounds1.y, bounds2)) { return true; }
	if (PointCollisionTest(bounds1.x, bounds1.y + bounds1.height, bounds2)) { return true; }
	if (PointCollisionTest(bounds1.x + bounds1.width, bounds1.y, bounds2)) { return true; }
	if (PointCollisionTest(bounds1.x + bounds1.width, bounds1.y + bounds1.height, bounds2)) { return true; }
	if (PointCollisionTest(bounds2.x, bounds2.y, bounds1)) { return true; }
	if (PointCollisionTest(bounds2.x, bounds2.y + bounds2.height, bounds1)) { return true; }
	if (PointCollisionTest(bounds2.x + bounds2.width, bounds2.y, bounds1)) { return true; }
	if (PointCollisionTest(bounds2.x + bounds2.width, bounds2.y + bounds2.height, bounds1)) { return true; }
	return false;
}

function PointCollisionTest(x, y, bounds) {
	if (x >= bounds.x) {
		if (x <= (bounds.x + bounds.width)) {
			if (y >= bounds.y) {
				if (y <= (bounds.y + bounds.height)) {
					return true;
				}
			}
		}
	}
	return false;
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function randomHead() {
	return textureHeads[Math.floor(Math.random() * textureHeads.length)];
}
function randomArm() {
	return textureArms[Math.floor(Math.random() * textureArms.length)];
}
function randomStuff() {
	if (Math.random() > 0.5) {
		return textureStuffs[Math.floor(Math.random() * textureStuffs.length)];
	} else {
		return randomPlate();
	}
}
function randomPlate() {
	return texturePlates[Math.floor(Math.random() * texturePlates.length)];
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function SprayRandomStuff(min, max, randomStuffCount)
{
	// Random Stuff
	for (var s = 0; s < randomStuffCount; s++) {
		var sprite = new PIXI.Sprite(randomStuff());
		sprite.scale.x = sprite.scale.y = globalScale * 0.8;
		sprite.alpha = 0;
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;
		// sprite.x = Math.random() * 
		// sprite.x = (s % dimension)/(dimension*2) * windowWidth + windowWidth/2 - windowWidth * 1/(dimension*2);
		// sprite.y = (Math.floor(s/dimension))/(dimension*2) * windowHeight + windowHeight/2 - windowHeight * 1/(dimension*2);
		sprite.x = Math.floor((min + Math.random() * (max - min)) * dimension) / dimension * windowWidth;
		sprite.y = Math.floor((min + Math.random() * (max - min)) * dimension) / dimension * windowHeight;
		//sprite.rotation = Math.random() * pi2;
		layerStuffs.addChild(sprite);
		stuffs.push({ caught: false, type: -1, sprite: sprite });
	}
}

/*
levels =  [
	{ x: 1/8 * windowWidth, y: 0, rot: 270, start: 0.1, end: 0.9 },
	{ x: 1/4 * windowWidth, y: 0, rot: 90, start: 0.1, end: 0.75 },
	{ x: 1/2 * windowWidth, y: 0, rot: 270, start: 0.25, end: 0.75 },
	{ x: 3/4 * windowWidth, y: 0, rot: 90, start: 0.1, end: 0.9 },
	{ x: 0, y: 1/4 * windowHeight, rot: 180, start: 0.5, end: 0.9 },
	{ x: 0, y: 1/2 * windowHeight, rot: 180, start: 0.25, end: 0.7 },
	{ x: 0, y: 1/2 * windowHeight, rot: 0, start: 0.1, end: 0.4 },
	{ x: 0, y: 3/4 * windowHeight, rot: 0, start: 0.25, end: 0.75}
];
*/