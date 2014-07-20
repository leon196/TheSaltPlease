// Définition de base de la classe MovieClip
function MovieClip()
{
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.image = null;	
	
	this.visible = true;
	this.collided = false;
	
	this.rectInitial = { x:0, y:0, w:0, h:0 };
	
	// Offset (pour recaler l'image en cas de spritesheet trop differentes)
	this.offset = { x:0, y:0 };
	
	// Pivot du movieclip (position relative)
	// Agit sur la position et la rotation
	this.pivot = { x:0, y:0 }; 
	// Rotation du movieclip en Radian
	this.rotation = 0;
	
	this.SetPosition = function(xx, yy) {
		this.x = xx - this.pivot.x; this.y = yy - this.pivot.y;
		this.rectInitial.x = this.x; this.rectInitial.y = this.y;
	}
	this.SetRect = function(xx,yy,w,h) {
		this.x = xx - this.pivot.x; this.y = yy - this.pivot.y;
		this.width = w; this.height = h;
		this.rectInitial.x = this.x; this.rectInitial.y = this.y;
		this.rectInitial.w = w; this.rectInitial.h = h;
	}
	this.SetPivot = function(xx, yy) { this.pivot.x = xx; this.pivot.y = yy; }
	
	// Le nombre de colonne et de ligne du sprite sheet
	this.spriteSheetGrid = 1;
	
	// Fonctionnement par frame similaire à flash (sauf qu'on commence à 0 au lieu de 1)
	// On attend un png/jpg avec toutes les frames collées à la suite
	// On affiche ensuite seulement un rectangle de [frame*width -> width];
	this.frame = 0;
	this.totalFrames = 0;
	this.nextFrame = function() { this.frame = (this.frame + 1) % this.totalFrames; }
	this.prevFrame = function() { this.frame = (this.frame > 0 ? this.frame - 1:this.totalFrames - 1); }
	
	// Essaye de calculer ses frames totales, en fonction du width qu'on lui a donné
	// Ne pas appeler pendant la phase de chargement
	this.computeTotalFrames = function() { this.totalFrames = Math.floor(this.image.width/this.width); }
	
	// Renvoie un rectangle legerement moins grand que la dimension de l'image
	// Pour avoir une indulgence sur les collisions avec les obstacles
	this.getBoundsRect = function() {
		var bounds = { x:0, y:0, w:0, h:0 };
		// Si les dimensions sont trop faible -> offset = 0
		var offset = (this.width + this.height) * (this.height <= 33 || this.width <= 33 ? 0 : 0.025 );
		bounds.x = this.x + offset;
		bounds.y = this.y + offset;
		bounds.w = this.width - offset * 2;
		bounds.h = this.height - offset * 2;
		return bounds;
	}
	
	// AddClickCallback - Permet d'agir comme un bouton
	this.hoverImage = null;
	this.showHand = true;
	this.callback = null;
	this.isHover = false;
	
	// Ajoute un callback de click
	// cb = callback
	// hand = le curseur change en main au hover
	this.addClickCallback = function(cb, hand) {
		this.callback = cb;
		this.showHand = typeof hand !== 'undefined' ? hand:true;
		// Ajoute au tableau global de clickables
		buttons.push(this);
	}
	this.removeClickCallback = function() {
		this.callback = null;
		// Enlève du tableau global de clickables
		for (var i=0; i<buttons.length; i++)
			if (buttons[i] == this)
				buttons.splice(i, 1);
	}
	
	// Animation
	this.animating = false;
	this.aFirstFrame = 0;
	this.aLastFrame = 0;
	this.aLooping = false;
	this.frameSkip = 0;
	this.frameSkipped = 0;
	this.aCb = null;
	
	// Lancer l'animation du gameobject : 
	// loop : En boucle ou non, par défaut true
	// start : Première frame, par défaut 0
	// end : Dernière frame, par défaut totalFrames
	// cb : Callback à appeler à la fin de l'anim (sauf en cas de boucle)
	this.animate = function(loop, start, end, cb) {
		this.aLooping = (typeof loop !== 'undefined' ? loop:true);
		this.aFirstFrame = (typeof start !== 'undefined' ? start:0);
		this.aLastFrame = (typeof end !== 'undefined' ? end:(this.totalFrames-1));
		this.aCb = (typeof cb !== 'undefined' ? cb:null);
		this.animating = true;
		this.frame = this.aFirstFrame;
	}
	
	// Alpha
	this.alpha = 1;
	this.alphaStep = 0;
	
	// fadeIn - fait apparaître l'objet (fadeOut, disparaître)
	// frame = nb de frames, par défaut 60 (une seconde)
	// r = reset l'alpha à 1 (ou 0) en début de fonction, true par défaut
	this.fadeIn = function(f, r) {
		var frames = typeof frames !== 'undefined' ? f:60;
		if (typeof r === 'undefined' || r === true) this.alpha = 0;
		this.alphaStep = 1 / frames;
	}
	this.fadeOut = function (f, r) {
		var frames = typeof frames !== 'undefined' ? f:60;
		if (typeof r === 'undefined' || r === true) this.alpha = 1;
		this.alphaStep = -1 / frames;
	}
	
	// Scale
	this.scaleX = 1;
	this.scaleY = 1;
	
	// HitTest - reprend la fonctionalité AS
	this.hitTestPoint = function(x, y) { return hitTestPoint(x, y, this); }
	
	this.hitTestObject = function(o) {
		// Les deux objets hittest ssi : 
		// Un des quatres coins de this est compris dans o
		// OU
		// Un des quatres coins de o est compris dans this
		// Cette logique fonctionne puisque les movieclip sont tous rectangles
		var xx = this.x-this.pivot.x;
		var yy = this.y-this.pivot.y;
		var ox = o.x-o.pivot.x;
		var oy = o.y-o.pivot.y;
		if (!hitTestPoint(xx, yy, o))
			if (!hitTestPoint(xx + this.width, yy, o))
				if (!hitTestPoint(xx, yy + this.height, o))
					if (!hitTestPoint(xx + this.width, yy + this.height, o))
						if (!hitTestPoint(ox, oy, this))
							if (!hitTestPoint(ox + o.width, oy, this))
								if (!hitTestPoint(ox, oy + o.height, this))
									if (!hitTestPoint(ox + o.width, oy + o.height, this))
										return false;
		
		return true;
	}
	
	// Test de collision selon les bounds
	this.hitTestBounds = function(bounds) {
		for (var i = 0; i < bounds.length; i++) 
			if (hitTestPointBounds(bounds[i][0], bounds[i][1], this)) 
				return true;
			
		return false;
	}
	
	// Dessin - prend en compte l'animation, le hover, alpha, ... (todo rotation etc..)
	this.draw = function()
	{
		
		ctx.save();
		ctx.scale(this.scaleX, this.scaleY);
		ctx.globalAlpha = this.alpha;
		
		// Setup Rotation
		if (this.rotation != 0) {
			ctx.translate(this.x + this.pivot.x, this.y + this.pivot.y);
			ctx.rotate(this.rotation);
		}
		
		// Hover Image (Button)
		if (this.isHover && this.hoverImage != null) {
			ctx.drawImage(this.hoverImage, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
			
		// Normal Image
		} else {
		
			// Sprite Sheet detected
			if (this.spriteSheetGrid > 1) {
				
				var sx = (this.frame % this.spriteSheetGrid) * this.width;
				var sy = Math.floor(this.frame / this.spriteSheetGrid) * this.height;
				
				if (this.rotation != 0) {
					// Draw Rotated Animated Image
					ctx.drawImage(this.image, sx, sy, this.width, this.height, -this.pivot.x, -this.pivot.y, this.width, this.height);
				} else {
					// Draw Animated Image
					ctx.drawImage(this.image, sx, sy, this.width, this.height, (this.x + this.offset.x) * (1/this.scaleX), (this.y + this.offset.y) * (1/this.scaleY), this.width, this.height);
				}
				
			// No Animation
			} else {
				if (this.rotation != 0) {
					// Draw Rotated Image
					ctx.drawImage(this.image, -this.pivot.x, -this.pivot.y, this.width, this.height);
				} else {
					// Draw Image
					ctx.drawImage(this.image, (this.x + this.offset.x) * (1/this.scaleX) - this.pivot.x, (this.y + this.offset.y) * (1/this.scaleY) - this.pivot.y, this.width, this.height);
				}
			}
		}
		
		// End Setup Rotation
		if (this.rotation != 0) {
			ctx.rotate(this.rotation * ( -1 ) );
			ctx.translate(-this.x - this.pivot.x, -this.y - this.pivot.y);
		}
		
		ctx.restore();
		
		// Animation Handler
		if (this.animating) {
		
			if (this.frameSkip > 0) {
				this.frameSkipped++;
				if (this.frameSkipped >= this.frameSkip) {
					this.frame++;
					this.frameSkipped = 0;
				}
			} else {
				this.frame++;
			}
			
			// Arrivé à la fin de l'anim 
			if (this.frame > this.aLastFrame) {
			
				// On boucle
				if (this.aLooping) {
					this.frame = this.aFirstFrame;
					
				// Fin d'animation
				} else {
				
					// On vérifie quand même qu'on à pas dépassé totalFrames
					if (this.frame >= this.totalFrames) 
						this.frame = (this.totalFrames -1);
					
					this.animating = false;
					
					// On vérifie si un callback doit être lancé
					if (this.aCb != null)
						this.aCb(this);
				}
			}
		}
	}
}