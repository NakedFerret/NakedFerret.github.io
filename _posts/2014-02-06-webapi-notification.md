---
layout: post
title:  "WebApi: Notification"
date:   2014-02-06 12:00:00
permalink: /blog/6/
---

This article will show how to use the [Notification API](https://developer.mozilla.org/en-US/docs/WebAPI/Using_Web_Notifications). We will be building the app `API Showcase` through the rest of these series to quickly test each new api. [Try the demo of version one](/demos/04/)

_Note:_ This is the icon for the new application

![API Showcase Icon](/demos/04/img/ic_api_showcase.png)

## Permission: Manifest

Unlike the previous post, the `Notification` API requires requesting a permission. This can be done one of two ways: through the manifest or through the API itself. However, Firefox OS does not support requesting permissions after an app is installed. The required permission is called `desktop-notification`.

	{
	  "name": "API Showcase",
	  "description": "App that contains examples of API usage",
	  "launch_path": "/index.html",
	  "version": "v1.0",
	  "icons": {
		"128": "/img/ic_api_showcase.png"
	  },
	  "permissions": {
		"desktop-notification": {
		"description": "Needed to show notifications"
		}
	  }
	}

## Notification Object

The Notification API works through the `Notification` object. To test whether the app has the required permissions, `Notification.permission` will return

* `granted`: the user has allowed the app to show notifications
* `denied`: the user has not allowed the app to show notifications
* `default`: the user did not decide, but this is as good as `denied`

Notifications are created by supplying a title and optionally

* `dir`: the direction of the notification (auto, ltr, rtl)
* `lang`: language used within notification
* `body`: the body of the notification
* `tag`: An ID that allows a notification to be replaced or removed
* `icon`: the url of the image to use as an icon

The notifications are displayed as soon as they are created. So all that is required to show a notification is

{% highlight javascript %}
var title = "Title!";
var body = "Look at this bod";
var tag = 0;
var n = new Notification(title, {body: body, tag: tag});
{% endhighlight %}

The `tag` option prevents multiple notifications with the same tag from being displayed.

## Permission: Javascript API

As mentioned before, there is another method to getting the required permissions to show a notification. It's possible to ask the user for permission using the `Notification.requestPermission` function. It takes a function with one parameter, `permission`, that contains the result of the user decision.

{% highlight javascript %}
Notification.requestPermission(function( permission ) {

    // Adresses a bug in Opera/Chrome. You can ignore this but it is
	// needed to run in some browsers
	if(!('permission' in Notification)) {
		Notification.permission = permission;
    }

	if (permission === "granted") {
		var title = "Title!";
		var body = "Look at this bod";
		var tag = 0;
		var n = new Notification(title, {body: body, tag: tag});
    }
});
{% endhighlight %}

You can find the source code for the app [here](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/04).

