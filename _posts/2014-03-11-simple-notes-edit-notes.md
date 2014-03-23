---
layout: post
title:  "Simple Notes: Edit Notes"
date:   2014-03-11 12:00:00
permalink: /blog/28/
---

In this post, I walk through the implementation of the Edit Note screen pictured below

![ When a note is clicked, a new section is shown. It looks like the new note section, but with the information from the note populated. It has two buttons: save and delete. ](/img/posts/28/preview.gif)

## Intuition fails

The `Edit Note` section is very similar to the `New Note` section. My first instinct was to use the same `section` for both purposes and modify them in javascript according to which mode we were in. This is the essence of the Don't Repeat Yourself principle, or DRY principle.

This turned out to be troublesome. Instead I opted to apply the DRY principle to the javascript code.

## Structuring

The CreateNoteForm object managed the new note form. It's interface was simply

{% highlight javascript %}
function CreateNoteForm () {
	// initializes the form. Mainly takes care of connecting the date button to
    // the date picker
	init();

	getTitle();
	getContent();
	getDate();
}

// To use it...
var form = new CreateNoteForm();
form.init();
{% endhighlight %}

The object was modified to work with both forms, and renamed to `NoteForm`. It now takes a single parameter, the form to manage. The methods now operate on this form instead of the hard coded reference to the new note form. 

{% highlight javascript %}
function NoteForm ( formSelector ) {
	var form = ...; // could be the New Note form or the Edit Note form

	// Now these methods use the form variable
	init();
	getTitle();
	getContent();
	getDate();
}
{% endhighlight %}

For these changes to work, the structures for the sections containing the forms needed modifications. Elements needed to be reference by class instead of id. This required changes to the inputs and buttons elements, and the date picker. The end result was something like the following

{% highlight html %}
<section id="create-note" role="region" data-position="right">
	<header>
		<a class="btn-back" href="#">
			<span class="icon icon-back">back</span>
		</a>
		<menu type="toolbar">
			<button class="btn-save">Save</button>
		</menu>
		<h1>New Note</h1>
	</header>
	<div role="main">
		<form>
			<p>
				<input type="text" placeholder="Note Title" class="note-form-title">
			</p>
			<p>
				<textarea placeholder="Note Content" class="note-form-content"></textarea>  
			</p>
			<div class="hides-date"> 
				<input class="picker-date" type="date" />   
			</div>
		</form>
		<p>
			<li><button class="btn-date" class="icon icon-dialog">Date Due</button></li>
		</p>
	</div>
</section>
{% endhighlight %}

The only CSS changes that were required was on the rule that hid the date picker

{% highlight css %}
/* Hide the ugly date input result form */
div.hides-date {
    width: 0;
    height: 0;
    overflow: hidden;
    float: left;
}
{% endhighlight %}

## Navigating

The next step was to show the `Edit Note` section whenever a note was clicked. This turned out to be trivial to implement. All we needed to do was call addNavigation() for every anchor in each list item. All relevant changes were confined to `addNoteToList()`.

{% highlight javascript %}
function addNoteToList(note) {
    var template = ...; 
    var noteListItem = template.cloneNode(true);

	...	// Code that populates the template

	// The selector for the list item anchor is essentially 
	//   li[note-id=#] a
	// where # is the note id
    var noteLISelector = "li[note-id=\"" + note.id + "\"]";
    addNavigation(noteLISelector + " a", "#edit-note");
}
{% endhighlight %}

## Populating

Populating the `Edit Note` section required fetching the relevant note from the database. This can be accomplished as long as the note id is known. I stored the note id as soon as a note was clicked. The code for this is found in `addNoteToList()` again

{% highlight javascript %}
function addNoteToList(note) {
    var template = ...; 
    var noteListItem = template.cloneNode(true);

	...	// Code that populates the template

	// Navigation code
    var noteLISelector = "li[note-id=\"" + note.id + "\"]";
    addNavigation(noteLISelector + " a", "#edit-note");

	var anchor = noteListItem.querySelector("a");
    anchor.addEventListener('click', function() {
        var editForm = document.querySelector("#edit-note");
        editForm.setAttribute("note-id", note.id);
        populateEditNoteSection();
    });
}
{% endhighlight %}

As show in the code, the `Edit Note` section can be populated as soon as the note-id is stored. `populateEditNoteSection()` simply fetches the relevant note from the database and fills in the fields.

{% highlight javascript %}
function populateEditNoteSection() {

    var section = document.querySelector("#edit-note");
    var noteId = parseInt(section.getAttribute("note-id"));
    
    var dbRequest = window.indexedDB.open(dbName, 1);

    dbRequest.onsuccess = function() {
        var db = this.result;

        var transaction = db.transaction([noteStoreName], "readonly");
        var notes = transaction.objectStore(noteStoreName);

        var getRequest = notes.get(noteId);
        
        getRequest.onsuccess = function(event) {
            var note = this.result;
			// fill in fields here
	    }
    
		... // some error handling
    };
    
    ... // more error handling
}
{% endhighlight %}

To fill in the fields, I opted to use the `NoteForm` object. I added the `setTitle()`, `setContent()`, and `setDate()` methods. They were simply defined as 

{% highlight javascript %}
function NoteForm(formSectionSelector) {
    var titleInput = form.querySelector(".note-form-title");
    var contentInput = form.querySelector(".note-form-content");
    var datePicker = form.querySelector(".picker-date");    

    this.setTitle = function(title) {
        titleInput.value = title;
    }

    this.setContent = function(content) {
        contentInput.value = content;
    }
    
    this.setDate = function(date) {
        datePicker.value = date;
        if(date != "") {
            dateButton.innerHTML = date;    
        } else {
            dateButton.innerHTML = "Date Due";    
        }
        
    }
}
{% endhighlight %}

Filling in the fields now simply consisted of a couple of method calls.

{% highlight javascript %}
getRequest.onsuccess = function(event) {
	var note = this.result;
	form.setTitle(note.title);
	form.setContent(note.content);
	form.setDate(note.date);
}
{% endhighlight %}

## Buttoning

The last part of the puzzle was to add functionality to the save and delete buttons of the `Edit Note` sections. This was all contained in `prepareEditNoteSection()`.

The bare the function needed to implement was the following

{% highlight javascript %}
function prepareEditNoteSection() {
    var form = new NoteForm('#edit-note');
    form.init();
}
{% endhighlight %}


The back button was the most straightforward to implement.

{% highlight javascript %}
function prepareEditNoteSection() {

    var form = new NoteForm('#edit-note');
    var section = document.querySelector("#edit-note");
    var backBtn = document.querySelector("#edit-note .btn-back");

    backBtn.addEventListener('click', function() {
        form.reset();
        section.removeAttribute("note-id");
    });
}
{% endhighlight %}

The other two buttons required the note id to function. This is stored in the edit-note section, but since the method is called once at runtime, we cannot store it in a variable. Instead we need to use a function to lookup the note-id when the buttons are clicked. The function is simply

{% highlight javascript %}
function getNoteId() {
	return parseInt(section.getAttribute("note-id"));  
};
{% endhighlight %}

The delete button calls `deleteNotes()`. It passes in the note id enclosed in an array. When the delete action completes successfully the back button is pressed and the notes list is reloaded.

{% highlight javascript %}
function prepareEditNoteSection() {
	
	var deleteBtn = document.querySelector('#edit-note .btn-delete')
    var backBtn = document.querySelector("#edit-note .btn-back");	

    deleteBtn.addEventListener('click', function() {
        deleteNotes([getNoteId()], function() {
            backBtn.click();
            reloadNotes();
        });
    });
}
{% endhighlight %}

Saving a note that is already in the database is synonymous with an update operation. The `IndexedDB` update method is `put()`. Interestingly enough, `put()` saves an object to the database even if it's not already present. We can take advantage of this by modifying the `saveNote` method so that both forms can use it.

The modification is simple: provide the note id in the parameter. If the note id is present, set the note object we create within the method to have the same id. The `put()` method will do an update operation if the id is present, or it will just do a save operation if it is not.

{% highlight javascript %}
function saveNote(form, id, successCallback) {

    var dbRequest = window.indexedDB.open(dbName, 1);

    dbRequest.onsuccess = function() {
        var db = this.result;

        var transaction = db.transaction([noteStoreName], "readwrite");
        var notes = transaction.objectStore(noteStoreName);
        
        var note = new Note(form.getTitle(), form.getContent(), form.getDate());
        
        if( id !== null ) {
            note.id = id;
        }
        
        notes.put(note);
    };
}
{% endhighlight %}

The save button handler can now use the new version of `saveNote()`

{% highlight javascript %}
function prepareEditNoteSection() {

    var backBtn = document.querySelector("#edit-note .btn-back");
    var saveBtn = document.querySelector("#edit-note .btn-save");
    
    // Save button
    saveBtn.addEventListener('click', function() {
       saveNote(form, getNoteId(), function() {
            backBtn.click();
            reloadNotes();
        });
    });
}
{% endhighlight %}

## Demo

As always, check out the [demo](/demos/25/) and the [source](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/25).
