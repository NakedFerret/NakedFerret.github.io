---
layout: post
title:  "BuildingBlocks: Drawer"
date:   2014-02-11 12:00:00
permalink: /blog/9/
---

Building on our [previous work](/blog/8/), we're going to separate the notification demos, from the alarm demos using the [Drawer](http://buildingfirefoxos.com/building-blocks/drawer.html). Download BuildingBlocks [here](https://github.com/buildingfirefoxos/Building-Blocks/archive/gh-pages.zip).

## First Attempt

According to the documentation, all we need to implement the drawer is to import

* `headers.css`
* the `style/headers` folder
* `drawer.css`
* the `style/drawer.css` folder

Then we can specify the navigation in the sidebar with the following HTML

{% highlight html %}
<section data-type="sidebar">
  <header>
    <menu type="toolbar">
      <a href="#">Done</a>
    </menu>
    <h1>Demos</h1>
  </header>
  <nav>
    <ul>
      <li><a href="#">Notification</a></li>
      <li><a href="#">Alarm</a></li>
    </ul>
    <h2>Misc Demos</h2>
    <ul>
      <li><a href="#">Text Clock</a></li>
      <li><a href="#">Image Clock</a></li>
    </ul>
  </nav>
</section>
{% endhighlight %}

This is broken down into 2 parts:

* `header` : the section which provides the header to the drawer navigation. This one just contains a toolbar with a `Done` button and a `h1` header
* `nav` : the section which contains the navigation links. It's just two unordered lists separated by a `h2` header

We can specify the content of the webpage in the following format

{% highlight html %}
<section id="drawer" role="region">
  <header>
	<a href="#content"><span class="icon icon-menu">hide sidebar</span></a>
	<a href="#drawer"><span class="icon icon-menu">show sidebar</span></a>
	<h1>Inbox</h1>
   </header>
   <div role="main">
	<button> Notify </button>
   </div>
</section>
{% endhighlight %}

Again, this includes a `header` which in this case contains two links: one to open the sidebar and one to hide the sidebar. The content of the page is inside `<div role="main">`.

But having done that, we are met with something like this

![First implementation of the drawer. The background of the content is transparent and the drawer menu can be seen](/img/posts/9/drawer1.png)

![First implementation of the drawer: sidebar shown. Heading for the sidebar is too big to fit](/img/posts/9/drawer2.png)

## Upon close inspection...

It seems like something went very wrong, but the following CSS will fix it

{% highlight css %}
html, body {
    margin: 0;
    height: 100%;
    width: 100%;
}

section[role="region"] {
    background: #fff;
    height: 100%;
}
{% endhighlight %}

Here's a quick overview of what was happening. `drawer.css` absolutely positions the sidebar on the webpage with a small z-index. The effect is that the side bar is all ways in the back of the layout. The `section` with the content was just large enough to wrap the header and button and it had a transparent background. The rules under `section[role="region"]` fix these problems. The next problem was that the containing elements of `section`, `html` and `body`, were not stretching to the available space. The fix for this was to set `margin: 0;` and `height: 100%`.

![Second implementation of the drawer. The content is no longer transparent and it fills the page.](/img/posts/9/drawer3.png)

![Second implementation of the drawer: sidebar shown. The heading is still too big](/img/posts/9/drawer4.png)

## Close, but something isn't quite right...

There are just some minor problems left to solve. The icon for the drawer is over-scaled and it makes the bitmap look fuzzy. The title of the sidebar is too big and cannot be read. To downscale the whole UI we can simply decrease the root font-size with `html { font-size: 62.5%; }` to get us the following result.

![Third implementation. Everything looks scaled down](/img/posts/9/drawer5.png)

![Third implementation: sidebar shown. The heading finally fits](/img/posts/9/drawer6.png)

## Yay! Now what?

Implementing the actual navigation will actually take a bit more work. Instead, we're going to take the easy way out and hide/show buttons based on the navigation clicks.

This is the structure of the content

{% highlight html %}
<div role="main">
 <h1 id="message"> Welcome to API Showcase.
  You can try out any API demo by opening up the drawer.</h1>
 <button id="btn-nofity"> Notify Me!</button>
 <button id="btn-nofity-wait"> Notify Me! (Wait 5s)</button>
</div>
{% endhighlight %}

And this is the structure of the navigation

{% highlight html %}
<section data-type="sidebar">
	<header>
		<menu type="toolbar">
			<a id="nav-message" href="#">Done</a>
		</menu>
		<h1>Demos</h1>
	</header>
	<nav>
		<ul>
			<li><a id="nav-notify" href="#">Notification</a></li>
			<li><a id="nav-notify-wait" href="#">Alarm</a></li>
		</ul>
	</nav>
</section>
{% endhighlight %}

The CSS to hide the buttons

{% highlight css %}
#btn-nofity {
    display: none;
}

#btn-nofity-wait {
    display: none;
}
{% endhighlight %}

And the javascript to bring it all together

{% highlight javascript %}
document.querySelector('#nav-notify').addEventListener ('click', function () {
	notifyButton.style.display = "block";
	notifyLaterButton.style.display = "";
});

document.querySelector('#nav-notify-wait').addEventListener ('click', function () {
	notifyButton.style.display = "";
	notifyLaterButton.style.display = "block";
});

document.querySelector('#nav-message').addEventListener ('click', function () {
	notifyButton.style.display = "";
	notifyLaterButton.style.display = "";
});
{% endhighlight %}

[Try the demo](/demos/07/) and check out the [source code](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/07).
