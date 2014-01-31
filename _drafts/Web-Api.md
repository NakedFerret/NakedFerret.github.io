---
layout: post
title:  "Firefox OS: Web Apis"
date:   2014-01-31 11:39:00
---

This post will give an overview of the Firefox OS [Web API](https://wiki.mozilla.org/WebAPI). The WebAPI provides access to the phone hardware. Keep in mind the limitations of the Firefox OS simulator when planning on testing the Firefox OS applications.

The simulator does not support the following APIs

* Telephony
* WebSMS
* WebBluetooh
* Ambient Light
* Proximity
* Network Information
* navigator.onLine and offline events
* Vibration

You can find more information about the limitations of the simulator [on this page](https://developer.mozilla.org/en-US/docs/Tools/Firefox_OS_Simulator#Unsupported_APIs).

### Security

The Web API is divided into 3 security levels

* Default 
* Priviledged
* Certified

Some API that we can explore are

* Screen Orientation
* Geolocation 
* TCP Socket 
* Device Storage 
* Contacts 
* Open WebApps
* Battery Status 
* Alarm 
* Browser
* Web Activities
* Push Notifications
* WebFM
* FileHandle
* WebPayment
* IndexedDB
* Archive



