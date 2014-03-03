---
layout: post
title:  "BuildingBlocks: Transitions"
date:   2014-02-12 12:00:00
permalink: /blog/10/
---

On the [previous post](/blog/9/), we finished implementing a drawer but we didn't have true navigation functionality. The drawer simply changed the button that the user was able to click. In this post, we will use [Transitions](http://buildingfirefoxos.com/transitions/in-app-navigation.html).

## The Structure

We will separate our app into three parts. Let's start with the `Notification` section

{% highlight html %}
<section id="notification" role="region" data-position="right">
    <header class="fixed">
	<a id="btn-notification-back" href="#">
		<span class="icon icon-back">back</span>
	</a>
	<h1>Notification</h1>
	</header>
	<div role="main">
		<button id="btn-notify"> Notify Me!</button>
	</div>
</section>
{% endhighlight %}

Notice that the header contains a back button with the `a#btn-notification-back`. The content of the page is under `div role="main"`.

The `Alarm` section will be very similar

{% highlight html %}
<section id="alarm" role="region" data-position="right">
    <header class="fixed">
	<a id="btn-alarm-back" href="#">
	  <span class="icon icon-back">back</span>
	</a>
	<h1>Alarm</h1>
	</header>
	<div role="main">
		<button id="btn-notify-wait"> Notify Me! (Wait 5s)</button>
	</div>
</section>
{% endhighlight %}

It has the same structure as `section#notification`.

The main content section will be similar as to what we had before but it's going to be wrapped in `section#index`. The reason why will be explained in the next section.

{% highlight html %}
<section id="index" data-position="current">
	
	<section data-type="sidebar">
		<header>
			<menu type="toolbar"> <a id="nav-message" href="#">Done</a> </menu>
			<h1>Demos</h1>
		</header>
		<nav>
			<ul>
				<li><a id="nav-notify" href="#">Notification</a></li>
				<li><a id="nav-alarm" href="#">Alarm</a></li>
	        </ul>
		</nav>
	</section>

	<section id="drawer" role="region" >
		<header>
			<a href="#content"><span class="icon icon-menu">hide sidebar</span></a>
			<a href="#drawer"><span class="icon icon-menu">show sidebar</span></a>
			<h1>API Showcase</h1>
		</header>
		<div role="main">
			<h1 id="message"> Welcome to API Showcase.
			Open the drawer to see all the demos</h1>
		</div>
	</section>
</section>
{% endhighlight %}

## The Layout

The layout of the page is as follows. Every section that has the property `data-position="right"` will be placed off screen to the right. We accomplish this with the following CSS

{% highlight css %}
[data-position="right"] {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transform: translateX(100%);
    -webkit-transform: translateX(100%);
    z-index: 15;
    z-index: 100; /* -> drawer */
}
{% endhighlight %}

The sections with `data-position="current"` will be place in the center of the page, where the user can interact with them (hence the value `current`). To navigate from one section to the next, we simply shift the `current` section and the next section to the left. This is the reason why we had to wrap the sidebar section and `section#drawer` in the `section#index`, the whole middle section has to move or else they end up on top of each other. 

Building blocks provides the following transitions to help us make this navigation possible

* `currentToLeft` : moves the current section off to the left
* `currentToRight` : same as above but to the right
* `rightToCurrent` : moves the off-screen section towards the center
* `leftToCurrent` : same as above but from the left 

We can use `currentToLeft` and `rightToCurrent` to navigate from the main section to another. Then, we can use `leftToCurrent` and `currentToRight` to bring things back to how they originally were.

## The Classes

We can easily use these transitions by changing an elements class, and making CSS rules based on these classes. The classes can be `left`, `current`, and `right`. Intuitively, they move a section to the left, to the right, or back to the middle.

## The Javascript

Therefore, when we click a navigation link in our drawer, we will set the class of the current element to `left` and the off-screen section to `current`

{% highlight javascript %}
document.querySelector('#nav-notify').addEventListener ('click', function () {
	document.querySelector('#notification').className = 'current';
	document.querySelector('[data-position="current"]').className = 'left';
});

document.querySelector('#nav-alarm').addEventListener ('click', function () {
	document.querySelector('#alarm').className = 'current';
	document.querySelector('[data-position="current"]').className = 'left';
});
{% endhighlight %}

To each section has a `btn-*-back` button, so we can reverse the actions above with the following

{% highlight javascript %}
document.querySelector('#btn-notification-back').addEventListener ('click', function () {
	document.querySelector('#notification').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
});

document.querySelector('#btn-alarm-back').addEventListener ('click', function () {
	document.querySelector('#alarm').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
});
{% endhighlight %}

## The CSS

Finally, the following CSS will tie up the animations to the classes

{% highlight css %}
[data-position="right"].current {
    animation: rightToCurrent 0.4s forwards;
    -webkit-animation: rightToCurrent 0.4s forwards;
}
[data-position="right"].right {
    animation: currentToRight 0.4s forwards;
    -webkit-animation: currentToRight 0.4s forwards;
}
[data-position="current"].left {
    animation: currentToLeft 0.4s forwards;
    -webkit-animation: currentToLeft 0.4s forwards;
}
[data-position="current"].current {
    animation: leftToCurrent 0.4s forwards;
    -webkit-animation: leftToCurrent 0.4s forwards;
}
{% endhighlight %}

## Presto

As always, feel free to [try the demo](/demos/08/) and examine the [source code](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/08).
