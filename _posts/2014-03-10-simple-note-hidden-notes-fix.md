---
layout: post
title:  "Simple Notes: Hidden Notes Fix"
date:   2014-03-10 12:00:00
permalink: /blog/27/
---

In this post, I will polish up the application and address one of its shortcomings: hidden list items. I did not test the list functionality fully when developing the application. This is what caused the bug to slip under the radar.

## The Problem

The Problem can be summed up as follows. The scrollable section's height was set to 100%. This means the height will be equal to it's parent container. What I did not realize was that the header was also taking up space on the screen. This caused the scrollable section to overflow off the screen by a margin equal to the size of the header, which is `5rem`.

I made a video to illustrate the problem. Notice that when I add the note with the title "h", it is not visible even though I try to scroll down.

![A video of what was described above](/img/posts/27/hidden.gif)

## The Solution

I discovered the solution by examining the BuildingBlocks [sample application](https://github.com/buildingfirefoxos/Building-Blocks/archive/gh-pages.zip). It's broken down in 3 parts

* position the header absolutely
* make the top border the size of the header
* change the box-sizing of the scrollable header

Positioning the header absolutely, places the header above the scrollable section. This effectively makes the scrollable section the size of the screen real estate. At this point the header obscures the first list item. To accomplish this step, we need to set `position: absolute` and `width: 100%`. If we use the same selector as in the headers file, our rule may not take effect due to CSS rule precedence. To ensure my rule took precedence, I added `fixed` class to the header. The resulting CSS selector and rules were

{% highlight css %}
section[role="region"] > header.fixed:first-child {
    position: absolute;
    width: 100%;
}
{% endhighlight %}

Intuitively, the next step would be to set the top border of the scrollable section to the size of the header, `5rem`, to prevent the header from blocking the first list item. However, this brings us back to step one because the size of the srollable section becomes the same size as before!

To remedy this, we can specify that the `scrollable` section use a different [box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing) property. The box-sizing property basically dictates if the height and width should include the padding and border. Padding is included with the `padding-box` value, and border is additionally included with the `border-box` value. Combining this with the border, gives us the result we want.

{% highlight css %}
.scrollable {
    border-top: 5rem solid transparent;
	box-sizing: border-box;
	-moz-box-sizing: border-box;
	-webkit-box-sizing: border-box;
}
{% endhighlight %}

## We Meet Again

The problem is exhibited once more when the application enters edit mode. Edit mode brings up a "footer" with two buttons, `Delete All` and `Delete Selected`. The footer is of size `7rem`. Intuitively we can just set the bottom border to the footer size, but this border has to be in effect only in edit mode. Therefore this solution requires not only CSS but javascript also.

The solution will consist of the border CSS rule activating on an element whose classes include `scrollable` and `edit`.

{% highlight css %}
.scrollable.edit {
    border-bottom: 7rem solid transparent;
}
{% endhighlight %}

The `edit` class will be added to the `scrollable` section when the user enters edit mode

{% highlight javascript %}
var indexScrollSection = document.querySelector("#index .scrollable.header");

enterEditModeButton.addEventListener("click", function() {
	indexScrollSection.classList.add("edit");
});

editModeDone.addEventListener("click", function() {
	indexScrollSection.classList.remove("edit");
});
{% endhighlight %}

## Demo

Try the [demo](/demos/24/) and the source is at [Github](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/24).
