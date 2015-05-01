var Asset = {};

Asset.Background = "img/background.jpg"
Asset.Table = "img/table.png";

Asset.HandOpen = "handOpen";
Asset.HandClose = "handCatch";
Asset.Arm = "arm";
Asset.Stuff = "plate1"

Asset.HandCount = 21;
Asset.StuffCount = 1;
Asset.HandRandomUniques = randomUniqueList(Asset.HandCount);

Asset.RandomHand = function ()
{
	var r = Asset.HandRandomUniques.pop();
	if (Asset.HandRandomUniques.length == 0)
	{
		Asset.HandRandomUniques = randomUniqueList(Asset.HandCount);
	}
	return Math.floor(Math.random() * Asset.HandCount) + 1;
};

Asset.LoadAndSetup = function (onComplete)
{
    PIXI.loader
    .add(Asset.Background)
    .add(Asset.Table)
    .add("img/sprites.png", "img/sprites.json")
    .add("img/arms.png", "img/arms.json")
    .once('complete', onComplete)
    .load();
};