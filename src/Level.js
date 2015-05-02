var Level = {};

Level.list =
[
	// 1
	{ grid : size(4, 4)
	, hands : [
		{ position: 1, direction: Direction.Left, start: 1, end: 4 }
		, { position: 2, direction: Direction.Up, start: 1, end: 4 }
		, { position: 4, direction: Direction.Down, start: 2, end: 4 }
		, { position: 4, direction: Direction.Right, start: 1, end: 4 }
	] }
	// 2
	, { grid : size(8, 8)
	, hands : [
		{ position: 5, direction: Direction.Right, start: 2, end: 6 }
		, { position: 3, direction: Direction.Down, start: 4, end: 8 }
		, { position: 2, direction: Direction.Down, start: 1, end: 8 }
		, { position: 1, direction: Direction.Down, start: 7, end: 8 }
	] }
];

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
			position.y = handInfo.position * gridCellSize.height * 2 - Screen.tableSize - gridCellSize.height;
			start = (handInfo.start - grid.width / 2) / (grid.width / 2) - 1 / grid.width;
			end = (handInfo.end - grid.width / 2) / (grid.width / 2) - 1 / grid.width;
		}
		else
		{
			position.x = handInfo.position * gridCellSize.width * 2 - Screen.tableSize - gridCellSize.width;
			start = (handInfo.start - grid.height / 2) / (grid.height / 2) - 1 / grid.height;
			end = (handInfo.end - grid.height / 2) / (grid.height / 2) - 1 / grid.height;
		}
        hands.push(new Hand( handInfo.direction, position, start, end ));
    }
    return hands;
};

Level.GetStuffListForLevel = function (levelNumber)
{
	var stuffs = [];
    var level = Level.list[levelNumber];
    var grid = level.grid;
    var gridDimension = grid.width * grid.height;
    var gridCellSize = size(Screen.tableSize / grid.width, Screen.tableSize / grid.height);
	var count = gridDimension;//1 + random(gridDimension);
	var randoms = randomUniqueList(gridDimension);
	for (var s = 0; s < count; ++s)
	{
		var p = randoms[s];
		var x = (p % grid.width) / grid.width * Screen.tableSize * 2 - Screen.tableSize + gridCellSize.width;
		var y = Math.floor(p / grid.width) / grid.height * Screen.tableSize * 2 - Screen.tableSize + gridCellSize.height;
		var stuff = new Stuff(vec2(x,y));
		stuffs.push(stuff);
	}
	return stuffs;
};