---
layout: post
title:  "WebApi: Alarm"
date:   2014-02-07 12:00:00
permalink: /blog/7/
---

This post will cover the [Alarm API](https://developer.mozilla.org/en-US/docs/WebAPI/Alarm). Instead of creating a brand new application, we will modifying the `API Showcase` app. As always, I would encourage you to [try the demo](/demos/05/).

## Permission

The `Alarm` API requires `alarms` permission. The following is required in the manifest file

	"permissions": {
	  "alarms": {
	  "description": "Required to schedule alarms"
	  }
	}

The permission level is `default`. That mean any `hosted` or `packaged` application can access this API.

## What do you mean, Alarm?

Alarms is a word that gets thrown around a lot these days. Depending on the context, it can mean an alert meant to attract attention, an awareness of dangers, or similarly, to cause to feel danger. In the Firefox OS context, an alarm is a message passed to your application, at a specified time.

## Scheduling Alarms

Alarms are registered through the `MozAlarmsManager` interface which is accessible through the `navigator.mozAlarms` object. Register an alarm using the `add` which accepts the parameters

* `Date`: in the future, of course
* `respectTimezone`: can be either `ignoreTimezone` or `honorTimezone`. Consider if you set the alarm in the CET timezone at 12 PM. If you travel to a place with a PDT timezone, __ignoring__ the timezone means the alarm will still sound at 12 PM, while __honoring__ the timezone will means the alarm will sound at 3 AM.
* `data`: optional object that gets attached to the alarm

The `add` method will return a [DomRequest](https://developer.mozilla.org/en-US/docs/Web/API/DOMRequest) object. If you are unfamiliar with this object, you can use it as follows

* `onsuccess`: assign a callback function for when the request is successful
* `result`: contains the result of the request
* `onerror`: same as above but for when an error occurred
* `error`: the error of the request

The `result` of the request will be a number representing the id of the alarm (the id is used to cancel an alarm with the `remove` method). All together, it looks quite simple

{% highlight javascript %}
var myDate  = new Date();
myDate.setSeconds(myDate.getSeconds() + 5);
var data = { foo: "bar" };
var request = navigator.mozAlarms.add(myDate, "ignoreTimezone", data);

request.onsuccess = function () {
  console.log("The alarm has been scheduled");
};

request.onerror = function () { 
  console.log("An error occurred: " + this.error.name);
};
{% endhighlight %}

This schedules an alarm that will activate 5 seconds into the future

## Responding to Alarms

In order to respond to Alarms, the application must register itself with the system. This is accomplished through the manifest and the `messages` field.

    "messages": [
    { "alarm": "/index.html" }
    ]


The `index.html` tells the system which page will handle the alarm messages. The alarms will be handled using navigator.mozSetMessageHandler in the following manner

{% highlight javascript %}
navigator.mozSetMessageHandler("alarm", function (alarm) { 
  console.log("alarm fired: " + JSON.stringify(alarm.data)); 
});
{% endhighlight %}

The demo uses an alarm to show a notification 5 seconds in the future. Check out the [source code](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/05) for more information.

_TODO_: write code to install application to Firefox. Alarms API is cannot be used on a website and instead the app has to be installed to the browser

