var Time = {};

Time.scale = 1000.0;
Time.started = new Date();

Time.restartStarted = 0.0;
Time.restartDelay = 1.0;

Time.appearingStarted = 0.0;
Time.appearingDelay = 2.0;

Time.disappearingStarted = 0.0;
Time.disappearingDelay = 1.0;

Time.wantingStarted = 0.0;
Time.wantingDelay = 10.0;

Time.GetElapsed = function ()
{
	return (new Date() - Time.started) / Time.scale;
}