---
layout: post
title:  "BuildingBlocks: Confirm"
date:   2014-02-18 12:00:00
permalink: /blog/13/
---

This post will show one way to implement the [Confirm](http://buildingfirefoxos.com/building-blocks/confirm.html) dialog from the building blocks. We will ask the user confirmation when deleting all contacts. We will be using the [Transitions](http://buildingfirefoxos.com/transitions/prompts.html) to show and hide the dialog.

## Importing

Like all BuildingBlocks components, the `Confirm` dialog must be imported. Download the [building blocks sample application](https://github.com/buildingfirefoxos/Building-Blocks/archive/gh-pages.zip), and copy

* `style/confirm.css`
* `style/confirm/`

Into your application structure and link `confirm.css` in the index page. `confirm.css` expects the `confirm` folder to be in the same directory. 

## The Dialog Structure

The dialog structure is as follows

{% highlight html %}
<form role="dialog" data-type="confirm">
	<section>
		<h1>Confirmation</h1><!-- this heading is optional -->
		<p>Are you sure you want to delete all contacts?</p>
	</section>
	<menu>
		<button class="cancel">Cancel</button>
		<button class="danger confirm">Delete</button>
	</menu>
</form>

{% endhighlight %}

For our example we are going to wrap this form with the following section

{% highlight html %}
<section id="contact-confirm" data-position="back" class="fullscreen">
</section>
{% endhighlight %}

The `data-position` property should be familiar. This will place the dialog in the back of the page layout. When the dialog is shown with the `fade-in` transition, and hidden with the `fade-out` transition.

## Style and Transitions

The dialog is placed in the back of the layout with the following CSS

{% highlight css %}
[data-position="back"] {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    opacity: 0;
}
{% endhighlight %}

The animations are going to be triggered with the `fade-in` and `fade-out` classes

{% highlight css %}
[data-position="back"].fade-in {
    z-index: 120;
    animation: fadeIn 0.2s forwards;
    -webkit-animation: fadeIn 0.2s forwards;
}
[data-position="back"].fade-out {
    animation: fadeOut 0.2s forwards;
    -webkit-animation: fadeOut 0.2s forwards;
}
{% endhighlight %}

## Implementing the functionality

We can use this utility function to show dialogs and execute certain callbacks depending on the action the user chooses. 

{% highlight javascript %}
function addDialog(buttonSelector, dialogSelector, cancelCallback, confirmCallback) {

    cancelCallback = cancelCallback || function(){};
    confirmCallback = confirmCallback || function(){};

    var dialog = document.querySelector(dialogSelector);
    var dialogButton = document.querySelector(buttonSelector);

    var cancelButton = document.querySelector(dialogSelector + " .cancel");
    var confirmButton = document.querySelector(dialogSelector + " .confirm");

    dialogButton.addEventListener ('click', function () {
	dialog.className = 'fade-in';
    });

    cancelButton.addEventListener ('click', function () {
	dialog.className = 'fade-out';
	cancelCallback();
    });

    confirmButton.addEventListener ('click', function () {
	dialog.className = 'fade-out';
	confirmCallback();
    });

}
{% endhighlight %}

And we simply call it as follows

{% highlight javascript %}
addDialog("#btn-contact-clear", "#contact-confirm", null, requestClear);
{% endhighlight %}

Where requestClear is the anonymous function from the last revision of Showcase API

{% highlight javascript %}
var requestClear = function() {
	var clearRequest = navigator.mozContacts.clear();

	clearRequest.onsuccess = function () {
		console.log('All contacts have been removed.');
	}

	clearRequest.onerror = function () {
		console.error('Contacts were not cleared');
	}
};
{% endhighlight %}

## Try it out

This [demo](/demos/11/) can be tested in the browser (just the building block functionality of course), and the source code [resides here](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/11).

