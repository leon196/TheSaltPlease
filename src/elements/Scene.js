var Scene = function() 
{
    // GUI
    PIXI.Container.call(this);
    this.interactive = true;
    this.background;
    this.tableSprite;
    // this.debugGrid;

    // Logic
    this.isReady = false;
    this.isAppearing = false;
    this.isDisappearing = false;
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

        this.isReady = true;
        this.Resize();
        this.LoadLevel();
        this.Show();
    };

    this.LoadLevel = function ()
    {
        // Stuffs
        this.stuffList = Level.GetStuffListForLevel(this.currentLevel);
        for (var s = 0; s < this.stuffList.length; ++s) {
            var stuff = this.stuffList[s];
            stuff.zIndex = this.children.length;
            this.addChild( stuff );
        }

        // Hands
        this.handList = Level.GetHandListForLevel(this.currentLevel);
        for (var h = 0; h < this.handList.length; ++h) {
            var hand = this.handList[h];
            this.addChild( hand );
        }
    };

    this.Show = function ()
    {
        Time.appearingStarted = Time.GetElapsed();
        this.isAppearing = true;
    };

    this.Update = function ()
    {
        if (this.isReady)
        {
            var hand, stuff, ratio, x, y, outOfScreenPosition;
            for (var h = 0; h < this.handList.length; ++h)
            {
                hand = this.handList[h];
                x = mix(hand.start * Screen.tableSize, hand.end * Screen.tableSize, clamp((Input.mouseTable.x + Screen.tableSize) / (Screen.tableSize * 2), 0, 1));
                y = mix(hand.start * Screen.tableSize, hand.end * Screen.tableSize, clamp((Input.mouseTable.y + Screen.tableSize) / (Screen.tableSize * 2), 0, 1));

                if (this.isAppearing)
                {
                    ratio = animationRatio(Time.appearingStarted, Time.appearingDelay, Time.GetElapsed());
                    outOfScreenPosition = Direction.GetOutOfScreenPosition(hand.direction);
                    x = mix(outOfScreenPosition, x, ratio);
                    y = mix(outOfScreenPosition, y, ratio);

                    for (var s = this.stuffList.length - 1; s >= 0; --s)
                    {
                        stuff = this.stuffList[s];
                        stuff.FallIn(smoothstep(0, 0.5 * stuff.zIndex / this.children.length, ratio));
                    }

                    if (ratio >= 1.0)
                    {
                        this.isAppearing = false;
                    }
                }
                if (this.isDisappearing)
                {
                    ratio = animationRatio(Time.disappearingStarted, Time.disappearingDelay, Time.GetElapsed());
                    outOfScreenPosition = Direction.GetOutOfScreenPosition(hand.direction);
                    x = mix(x, outOfScreenPosition, ratio);
                    y = mix(y, outOfScreenPosition, ratio);

                    for (var s = this.stuffList.length - 1; s >= 0; --s)
                    {
                        stuff = this.stuffList[s];
                        stuff.FallOut(ratio);
                    }
                }
                
                // Animating
                hand.Update(x, y, Input.mousePressed);

                // Catching
                if (Input.mouseClic && hand.CanCatch())
                {
                    for (var s = this.stuffList.length - 1; s >= 0; --s)
                    {
                        stuff = this.stuffList[s];
                        if (stuff.canBeCaught)
                        {
                            if (hand.Catch(stuff))
                            {
                                this.setChildIndex(stuff, this.getChildIndex(hand) - 1);
                                break;
                            }
                        }
                    }
                }

                // Droping
                if (!Input.mousePressed && hand.HasStuff())
                {
                    this.setChildIndex(hand.stuff, this.getChildIndex(this.handList[0]) - 1);
                    hand.Drop();
                }
            }
        }

        Input.mouseClic = false;
    };

    // Input Events

    this.touchmove = this.mousemove = function(mouseData)
    {
        Input.mouseTable = mouseData.data.getLocalPosition(this);
    };

    this.mousedown = function(mouseData)
    {
        Input.mouseTable = mouseData.data.getLocalPosition(this);
        Input.mousePressed = true;
        Input.mouseClic = true;
    };

    this.tap = function(mouseData)
    {
        Input.mouseTable = mouseData.data.getLocalPosition(this);
        if (Input.mousePressed)
        {
            Input.mousePressed = false;
        }
        else
        {
            Input.mousePressed = true;
        }
        Input.mouseClic = true;
    };

    this.mouseupoutside = this.mouseout = this.mouseup = function(mouseData)
    {
        Input.mouseTable = mouseData.data.getLocalPosition(this);
        Input.mousePressed = false;
    };

    this.Restart = function ()
    {
        for (var h = 0; h < this.handList.length; ++h)
        {
            var hand = this.handList[h];
            this.removeChild(hand);
        }
        this.handList = [];

        for (var s = 0; s < this.stuffList.length; ++s)
        {
            var stuff = this.stuffList[s];
            this.removeChild(stuff);
        }
        this.stuffList = [];
    };

    this.Resize = function ()
    {
        if (this.isReady)
        {
            var screenSizeMin = Math.min(Screen.size.width, Screen.size.height);
            var tableSizeMax = Math.max(this.tableSprite.width, this.tableSprite.height);
            var scale = screenSizeMin / tableSizeMax;

            this.scale.x = this.scale.y = scale;

            this.x = Screen.size.width / 2;
            this.y = Screen.size.height / 2;

            Screen.tableSize = Screen.tableMarginRatio * tableSizeMax / 2;

            // this.debugGrid.clear();
            // this.debugGrid.beginFill(0x00ff00);
            // this.debugGrid.drawRect( -Screen.tableSize, -Screen.tableSize, Screen.tableSize / 2, Screen.tableSize * 2 );
            // this.debugGrid.drawRect( -Screen.tableSize + Screen.tableSize, -Screen.tableSize, Screen.tableSize / 2, Screen.tableSize * 2 );
            // this.debugGrid.endFill();
        }
    }
};

Scene.prototype = Object.create(PIXI.Container.prototype);
Scene.prototype.constructor = Scene;