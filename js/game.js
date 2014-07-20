

var arms = [];
var hands = [];
var targets = [];
var stage;
var salt;
var mouseClic = false;
var armLength = 400;

var bitmapArm = new BitmapData("img/arm.png");
var bitmapHand = new BitmapData("img/hand.png");
var bitmapHandCatch = new BitmapData("img/handCatch.png");
var bitmapSalt = new BitmapData("img/salt.png");

$(document).ready(function(){
	Start();
});

function Start()
{
	stage = new Stage("game");

	// background
	var bg = new Bitmap(new BitmapData("img/xnviewshell_wallpaper.jpg"));
	bg.scaleX = stage.stageWidth / 1530;  
	bg.scaleY = stage.stageHeight / 1080;
	stage.addChild(bg);

	salt = new Bitmap(bitmapSalt);
	salt.x = stage.stageWidth * 0.5;
	salt.y = stage.stageHeight * 0.5;
	stage.addChild(salt);

	var levels = [
		{isVertical: true, isReversed: false, x: 1/4 * stage.stageWidth, y: -100, start: 0.2, end: 0.8},
		{isVertical: false, isReversed: false, x: -100, y: 1/4 * stage.stageHeight, start: 0.4, end: 0.6},
		{isVertical: true, isReversed: false, x: 2/4 * stage.stageWidth, y: -100, start: 0.4, end: 0.6},
		{isVertical: false, isReversed: false, x: -100, y: 2/4 * stage.stageHeight, start: 0.2, end: 0.8},
		{isVertical: true, isReversed: false, x: 3/4 * stage.stageWidth, y: -100, start: 0.1, end: 0.7},
		{isVertical: false, isReversed: false, x: -100, y: 3/4 * stage.stageHeight, start: 0.1, end: 0.5},
		{isVertical: false, isReversed: true, x: stage.stageWidth + 100, y: 9/10 * stage.stageHeight, start: 0.1, end: 0.9}
	];

	var count = levels.length;
	for(var i=0; i<count; i++)
	{
		//var x = ((i+1)/(count+1))*stage.stageWidth - 54;
		var level = levels[i];
		createArm(level.x, level.y, level.start, level.end, level.isVertical, level.isReversed);
	}

	stage.addEventListener(MouseEvent.MOUSE_DOWN, onMD );
	stage.addEventListener(MouseEvent.MOUSE_UP, onMU );
	stage.addEventListener(Event.ENTER_FRAME, onEF);
	stage.addEventListener(MouseEvent.MOUSE_MOVE, onMM );
}

function createArm(x, y, targetStart, targetEnd, isVertical, isReversed)
{
	// Arm Vertical
	var b = new Bitmap(bitmapArm);
	b.x = x;
	b.y = y;
	
	arms.push(b);
	targets.push({isVertical:isVertical, isReversed:isReversed, start: targetStart, end: targetEnd});
	stage.addChild(b);

	// Hand Vertical
	var h = new Bitmap(bitmapHand);
	
	if (!isVertical) {
		b.rotation += 270.0;
		h.rotation += 270.0;
		h.y = b.y;
	} else {
		h.x = b.x;
	}

	if (isReversed) {
		b.rotation += 180.0;
		h.rotation += 180.0;
	}

	hands.push(h);
	stage.addChild(h);
}

function onMU(e)
{
	mouseClic = false;
	for(var i=0; i<hands.length; i++) 
	{
		var hand = hands[i];
		hand.bitmapData = bitmapHand;
	}
}

function onMD(e)
{
	mouseClic = true;
	for(var i=0; i<hands.length; i++) 
	{
		var hand = hands[i];
		hand.bitmapData = bitmapHandCatch;
	}
}

function onEF(e)
{
	var ratioX = stage.mouseX / stage.stageWidth;
	var ratioY = stage.mouseY / stage.stageHeight;
	for(var i=0; i<arms.length; i++) 
	{
		var arm = arms[i];
		var target = targets[i];
		var hand = hands[i];
		if (target.isVertical) {
			if (target.isReversed) {
				arm.scaleY = (target.end * (1.0 - ratioY) + target.start * ratioY) * stage.stageHeight / armLength;
				hand.y = (target.start * (1.0 - ratioY) + target.end * ratioY) * stage.stageHeight + 100;
			} else {
				arm.scaleY = (target.start * (1.0 - ratioY) + target.end * ratioY) * stage.stageHeight / armLength;
				hand.y = (target.start * (1.0 - ratioY) + target.end * ratioY) * stage.stageHeight - 100;
			}
		} else {
			if (target.isReversed) {
				arm.scaleY = (target.end * (1.0 - ratioX) + target.start * ratioX) * stage.stageWidth / armLength;
				hand.x = (target.start * (1.0 - ratioX) + target.end * ratioX) * stage.stageWidth + 100;
			} else {
				arm.scaleY = (target.start * (1.0 - ratioX) + target.end * ratioX) * stage.stageWidth / armLength;
				hand.x = (target.start * (1.0 - ratioX) + target.end * ratioX) * stage.stageWidth - 100;
			}
		}
	}
}
function onMM(e)
{
}