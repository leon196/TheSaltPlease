function Character(x, y, pos, rot, targetStart, targetEnd)
{

	// Movement & Orientations
	this.targets = {start: {x: 0, y: 0}, end: {x: 0, y: 0}};
	this.orientation = rot / 180 * pi;
	this.horizontal = rot == 0 || rot == 180 ? true : false;
	this.rot = rot;
	this.posGrid = pos;
	this.targetStart = targetStart;
	this.targetEnd = targetEnd;

	// Animation
	this.pirouette = rot == 0 || rot == 270 ? pi : -pi;
	this.pirouetteDuration = 0.5;

	// Set Targets	
	var minX = area.x + area.cellSize * this.targetStart -area.cellSize/2;
	var minY = area.y + area.cellSize * this.targetStart -area.cellSize/2;
	var maxX = area.x + area.cellSize * this.targetEnd -area.cellSize/2;
	var maxY = area.y + area.cellSize * this.targetEnd -area.cellSize/2;
	
	// Horizontal Issues
	if (this.rot == 0 || this.rot == 180)
	{
		// Set Min & Max on X axis
		this.targets.start.x = minX;
		this.targets.end.x = maxX;
		// Lock on Y axis
		this.targets.start.y = this.targets.end.y = y;
	} 
	// Vertical Issues
	else if (this.rot == 90 || this.rot == 270)
	{			
		// Set Min & Max on Y axis
		this.targets.start.y = minY;
		this.targets.end.y = maxY;
		// Lock on X axis
		this.targets.start.x = this.targets.end.x = x;
	}

	// Head
	this.head = new Head(x, y, pos, rot);

	// Arms
	this.arm = new Arm(x, y, pos, rot, this.targets, false, 0);
	this.armRight = new Arm(x, y, pos, rot, this.targets, true, this.head.spriteHead.height);
	this.armRight.synchronize(this.arm.indexHand, this.arm.indexArm);

	// Plate
	this.spritePlate = new PIXI.Sprite(randomPlate());
	this.spritePlate.anchor.x = this.spritePlate.anchor.y = 0.5;
	this.spritePlate.x = this.spritePlate.width/4;
	this.armRight.spriteHand.addChild(this.spritePlate);

	// Bull
	this.bull = new Bull(x, y, rot, this.head.spriteHead.height);

	// Condiments & Stuffs
	this.wantCondimentID = -1;
	this.usingCondiment = false;
	this.objectCaught = undefined;
	this.objectCaughtOffset = { x: 0, y: 0};
	this.positionUsingCondiment = { 
		x: (rot == 0 || rot == 180 ? this.spritePlate.x : x),
		y: (rot == 0 || rot == 180 ? y : this.spritePlate.y) };

	this.Update = function(ratio)
	{
		// Ratios
		var x = this.targets.start.x * (1.0 - ratio.x) + this.targets.end.x * ratio.x;
		var y = this.targets.start.y * (1.0 - ratio.y) + this.targets.end.y * ratio.y;
		// Positions on grid
		//x = Math.max(area.x, Math.min(x, area.x + area.w));
		//y = Math.max(area.y, Math.min(y, area.y + area.h));

		this.arm.Move(x, y);

		// Move Object
		if (this.objectCaught != undefined) {
			this.objectCaught.sprite.x = this.objectCaughtOffset.x + this.arm.spriteHand.x;
			this.objectCaught.sprite.y = this.objectCaughtOffset.y + this.arm.spriteHand.y;
		}
	}

	this.Catch = function()
	{
		// Animation
		this.arm.Catch();

    	// Collision Condiments
    	var getCondiment = false;
    	for (var i = 0; i < condiments.length; i++) {
    		var condiment = condiments[i];
    		if (condiment.caught == false) {
				var caught = DistanceTest(this.arm.getHandBounds(), condiment.sprite.getBounds());
    			if (caught) {
    				this.HaveSome(condiment);
    				getCondiment = true;
    				break;
    			}
    		}
    	}

    	// Collision Stuffs
    	if (!getCondiment) {
			for (var i = 0; i < stuffs.length; i++) {
				var stuff = stuffs[i];
				if (stuff.caught == false) {
					var caught = DistanceTest(this.arm.getHandBounds(), stuff.sprite.getBounds());
					if (caught) {
						this.HaveSome(stuff);
						break;
					}
				}
			}
		}
	}

	this.Release = function()
	{
		// Animation
		this.arm.Release();

		// Release Object
		if (this.objectCaught != undefined)
		{
			// Replace on layer
			var layer = this.objectCaught.type == -1 ? layerStuffs : layerCondiments;
			layer.addChild(this.objectCaught.sprite);

			// Reset Object
			this.objectCaught.caught = false;
			this.objectCaught = undefined;
		}
	}

	this.HaveSome = function(thing)
	{
		// Replace object on layer
		// if (thing.type == 0) {
			var spriteIndex = layerArms.children.indexOf(this.arm.spriteHand);
			layerArms.addChildAt(thing.sprite, Math.max(0, spriteIndex - 1));
		/*} else {
			var spriteIndex = layerArms.children.indexOf(this.arm.spriteArm);
			layerArms.addChildAt(thing.sprite, Math.min(layerArms.children.length-1, spriteIndex+1));
		}**/

		// Set thing caught
		thing.caught = true;

		// Set object caught
		this.objectCaught = thing;
		this.objectCaughtOffset.x = thing.sprite.x - this.arm.spriteHand.x;
		this.objectCaughtOffset.y = thing.sprite.y - this.arm.spriteHand.y;

		// Check Want
		if (this.wantCondimentID != -1) {
			if (thing.type == this.wantCondimentID) {
				this.usingCondiment = true;
				this.UnWant();

				var condiment = this.objectCaught.sprite;
				var character = this;
				var onComplete = function() {
					character.usingCondiment = false;
					character.Release();
					WantComplete();
				}

				var posFromHand = { x: character.arm.spriteHand.x, y: character.arm.spriteHand.y}
				var posFromCondiment = { x: condiment.x, y: condiment.y }
				var posTo = { x: this.positionUsingCondiment.x, y: this.positionUsingCondiment.y };

				if (this.horizontal) {
					posTo.y = condiment.y;
				} else {
					posTo.x = condiment.x;
				}

				// Aller
				Tweener.addTween(character.arm.spriteHand, { time: timeTaking, x:this.positionUsingCondiment.x, y:this.positionUsingCondiment.y, transition:"easeInQuad"});
				Tweener.addTween(character.arm.spriteArm, { time: timeTaking, x:this.positionUsingCondiment.x, y:this.positionUsingCondiment.y, transition:"easeInQuad"});
				Tweener.addTween(condiment, { time: timeTaking, x:posTo.x, y:posTo.y, transition:"easeInQuad"});

				// Retour
				Tweener.addTween(character.arm.spriteHand, { delay: timeTaking, time: timeReturning, x:posFromHand.x, y:posFromHand.y, transition:"easeInOutQuad"});
				Tweener.addTween(character.arm.spriteArm, { delay: timeTaking, time: timeReturning, x:posFromHand.x, y:posFromHand.y, transition:"easeInOutQuad"});
				Tweener.addTween(condiment, { delay: timeTaking, time: timeReturning, x:posFromCondiment.x, y:posFromCondiment.y, transition:"easeInOutQuad",  onComplete:onComplete});
/*
				// Pirouette Aller
				Tweener.addTween(character.arm.spriteHand, { delay: timeTaking - this.pirouetteDuration, time: this.pirouetteDuration, rotation:this.orientation + this.pirouette, transition:"easeInQuad"});
				Tweener.addTween(condiment, { delay: timeTaking - this.pirouetteDuration, time: this.pirouetteDuration, rotation: this.pirouette, transition:"easeInQuad"});

				
				// Pirouette Retour
				Tweener.addTween(character.arm.spriteHand, { delay: timeTaking, time: this.pirouetteDuration, rotation:this.orientation, transition:"easeInOutQuad"});
				Tweener.addTween(condiment, { delay: timeTaking + this.pirouetteDuration, time: this.pirouetteDuration, rotation:0, transition:"easeInOutQuad"});
				*/
			}
		}
	}

	this.CalculateTargets = function()
	{
		// Set Targets
		var minX = area.x + area.cellSize * this.targetStart -area.cellSize/2;
		var minY = area.y + area.cellSize * this.targetStart -area.cellSize/2;
		var maxX = area.x + area.cellSize * this.targetEnd -area.cellSize/2;
		var maxY = area.y + area.cellSize * this.targetEnd -area.cellSize/2;
		
		// Horizontal Issues
		if (this.rot == 0 || this.rot == 180)
		{
			// Set Min & Max on X axis
			this.targets.start.x = minX;
			this.targets.end.x = maxX;
			// Lock on Y axis
			this.targets.start.y = this.targets.end.y = positionArea(0, this.posGrid).y;
		} 
		// Vertical Issues
		else if (this.rot == 90 || this.rot == 270)
		{			
			// Set Min & Max on Y axis
			this.targets.start.y = minY;
			this.targets.end.y = maxY;
			// Lock on X axis
			this.targets.start.x = this.targets.end.x = positionArea(this.posGrid, 0).x;
		}
	}

	this.StartWant = function(condimentID)
	{
		this.bull.Setup(condimentID);
		this.wantCondimentID = condimentID;
	}

	this.Want = function(ratio)
	{
		this.bull.Grow(ratio);
	}

	this.UnWant = function()
	{
		this.wantCondimentID = -1;
		this.bull.Reset();
	}

	this.Appear = function()
	{
		this.arm.Appear();
		this.armRight.Appear();
		this.head.Appear();
	}

	this.Disappear = function()
	{
		this.arm.Disappear();
		this.armRight.Disappear();
		this.head.Disappear();
	}

	this.ReachMouse = function(ratio)
	{
		var x = this.targets.start.x * (1.0 - mouseRatio.x) + this.targets.end.x * mouseRatio.x;
		x = this.arm.positionOutOfScreen.x * (1 - ratio) + x * ratio;
		var y = this.targets.start.y * (1.0 - mouseRatio.y) + this.targets.end.y * mouseRatio.y;
		y = this.arm.positionOutOfScreen.y * (1 - ratio) + y * ratio;
		this.arm.Move(x, y);
	}

	this.resize = function()
	{

		this.CalculateTargets();
		this.arm.targets = this.targets;

		this.head.resize();
		this.arm.resize();
		this.armRight.resize();
		this.spritePlate.scale.x = this.spritePlate.scale.y = globalScale;
	}
}