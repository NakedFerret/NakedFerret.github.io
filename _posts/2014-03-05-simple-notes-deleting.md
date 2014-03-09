---
layout: post
title:  "Simple Notes: Deleting"
date:   2014-03-05 12:00:00
permalink: /blog/24/
---

The next functionality I decided to implement was the ability to delete multiple notes at once. I originally planned to implement this functionality along with the index section, but there were a lot of little details that I overlooked during the planning phase that set me back.

## Edit Mode

The user enters the multiple-deletion mode by pressing a button. I used the EditMode [BuildingBlock](http://buildingfirefoxos.com/building-blocks/edit-mode.html) to distinguish the UI between the regular mode and the multiple deletion mode. 

The HTML I used for the header mode is

{% highlight html %}
<form role="dialog" data-type="edit">
  <section>
	<header>
	  <menu type="toolbar">
		<button>Done</button>
	  </menu>
	  <h1>Delete Notes</h1>
	</header>
  </section>
  <menu>
	<button id="btn-delete-all">Delete All </button>
	<button id="btn-delete-selected">Delete Selected</button>
  </menu>
</form>
{% endhighlight %}

The sample BuildingBlocks application shows the Edit Mode as an overlay, obscuring the header and the bottom part of the application. To transition into and out of this mode, I copied exactly what the sample application did. I enclosed the above `form` with the following `section`

{% highlight html %}
<section id="edit-note-list" data-position="edit-mode">
  <!-- Form goes here -->
</section>
{% endhighlight %}

And I copied these CSS rules also

{% highlight css %}
[data-position="edit-mode"] {
    position: absolute;
    top: -5rem;
    left: 0;
    right: 0;
    bottom: -7rem;
    z-index: -1;
    opacity: 0;
    transition: all 0.3s ease;
}
[data-position="edit-mode"].edit {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 120;
    opacity: 1;
}
{% endhighlight %}

To transition from mode to mode, I simply had to add and remove the `edit` class from the above `section`.

## Switches

Next, I had to modify the list to distinguish it from regular mode and multiple-deletion mode, and to allow the user to select the items to delete. I used the Switches [BuildingBlock](http://buildingfirefoxos.com/building-blocks/switches.html). To add a switch to each list item, I modified the template into the following

{% highlight html %}
<li>
  <label class="pack-checkbox danger">
	<input type="checkbox">
	<span></span>
  </label>
  <a href="#">
	<p class="note-title"> </p>
	<p class="note-content"> </p>
  </a>
</li>
{% endhighlight %}

The nice thing about the switches, is that they will not be visible unless the `ul` enclosing the list items has the `data-type="edit"` attribute. To take advantage of this I added and removed the attribute to the index `ul` when entering and exiting the Edit Mode, respectively. This was stumbling block because it took me a while to figure out that I had to use the `setAttribute()` method.

## Stumbling all over the place

Right after implementing the above functionality I ran into a problem I should have foreseen. The index list was not receving any clicks while in EditMode. It was clear why. The Edit Mode section was overlayed on top of the index section, and the former was intercepting all clicks. The solution turned out to be really simple. It's just the following CSS rule.

{% highlight css %}
#edit-note-list {
    pointer-events:none;
}
{% endhighlight %}

This rule makes the edit mode section ignore any click events and pass them to whatever HTML element is below it. Fortunately, the children of the section still receive clicks, so the buttons and header will intercept clicks and white space will pass the clicks. 

## Can I see your ID?

The next puzzle was enumerating the checked list items for deletion. Finding the correct list items basically boiled down to these two methods for the `Delete All` and `Delete Selected` buttons

{% highlight javascript %}
// Delete All
var allNotes = document.querySelectorAll("#note-list li");
{% endhighlight %}

{% highlight javascript %}
// Delete Selected
var allNotes = document.querySelectorAll("#note-list li");
var checkedNotes = []

for (var i = 0; i < allNotes.length; i++) {
  note = allNotes[i];
  // See if the note contains an input element that is checked
  if(note.querySelector('input:checked') != null) {
	checkedNotes.push(note);
  }
}
{% endhighlight %}

However, to delete the object stored in the indexed db we need the id of said object. To remedy this, I simply added the attribute `note-id` to the list item with the value of the id. I simply had to modify the `addNoteToList()` method

{% highlight javascript %}
function addNoteToList(note) {
  var template = document.querySelector("#note-li-template");
  var noteList = document.querySelector("#note-list");
  var noteListItem = template.cloneNode(true);

  noteListItem.setAttribute("note-id", note.id);  // Add the id here!

  noteListItem.querySelector('.note-title').innerHTML = note.title;
  noteListItem.querySelector('.note-content').innerHTML = note.content;
  noteList.appendChild(noteListItem);
}
{% endhighlight %}

## Demo

Try the demo [here (works in Firefox!)](/demos/22/) and see the source [here](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/22).
