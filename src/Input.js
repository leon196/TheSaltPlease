
var Input = {};

Input.mouseTable = vec2(0,0);

// State
Input.mousePressed = false;

// Triggered once
Input.mouseClic = false;

// Input Events

Input.MouseMove = function(mouseData)
{
    Input.mouseTable = mouseData.data.getLocalPosition(Engine.scene);
};

Input.MouseDown = function(mouseData)
{
    Input.mouseTable = mouseData.data.getLocalPosition(Engine.scene);
    Input.mousePressed = true;
    Input.mouseClic = true;
};

Input.Tap = function(mouseData)
{
    Input.mouseTable = mouseData.data.getLocalPosition(Engine.scene);
    if (Input.mousePressed)
    {
        Input.mousePressed = false;
    }
    else
    {
        Input.mousePressed = true;
    }
    Input.mouseClic = true;
};

Input.MouseUp = function(mouseData)
{
    Input.mouseTable = mouseData.data.getLocalPosition(Engine.scene);
    Input.mousePressed = false;
};

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
