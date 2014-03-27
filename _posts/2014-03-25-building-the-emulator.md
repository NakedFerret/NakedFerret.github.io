---
layout: post
title:  "Building the Emulator"
date:   2014-03-27 12:00:00
permalink: /blog/30/
---


In this post I will talk about my experience with building the Firefox OS emulator. It's a simple process but the documentation is spread out over a couple of pages in the MDN.

## Getting the code

The Firefox OS project is based on the Android project and is spread out over many Github repositories. The following commands fetch the code from the servers. 

	git clone git://github.com/mozilla-b2g/B2G.git
	cd B2G
	./config.sh emulator // Starts fetching code

The whole project is about 19 GB. 

## Building

Building requires the correct libraries to be installed in the system. A list can be found [here](https://developer.mozilla.org/en-US/Firefox_OS/Firefox_OS_build_prerequisites#64_bit_requirement_installation).

Also, it's important to install the required 32 bit libraries. For a 64-bit debian based system, run the following commands.

	sudo dpkg --add-architecture i386
	sudo apt-get update

Here are a couple of libraries that I also needed to install to complete the build

* libdbus-glib-1-2
* libgtk2.0-0

I also needed to create the following symlinks

	sudo ln -s /usr/lib/i386-linux-gnu/libX11.so.6 /usr/lib/i386-linux-gnu/libX11.so
    sudo ln -s /usr/lib/i386-linux-gnu/libGL.so.1 /usr/lib/i386-linux-gnu/libGL.so

## Transferring the emulator

I built the emulator in a VPS. I wanted to use the emulator locally however. After a lot of trial and error, I found the relevant files.

* .config
* load-config.sh
* run-emulator.sh
* /out/host/linux-x86/bin/
  * ddms
  * emulator
  * emulator-arm
  * mksdcard
* /out/host/linux-x86/lib/
* prebuilts/qemu-kernel/arm/kernel-qemu-armv7 
* out/target/product/generic/
  * hardware-qemu.ini
  * ramdisk.img
  * system.img
  * userdata.img
  * sdcard.img  // optional

You can probably shrink this list down a bit more, but as it stands, it's only about a quarter of a gig without `sdcard.img`. The `sdcard.img` does not have to get copied because it is created by the `run-emulator` script and the `mksdcard` program.

## Using the emulator

![A screenshot of the emulator lockscreen](/img/posts/30/emulator_lockscreen.png)

The emulator works much like the simulator except that it does not have as many bells and whistles and it is dog slow. The `home` key maps to the home button on the device and `F7` maps to the lock button on the device.


	
