
var Engine = {};

Engine.renderer;
Engine.canvas;
Engine.scene;
Engine.isRestarting = false;

Engine.Setup = function ()
{
    // Pixi
    Engine.renderer = PIXI.autoDetectRenderer(Screen.size.width, Screen.size.height);

    // Main Scene
    Engine.scene = new Scene();

    // Resize Event
    window.addEventListener("resize", function ()
    {
        Screen.size.width = window.innerWidth;
        Screen.size.height = window.innerHeight;
        Engine.scene.Resize();
        Engine.renderer.resize(Screen.size.width, Screen.size.height);
    });

    // Load Asset
    Asset.LoadAndSetup(function()
    {
        Engine.scene.Setup();
        Engine.scene.Show();

        Engine.canvas = document.getElementById("canvas");
        Engine.canvas.appendChild(Engine.renderer.view);
    });
};

Engine.Update = function ()
{
    if (Input.keyR && !Engine.isRestarting && !Engine.scene.isAppearing && !Engine.scene.isDisappearing)
    {
        Engine.isRestarting = true;

        Time.disappearingStarted = Time.GetElapsed();
        Engine.scene.isDisappearing = true;
    }

    if (Engine.isRestarting)
    {
        var ratioDisappearing = animationRatio(Time.disappearingStarted, Time.disappearingDelay, Time.GetElapsed());
        if (ratioDisappearing >= 1.0)
        {
            Engine.isRestarting = false;
            //Engine.scene.currentLevel++;
            Engine.scene.Restart();
            Engine.scene.LoadLevel();
            Engine.scene.Show();
            Engine.scene.isDisappearing = false;
        }
    }

    Engine.scene.Update();

    Engine.renderer.render( Engine.scene );
};

