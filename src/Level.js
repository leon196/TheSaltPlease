var Level = {};

Level.list =
[
	// 1
	{ grid : size(4, 4)
	, hands : [
		{ position: 1, direction: Direction.Left, start: -1, end: 1 }
		, { position: 2, direction: Direction.Up, start: -1, end: 1 }
		, { position: 4, direction: Direction.Down, start: -0.5, end: 0.5 }
		, { position: 4, direction: Direction.Right, start: -0.75, end: 0.25 }
	] }
	// 2
	, { grid : size(8, 8)
	, hands : [
		{ position: 5, direction: Direction.Right, start: -1, end: 1 }
		, { position: 3, direction: Direction.Down, start: -1, end: 1 }
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
    	if ( Direction.IsHorizontal(handInfo.direction) )
    	{
			position.y = handInfo.position * gridCellSize.height * 2 - Screen.tableSize - gridCellSize.height;
		}
		else
		{
			position.x = handInfo.position * gridCellSize.width * 2 - Screen.tableSize - gridCellSize.width;
		}
        hands.push(new Hand( handInfo.direction, position, handInfo.start, handInfo.end ));
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