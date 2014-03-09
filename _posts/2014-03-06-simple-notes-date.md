---
layout: post
title:  "Simple Notes: Date"
date:   2014-03-06 12:00:00
permalink: /blog/25/
---

This is the final day in which I worked on the Simple Notes application. I implemented a due date for each note.

## Selecting a date

Firefox OS comes with a native date picker optimized for mobile layouts. In order to call forth this date picker, one has to simple add the following `input` element to a form.

{% highlight html %}
<input type='date'>
{% endhighlight %}

And said Date picker looks like this

![The Date Picker looks like a slot machine with 3 slots, for month, day, and year](/img/posts/25/date-picker.png)

## Uglyness

There was a glaring issue with this approach. In order to bring forth the date picker, the user needed to press this ugly input box

![An input box that has the default styling. It stands out from the rest of the UI and not in the good way.](/img/posts/25/create_note_ugly.png)

To fix this issue, I wrapped the `<input>` in a div that had the following CSS rules applied

{% highlight css %}
div#hides-date {
    width: 0;
    height: 0;
    overflow: hidden;
    float: left;
}
{% endhighlight %}

This hides the input, and takes it out of the "flow" (i.e. other elements on the page ignore the div when aligning themselves). Next, I added a button. When the button is clicked, the hidden date input is focused. This causes the date picker to pop up, and this effectively makes the user think that the button controls the date picker. I also added an event listener to the `input` element that listened for input changes. This event gets fired when the user chooses a date. When the event is received I updated the text of the button to reflect the date choosen.

To accomplish all of that I used the following snippet

{% highlight javascript %}
// dateButton == the button to replace the date input element
// datePicker == the date input element
dateButton.addEventListener('click', function() {
  datePicker.focus();
  datePicker.addEventListener('input', function() {
	dateButton.innerHTML = this.value;
  });
});
{% endhighlight %}

This is the result

![An animation of what was described above. The ugly input box was replaced with a button that fits in with the rest of the UI](/img/posts/25/create_note_pretty.gif)

## Show me the date

Displaying the date to the user required only 3 minor changes

* Add a Date field to the Note object IndexedDB stores
* Add a Date field to the template
* Update the modified code

Adding the date field, is trivial. Adding the date field to the template was pretty simple, it only required adding the following `aside`

{% highlight html %}
<aside class="pack-end">
  <p> </p>
  <p class="note-date"></p>
</aside>
{% endhighlight %}

In case you're curious, the CSS rules that style this structure come from `lists.css`. Then the following snippets of code where added throughout the code base

{% highlight javascript %}
function addNoteToList(note) {
	// ...
    noteListItem.querySelector('.note-date').innerHTML = note.date;
	// ...
}

// form == object that represents the new note <form>
function saveNote(form) {
// ...
var newNote = new Note(form.getTitle(), form.getContent(), form.getDate());
// ...
}
{% endhighlight %}

Surprisingly, that is all the spots that needed to be changed. My code turned out to be more modular than I anticipated :)

## Demo

Try the [demo](/demos/23/) and explore the [source](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/22).
