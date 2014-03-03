---
layout: post
title:  "Submitting a Firefox OS bug"
date:   2014-02-20 12:00:00
permalink: /blog/15/
---

This post documents my experience submitting a bug report to the Firefox OS project. The bug resides [here](https://bugzilla.mozilla.org/show_bug.cgi?id=975241). Hopefully it's not a duplicate (I searched for a while), and hopefully it will benefit the project in the long run.

## Stumbling on a bug

I found the bug while messing around with the [Contact API](https://developer.mozilla.org/en-US/docs/WebAPI/Contacts). When an application wishes to use the Contact API, the system will present a user with a prompt. The user can choose to deny or allow the application access to the API. The prompt looks like the one below.

![A prompt with the options "deny" or "allow"](/img/posts/15/prompt.png)

I unchecked the "Remember my choice" option, pressed "Deny", and nothing happened. Not the gravest bug, but a bug nonetheless.

## Reproducing

Now, I needed to create discrete steps the Firefox OS developers could take to reproduce the bug. What I described above is pretty good, but it could be more concise and clearer.

First of all, the app that I was testing contained 300 lines of javascript and had some semi complex UI interaction. The developers should not have to search through all of that to find the single line that causes the bug. I created a much smaller application ([source here](https://github.com/NakedFerret/NakedFerret.github.io/tree/master/demos/13)) that the developers could test. 

Then, I created the following steps to reproduce the bug

1. Install the provided app
2. Open provide app
3. Click on the button labeled "Ask for permission"
4. Uncheck "Remember Choice"
5. Click "Deny"

Which is more concise and much clearer than the paragraph I had before. I was ready to submit the bug report. 

## Submitting

Mozilla uses their own [bug management system](https://bugzilla.mozilla.org/), called Bugzilla. Submitting a bug is relatively simple, and the system gives you suggestions for other bugs that might be duplicates. Of course, the suggestions are naive and I took the time to search for similar bugs using any other keyword I could think of.

The system asks the three main questions any bug report should answer

* What did you do?
* What happened?
* What should have happened?

The system then takes the answers to these questions and automatically formats the report. It also accepts attachments and provides a link to [documentation](https://developer.mozilla.org/en-US/docs/Mozilla/QA/Bug_writing_guidelines) on how to write bug reports. The process was relatively painless and simple.

## What's next?

Well, the bug will get marked as either a `duplicate` or `new`, which means that the bug is confirmed by a developer. Should the bug get confirmed, the developer will mark the severity of the bug, i.e. put on the backlog or fixed before the release, etc.

If the developers deem the bug an easy fix, they will assign a mentor. Mentored bugs are a great opportunity for community members to get involved in the project. I believe this system creates a really strong welcoming atmosphere. There's a nice little website called [Bugs Ahoy!](http://www.joshmatthews.net/bugsahoy/) that contains a list of mentored bugs.

## What could have been done better?

The biggest concern in my mind is that the bug could have already been fixed in one of the latest developmental snapshots. I did not get a chance to test the bug in a development release of Firefox OS (for numerous reasons). 

