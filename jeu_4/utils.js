

// Vérifie si un objet contient un point
function hitTestPoint(x, y, o)
{
	var ox = o.x - o.pivot.x;
	var oy = o.y - o.pivot.y;
	if (x >= ox)
		if (x <= (ox + o.width))
			if (y >= oy)
				if (y <= (oy + o.height))
					return true;
	return false;
}

function hitTestPointBounds(x, y, bounds)
{
	if (x >= bounds.x)
		if (x <= (bounds.x + bounds.w))
			if (y >= bounds.y)
				if (y <= (bounds.y + bounds.h))
					return true;
	return false;
}

function hitTestBounds(bounds1, bounds2)
{
	if (!hitTestPointBounds(bounds1.x, bounds1.y, bounds2))
		if (!hitTestPointBounds(bounds1.x + bounds1.w, bounds1.y, bounds2))
			if (!hitTestPointBounds(bounds1.x, bounds1.y + bounds1.h, bounds2))
				if (!hitTestPointBounds(bounds1.x + bounds1.w, bounds1.y + bounds1.h, bounds2))
					if (!hitTestPointBounds(bounds2.x, bounds2.y, bounds1))
						if (!hitTestPointBounds(bounds2.x + bounds2.w, bounds2.y, bounds1))
							if (!hitTestPointBounds(bounds2.x, bounds2.y + bounds2.h, bounds1))
								if (!hitTestPointBounds(bounds2.x + bounds2.w, bounds2.y + bounds2.h, bounds1))
									return false;
	
	return true;
}

function Normalize(xx, yy)
{
	var d = Distance(xx, yy);
	return { x : xx / d, y : yy / d };
}

function Distance(x, y)
{
	return Math.sqrt(x*x+y*y);
}