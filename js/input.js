var onButton1 = false;
var onButton2 = false;

function onMouseMove(e)
{
	mouse.x = e.pageX - renderer.view.getBoundingClientRect().left;
	mouse.y = e.pageY - renderer.view.getBoundingClientRect().top;

	mouse.x = Math.max(0, Math.min(mouse.x, defaultSize * globalScale));
	mouse.y = Math.max(0, Math.min(mouse.y, defaultSize * globalScale));

	mouseRatio.x = mouse.x / windowWidth;
	mouseRatio.y = mouse.y / windowHeight;

    if (!playing && onMenu) {
        if (PointCollisionTest(mouse.x, mouse.y, button1.getBounds())) {
            button1.scale.x = globalScale * 0.7;
            button1.scale.y = globalScale * 0.55;
            onButton1 = true;
        } else if (button1.scale.x > globalScale * 0.6) {
            button1.scale.x = globalScale * 0.6;
            button1.scale.y = globalScale * 0.6;
            onButton1 = false;
        }
        if (PointCollisionTest(mouse.x, mouse.y, button2.getBounds())) {
            button2.scale.x = globalScale * 0.55;
            button2.scale.y = globalScale * 0.7;
            onButton2 = true;
        } else if (button2.scale.y > globalScale * 0.6) {
            button2.scale.x = globalScale * 0.6;
            button2.scale.y = globalScale * 0.6;
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