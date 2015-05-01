var Background = function() 
{
    PIXI.Sprite.call(this, PIXI.Texture.fromImage(Asset.Background));

    this.anchor.x = this.anchor.y = 0.5;

    var screenSizeMin = Math.min(Screen.size.width, Screen.size.height);
    var tableSizeMax = Math.max(this.width, this.height);
    var scale = tableSizeMax / screenSizeMin;

    this.scale.x = this.scale.y = scale;
};

Background.prototype = Object.create(PIXI.Sprite.prototype);
Background.prototype.constructor = Background;