var onButton1 = false;
var onButton2 = false;

function onMouseMove(e)
{
	mouse.x = e.pageX;
	mouse.y = e.pageY;

    mouseRatio.x = Math.max(0, Math.min(1, (mouse.x - area.x)/area.w));
    mouseRatio.y = Math.max(0, Math.min(1, (mouse.y - area.y)/area.w));

    if (!playing && onMenu) {

        if (PointCollisionTest(mouse.x, mouse.y, button1.getBounds())) {
            button1.scale.x = 1.1;
            button1.scale.y = 0.9;
            onButton1 = true;
        } else {
            onButton1 = false;
        }
        if (PointCollisionTest(mouse.x, mouse.y, button2.getBounds())) {
            button2.scale.x = 0.9;
            button2.scale.y = 1.1;
            onButton2 = true;
        } else if (onButton2) {
            onButton2 = false;
        }
    }
}

function onMouseDown(e)
{
    mouseDown = true;

    if (playing) {
        for (var c = 0; c < characters.length; c++)
        {
        	var character = characters[c];
            if (character.usingCondiment == false) {
        	   character.Catch();
            }
        }
    }
}

function onMouseUp(e)
{
    mouseDown = false;
    if (playing) {
        for (var c = 0; c < characters.length; c++)
        {
            var character = characters[c];
            if (character.usingCondiment == false) {
                character.Release();
            }
        }
    } else if (onMenu) {
        if (onButton1) {
            ClicButton1();
        } else if (onButton2) {
            ClicButton2();
        }
    }
}

function onKeyDown(e)
{
    if (playing) {
    }
}

function onKeyUp(e)
{
    if (playing) {
        console.log(e.keyCode);
        switch(e.keyCode) {
            // R
            case 82 :
                if (modeRandom) {
                    ResetRandomLevel();
                } else {
                    ResetCurrentLevel();
                }
            break;
            /*
            // N
            case 78 :
                if (modeRandom) {
                    NextRandomGame();
                } else {
                    NextGame();
            }
            break;
            */
            // M
            case 77 :
                ResetGame();
            break;
        }
    }

}