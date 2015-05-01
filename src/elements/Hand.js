
var Hand = function(direction, position, start, end) 
{
    // GUI
    PIXI.Container.call(this);
    this.x = position.x;
    this.y = position.y;
    this.handNumber = Asset.RandomHand();

    // Logic
    this.direction = direction;
    this.start = start;
    this.end = end;
    this.isOpen = false;
    this.stuff = null;
    this.stuffOffset = vec2(0,0);

    // Hand Sprite
    this.handSprite = new PIXI.Sprite(PIXI.Texture.fromFrame(Asset.HandOpen + this.handNumber));
    this.handSprite.anchor.x = 0.5
    this.handSprite.anchor.y = 0.5;
    this.handSprite.rotation = Direction.GetRotation(this.direction);
    this.addChild(this.handSprite);

    // Arm Sprite
    var armTexture = PIXI.Texture.fromFrame(Asset.Arm + this.handNumber);
    this.armSprite = new PIXI.extras.TilingSprite(armTexture, armTexture.width * 8, armTexture.height);
    this.armSprite.anchor.x = 1;
    this.armSprite.anchor.y = 0.5;
    this.armSprite.rotation = Direction.GetRotation(this.direction);
    this.armSprite.x = -Math.cos(this.armSprite.rotation) * this.handSprite.width / 2;
    this.armSprite.y = -Math.sin(this.armSprite.rotation) * this.handSprite.width / 2;
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
        var radius = (this.handSprite.width + this.handSprite.height + stuff.width + stuff.height) / 8.0;
        var caught = dist < radius;
        if (caught)
        {
            this.stuffOffset.x = this.x - stuff.x;
            this.stuffOffset.y = this.y - stuff.y;
            stuff.canBeCaught = false;
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

        if (this.stuff != null)
        {
            this.stuff.x = this.x - this.stuffOffset.x;
            this.stuff.y = this.y - this.stuffOffset.y;
        }

        if (mousePressed && this.isOpen)
        {
            this.isOpen = false;
            this.handSprite.texture = PIXI.Texture.fromFrame(Asset.HandClose + this.handNumber);
        }
        else if (!mousePressed && !this.isOpen)
        {
            this.isOpen = true;
            this.handSprite.texture = PIXI.Texture.fromFrame(Asset.HandOpen + this.handNumber);
        }
    };

    this.Recycle = function()
    {
    };
};

Hand.prototype = Object.create(PIXI.Container.prototype);
Hand.prototype.constructor = Hand;