---
layout: post
title:  "WebAPI: WebActivities"
date:   2014-02-13 12:00:00
permalink: /blog/11/
---

In this post, we will take a quick look at the [WebActivity API](https://developer.mozilla.org/en-US/docs/WebAPI/Web_Activities). WebActivities are basically parts of apps that register with the system. When a user wants to perform a certain action that many apps can accomplish (like share, choose an image, take a photo, etc), the system will present the user with all the registered applications that can accomplish that action.

## Starting an Activity

In order to launch one of these activities we create a `MozActivity`. The parameter is an object with the following 

* `name` : the name of the action the user wants to perform
* `data` : information about the action. Usually contains `type`

[Here](https://developer.mozilla.org/en-US/docs/WebAPI/Web_Activities#Firefox_OS_activities) is a list of all the activities that Gaia offers. Let's try to show the user an activity to create a contact. It's done as follows

{% highlight javascript %}
var activity = new MozActivity({
	name: "new",
	data: {
		type: "webcontacts/contact"
	}
});

activity.onsuccess = function() {
	console.log("WebActivity reported success");
};

activity.onerror = function() {
	console.log(this.error);
};
{% endhighlight %}

And that's it! You can [try the demo](/demos/09/) but the WebActivity API is not supported by any web browser. Source code is [here](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/09).


