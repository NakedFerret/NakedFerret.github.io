---
layout: post
title:  "Simple Notes: Index"
date:   2014-03-04 12:00:00
permalink: /blog/23/
---

In this post, I will outline the modifications I did to the Simple Notes app in order to create the index screen.

## Sectioning

The first order of business was separating the `Index` from the `New Note` section. I used the same CSS rules from the [BuildingBlocks Transitions](/blog/10/) post. With these rules I could use the following structure to separate the sections.

{% highlight html %}
<section role="region" data-position="current">
<!-- Index section content goes here -->
</section>

<section role="region" data-position="right">
<!-- create-note section content goes here -->
</section>
{% endhighlight  %}

With these sections wrapped, they can be easily switched in and out of the user interface by changing the classes. A more in depth explanation is provided in the aforementioned [transitions post](/blog/10/).

## The Index

The index consists of a list of notes and a button to create a new note. I used the `List` BuildingBlock to create the Note List. To import it, I simply copied the following files from the [BuildingBlocks sample app (zip)](https://github.com/buildingfirefoxos/Building-Blocks/archive/gh-pages.zip)

* `styles/lists`
* `styles/list.css`

Then I just had to enclose the list with a `section data-type="list"`

{% highlight html %}
<section data-type="list">
<!-- List goes in here -->
</section>
{% endhighlight  %}

Since I planned on populating the list dynamically, I created a template list item. I enclosed it in a section that forced it off the screen and applied some styles to get rid of the list styles (there were random dots in the index section because of the list styles).

{% highlight html %}
<section role="region" data-position="right">
  <section data-type="list">
    <ul>

      <li id="note-li-template">
	    <p class="note-title"> </p>
		<p class="note-content"> </p>
	  </li>
	  
	</ul>
  </section>
</section>
{% endhighlight  %}

To create a list item for each note I simply used a technique similar to this

{% highlight javascript %}
function addNoteToList(note) {
    var template = document.querySelector("#note-li-template");
    var templateClone = template.cloneNode(true);

	// Fill the title and content
	templateClone.querySelector('.note-title').innerHTML = note.title;
    templateClone.querySelector('.note-content').innerHTML = note.content;

	// Add the note list item to the list
    var noteList = ...;
    noteList.appendChild(templateClone);
}
{% endhighlight %}

Next I used a cursor to retrieve the objects from the database. Here is the most important part of that code

{% highlight javascript %}
function reloadNotes() {

  // Open the database
  var openRequest = window.indexedDB.open(dbName, 1);
    
  openRequest.onsuccess = function() {
    var db = this.result;

	// Object stores can only be accessed through transactions
    var transaction = db.transaction([noteStoreName], "readonly");
    var notes = transaction.objectStore(noteStoreName);

    var cursorRequest = notes.openCursor();
	// Used to keep track if we cleared the list or not
	// We could clear the list here but the cursorRequest might fail and the UI
    // would be empty
    var listEmpty = false;
	
    cursorRequest.onsuccess = function() {
	  var cursor = this.result;

	  if(! listEmpty) {
		clearNoteList();
		listEmpty = true;
	  }

	  // Cursor might be null (no result)
	  if(cursor) {
		var note = cursor.value;
		addNoteToList(note);
		cursor.continue();
	  }
	};

	cursorRequest.onerror = function() {
	    console.error(this.error);
	};
  };

  openRequest.onerror = function() {
    console.error(this.error);
  };
}
{% endhighlight %}

## Tying it Together

Now all that was left was to change the New Note section to work with the index section. First of all, the discard button was replaced with a back button. This required changes to the New Note section header and some javascript code

{% highlight html %}
<header>
  <a class="btn-back" href="#">
    <span class="icon icon-back">back</span>
  </a>
  <menu type="toolbar">
    <button id="btn-create-note-save">Save</button>
  </menu>
  <h1>New Note</h1>
</header>
{% endhighlight %}

{% highlight javascript %}
var backButton = document.querySelector("#create-note .btn-back");

// Discard Button
backButton.addEventListener('click', function() {
  form.reset();
});
{% endhighlight %}

After a successful save operation, `backButton.click()` and `reloadNotes()` were called.

## Demo

The demo can be tested [here (firefox browser friendly)](/demos/21/) and the source code is [here](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/21)
