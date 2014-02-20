---
layout: post
title:  "BuildingBlocks: Status"
date:   2014-02-19 12:00:00
permalink: /blog/14/
---

The Contacts part of the API Showcase application does not show a lot of information to the user. All the information is displayed in the console. A good way to remedy is to use the [Status](http://buildingfirefoxos.com/building-blocks/status.html) building block.

## The Simplest

This is by far the simplest building blocks to use by virtue of the implementation of the building blocks demo ([download here](https://github.com/buildingfirefoxos/Building-Blocks/archive/gh-pages.zip)). In order to take advantage of this, simply copy the following from the demo 

* `style/status`
* `status.css`
* `js/status.js`

and import it in your app

{% highlight html %}
<script type="text/javascript" defer src="js/status.js"></script>
<link href="css/status.css" rel="stylesheet" type="text/css">
{% endhighlight %}

To use, simply call `utils.status.show(message)`. `message` can be a string or HTML.

## Thats cool, but how does it work?

To satisfy my curiosity I took a peek at the contents of `status.js`. It works as follows. The `status` object keeps track of 4 variables

* `DISPLAYED_TIME` : default time to show the status, in milliseconds
* `section` : the HTML element representing a status. Looks like
{% highlight html %}
<section role="status">
  <p>The Alarm is set. Nighty night</p>
</section>
{% endhighlight %}
* `content` : The HTML element representing the message contents
* `timeoutID` : used to hide the status

The library is auto initialized, and at this time `section` is created. The library listens for `animationend` events on the `section`, and the listeners are attached at this time also.

The only function the user should use is `show()`. It takes two parameters `message` and `duration`. The `message`, as explained above, can be a string or HTML. `duration` is specified in milliseconds and is optional ( the library will use `DISPLAYED_TIME` instead ). If a status is already shown, it will change the contents, or else it will display a new one. In either case, it will set a timeout to hide the status.

As a little bonus, the library emits `status-showed` and `status-hidden` events should the application want to know coordinate with the status.

## Wrapping Up

The status was used in the demos, as described in the beginning of the post, to give the user feedback about the Contact API calls. The demo is available [here (does not work in browsers)](/demos/12/) and the [source is on github](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/12).
