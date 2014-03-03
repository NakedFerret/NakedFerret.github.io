---
layout: post
title:  "WebAPI: IndexedDB Part1"
date:   2014-02-24 12:00:00
permalink: /blog/17/
---

In this post, I will introduce [IndexedDB](https://developer.mozilla.org/en-US/docs/IndexedDB). As the name suggests, it is a lightweight database. It's not a relational database however, it's a key-value database. It maps keys to javascript objects (or primitives). The API is a little more difficult to grasp than the other APIs offered by Firefox OS so this post is broken up into two parts. The first part will talk about how to create the structure of the database, and how to open and close the database.

## The Object Store

Instead of containing tables, IndexedDB databases contain object stores. The object stores provide the structure to the database. Object stores map keys to objects, and allow indexes to be built on the property of an object. Indexes will be covered in the next section.

The keys can be supplied by using `keyPath`, `autoIncrement`, both, or neither. `keyPath` specifies which value in the object is the key. `autoIncrement` automatically creates the key when an item is stored. Here are the implications of using each key strategy.

* `keyPath` : javascript objects only (no primitives). objects must have property with same name as keyPath.
* `autoIncrement` : any value (objects included). Keys are auto generated. Keys can optionally be specified
* `both` : javascript objects only (no primitives). Key is generated and saved to property whose name matches the keyPath. If a value exists already, that will be the key.
* `neither` : any value (objects included). Key must be supplied when adding new value

These key strategies apply to each individual object storage. This allows some flexibility in designing the structure of a database because it's possible to have a database that takes advantage of all these strategies.

## Creating the object stores

The object stores are created using `createObjectStore()`. The first parameter is the name of the object store and the second parameters is an object that specifies which strategy to use. The following example assumes we have a database opened and ready to be modified. We will cover how to accomplish this in the next section.

{% highlight javascript %}
// db == open database

// Uses the keyPath strategy
// Keys is stored in object.taskId
db.createObjectStore("toDoList", { keyPath: "taskId" });

// Uses the autoIncrement strategy
// Key is automatically created
db.createObjectStore("toDoList", { autoIncrement: true });

// Uses the "both" strategy
// Key is automatically created and stored in object.taskId.
// If object.taskId has a value, that will be used instead of being created
db.createObjectStore("toDoList", { autoIncrement: true, keyPath: "taskId" });

// Uses the "neither" strategy
// Keys have to be given when adding objects to the store
db.createObjectStore("toDoList");
{% endhighlight %}

## Handling the Database

Once the structure is designed, the database can be created. There is no explicit create method in IndexedDB. Instead, the database is created when it is first opened. To open the database, simply call `indexedDB.open()`

{% highlight javascript %}
var request = window.indexedDB.open("MyTestDatabase", 3);
{% endhighlight %}

The first argument is the name of the database and the second argument is the database version. When the database version changes, the system will call `onupgradeneeded()`. The system will also call `onupgradeneeded()` when the database needs to be created.

{% highlight javascript %}
request.onupgradeneeded = function(event) { 
  var db = event.target.result;
  // Create an object store for this database
};
{% endhighlight %}

It's important to note that any structure changes to the database can only happen in `onupgradeneeded()`

Opening the database returns a `DOMRequest` object. We can grab the database connection from the result or access any errors in the following manner

{% highlight javascript %}
var db;

request.onerror = function(event) {
  console.error(this.errorCode);
};
request.onsuccess = function(event) {
  db = this.result;
};
{% endhighlight %}

Closing the database is not required, but it is good practice. Use `db.close()`

## Demo

The demo for this post focuses only on opening and closing the database. It creates an object store but does not add, remove, or get any items from it. All of that will be covered in the next post. The demo is [here (may work on modern browsers)](/demos/15/) and, of course, [the source](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/15).
)
