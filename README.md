Before you can do anything with this repository, you should close it (pretty obvious, indeed). 
However, some further instructions ...

Prerequisites
===============
You will need recent versions of 

* [Node.js](https://nodejs.org) for the task runner and protractor itself (I've only tested against >=4, and thus adjusted the engine restriction accordingly)
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
The E2E tests currently only aim at Firefox (as of 2015-11-17), which will be extended later on. To run them, just execute `gulp e2e:firefox`. Something like the following should appear on the command line, indicating that everything worked fine:
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