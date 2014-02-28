---
layout: post
title:  "IndexedDB Caveat"
date:   2014-02-27 12:00:00
permalink: /blog/20/
---

This post will explain a caveat of the IndexedDB api that I have encountered and my work around. 

## The Caveat

[Part 1](/blog/17/) of the IndexedDB posts explains that it's possible to store objects using a `keyPath` and `autoIncrement`. The documentation states that the key will be stored in `object[keyPath]` if it doesn't exists already. This is not true. Examine the following code

{% highlight javascript %}
// open a transaction and access the object store
var objStore = ...; // object store has keyPath and autoIncrement
// obj = object with keyPath undefined
var obj = ...;

var request = objStore.add(obj);

request.onsuccess = function(event) {
  console.log(obj.keyPath);
};
{% endhighlight %}

This will add an object and print the value of the objects `keyPath`. When running the code, it prints `undefined`. This is against what the documentation states, but there is an easy work around. It is this utility function.

{% highlight javascript %}
function addObject(objectStore, object) {
  var request = objectStore.add(object);

  request.onsuccess = function(event) {
	var keyPath = event.target.source.keyPath;
	object[keyPath] = this.result;
  };
}
{% endhighlight %}

The function encapsulates the scope of the object, and updates the keyPath value with the key. The keyPath value is stored in `event.target.source.keyPath`, and the new key is the `result`. With this function, the code changes only slighty but works as expected.

{% highlight javascript %}
// open a transaction and access the object store
var objStore = ...; // object store has keyPath and autoIncrement
// obj = object with keyPath undefined
var obj = ...;

addObject(objStore, obj);
{% endhighlight %}

After the code is run and the result is received, the object will be updated with the correct key. They only drawback to this workaround is that it limits the users from being able to execute code on the `request.onsuccess` call back. The function could be modified to receive an optional callback as a paremeter to remedy this.

## Demo

The demo of the code using this functionality is [here](/demos/18/). It behaves the same way but the code is a little clearer and more straighforward. [Source Code](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/18)
