var Scene = function() 
{
    // GUI
    PIXI.Container.call(this);
    this.background;
    this.tableSprite;
    // this.debugGrid;
    
    // Input
    this.interactive = true;
    this.mouse = vec2(0,0);
    this.mousePressed = false;

    // Logic
    this.ready = false;
    this.currentLevel = 0;

    // Elements
    this.handList;
    this.stuffList;

    this.Setup = function ()
    {
        // Background
        this.background = new Background();
        this.addChild(this.background);

        // Table
        this.tableSprite = new PIXI.Sprite(PIXI.Texture.fromImage(Asset.Table));
        this.tableSprite.anchor.x = this.tableSprite.anchor.y = 0.5;
        this.addChild(this.tableSprite);

        // Debug Grid
        // this.debugGrid = new PIXI.Graphics();
        // this.addChild(this.debugGrid);

        this.Resize();

        // Stuffs
        this.stuffList = Level.GetStuffListForLevel(this.currentLevel);
        for (var s = 0; s < this.stuffList.length; ++s) {
            var stuff = this.stuffList[s];
            this.addChild( stuff );
        }

        // Hands
        this.handList = Level.GetHandListForLevel(this.currentLevel);
        for (var h = 0; h < this.handList.length; ++h) {
            var hand = this.handList[h];
            this.addChild( hand );
        }

        this.ready = true;
    };

    this.Update = function ()
    {
        if (this.ready)
        {
            for (var h = this.handList.length - 1; h >= 0; --h)
            {
                var hand = this.handList[h];
                var x = clamp(this.mouse.x, hand.start * Screen.tableSize, hand.end * Screen.tableSize);
                var y = clamp(this.mouse.y, hand.start * Screen.tableSize, hand.end * Screen.tableSize);
                hand.Update(x, y, this.mousePressed);
            }
        }
    };

    // Input Events

    this.touchmove = this.mousemove = function(mouseData)
    {
        this.mouse = mouseData.data.getLocalPosition(this);
    };

    this.tap = this.touchstart = this.mousedown = function(mouseData)
    {
        this.mouse = mouseData.data.getLocalPosition(this);
        this.mousePressed = true;
    };

    this.touchend = this.touchendoutside = this.mouseupoutside = this.mouseout = this.mouseup = function(mouseData)
    {
        this.mouse = mouseData.data.getLocalPosition(this);
        this.mousePressed = false;
    };

    // Resize Event

    this.Resize = function ()
    {
        var screenSizeMin = Math.min(Screen.size.width, Screen.size.height);
        var tableSizeMax = Math.max(this.tableSprite.width, this.tableSprite.height);
        var scale = screenSizeMin / tableSizeMax;

        this.scale.x = this.scale.y = scale;

        this.x = Screen.size.width / 2;
        this.y = Screen.size.height / 2;

        Screen.tableSize = Screen.tableMarginRatio * tableSizeMax / 2;

        /*
        this.debugGrid.clear();
        this.debugGrid.beginFill(0x00ff00);
        this.debugGrid.drawRect( -Screen.tableSize, -Screen.tableSize, Screen.tableSize * 2, Screen.tableSize * 2 );
        this.debugGrid.endFill();
        */
    }
};

Scene.prototype = Object.create(PIXI.Container.prototype);
Scene.prototype.constructor = Scene;