function Head(x, y, rot)
{
	// Sprites
	this.spriteHead = new PIXI.Sprite(randomHead());
	this.spritePlate = new PIXI.Sprite(randomPlate());

	// Head
	this.spriteHead.scale.x = this.spriteHead.scale.y = globalScale * 0.8;
	this.spriteHead.rotation = rot / 180 * pi - pi/2;
	this.spriteHead.anchor.x = 1;
	this.spriteHead.anchor.y = 0.33;
	this.spriteHead.x = x;
	this.spriteHead.y = y;

	// Plate
	this.spritePlate.anchor.x = 0.75;
	this.spritePlate.anchor.y = 0;
	this.spritePlate.x = x + (rot == 0 ? this.spriteHead.height * 0.75 : (rot == 180 ? -this.spriteHead.height * 0.75 : 0));
	this.spritePlate.y = y + (rot == 90 ? this.spriteHead.height * 0.75 : (rot == 270 ? -this.spriteHead.height * 0.75 : 0));
	this.spritePlate.scale.x = globalScale * 0.8;
	this.spritePlate.scale.y = globalScale * 0.8;
	this.spritePlate.rotation = rot / 180 * pi;

	// Positions
	this.positionHeadInitial = { x: this.spriteHead.x, y: this.spriteHead.y };
	this.positionPlateInitial = { x: this.spritePlate.x, y: this.spritePlate.y };
	this.positionHeadOutOfScreen = { x: this.spriteHead.x, y: this.spriteHead.y };
	this.positionPlateOutOfScreen = { x: this.spritePlate.x, y: this.spritePlate.y };
	switch (rot) {
		case 0:
			this.positionHeadOutOfScreen.x = -this.spriteHead.width;
			this.positionPlateOutOfScreen.x = -this.spritePlate.width;
		break;
		case 180:
			this.positionHeadOutOfScreen.x = windowWidth + this.spriteHead.width;
			this.positionPlateOutOfScreen.x = windowWidth + this.spritePlate.width;
		break;
		case 270:
			this.positionHeadOutOfScreen.y = windowHeight + this.spriteHead.width;
			this.positionPlateOutOfScreen.y = windowHeight + this.spritePlate.width;
		break;
		case 90:
			this.positionHeadOutOfScreen.y = -this.spriteHead.width;
			this.positionPlateOutOfScreen.y = -this.spritePlate.width;
		break;
	}
	
	// Add to stage
	layerStuffs.addChild(this.spritePlate);
	layerHeads.addChild(this.spriteHead);

	this.Appear = function()
	{
		// Head
		this.spriteHead.x = this.positionHeadOutOfScreen.x;
		this.spriteHead.y = this.positionHeadOutOfScreen.y;
		Tweener.addTween(this.spriteHead, { time: timeAppear,
			x: this.positionHeadInitial.x, y: this.positionHeadInitial.y,
			transition:"easeInOutSine"});
		// Plate
		this.spritePlate.x = this.positionPlateOutOfScreen.x;
		this.spritePlate.y = this.positionPlateOutOfScreen.y;
		Tweener.addTween(this.spritePlate, { time: timeAppear,
			x: this.positionPlateInitial.x, y: this.positionPlateInitial.y,
			transition:"easeInOutSine"});
	}

	this.Disappear = function()
	{
		// Head
		this.spriteHead.x = this.positionHeadInitial.x;
		this.spriteHead.y = this.positionHeadInitial.y;
		Tweener.addTween(this.spriteHead, { time: timeAppear,
			x: this.positionHeadOutOfScreen.x, y: this.positionHeadOutOfScreen.y,
			transition:"easeInOutSine"});
		// Plate
		this.spritePlate.x = this.positionPlateInitial.x;
		this.spritePlate.y = this.positionPlateInitial.y;
		Tweener.addTween(this.spritePlate, { time: timeAppear,
			x: this.positionPlateOutOfScreen.x, y: this.positionPlateOutOfScreen.y,
			transition:"easeInOutSine"});
	}

}