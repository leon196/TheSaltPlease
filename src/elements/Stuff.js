
var Stuff = function(position) 
{
    // Display
    PIXI.Sprite.call(this, PIXI.Texture.fromFrame(Asset.Stuff));
	this.anchor.x = this.anchor.y = 0.5;
    this.x = position.x;
    this.y = position.y;
};

Stuff.prototype = Object.create(PIXI.Sprite.prototype);
Stuff.prototype.constructor = Stuff;