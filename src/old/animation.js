

function HideMenu(onComplete)
{
	Tweener.addTween(title, {time: 1, alpha: 0});
	Tweener.addTween(button2, {time: 1, alpha: 0});
	Tweener.addTween(keys, {time: 1, alpha: 0});
	Tweener.addTween(info1, {time: 1, alpha: 0});
	Tweener.addTween(info2, {time: 1, alpha: 0});
	Tweener.addTween(bravo, { time: 1, alpha: 0});
	Tweener.addTween(click2, { time: 1, alpha: 0});
	Tweener.addTween(click1, { time: 1, alpha: 0});
	Tweener.addTween(button1, {time: 1, alpha: 0, onComplete:onComplete});
}

function ShowMenu(onComplete)
{
	Tweener.addTween(title, {time: 1, alpha: 1});
	Tweener.addTween(button2, {time: 1, alpha: 1});
	Tweener.addTween(keys, {time: 1, alpha: 1});
	Tweener.addTween(info1, {time: 1, alpha: 1});
	Tweener.addTween(info2, {time: 1, alpha: 1});
	Tweener.addTween(click2, { time: 1, alpha: 1});
	Tweener.addTween(click1, { time: 1, alpha: 1});
	Tweener.addTween(button1, {time: 1, alpha: 1, onComplete:onComplete});
}