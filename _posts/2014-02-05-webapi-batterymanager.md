---
layout: post
title:  "WebAPI: BatteryManager"
date:   2014-02-05 12:00:00
permalink: /blog/05/
---


In this post were going to explore the (small) [BatteryManager API](https://developer.mozilla.org/en-US/docs/Web/API/BatteryManager).

`BatteryManager` is returned by `navigator.battery`. You can interface with the object in the following ways

* `level`
* `chargingTime`
* `discharginTime`

The battery manager also dispatches the following events

* `levelchange`
* `chargingchange`
* `chargingtimechange`
* `dischargingtimechange`

You can add an event listener using `addEventListener` interface.


{% highlight javascript %}

function updateStatus() {
    var battery = navigator.battery;
    console.log('Battery: ' + battery.level * 100 + '%');
    console.log('Charge Time: ' + battery.chargingTime);
    console.log('DisCharge Time: ' + battery.dischargingTime);
}

function addBatteryListeners() {
    var battery = navigator.battery;
    battery.addEventListener('levelchange', updateStatus, false);
    battery.addEventListener('chargingchange', updateStatus, false);
    battery.addEventListener('chargingtimechange', updateStatus, false);
    battery.addEventListener('dischargingtimechange', updateStatus, false);
}

addBatteryListeners();
updateStatus();

{% endhighlight %}

Now we can test this...but it's a lot of trouble to create a new application to test this little bit of javascript. Thus, this leads us to an introduction to some of the developer tools.

## Web Developer Tools

The Web Developer Tools for in the Firefox Web browser can be used for any website and for any Firefox OS app. 

* Go to the [App Manager](about:app-manager)
* Select the `Apps` Tab on the left hand side
* Select the `Hello, Firefox OS` app from the first post.
* Click on `Debug`

Here there is a couple of different tools at out disposal.

* `Console` - the javascript console
* `Inspector` - inspect HTML elements from the page. Shows the CSS rules applied to the element.
* `Debugger`- used to set breakpoints in javascript code and step through it
* `Style Editor` - CSS editor
* `Profiler` - profile the render and running time of the webpage.
* `Scratchpad` - write javascript code that gets run in the context of the webpage

The one we are interested in is the `Scratchpad`. Just paste the javascript code above, click run, and look at the console! Much simpler than creating another app.


