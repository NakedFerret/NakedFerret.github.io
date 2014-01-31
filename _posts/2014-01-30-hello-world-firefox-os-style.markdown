---
layout: post
title:  "Hello, World: Firefox OS Style"
date:   2014-01-30 23:51:57
---

This is the first entry to the blog series dedicated to developing mobile applications for [Firefox OS](http://www.mozilla.org/en-US/firefox/os/).

## Hello, Firefox OS

Firefox OS apps are created using the standard web technologies: HTML, CSS, and Javascript. Let's create three files that test the basic functionality of each of these technologies.

HTML:
{% highlight html %}
<!-- hello.html -->
<html>
  <head>
	<title> Hello, Firefox OS </title>
	<script type="text/javascript" src="hello.js"> </script>
	<link rel="stylesheet" type="text/css" href="hello.css">
  </head>
  <body>
	<p>Hello, Firefox OS</p>
	<button type="button" id="coolButton">Do Something Cool</button>
  </body>
</html>
{% endhighlight %}

CSS:
{% highlight css %}
/* hello.css */
.body {
  background-color:#00ff00;
}
{% endhighlight %}

Javascript:
{% highlight javascript %}
// hello.js
var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		init();
		clearInterval(readyStateCheckInterval);
	}
}, 100);

function init() {
	console.log("ready!");
	var button = document.getElementById('coolButton');
	var state = 0; // 0 = normal | 1 = converted

	button.addEventListener('click', function(event) {

	if(state === 0) {
		document.body.style.backgroundColor = 'black';
		this.innerHTML = "Turn It Back!";
		state = 1;
	} else if( state === 1) {
		document.body.style.backgroundColor = '#fdf3e6';
		this.innerHTML = "Do That Again!";
		state = 0;
	}
	});
}
{% endhighlight %}

Save all these files in the same directory/folder. Now open a web browser and point it to `hello.html`. Check that everything is working. All the files work as a website. Let's make them work as an application.

## Simulate

The easiest way to test a Firefox OS application is to use the simulator for the Firefox web browser. Here's a quick tutorial on how to install it.

* Download and install the latest version of [Firefox](http://www.mozilla.org/en-US/firefox/new/)
* Navigate to the App Manager (located at [about:app-manager](about:app-manager))
* Click on `Start Simulator` on the bottom of the page
* Click on `Install Simulator`
* Click on the green `Install Simulator` button on the page
* Choose the stable version (should be 1.2)
* Wait for the download to finish (it's around 60 MB)
* Click `Allow` in the menu that pops up under the URL bar
* Click `Install Now`

And it's installed! Here's how to start the simulator.

* Now go back to [App Manager](about:app-manager)
* Click on `Start Simulator`
* Select `Firefox OS 1.2`

Now, we're ready to test the application. Let's convert our website into the application.

## The Manifest

The [App Manifest](https://developer.mozilla.org/docs/Apps/Manifest) is a JSON file that contains metadata about a Firefox OS application. It can contains data on the developer and the permissions that the application uses. To turn our Hello World website into an application we only need to provide the required metadata fields

The manifest only requires the fields

* Name
* Description
* Icons

Our manifest will look like this

	{
	  "name": "Hello, Firefox OS",
	  "description": "Simple Demo App",
	  "launch_path": "/hello.html",
	  "icons": {
		"128": "/hello.png"
	  }
	}

The field `launch_path` is needed because our HTML file is not name `index.html`. Also, it is required that your application has an icon (To save some time, feel free to use [this one I made myself]()).

## The Moment Of Truth

Finally, it's time to test the application on the simulator.

* Place all the files in the same directory/folder
* Navigate to the [App Manager](about:app-manager)
* Start the simulator
* Select the `Apps` tab
* Click on `Add Packaged App`
* Select the directory/folder that contains all the files
* Click `Update`

And that's it! It's a simple process
