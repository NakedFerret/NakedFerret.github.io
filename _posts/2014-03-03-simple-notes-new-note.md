---
layout: post
title:  "Simple Notes: New Note"
date:   2014-03-03 12:00:00
permalink: /blog/22/
---

Over the next couple of days I will be creating an application that will store notes for the user. I will not spend more than 4 days working on it, so my top priority will be basic functionality and polish/features will follow afterwards.

Today I will tackle the New Note screen, as it seems like the most difficult part of the application.

## Database Structure

The database model used to store notes is simply

{% highlight javascript %}
function Note(title, content) {
    this.id
    this.title = title || "";
    this.content = content || "";
}
{% endhighlight %}

I chose to use a `keyPath` and `autoIncrement` key strategy with the model. Notes are stored in the `notes` object store. The `notes` object store does not have any indexes but it might in the future to keep the `title`'s unique or implement search functionality.

## The UI

The `New Note` interface consists simply of

* Single-line text input for the `title`
* Multi-line text input for the `content`
* A `Discard` button that cancels the task of creating a Note
* A `Save` button that saves the Note

The finished product looks like this

![The UI described above](/img/posts/22/new_note_ui.png)

In order to achieve this look I the `headers` and `input area` [building blocks](http://buildingfirefoxos.com/building-blocks/headers.html). To import these blocks, I simply copied

* `style/headers/`
* `style/headers.css`
* `style/input_areas/`
* `style/input_areas.css`

from the sample BuildingBlocks application found [here (zip)](https://github.com/buildingfirefoxos/Building-Blocks/archive/gh-pages.zip)

The structure for the header is simply

{% highlight html %}
<header>
  <menu type="toolbar">
    <button>Discard</button>
    <button>Save</button>
  </menu>
  <h1>New Note</h1>
</header>
{% endhighlight %}

and the structure for the text input is

{% highlight html %}
<div role="main">
  <form>
  <p>
    <input type="text" placeholder="Note Title">
  </p>
  <p>
    <textarea placeholder="Note Content" ></textarea>
  </p>
  </form>
</div>
{% endhighlight %}

Additionally, the UI alerts the user when a note has been successfully saved by showing a `status`. This is done using the `status.js` javascript module from the BuildingBlocks sample application. This node requires `transitions.css` file from the application also.

## Demo

Once again, this application can be tested in a web browser [here](/demos/20/) and the source code can be found [here](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/20)


