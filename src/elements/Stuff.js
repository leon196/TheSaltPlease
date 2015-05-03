
var Stuff = function(texture, position) 
{
    // GUI
    PIXI.Sprite.call(this, texture);
	this.anchor.x = this.anchor.y = 0.5;
    this.x = position.x;
    this.y = position.y;

    // Animation Falling
    this.positionInitial = vec2(position.x, position.y);
    this.randomSeed = Math.random();
    this.velocity = -10.0;
    this.zIndex = 0;

    // Logic
    this.canBeCaught = true;
    this.isCondiment = false;

    this.FallIn = function (ratio)
	{
        this.y = mix(Direction.GetOutOfScreenPosition(Direction.Down), this.positionInitial.y, ratio);
    };

    this.FallOut = function (ratio)
	{
		this.x += Math.cos(this.randomSeed * PI2);
        this.y += this.velocity + Math.sin(this.randomSeed * PI2);
        this.velocity += 0.2;
        this.alpha = 1.0 - ratio;
    };
};

Stuff.prototype = Object.create(PIXI.Sprite.prototype);
Stuff.prototype.constructor = Stuff;