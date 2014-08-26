function Bull(x, y, rot, offset)
{
	this.spriteBullWantContainer = new PIXI.DisplayObjectContainer();
	this.spriteBull = new PIXI.Sprite(textureBull);
	this.spriteWant = new PIXI.Sprite(textureCondiments[0]);
	
	this.spriteBull.anchor.x = 0;
	this.spriteBull.anchor.y = 1;
	this.spriteWant.anchor.x = 0.5;
	this.spriteWant.anchor.y = 0.5;
	this.spriteBull.alpha = 0;
	this.spriteWant.alpha = 0;
	this.spriteBull.rotation = rot / 180 * pi;
	this.spriteBull.scale.x = this.spriteBull.scale.y = globalScale * 0.8;
	this.spriteWant.scale.x = this.spriteWant.scale.y = globalScale * 0.5;

	layerBulls.addChild(this.spriteBullWantContainer);
	this.spriteBullWantContainer.addChild(this.spriteBull);
	this.spriteBullWantContainer.addChild(this.spriteWant);
	this.spriteWant.x = this.spriteBull.x + (rot == 0 || rot == 90 ? this.spriteBull.width * 0.5 : - this.spriteBull.width * 0.5);
	this.spriteWant.y = this.spriteBull.y + (rot == 180 || rot == 90 ? this.spriteBull.height * 0.5 : - this.spriteBull.height * 0.5);

	this.spriteBullWantContainer.x = x + Math.cos(rot / 180 * pi) * this.spriteBull.width * 0.5;
	this.spriteBullWantContainer.y = y + Math.sin(rot / 180 * pi) * this.spriteBull.width * 0.5;

	this.Setup = function(condimentID)
	{
		this.spriteBull.alpha = 1;
		this.spriteWant.setTexture(textureCondiments[condimentID]);
		this.spriteWant.alpha = 1;
		this.spriteBullWantContainer.scale.x = this.spriteBullWantContainer.scale.y = 0;
	}

	this.Reset = function()
	{
		this.spriteBull.alpha = 0;
		this.spriteWant.alpha = 0;
	}

	this.Grow = function(ratio)
	{
		this.spriteBullWantContainer.scale.x = this.spriteBullWantContainer.scale.y = ratio;
	}
}