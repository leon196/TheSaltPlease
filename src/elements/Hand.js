
var Hand = function(direction, position, start, end) 
{
    // GUI
    PIXI.Container.call(this);
    this.x = position.x;
    this.y = position.y;

    // Logic
    this.direction = direction;
    this.start = start;
    this.end = end;
    this.isOpen = false;
    this.stuff = null;

    // Hand Sprite
    this.handSprite = new PIXI.Sprite(PIXI.Texture.fromFrame(Asset.HandOpen));
    this.handSprite.anchor.x = 0.5
    this.handSprite.anchor.y = 0.45;
    this.handSprite.rotation = Direction.GetRotation(this.direction);
    this.addChild(this.handSprite);

    // Arm Sprite
    this.armSprite = new PIXI.Sprite(PIXI.Texture.fromFrame(Asset.Arm));
    this.armSprite.anchor.x = 1;
    this.armSprite.anchor.y = 0.5;
    this.armSprite.rotation = Direction.GetRotation(this.direction);
    this.addChild(this.armSprite);

    this.CanCatch = function ()
    {
        return this.stuff == null;
    };

    this.HasStuff = function ()
    {
        return this.stuff != null;
    };

    this.Catch = function (stuff)
    {
        var dist = distance(stuff.position, this.position);
        var radius = (this.handSprite.width + this.handSprite.height + stuff.width + stuff.height) / 4.0;
        var caught = dist < radius;
        //console.log(stuff);
        if (caught)
        {
            stuff.x = this.x - stuff.x;
            stuff.y = this.y - stuff.y;
            stuff.canBeCaught = false;
            this.addChild(stuff);
            this.stuff = stuff;
        }
        return caught;
    };

    this.Drop = function ()
    {
        this.stuff.canBeCaught = true;
        this.stuff = null;
    };

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
            this.isOpen = false;
            this.handSprite.texture = PIXI.Texture.fromFrame(Asset.HandClose);
        }
        else if (!mousePressed && !this.isOpen)
        {
            this.isOpen = true;
            this.handSprite.texture = PIXI.Texture.fromFrame(Asset.HandOpen);
        }
    };

    this.Recycle = function()
    {
    };
};

Hand.prototype = Object.create(PIXI.Container.prototype);
Hand.prototype.constructor = Hand;