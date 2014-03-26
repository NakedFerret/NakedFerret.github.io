---
layout: post
title:  "A Quick Intro to Firefox OS for Devs"
date:   2014-01-31 11:39:00
permalink: /blog/2/
---

This post will give an overview of Firefox OS. The audience are developers of mobile applications.

## [WebAPI](https://developer.mozilla.org/en-US/docs/WebAPI)

The most interesting part of the OS to a developer is the API. The APIs provided by Firefox OS are officially called `WebAPI`. They control access to the device hardware. The APIs are drafter by Mozilla, implemented in the current version of Firefox OS, and then submitted to the W3C in an effort to create standards. 

## WebAPI Security Levels

`WebAPI` is divided into 3 security levels.

* `Default`
* `Privileged`
* `Certified`

Any application can access default the `Default` security level. The `Privileged` security level can be accessed by packaged applications that are signed by the Firefox OS Marketplace. `Certified` APIs can only be accessed by Mozilla and it's partners. APIs in these levels are reserved for system applications ( e.g. the ones installed by the phone manufacturer or carrier ).

## Hosted vs Packaged

An application can be `Hosted` or `Packaged`. Hosted applications are loaded from a server and packaged applications are distributed in an archive. The advantages of a hosted application is that it is easier to update the application because only the files on the web server need to be modified. Packages applications obviously have the advantage that they work when the phone has no Internet connection. They also have the advantage of accessing "Privileged" APIs.

## [Gaia](https://developer.mozilla.org/en-US/Firefox_OS/Platform/Gaia)

`Gaia` is the user interface for Firefox OS. It created using only HTML/CSS/Javascript and interfaces using the `WebAPI`. As such, it can be easily moved to other devices, operating systems, and web browsers. This design feature is what allows the simulator to work with the Firefox browser.

`Gaia` also offers a micro-framework called [Gaia Building Blocks](http://buildingfirefoxos.com/building-blocks). The frameworks offers some basic UI widgets and CSS transitions. They are simple to use and only required adding importing CSS and Javascript files into a project.


