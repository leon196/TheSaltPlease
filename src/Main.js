var engine = new Engine();
engine.Setup();
requestAnimFrame( animate );

function animate ()
{
	requestAnimFrame( animate );
	engine.Update();
}