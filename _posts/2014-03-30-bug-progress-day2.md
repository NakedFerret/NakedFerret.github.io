---
layout: post
title:  "Bug Progress: Day 2"
date:   2014-03-30 12:00:00
permalink: /blog/31/
---

Here's a small overview of my progress in fixing [bug #924609](https://bugzilla.mozilla.org/show_bug.cgi?id=924609).

## Finding the code

We know how to replicate the video app's thumbnail functionality. We just need to find the relevant code that generates (or doesn't generate, in this case) a thumbnail for an attachment. 

Here's the path I took to find the relevant code

* `Compose.js` -  handles the UI section that creates a new text message.
* clicking the attach button calls requestAttachment()
* this calls a MozActivity, the activity returns a blob of the attachment
* `attachment.js` - object that represents an attachment
* getThumbnail function found

The Attachment.getThumbnail functions is where we need to make the changes. 

## Development

To rebuild the SMS application, we can run

	BUILD_APP_NAME=sms ./build.sh gaia

I used rsync to copy the compiled files from my build server. The list of files to copy can be found in the [last post](/blog/30/)

	rsync -z --files-from=files.txt host:~/B2G/ ./

## Debugging

To debug the applications first you must install the [adb helper](https://ftp.mozilla.org/pub/mozilla.org/labs/fxos-simulator/). Then you must set the remote debugging option to `ABD and Devtools`. Finally, when the emulator starts up, you can connect to the emulator in the app manager, and accept the connection in the emulator itself.

In order to test Certified applications, we first have to build gaia with the following options.

	DEVICE_DEBUG=1 reset-gaia

But for the emulator build we actually just want to run

	DEVICE_DEBUG=1 ./build.sh gaia

These changes allows us to debug system applications, i.e. the certified applications. To test out the code we can use the following debuggin flow

* Place break in the code
* Trigger the breaks by interacting with the emulator
* Open the console part of the dev tools
* Print the stack trace using `(new Error()).stack)` 

Results

	Attachment.prototype.getThumbnail@app://sms.gaiamobile.org/js/attachment.js:69:11
	Attachment.prototype.render@app://sms.gaiamobile.org/js/attachment.js:216:9
	insert@app://sms.gaiamobile.org/js/compose.js:172:1
	Compose</compose.append@app://sms.gaiamobile.org/js/compose.js:499:1
	Compose</compose.requestAttachment/activity.onsuccess@app://sms.gaiamobile.org/js/compose.js:644:1

## Changing the code

I'm not familiar with the build tools and I unfortunately can't make any code changes appear in the emulator build. The next post will outline how to make code changes stick. 
