---
layout: post
title:  "BuildingBlocks: Buttons"
date:   2014-02-10 12:00:00
permalink: /blog/8/
---

Before we keep exploring WebAPI, we can take a moment to build a UI foundation our API Showcase app. I [previously mentioned](/blog/2/) Gaia Building Blocks. It's a mini GUI framework for Firefox OS. So far, the application only showcases 2 APIs: Notification and Alarm. Let's examine the [Button](http://buildingfirefoxos.com/building-blocks/buttons.html) building block

## Downloading 

You can download Building Blocks [here](https://github.com/buildingfirefoxos/Building-Blocks/archive/gh-pages.zip). This is an archive of the sample application for the framework, but the framework is the collection of files under the `style` directory.

## Baby Steps: Button

Now to implement the buttons. It's actually pretty simple. Recall that our previous rendition of API Showcase contained the following buttons. 

{% highlight html %}
<body>
	<button id="notifyButton">Notify Me!</button>
	<button id="notifyLaterButton">Notify Me, but 5 seconds later!</button>
</body>
{% endhighlight %}

All that is needed to convert the buttons is to add `buttons.css` to the page and the `style/buttons/` folder to our `css` directory.

{% highlight html %}
<head>
	<link href="css/style/buttons.css" rel="stylesheet" type="text/css">
</head>
{% endhighlight %}

And that's it! The buttons work the same way as before, they just look different

![API Showcase using the default buttons](/img/posts/8/buttons.png)

With a little bit of tweaking to the HTML, we can change the look and behavior of the buttons...

{% highlight html %}
<button>Default</button>
<a class="recommend" role="button" href="#">Primary</a>
<button class="danger">Danger</button>
{% endhighlight %}

The "recommend" button is implemented with an `a` element of class `recommend` and the `role="button"` property. The "danger" button simple requires adding the `danger` class to a `button` element.

![Default, Recommend, and Danger button styles](/img/posts/8/buttons2.png)

If we add `disabled="disabled"` to the `button` elements and `aria-disabled=true` to the `a` button elements, we disable the buttons. 

{% highlight html %}
<button disabled="disabled">Default</button>
<a class="recommend" role="button" aria-disabled="true" href="#">Recommend</a>
<button class="danger" disabled="disabled">Danger</button>
{% endhighlight %}

![Disabled button styles](/img/posts/8/buttons3.png)

Lastly, creating a list of buttons also changes their look.

{% highlight html %}
<li> <button>Default</button> </li>
<li> <button disabled="disabled">Disabled</button> </li>
<li> <button>Action 1</button> </li>
<li> <button class="icon icon-view">View Name</button> </li>
<li> <button class="icon icon-dialog">Change Date</button> </li>
{% endhighlight %}

![List button styles](/img/posts/8/buttons4.png)

This is useful when grouping actions together or when you want to trigger a dialog. Using the classes `icon icon-view` will create a button that suggests to the user something will be shown. The classes `icon icon-dialog` will suggest that a dialog will be shown.


