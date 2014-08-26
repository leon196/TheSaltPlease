function Arm(x, y, rot, targets, inversed, offset)
{
	this.indexHand = Math.floor(Math.random() * textureHandOpens.length);
	this.indexArm = Math.floor(Math.random() * textureArms.length);
	this.targets = targets;

	// Sprites
	this.spriteArm = new PIXI.Sprite(textureArms[this.indexArm]);
	this.spriteHand = new PIXI.Sprite(textureHandOpens[this.indexHand]);
	layerArms.addChild(this.spriteHand);
	layerArms.addChild(this.spriteArm);

	// Scale
	this.spriteArm.scale.x = globalScale * 0.6
	this.spriteArm.scale.y = globalScale * 0.6 * (inversed ? -1 : 1);
	this.spriteHand.scale.x = globalScale * 0.6
	this.spriteHand.scale.y = globalScale * 0.6 * (inversed ? -1 : 1);

	// General Anchors
	this.spriteHand.anchor.x = 0.5;
	this.spriteHand.anchor.y = 0.5;
	this.spriteArm.anchor.y = 0.5;
	this.spriteArm.anchor.x = 1;

	// Positions
	this.positionInitial = { x: 0, y: 0};
	this.positionOutOfScreen = { x: 0, y: 0};

	// Rotate
	this.spriteArm.rotation = rot / 180 * pi;
	this.spriteHand.rotation = rot / 180 * pi;// + (inversed ? pi / 4 : 0);

	switch (rot) 
	{
		case 0:
			if (inversed) {
				this.positionInitial.x = this.spriteArm.x = this.spriteHand.x = x + this.spriteHand.width * 0.5;
				this.positionOutOfScreen.y = this.positionInitial.y = this.spriteArm.y = this.spriteHand.y = y + offset;
			} else {
				this.positionInitial.x = this.spriteArm.x = this.spriteHand.x = this.targets.start.x;
				this.positionOutOfScreen.y = this.positionInitial.y = this.spriteArm.y = this.spriteHand.y = this.targets.start.y;
			}
			this.positionOutOfScreen.x = - this.spriteHand.width;
		break;

		case 180:
			this.positionInitial.x = this.spriteArm.x = this.spriteHand.x = x - this.spriteHand.width * 0.5;
			this.positionOutOfScreen.y = this.positionInitial.y = this.spriteArm.y = this.spriteHand.y = y - offset;
			this.positionOutOfScreen.x = windowWidth + this.spriteHand.width;
		break;

		case 90:
			this.positionOutOfScreen.x = this.positionInitial.x = this.spriteArm.x = this.spriteHand.x = x - offset;
			this.positionInitial.y = this.spriteArm.y = this.spriteHand.y = y + this.spriteHand.width * 0.5;
			this.positionOutOfScreen.y = - this.spriteHand.width;
		break;

		case 270:
			this.positionOutOfScreen.x = this.positionInitial.x = this.spriteArm.x = this.spriteHand.x = x + offset;
			this.positionInitial.y = this.spriteArm.y = this.spriteHand.y = y - this.spriteHand.width * 0.5;
			this.positionOutOfScreen.y = windowHeight + this.spriteHand.width;
		break;
	}

	this.synchronize = function(indexHand, indexArm)
	{
		this.indexHand = indexHand;
		this.spriteHand.setTexture(textureHandOpens[this.indexHand]);
		this.spriteArm.setTexture(textureArms[indexArm]);
	}

	this.getHandBounds = function()
	{
		return this.spriteHand.getBounds();
	}

	this.Move = function(x, y)
	{
		this.spriteHand.x = this.spriteArm.x = x;
		this.spriteHand.y = this.spriteArm.y = y;
		
	}

	this.Catch = function()
	{
		this.spriteHand.setTexture(textureHandCatchs[this.indexHand]);
	}

	this.Release = function()
	{
		this.spriteHand.setTexture(textureHandOpens[this.indexHand]);
	}

	this.Appear = function()
	{
		// Hand
		this.spriteHand.x = this.positionOutOfScreen.x;
		this.spriteHand.y = this.positionOutOfScreen.y;
		Tweener.addTween(this.spriteHand, { time: timeAppear,
			x: this.positionInitial.x, y: this.positionInitial.y,
			transition:"easeInOutSine"});
		// Arm
		this.spriteArm.x = this.positionOutOfScreen.x;
		this.spriteArm.y = this.positionOutOfScreen.y;
		Tweener.addTween(this.spriteArm, { time: timeAppear,
			x: this.positionInitial.x, y: this.positionInitial.y,
			transition:"easeInOutSine"});
	}

	this.Disappear = function()
	{
		// Hand
		Tweener.addTween(this.spriteHand, { time: timeAppear,
			x: this.positionOutOfScreen.x, y: this.positionOutOfScreen.y,
			transition:"easeInOutSine"});
		// Arm
		Tweener.addTween(this.spriteArm, { time: timeAppear,
			x: this.positionOutOfScreen.x, y: this.positionOutOfScreen.y,
			transition:"easeInOutSine"});
	}
}