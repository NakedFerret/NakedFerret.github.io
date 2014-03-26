---
layout: post
title:  "Bug Progress: Day 1"
date:   2014-03-07 12:00:00
permalink: /blog/26/
---

I have volunteered to help fix a [bug](https://bugzilla.mozilla.org/show_bug.cgi?id=924609) in Firefox OS. The bug is pretty small. It can be summed up as follows. When you attach a video to the SMS application, it shows a generic icon. Ideally it should show a thumbnail preview. In this post, I will explain my understanding of how the Gaia video application generates a thumbnail from a video.

## MediaDB

`MediaDB` is the shared library that keeps track of the filesystem. It stores names, types, sizes and metadata about files. `metadata.js` is the Video app library that wraps around the `MediaDB` library. The reason for this is outlined in the source code documentation 

> The phones we want to run on have only a single hardware h.264 video decoder, and gecko is not yet smart enough to share the hardware among all the `video` elements that want to use it. So all apps (camera, gallery and video) that have permission to use the video hardware must be careful to only use it while they are in the foreground and to relinquish it when they go to the background.
> 
> The video app wants to use `video` elements for metadata parsing and for playing videos for the user. It can't do both of these things at the same time. The MediaDB metadata parsing architecture assumes that it can, however. So the Video app does not pass a metadata parser function to MediaDB. MediaDB notifies the app about new video files but does not include any metadata with those notifications. Instead, we use the queuing and metadata parsing functions in this file to handle metadata parsing in an interruptible way.

From reading this, it is clear that MediaDB does not play a role in generating thumbnails. Why even mention it then? I think it's a very important caveat that should be kept in the back of the mind when designing the solution to the bug. Here's why. Ultimately, the best solution to the bug would be to create a shared library that both the Video app and the SMS app could use to generate a thumbnail. If creating a thumbnail from a video can only be done through the use of a `video` tag, the shared library should be very careful about how it handles the `video` tag.

## Generating a Thumbnail

The process to generate a thumbnail is surprisingly simple. It consists of the following steps

* Load the video file
* Seek
* Create `canvas`
* Determine Scale
* Call `context.drawImage` on the `video` tag
* Get image url from `canvas.toBlob()`

First, the video file is loaded into a `video` tag. Then, the video is fast forwarded 5 seconds or 10% of the video, whichever is shorter. This is accomplished using

{% highlight javascript %}
var video = ...; // Offscreen video element
video.currentTime = Math.min(5, video.duration / 10);
{% endhighlight %}

Next, a canvas is created. The scale is determined by finding the smallest ratio between the desired thumbnail size and the video size.

{% highlight javascript %}
var scale = Math.min(thumbWidth / videoWidth, thumbHeight / videoHeight);
context.scale(scale, scale);
{% endhighlight %}

Calling `context.scale()` will scale the image we get from `context.drawImage()`. The first parameter is the x scale ratio and the second parameter is the y scale ratio. Finally `context.drawImage()` is called. This method draws an image of what the element looks like at the moment the method is called. It takes 3 parameters, an element, an x position, and a y position. The element is the offscreen `video` tag. The x and y have to be calculated so that the image is placed in the center of the canvas. The resulting image url can be obtained from `canvas.toBlob()`

{% highlight javascript %}
var w = scale * vw;
var h = scale * vh;
var x = (tw - w) / 2 / scale;
var y = (th - h) / 2 / scale;

// Draw the current video frame into the image
context.drawImage(player, x, y);
canvas.toBlob(callback, 'image/jpeg');
{% endhighlight %}
