var Asset = {};

Asset.Background = "img/background.jpg";
Asset.Table = "img/table.png";

Asset.HandOpen = "handOpen";
Asset.HandClose = "handClose";
Asset.Arm = "arm";
Asset.Stuff = "plate1";
Asset.Condiment = "condiment";
Asset.Bull = "bull";

Asset.HandCount = 3;
Asset.StuffCount = 1;
Asset.HandRandomUniques = [7, 12, 13];//randomUniqueList(Asset.HandCount);

Asset.RandomHand = function ()
{
    /*
	var r = Asset.HandRandomUniques.pop();
	if (Asset.HandRandomUniques.length == 0)
	{
		Asset.HandRandomUniques = randomUniqueList(Asset.HandCount);
	}
	return r + 1;
    */
    return Asset.HandRandomUniques[ Math.floor( Math.random() * Asset.HandRandomUniques.length ) ];
};

Asset.GetCondiment = function (type)
{
    return Asset.Condiment + type;
};

Asset.LoadAndSetup = function (onComplete)
{
    PIXI.loader
    .add(Asset.Background)
    .add(Asset.Table)
    .add("img/sprites.png", "img/sprites.json")
    .add("img/arms.png", "img/arms.json")
    .add("img/hands.png", "img/hands.json")
    .once('complete', onComplete)
    .load();
};