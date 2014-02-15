---
layout: post
title:  "WebAPI: Contact"
date:   2014-02-14 12:00:00
permalink: /blog/11/
---

In this post we will be exploring the [Contact API](https://developer.mozilla.org/en-US/docs/WebAPI/Contacts). 

## Creating a Contact

The code to create a contact differs between Firefox OS v1.2 and v1.3

{% highlight javascript %}
var contactData = {
  givenName: ["John"],
  familyName: ["Doe"]
}

// V1.2
var person = new mozContact();
person.init(contactData);

// V1.3
var person = new mozContact(contactData);

// Platform independent code
var person = new mozContact(contactData);
if( "init" in person ){
	person.init(contactData);
}
{% endhighlight %}

Once the contact is created, it must be saved. The save() method returns a DOMRequest object. We can listen for success or errors by passing callbacks.

{% highlight javascript %}
var saveRequest = navigator.mozContacts.save(person);

saveRequest.onsuccess = function() {
	console.log("Contact Saved");
}

saveRequest.onerror = function(err) {
	console.error(err);
}
{% endhighlight %}

## Searching for Contacts

When searching the contacts, we can specify filter and sort options.

The filter options include

* `filterBy`: An array of strings of all the fields to filter by
* `filterValue`: the value to match against
* `filterOp`: The filter comparison operator. Can be `equals`, `startsWith`, `contains`, and `match` (used for telephone numbers)
* `filterLimit`: the number of contacts to retrieve

And the sort options are

* `sortBy`: A string of the field to sort by. Only `giveName` and `familyName` are supported
* `sortOrder`: A string of the order. Can be `descending` or `ascending`

The two methods to search for contacts are

* `mozContacts.find()`: find a specific list of contacts
* `mozContacts.getAll()`: retrive all contacts

The `find()` method returns a [DomRequest](https://developer.mozilla.org/en-US/docs/Web/API/DOMRequest) object and can be used as follows

{% highlight javascript %}
var options = {
  filterValue : "John",
  filterBy    : ["givenName","name","nickName"],
  filterOp    : "contains",
  filterLimit : 1,
  sortBy      : "familyName"
  sortOrder   : "ascending"
}

var search = navigator.mozContacts.find(options);

search.onsuccess = function() {
  if (search.result.length === 1) {
    var person = search.result[0];
	var firstName = person.givenName[0];
	var lastName = person.familyName[0];
    console.log("Found:" + firstName + " " + lastName);
  } else {
    console.log("Sorry, there is no such contact.")
  }
}

search.onerror = function() {
  console.error("Search failed");
}
{% endhighlight %}

The `getAll()` method is slightly different because if uses a [DomCursor](https://developer.mozilla.org/en-US/docs/Web/API/DOMCursor) instead of a DomRequest to callback the results.

{% highlight javascript %}
var options = {
	sortBy: "familyName",
	sortOrder: "descending"
}
	
var allContacts = navigator.mozContacts.getAll(options);

allContacts.onsuccess = function(event) {
  var cursor = event.target;
  if (cursor.result) {
	var firstName = cursor.result.givenName[0];
	var lastName = cursor.result.familyName[0];
    console.log("Found: " + firstName + " " + lastName);
    cursor.continue(); 
  } else {
    console.log("No more contacts");
  }
}

allContacts.onerror = function() {
  console.warn("Something went terribly wrong! :(");
}
{% endhighlight %}

The `continue()` method will call `onsuccess` or `onerror` again with the next contact in the result list.

## Updating and Deleting Contact

A contact can be updated by changing its properties and calling `mozContacts.save()`. Similarly, a contact can be deleted by calling `mozContacts.remove()`.

## Seeing it in action

> *Note:* there is currently a permissions error with the demo, I'm trying to fix it and will update this post in the future

[Try the demo](/demos/10/) (although it can only be tested in the simulator) and/or check out the [source code](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/10).
