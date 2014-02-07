---
layout: post
title:  "Simple Clock: Images"
date:   2014-02-04 12:00:00
permalink: /blog/4/
---

In this post, we modify the previous app to create an analog clock using images. [Try the Demo](/demos/03/)

---

HTML:
{% highlight html %}
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Simple Clock: V2</title>
    <script type="text/javascript" src="js/app.js"> </script>
    <link rel="stylesheet" type="text/css" href="css/style.css">
  </head>

  <body>
    <div id="clock-container">
      <img id="clock-face" src="img/clock-face.png">
      <img id="hour-hand" src="img/hour-hand.png">
      <img id="minute-hand" src="img/minute-hand.png">
      <img id="second-hand" src="img/second-hand.png">
    </div>
  </body>

</html>
{% endhighlight %}

We're going to use a div that contains all the images. This will make it easier to position the images. We're going to exploit the fact that all images fit within 256px x 256px

To center the css were going to use `absolute positioning` with the `top` and `left` rules.
{% highlight css %}
#clock-container {
    position: absolute;
    height: 256px;
    width: 256px;
    left:50%;
    top: 50%;
    margin: -128px 0 0 -128px;
}
{% endhighlight %}

The all images are also going to use `absolute positioning` so that they can overlap
{% highlight css %}
#clock-container img {
    position: absolute;
}
{% endhighlight %}

Then we center each hand image using `left` again.
{% highlight css %}
#hour-hand {
    height: 256px;
    width: 12px;
    left: 50%;
    margin: 0 0 0 -4.5px;
}

#minute-hand {
    height: 256px;
    width: 9px;
    left:50%;
    margin: 0 0 0 -6px;
}

#second-hand {
    height: 256px;
    width: 6px;
    left: 50%;
    margin: 0 0 0 -3px;
}
{% endhighlight %}

The javascript is going to change the CSS `transform` rule. In order to update the `transform` rule of an element we need to change the `MozTransform` field. It's easier to deal with the hand images if we use a an object to represent them. The `Hand` object accomplishes this. It takes an HTML element and a degree of rotation. 

{% highlight javascript %}
function Hand(element, degree_rotation) {
    this.degree_rotation = degree_rotation;
    this.element = element;

    this.update = function(time) {
	console.log
	degree = time * degree_rotation;
	this.element.style.MozTransform = "rotate("+degree+"deg)";
    };
}
{% endhighlight %}

This makes the rest of the code a little more manageable and readable

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
    // Rotate image

    var d = new Date();

    console.log(d.toString());

    var hour_hand = new Hand(document.getElementById('hour-hand'), 30);
    var minute_hand = new Hand(document.getElementById('minute-hand'), 6);
    var second_hand = new Hand(document.getElementById('second-hand'), 6);

    minute_hand.update(d.getMinutes());
    second_hand.update(d.getSeconds());

    var h = d.getHours();
    if (h >= 12) {
	h -= 12;
    }

    hour_hand.update(h);
    
}
{% endhighlight %}

The manifest is very similar to the one from the previous version. However, we now can use the `version` field. Firefox OS never uses this variable but it is accessible by the app and can be used to coordinate in-app update procedures.


	{
	  "name": "Simple Clock",
	  "description": "Simple analog clock",
	  "launch_path": "/index.html",
	  "version": "V2"
	  "icons": {
		"128": "/images/ic_simple_lock.png"
	  }
	}


You can find a packaged version in a zip file [COMING SOON]() and the hosted version at [COMING SOON]().


