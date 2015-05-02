var Direction = {};

Direction.Left = 0;
Direction.Right = 2;
Direction.Up = 1;
Direction.Down = 3;

Direction.IsHorizontal = function (direction)
{
    return direction % 2 == 0;
};

Direction.IsVertical = function (direction)
{
    return direction % 2 != 0;
};

Direction.GetRotation = function (direction)
{
	var rotation = 0;
	switch (direction)
	{
		case Direction.Left: rotation = PI; break;
		case Direction.Right: rotation = 0; break;
		case Direction.Up: rotation = PI2*3/4; break;
		case Direction.Down: rotation = PI/2; break;
		default: break;
	}
	return rotation;
};

Direction.GetRotationInverse = function (direction)
{
	var rotation = 0;
	switch (direction)
	{
		case Direction.Left: rotation = 0; break;
		case Direction.Right: rotation = PI; break;
		case Direction.Up: rotation = PI/2; break;
		case Direction.Down: rotation = PI2*3/4; break;
		default: break;
	}
	return rotation;
};

Direction.GetOutOfScreenPosition = function (direction)
{
	var position = 0;
	switch (direction)
	{
		case Direction.Left: position = Screen.size.width; break;
		case Direction.Right: position = -Screen.size.width; break;
		case Direction.Up: position = Screen.size.height; break;
		case Direction.Down: position = -Screen.size.height; break;
		default: break;
	}
	return position;
};