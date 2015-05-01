
var Hand = function(direction, position, start, end) 
{
    // Logic
    this.direction = direction;
    this.start = start;
    this.end = end;
    this.isOpen = false;

    // Display
    PIXI.Sprite.call(this, PIXI.Texture.fromFrame(Asset.HandOpen));
	this.anchor.x = 0.5
    this.anchor.y = 0.45;
    this.x = position.x;
    this.y = position.y;
    this.rotation = Direction.GetRotation(this.direction);

    // Arm
    this.arm = new PIXI.Sprite(PIXI.Texture.fromFrame(Asset.Arm));
    this.arm.anchor.x = 1;
    this.arm.anchor.y = 0.5;
    this.addChild(this.arm);

    this.Update = function (x, y, mousePressed)
    {
        if (Direction.IsHorizontal(this.direction))
        {
            this.x = x;
        }
        else
        {
            this.y = y;
        }

        if (mousePressed && this.isOpen)
        {
            this.texture = PIXI.Texture.fromFrame(Asset.HandClose);
            this.isOpen = false;
        }
        else if (!mousePressed && !this.isOpen)
        {
            this.texture = PIXI.Texture.fromFrame(Asset.HandOpen);
            this.isOpen = true;
        }
    };

    this.Recycle = function()
    {
    };
};

Hand.prototype = Object.create(PIXI.Sprite.prototype);
Hand.prototype.constructor = Hand;