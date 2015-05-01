
var Engine = function()
{
    this.renderer;
    this.canvas;
    this.scene;

    this.Setup = function ()
    {
        // Pixi
        this.renderer = PIXI.autoDetectRenderer(Screen.size.width, Screen.size.height);
        this.canvas = document.getElementById("canvas");
        this.canvas.appendChild(this.renderer.view);

        // Main Scene
        this.scene = new Scene();

        // Resize Event
        var self = this;
        window.addEventListener("resize", function ()
        {
            Screen.size.width = window.innerWidth;
            Screen.size.height = window.innerHeight;
            self.scene.Resize();
            self.renderer.resize(Screen.size.width, Screen.size.height);
        });

        // Load Asset
        var self = this;
        Asset.LoadAndSetup(function()
        {
            self.scene.Setup();
        });
    };

    this.Update = function ()
    {
        this.scene.Update();

        this.renderer.render( this.scene );
    };
};