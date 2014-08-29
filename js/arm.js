function Arm(x, y, pos, rot, targets, inversed, offset)
{
	this.indexHand = Math.floor(Math.random() * textureHandOpens.length);
	this.indexArm = Math.floor(Math.random() * textureArms.length);
	this.targets = targets;
	this.rot = rot;
	this.posGrid = pos;
	this.inversed = inversed;

	// Sprites
	this.spriteArm = new PIXI.Sprite(textureArms[this.indexArm]);
	this.spriteHand = new PIXI.Sprite(textureHandOpens[this.indexHand]);
	layerArms.addChild(this.spriteHand);
	layerArms.addChild(this.spriteArm);

	// Scale
	this.spriteArm.scale.x = globalScale
	this.spriteArm.scale.y = globalScale;// * (inversed ? -1 : 1);
	this.spriteHand.scale.x = globalScale
	this.spriteHand.scale.y = globalScale;// * (inversed ? -1 : 1);

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

	switch (this.rot) 
	{
		case 0:
			this.positionInitial.x = this.spriteArm.x = this.spriteHand.x = x + this.spriteHand.width * 0.5;
			this.positionOutOfScreen.y = this.positionInitial.y = this.spriteArm.y = this.spriteHand.y = y + offset;
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

	this.resize = function()
	{
		this.spriteHand.scale.x = this.spriteHand.scale.y = globalScale;
		this.spriteArm.scale.x = this.spriteArm.scale.y = globalScale;

		if (this.rot == 90 || this.rot == 270) {
			this.spriteHand.x = this.spriteArm.x = positionArea(this.posGrid, 0).x;
			if (this.rot == 90) {
				this.spriteHand.y = this.spriteArm.y = 0;
			} else {
				this.spriteHand.y = this.spriteArm.y = windowHeight;
			}
		} else {
			this.spriteHand.y = this.spriteArm.y = positionArea(0, this.posGrid).y;
			if (this.rot == 0) {
				this.spriteHand.x = this.spriteArm.x = 0;
			} else {
				this.spriteHand.x = this.spriteArm.x = windowWidth;
			}
		}

		switch (this.rot) 
		{
			case 0:
				this.positionInitial.x = this.spriteArm.x = this.spriteHand.x = x + this.spriteHand.width * 0.5;
				this.positionOutOfScreen.y = this.positionInitial.y = this.spriteArm.y = this.spriteHand.y = y + offset;
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
	}
}