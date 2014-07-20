

$(document).ready(function(){

	// Make an instance of two and place it on the page.
	var type = /(canvas|webgl)/.test(url.type) ? url.type : 'svg';
	var two = new Two({
            type: Two.Types[type],
            fullscreen: true,
            autostart: true
          }).appendTo(document.body);

	// two has convenience methods to create shapes.
	var circle = two.makeCircle(2, 10, 50);
	//var rect = two.makeRectangle(213, 100, 100, 100);
	var rect = two.makeRectangle(0, 0, 10000, 10000);

	// The object returned has many stylable properties:
	circle.fill = '#FF8000';
	circle.stroke = 'orangered'; // Accepts all valid css color
	circle.linewidth = 5;

	rect.fill = 'rgb(0, 200, 255)';
	rect.opacity = 0.75;
	rect.noStroke();

	// Don't forget to tell two to render everything
	// to the screen
	//two.update();

	// Bind a function to scale and rotate the group
	// to the animation loop.
	two.bind('update', function(frameCount) {
	  // This code is called everytime two.update() is called.
	  // Effectively 60 times per second.
	  if (circle.scale > 0.9999) {
	    circle.scale = circle.rotation = 0;
	  }
	  var t = (1 - circle.scale) * 0.125;
	  circle.scale += t;
	  circle.rotation += t * 4 * Math.PI;
	}).play();  // Finally, start the animation loop
});

function MovieClip()
{
	this.x = 0;
	this.y = 0;
	this.xStart = 0;
	this.yStart = 0;
	
	this.SetPosition = function(xx, yy) {

	}
}