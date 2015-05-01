
var Engine = function()
{
    this.renderer;
    this.canvas;
    this.scene;

    this.Setup = function ()
    {
        // Pixi
        this.renderer = PIXI.autoDetectRenderer(Screen.size.width, Screen.size.height);

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
            self.canvas = document.getElementById("canvas");
            self.canvas.appendChild(self.renderer.view);
        });
    };

    this.Update = function ()
    {
        this.scene.Update();

        this.renderer.render( this.scene );
    };
};