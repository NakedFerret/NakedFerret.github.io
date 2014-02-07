---
layout: post
title:  "Simple Clock App: Simple Base"
date:   2014-02-03 1:26:00
---

In this post, we create a simple clock app.

---
HTML:
{% highlight html %}
<!DOCTYPE html>
<html>
<head>
<title>Welcome to JS Bin</title>
</head>
<body>
  <h1 id="clock"> Time </h1>
</body>
</html>
{% endhighlight %}

We are going to just replace the text inside the H1 with the id `clock`.

CSS:
{% highlight css %}
h1 {
  position: absolute;
  top: 50%;
  left:50%;
  transform: translateX(-50%);
}
{% endhighlight %}

This is just a couple of rules to center the H1

Javascript:
{% highlight javascript %}
var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        init();
        clearInterval(readyStateCheckInterval);
    }
}, 100);


function init() {
  setInterval(updateTime, 1000);
}

function updateTime() {
  var clock = document.getElementById('clock');
  var date = formatDate(new Date());
  clock.innerHTML = date;  
}

function formatDate(d) {
  var hh = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  var dd = "AM";
  var h = hh;
  if (h >= 12) {
    h = hh-12;
    dd = "PM";
  }
    if (h === 0) {
        h = 12;
    }
  
    m = m<10?"0"+m:m;
    s = s<10?"0"+s:s;
  
  return h + ":" + m + ":" + s + " " + dd;
}
{% endhighlight %}

The this will get the time from a `Date` object, format it to a 12 hour format that includes seconds, and will update the text of the H1.

The manifest is very similar to the one from Hello, Firefox.


	{
	  "name": "Simple Clock",
	  "description": "Simple Text Based Clock",
	  "launch_path": "/index.html",
	  "icons": {
		"128": "/img/ic_simple_clock.png"
	  }
	}


Here is the icon.

![Simple Clock Icon](/demos/02/img/ic_simple_clock.png) 


TODO: Show how to install a hosted application
