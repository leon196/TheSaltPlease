
var Input = {};

Input.mouseTable = vec2(0,0);

// State
Input.mousePressed = false;

// Triggered once
Input.mouseClic = false;

// Keys
Input.keyR = false;

Input.KeyDown = function (event)
{
	switch (event.keyCode)
	{
		case 82: Input.keyR = true; break;
	}
}

Input.KeyUp = function (event)
{
	switch (event.keyCode)
	{
		case 82: Input.keyR = false; break;
	}
}

// Keyboard Event
window.addEventListener("keydown", Input.KeyDown, false);
window.addEventListener("keyup", Input.KeyUp, false);
