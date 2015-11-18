This repository is part of a tutorial regarding Protractor and Angular.js 1.x which I am currently working on. It will cover a rather huge amount of basics and (technical) details, aiming at newbies. However, it is still incomplete and thus not published. If you feel a little bit adventurous, you might as well jump in and see what happens.
  
Anyway, before you can do anything with this repository, you should clone or download it (pretty obvious, indeed). 
However, some further instructions ...

Prerequisites
===============
You will need recent versions of 

* [Node.js](https://nodejs.org) for the task runner and protractor itself (>=4 is required for protractor w.r.t. the [docs](https://github.com/angular/protractor/commit/1a8bb5357ccc254ce9453972fee8521efbeb0a4d) - see the "Breaking Changes" section)
* [Java](http://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html) for the Selenium Webdriver part of protractor (I'd suggest to go with JDK/JRE8 - please note that both the Oracle and OpenJDK/JRE versions should work properly)

installed.

Usage
=====
Pretty simple things.

Install dependencies
--------------------
* Run the `install_deps.sh` to install the required command line tools globally. `sudo` might be required to do so. If you don't trust the file, or are running windows, you might also just execute the content, like `npm install -g jspm gulp`.
* Use `npm install` and `jspm install` to install the dependencies for running the tasks and for the frontend part.

Running
-------
To run the example server, use `gulp serve`. This should open a new tab in your default browser on [http://localhost:3333](http://localhost:3333) - if that does not happen automatically, just move there manually. You should see an extremely simple page displaying `angular-protractor-test-app-thing`.
The E2E tests may currently (as of 2015-11-18) target:

* Firefox using `gulp e2e:firefox`
* Chrome using `gulp e2e:chrome`

Something like the following should appear on the command line, indicating that everything worked fine:
'''

    Starting selenium standalone server...
    [launcher] Running 1 instances of WebDriver
    Selenium standalone server started at http://10.2.1.65:53732/wd/hub
    Spec started
    Started
    
      A simple initial testcase
        ✓ should display the home`s root element correctly
    .
    Executed 1 of 1 spec SUCCESS in 2 secs.
    1 spec, 0 failures
    
TODO
====
* Further technology description (why, how it works, etc.)
* Extend to be able to use more browsers.
* Some less simple examples.