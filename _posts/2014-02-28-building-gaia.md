---
layout: post
title:  "Building Gaia"
date:   2014-02-28 12:00:00
permalink: /blog/21/
---

In this thread I will cover my experience building the Gaia interface from the source code. I followed the [Quickstart Guide](https://developer.mozilla.org/en-US/Firefox_OS/Hacking_Firefox_OS/Quickstart_guide_to_Gaia_development) at MDN.

> *Note:* I used a linux distribution based on Ubuntu Precise (12.04). This is not meant to be a guide, I'm just merely documenting my experience.

## Getting the Source Code

The source of the Gaia interface is located at [https://github.com/mozilla-b2g/gaia](https://github.com/mozilla-b2g/gaia). It uses the [Git](http://git-scm.com/) version control system. To copy the code to my computer, I used the clone command

	git clone https://github.com/mozilla-b2g/gaia.git

Git will copy the source code to a folder named `gaia` in the directory in which the command is run.

## Compiling

As mentioned before, Gaia is created using HTML, CSS, and Javascript. As such, most linux distribution will contain everything that is needed to compile the source code. Most of the compiling is just minimizing and unifying the CSS and javascript files. There are different compiling options available

* `default`
* `push to device` : This will push the new build to the device using `ADB`. Optionally, you can use `reset-gaia` to remove profiles, web app, and database entries (essentially resetting the phone for the specific build).

		make install-gaia

* `production` : phone is prepared for a production environment. Gaia is run as packaged apps (privileged and certified levels), test applications are not included int the build, remote debugging is disabled, the lock screen is turned off, etc.

		PRODUCTION=1 make
		# or optionally you can use
		make production

* `debug` : runs gaia as a hosted application on a local webserver. This allows apps to be tested without repackaging the apps. It also allows specific developers tools (that will be mentioned in more detail later on) to function.

			DEBUG=1 make

* `device debug` : this disables the lock screen on the device and enables ADB debugging. Only useful if you have a device

		DEVICE_DEBUG=1 make
There are more options but they are not too relevant to most scenarios. I used the `debug` option because it allows me to debug applications really easily as explained in the next section.

## Testing

The fastest way to test any changes to Gaia is to use a [nightly build of Firefox](http://nightly.mozilla.org/). I downloaded last nights build and extracted the archive. To test gaia I simply ran the following command in the directory I extracted the nightly build

	./firefox-bin -profile <gaia dir>/profile-debug/ -no-remote

`<gaia dir>` is the path to the directory where the Gaia source code is located. The `-no-remote` options will prevent the nightly build from interfering with any other firefox instances currently running.

After much a lot more than I should have had, I was met with the following sight.

![A screen shot of the Nightly build of firefox with what looks like an emulator to the left and developer tools to the right](/img/posts/21/desktop-build.png)

## Making Changes

Now get familiar with the workflow, I made a small change to the Contacts app to see if everything my developing environment was setup correctly. 

Here's what the Contact app looks like when on the first start

![A screen shot of the Contacts app. The important thing to notice is that the header is the typical Firefox OS orange color](/img/posts/21/before.png)

First, I closed the instance of the Firefox Nightly I had running. Then, I I added the following rule to the file located at `/apps/communications/contacts/style/app.css`

{% highlight css %}
section[role="region"] > header:first-child {
	background-color: #FFA;
}
{% endhighlight %}

I recompiled the the project...

	DEBUG=1 make

Started up the Firefox Nightly again...

	./firefox-bin -profile <gaia dir>/profile-debug/ -no-remote

And Voila! I got the following result

![It's the Contact app again but the color of the header looks washed out](/img/posts/21/result.png)

