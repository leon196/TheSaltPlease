
var Stuff = function(position) 
{
    // GUI
    PIXI.Sprite.call(this, PIXI.Texture.fromFrame(Asset.Stuff));
	this.anchor.x = this.anchor.y = 0.5;
    this.x = position.x;
    this.y = position.y;

    // Logic
    this.canBeCaught = true;
};

Stuff.prototype = Object.create(PIXI.Sprite.prototype);
Stuff.prototype.constructor = Stuff;