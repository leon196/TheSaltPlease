var buttons = new Array();

// Contexte de dessin
var screenContext;
var screenWidth;
var screenHeight;
var texturesTotal = 0;
var texturesLoaded = 0;

// Inputs
var keyUp = false;
var keyDown = false;

// Lance le jeu au document.ready
$(document).ready(function(){

	// Compute les paramètres de dessin
	// On attend un <canvas id="game">
	ctx = document.getElementById('game').getContext('2d');
	screenWidth = parseInt($("#game").attr("width"));
	screenHeight = parseInt($("#game").attr("height"));
	
	// Init les listeners click et move
	$("#game").on('click', onClick);
	$("#game").on('mousemove', onMove);
	
	// Keyboard Event
	window.addEventListener('keydown', onKeyDown, true);
	window.addEventListener('keyup', onKeyUp, true);
	
	// Appelle la fonction "init" de la classe principale
	init();
});

// Charge une image et l'associe éventuellement à un GameObject
// img = resource Image (créee avec new Image())
// src = chemin vers l'image
// gameObj = resource gameObject à associer
// getSize = met la taille du gameObj à la même taille que l'image une fois loadée
function loadImage(img, src, gameObj, getSize)
{
	imagesTotal++;
	
	img.src = src;
	img.onload = imageLoaded;
	img.onerror = function(){alert ("Impossible de trouver le fichier "+src); };
	
	if (getSize === true) img.ob = gameObj;
	
	if (typeof gameObj !== 'undefined') gameObj.image = img;
	
}
function imageLoaded()
{
	imagesLoaded++;
	
	if (typeof this.ob !== 'undefined')
	{
		this.ob.width = this.ob.widthInitial = this.width;
		this.ob.height = this.ob.heightInitial= this.height;
	}
	
	if (imagesLoaded == imagesTotal)
	{
		// On vire le loader (div avec id="preload")
		$("#preload").hide();
		
		// Function à écrire dans la classe principale, appelée lorsque toutes les images sont chargées.
		ImagesReady();
	}
}

// Listener de click
function onClick(e)
{
	var mouseX = e.pageX - $("#game").position().left;
	var mouseY = e.pageY - $("#game").position().top;
	
	// On vérifie si on à cliqué sur un bouton
	for (var i =0; i<buttons.length; i++)
	{
		if (buttons[i].visible && hitTestPoint(mouseX, mouseY, buttons[i]))
		{
			buttons[i].callback(buttons[i]);
			break;
		}
	}
}

// Listener de souris
function onMove(e)
{
	var mouseX = e.pageX - $("#game").position().left;
	var mouseY = e.pageY - $("#game").position().top;
	var hover = false;
	
	// On vérifie si on à cliqué sur un bouton
	for (var i =0; i<buttons.length; i++)
	{
		if (buttons[i].visible && hitTestPoint(mouseX, mouseY, buttons[i]))
		{
			hover = true;
			buttons[i].isHover = true;
		}
		else
		{
			buttons[i].isHover = false;
		}
	}
	
	// Mouse Pointer Hover Button
	if (hover) $("#game").css({ 'cursor' : 'hand', 'cursor' : 'pointer'});
	
	// Mouse Auto In Menu
	else $("#game").css('cursor', 'auto');
}

function onKeyDown(e)
{
	switch (e.keyCode)
	{
		// Up
		case 38 : keyUp = true; break;
		// Down
		case 40 : keyDown = true; break;
		// Default
		default : break;
	}
}

function onKeyUp(e)
{
	switch (e.keyCode)
	{
		// Up
		case 38 : keyUp = false; break;
		// Down
		case 40 : keyDown = false; break;
		// Default
		default : break;
	}
}
