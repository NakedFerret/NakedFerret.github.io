---
layout: post
title:  "WebAPI: IndexedDB Part2"
date:   2014-02-25 12:00:00
permalink: /blog/17/
---

In this post, we will cover how to add, get, update, and delete records from [IndexedDB](https://developer.mozilla.org/en-US/docs/IndexedDB).

## Transactions

All of these operations are done through the respective methods in the object store interface. The only way to access an object store is through transactions.

IndexedDB is a transactional database, so any changes to the database are passed through a transaction context. Transactions take a list of object stores affected by the transaction and a mode. The available modes are

* `readonly` : only allows the user can only read from the object stores
* `readwrite` : the user may read, update, and delete objects from the stores
* `versionchange` : allows the user to change the object stores in the database

There are specific call backs when a transactions completes or when it encounters errors. They are `oncomplete` and `onerror`, respectively.

## Adding

To add, simply start a transaction in `readwrite` mode and call the `add()` method on the object store.

{% highlight javascript %}
var objstrName = ...;

var transaction = db.transaction([objstrName], "readwrite");
var objStr = transaction.objectStore(objstrName);

var obj = ...;
var addRequest = objStr.add(obj);
addRequest.onsuccess = function () {
  // Individual object added
}
addRequest.onerror = function() {
  // Individual object NOT added
}

// Optionally add other objects

transaction.oncomplete = function(event) {
  // All objects stored
};
transaction.onerror = function(event) {
  // No objects stored
};
{% endhighlight %}

## Get

When getting an object, the transaction can be opened in `readonly` mode if no changes to the object are intended. The `get()` is responsible for retrieving the objects and takes the key of the desired object as a parameter. The object will be returned as a result to the `onsuccess` function provided. Instead of throwing an error, the result will be undefined if the object could not be found.

{% highlight javascript %}
var objstrName = ...;

var transaction = db.transaction([objstrName], "readonly");
var objStr = transaction.objectStore(objstrName);

var objKey = ...;
objStr.get(objKey).onsuccess = function(event) {
  if(event.target.result !== undefined)  {
    // Object found
  } else {
    // Object not found
  }
};
{% endhighlight %}

## Update

Updating objects is accomplished through the `put()` method. If the object being updated is not using the `keyPath` strategy, the key must be supplied. The transaction must be used in `readwrite` mode.

{% highlight javascript %}
var objstrName = ...;

var transaction = db.transaction([objstrName], "readwrite");
var objStr = transaction.objectStore(objstrName);

var obj = ...;
var updateRequest = objStr.put(obj);
// If not using the keyPath strategy, pass a key
var obj = ...;
var objKey = ..;
var updateRequest = objStr.put(obj, objKey);

updateRequest.onsuccess = function () {
  // Individual object added
}
updateRequest.onerror = function() {
  // Individual object NOT added
}

// Optionally update other objects

transaction.oncomplete = function(event) {
  // All objects updated
};
transaction.onerror = function(event) {
  // No objects updated
};
{% endhighlight %}

## Delete

Deleting objects is accomplished using the `delete()` command. It accepts a key for the desired object to release. The transaction must be openend in `readwrite` mode.

{% highlight javascript %}
var objstrName = ...;

var transaction = db.transaction([objstrName], "readwrite");
var objStr = transaction.objectStore(objstrName);

var objKey = ...;
var deleteRequest = objStr.delete(objKey);
deleteRequest.onsuccess = function() {
  // Individual object deleted
};
deleteRequest.onerror = function() {
  // Individual delete object NOT deleted
};

// Optionally delete other objects

transaction.oncomplete = function() {
  // All objects deleted
}
transaction.onerror = function() {
  // No objects deleted
}
{% endhighlight %}

## Demo

The demo stores the following object, called `Person`

{% highlight javascript %}
function Person(name, id) {
  this.name = name;
  this.id = id;
}
{% endhighlight %}

The object store holding all the `Person` objects uses the `keyPath` strategy. [Try it here (FXOS only)](/demos/16/) and the source is [here](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/16).
