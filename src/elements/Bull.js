
var Bull = function(position, condimentType, delay) 
{
    // GUI
    PIXI.Sprite.call(this, PIXI.Texture.fromFrame(Asset.Bull));
    this.anchor.y = 1.0;
    this.x = position.x;
    this.y = position.y;

    // Condiment Sprite
    this.condimentSprite = new PIXI.Sprite(PIXI.Texture.fromFrame(Asset.GetCondiment(condimentType)));
    this.condimentSprite.anchor.x = this.condimentSprite.anchor.y = 0.5;
    this.condimentSprite.scale.x = this.condimentSprite.scale.y = 0.75;
    this.condimentSprite.x = this.width / 2;
    this.condimentSprite.y = this.height / 2 - this.height;
    this.addChild(this.condimentSprite);
};

Bull.prototype = Object.create(PIXI.Sprite.prototype);
Bull.prototype.constructor = Bull;

