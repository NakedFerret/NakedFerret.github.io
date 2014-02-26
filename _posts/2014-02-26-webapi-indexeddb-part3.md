---
layout: post
title:  "WebAPI: IndexedDB Part3"
date:   2014-02-26 12:00:00
permalink: /blog/19/
---

In this post we will wrap up [IndexedDB](https://developer.mozilla.org/en-US/docs/IndexedDB) by exploring cursors and indexes. Make sure you read [part 1](/blog/17/) and [part 2](/blog/18/).

## Cursors

A cursor allows an app to iterate through all the results of a query in a manner that does not block the main UI thread. Opening a cursor is simple, just call `openCursor()` on an object store. It returns an [IDBRequest](https://developer.mozilla.org/en-US/docs/Web/API/IDBRequest) object. The result of the request will be the cursor. The object retrieved by the cursor is in `cursor.value`. To retrieve the next object call `cursor.continue()` and the function will be called again recursively. The function will be called one last time when there are no more results to the query. A common flow is as follows

{% highlight javascript %}
// open the object store in a transaction
var objStr = ...;

objStr.openCursor().onsuccess = function() {
  var cursor = this.result;
  if(cursor) {
    // retrieved object in cursor.value
	cursor.continue();
  } else {
    // No more object left in the query
  }
}

// handle transaction success, error
{% endhighlight %}

## Range and Direction

It's possible to limit the objects returned by a cursor. You can create an `IDBKeyRange` and pass it as a parameter to the cursor.

* `lowerBound()` : match anything past the provided key. Optionally pass `true` to exclude the given key in the results
* `upperBound()` : match anything up to the provided key. Optionally pass `true` to exclude the given key in the results
* `bound()` : provide two keys to get the results between the two keys. The default includes the keys in the results. To exclude one key but include the other, pass `true` and `false`, respectively. To exclude both keys, pass two `true`'s

Here are a couple of examples to better illustrate the above. The examples assume the object store uses a string value as a key.

{% highlight javascript %}
// Match anything past "Bill", including "Bill"
var lowerBoundKeyRange = IDBKeyRange.lowerBound("Bill");

// Match anything past "Bill", but don't include "Bill"
var lowerBoundOpenKeyRange = IDBKeyRange.lowerBound("Bill", true);

// Match anything up to, but not including, "Donna"
var upperBoundOpenKeyRange = IDBKeyRange.upperBound("Donna", true);

// Match anything between "Bill" and "Donna", but not including "Donna"
var boundKeyRange = IDBKeyRange.bound("Bill", "Donna", false, true);

objStr.openCursor(boundKeyRange).onsuccess = ...;
{% endhighlight %}

## Indexes

Indexes allow the user to search through the object store on properties besides the key. This does not work on object stores that contain values instead of javscript objects. The parameter for creating an index are the name of the index and the name of the property to build the index on. 

{% highlight javascript %}
var openDBRequest = ...;

openDBRequest.onupgradeneeded = function() {
// create the object stores
var objStr = ...;

// create the "name" index on the "firstName" property
objStr.createIndex("name", "firstName");

// Finish setting up db
};
{% endhighlight %}

You can also use indexes to apply constraints on the data. This can be achieved using the `unique` optional parameter.

{% highlight javascript %}
// Users should not have the same email address
// Create an index called "email" on the "email" property of the objects
objStr.createIndex("email", "email", {unique: true});
};
{% endhighlight %}

You can use the indexes through `get()`, simply pass the value of the property you are looking for. `get()` will return the object with the lowest key value. To run through all the matches, you can get a cursor through `openCursor()`

{% highlight javascript %}
// open the object store in a transaction
var index = ...;

// Returns the first result
index.get("Donna").onsuccess = function() {
  var donna = this.result;
}

// Returns all the results
objStr.openCursor().onsuccess = function() {
  var cursor = this.result;
  if(cursor) {
    var obj = cursor.value
	cursor.continue();
  } else {
    // No more object left in the query
  }
}

// handle transaction success, error
{% endhighlight %}

## Demo

The demo does not take advantage of the key ranges, but it creates an index on the name property of the `Person` object. Try the [demo here (FXOS only)](/demos/17/) and find the source [here](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/17).


