---
layout: post
title:  "ADB access to remote server from local usb"
date:   2014-10-06 23:51:57
permalink: /blog/32/
---

I have a VPS server where I'm compiling CyanogenMod and some android kernels. To compile CyanogenMod we need to pull some vendor specific "prebuilts" i.e. binaries. Connecting the server to the device connected to my laptop is actually quite trivial.

First we put adb in TCP/IP mode

    adb tcpip 8001


Then, let's forward the that same port to the laptop

    adb forward tcp:8001 tcp:8001


Connect to the phone

    adb connect localhost:8001


Then finally, we forward the local port to the server

    ssh -R localhost:8001:localhost:8001 <server_host>

This command simply does a reverse tunnel. Back on the server we simply connect to the port on localhost again

    adb connect localhost:8001

And viola! Pretty simple :D
