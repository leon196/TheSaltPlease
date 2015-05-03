var Level = {};

Level.list =
[
	// 1
	{ grid : size(4, 4)
	, hands : [
		{ offset: 1, direction: Direction.Left, start: 1, end: 4 }
		, { offset: 2, direction: Direction.Up, start: 1, end: 4 }
		, { offset: 4, direction: Direction.Down, start: 2, end: 4 }
		, { offset: 4, direction: Direction.Right, start: 1, end: 4 }
	]
	, condiments : [
		{ position: vec2(2,3), type: Condiment.Red }
		, { position: vec2(1,2), type: Condiment.Green }
	]
	, wants : [
		{ handIndex: 0, condiment: Condiment.Red, delay: 10.0 }
	] }
	// 2
	, { grid : size(8, 8)
	, hands : [
		{ offset: 5, direction: Direction.Right, start: 2, end: 6 }
		, { offset: 3, direction: Direction.Down, start: 4, end: 8 }
		, { offset: 2, direction: Direction.Down, start: 1, end: 8 }
		, { offset: 1, direction: Direction.Down, start: 7, end: 8 }
	] }
];

Level.GetWantListForLevel = function (levelNumber)
{
    var level = Level.list[levelNumber];
	return level.wants;
};

Level.GetHandListForLevel = function (levelNumber)
{
	var hands = [];
    var level = Level.list[levelNumber];
    var grid = level.grid;
    var gridDimension = grid.width * grid.height;
    var gridCellSize = size(Screen.tableSize / grid.width, Screen.tableSize / grid.height);
    for (var h = level.hands.length - 1; h >= 0; --h)
    {
        var handInfo = level.hands[h];
        var position = vec2(0,0);
		var start = 0;
		var end = 0;
    	if ( Direction.IsHorizontal(handInfo.direction) )
    	{
			position.y = handInfo.offset * gridCellSize.height * 2 - Screen.tableSize - gridCellSize.height;
			start = (handInfo.start - grid.width / 2) / (grid.width / 2) - 1 / grid.width;
			end = (handInfo.end - grid.width / 2) / (grid.width / 2) - 1 / grid.width;
		}
		else
		{
			position.x = handInfo.offset * gridCellSize.width * 2 - Screen.tableSize - gridCellSize.width;
			start = (handInfo.start - grid.height / 2) / (grid.height / 2) - 1 / grid.height;
			end = (handInfo.end - grid.height / 2) / (grid.height / 2) - 1 / grid.height;
		}
        hands.push(new Hand( handInfo.direction, position, start, end ));
    }
    return hands;
};

Level.GetCondimentListForLevel = function (levelNumber)
{
	var condiments = [];
    var level = Level.list[levelNumber];
    var grid = level.grid;
    var gridDimension = grid.width * grid.height;
    var gridCellSize = size(Screen.tableSize / grid.width, Screen.tableSize / grid.height);
	var count = level.condiments.length;
	for (var s = 0; s < count; ++s)
	{
		var condimentInfo = level.condiments[s];
		var position = vec2(0,0);
		position.x = condimentInfo.position.x * gridCellSize.width * 2 - Screen.tableSize - gridCellSize.width;
		position.y = condimentInfo.position.y * gridCellSize.height * 2 - Screen.tableSize - gridCellSize.height;
		var condiment = new Stuff(PIXI.Texture.fromFrame(Asset.GetCondiment(condimentInfo.type)), position);
		condiments.push(condiment);
	}
	return condiments;
};

Level.GetStuffListForLevel = function (levelNumber)
{
	var stuffs = [];
    var level = Level.list[levelNumber];
    var grid = level.grid;
    var gridDimension = grid.width * grid.height;
    var gridCellSize = size(Screen.tableSize / grid.width, Screen.tableSize / grid.height);
	var randoms = randomUniqueList(gridDimension);
	for (var c = 0; c < level.condiments.length; ++c)
	{
		var condiment = level.condiments[c];
		var index = condiment.position.x - 1 + (condiment.position.y - 1) * grid.width;
		randoms.splice(randoms.indexOf(index), 1);
	}
	var count = randoms.length;//1 + random(gridDimension);
	for (var s = 0; s < count; ++s)
	{
		var p = randoms[s];
		var x = (p % grid.width) / grid.width * Screen.tableSize * 2 - Screen.tableSize + gridCellSize.width;
		var y = Math.floor(p / grid.width) / grid.height * Screen.tableSize * 2 - Screen.tableSize + gridCellSize.height;
		var stuff = new Stuff(PIXI.Texture.fromFrame(Asset.Stuff), vec2(x,y));
		stuffs.push(stuff);
	}
	return stuffs;
};