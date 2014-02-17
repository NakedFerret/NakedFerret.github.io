---
layout: post
title:  "WebAPI: Contact Continued"
date:   2014-02-17 12:00:00
permalink: /blog/12/
---

[Last post](/blog/11/) we explored the Contact API, but ran into permissions problems. This post, we'll show the fix and show the last part of the contacts API. [Try the (working) demo](/demos/10/) and check out the [source code](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/10).

## Wiping the slate

The most destructive API call in is by far the `clear()` command. It will remove all contacts from the device. The system does not step in and warn the user while the command is happening, so the duty is delegated to the application. In the future we will implement an alert dialog for this particular demo, but for now here is the code.

{% highlight javascript %}
var clearRequest = navigator.mozContacts.clear();

clearRequest.onsuccess = function () {
    console.log('All contacts have been removed.');
}

clearRequest.onerror = function () {
    console.error('Contacts were not cleared');
}
{% endhighlight %}

## Asking for Permission, Take one

According to [the permissions list page](https://developer.mozilla.org/en-US/Apps/Developing/App_permissions#Hosted_app_and_privileged_app_permissions), accessing the contacts API requires something like the following in the application manifest


	"permissions": {
	  "contacts": {
		"access": "readwrite",
		"description": "Needed to read, create, and modify contacts"
	  }
	},

Where the possible values of `access` are

* `readonly`
* `readwrite`
* `readcreate`
* `createonly`

Looking at the [permissions page](https://developer.mozilla.org/en-US/Apps/Developing/App_permissions#Hosted_app_and_privileged_app_permissions) again, you can notice that the `Default Granted` column has the value `Prompt` for the `contacts` api. This means that the user will be given a prompt before the appliction is given access to the api. The user can deny or allow the app the access to the api at this prompt.

However, when we test the app, no such prompt comes up and the app reports error on every contact api. The error name is `Not Allowed`. Intuitively, there is an error with the permissions.

## Asking for Permission, Take two

The fix is a simple one, all it requieres is that the app manifest contain the following

	"type": "privileged"

Here's the explanation. The contact API is a `priviledged` API. An application can be priveledged when it is installed through the marketplace. But for the system to recognize the application as privileged, we must specify it in the manifest as stated above.

## All's Well

As stated in the beginning of the post, [demo](/demos/10/) and [source](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/10).
