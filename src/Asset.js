var Asset = {};

Asset.Background = "img/background.jpg"
Asset.Table = "img/table.png";
Asset.HandOpen = "handOpen1";
Asset.HandClose = "handCatch1";
Asset.Arm = "arm1";
Asset.Stuff = "stuff1"

Asset.LoadAndSetup = function (onComplete)
{
    PIXI.loader
    .add(Asset.Background)
    .add(Asset.Table)
    .add("img/sprites.png", "img/sprites.json")
    .once('complete', onComplete)
    .load();
};