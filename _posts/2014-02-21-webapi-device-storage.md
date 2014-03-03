---
layout: post
title:  "WebAPI: Device Storage"
date:   2014-02-21 12:00:00
permalink: /blog/16/
---

This post will give a short demonstration of the [Device Storage API](https://developer.mozilla.org/en-US/docs/WebAPI/Device_Storage).


## The storage types

Firefox OS divides the storage into the following storage areas.

* `apps`: This storage area is used to store the user data needed by apps. Only available for certified application only.
* `music`: This is the storage area where music and sounds are stored.
* `pictures`: This is the storage area where pictures are stored.
* `sdcard`: This is the storage area that give access to the device's SD Card.
* `videos`: This is the storage area where videos are stored.

To access a certain storage area, use the `navigator.getDeviceStorage()` method. Also, each storage area requires explicit permissions. For example, to access the `sdcard` and `videos` areas, the following is needed in the manifest

	"permissions": {
	  "device-storage:videos":{ "access": "readonly" },
	  "device-storage:sdcard":{ "access": "readwrite" }
	}

The access property can be

* `readonly`
* `readwrite`
* `readcreate`
* `createonly`

After that, we are ready to access the storage area.

## Is there room for one more?

A good first step is to check if the storage area has enough space for your intended use. The `DeviceStorage.freeSpace()` method provides the information. It returns the amount of free space in bytes

{% highlight javascript %}
var pics = navigator.getDeviceStorage('pictures');
var request = pics.freeSpace();

request.onsuccess = function () {
  	var size = parseInt(this.result / 1048576);
   	document.querySelector("#available-storage").innerHTML = size + " MB";
}

request.onerror = function () {
  	console.error(this.error);
  	utils.status.show("Could not access the device storage");
}
{% endhighlight %}

## Adding a file

There are two methods to add a file, `add()` and `addNamed()`. The system creates a name for the file when using `add()`. Both files except a `Blob`. It's mandatory to give a `Blob` a mime type. All together, one might use the methods as follows.

{% highlight javascript %}
var sdcard = navigator.getDeviceStorage("sdcard");
var file   = new Blob(["This is a text file."], {type: "text/plain"});

var request = sdcard.addNamed(file, "my-file.txt");

request.onsuccess = function () {
  var name = this.result;
  console.log('File "' + name + '" saved');
}

// An error typically occur if a file with the same name already exist
request.onerror = function () {
  console.warn('Unable to write the file: ' + this.error);
}
{% endhighlight %}

It's important to mention what mime type each storage area expects

* `music` : valid audio mime types
* `pictures` : valid image mime types
* `videos` : valid video mime type

The information above is intuitive but worth mentioning.

## Retrieving a file

Retrieving a file is much simpler, simple provide the file name to `DeviceStorage.get()`.

{% highlight javascript %}
var sdcard = navigator.getDeviceStorage("sdcard");
var request = pics.get("my-file.txt");

request.onsuccess = function () {
    var file = this.result;
    console.log(file);
}

request.onerror = function () {
    console.error(this.error);
}
{% endhighlight %}

The result of the get request is a `FileHandle` object.

## Deleting

Deleting files is also simple. Use `DeviceStorage.delete()`

{% highlight javascript %}
var sdcard = navigator.getDeviceStorage("sdcard");
var request = pics.get("my-file.txt");

request.onsuccess = function () {
	console.log("File deleted");
}

request.onerror = function () {
    console.error(this.error);
}
{% endhighlight %}

## API Showcase

The demo for this API uses the methods mention above on the `pictures` storage. The reason for this is that I was unable to use the `sdcard` storage area. After a bit of head scratching I figured out how to convert an image from a URL into a `Blob`. The demo resides [here (only works in the simulator](/demos/14) and the source code is at [Github](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/14).
