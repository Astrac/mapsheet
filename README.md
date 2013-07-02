# Mapsheet

A simple handy tool to visualize geo-referenced data in a google spreadsheet. Mapsheet
is a single page application that resides entirely on the client; it's based on the
[AngularJS](http://angularjs.org/) framework and leverages [Yeoman](http://yeoman.io/)
for scaffolding and tasks automation.

You can see a demo at this [URL](http://mapsheet.astrac.me)

This project is released under the MIT Licence and any contribution is very welcome!

## Installation

### Requirements

Some requirements to get started with development:

* [NodeJS](http://http://nodejs.org/) with [npm](https://npmjs.org/) package manager
* [Yeoman](http://yeoman.io/)
* [PhantomJS](http://phantomjs.org/) - needed for tests, though it is possible to change the configuration and use any browser supported by karma

### Project setup

After installing node and yeoman you can clone the repository and run the commands:

    npm install
    bower install

### Configuration

Copy the app/scripts/config.example.js to app/scripts/config.js and put your
Google OAuth2 Client ID to enable API access.

You can access the API Console using this [URL](https://code.google.com/apis/console).

### Grunt tasks

Now to run the embedded server with livereload:

    grunt server

**Please note** that the API key used in the repository will only work if the
application is served at the URL http://127.0.0.1:9999

Other useful grunt tasks:

* **grunt test** - Single run tests
* **grunt test-watch** - Watch filesystem and run tests on any change
* **grunt build** - Builds a distribution snapshot

## What's working:

* Login with google account
* Retrieval of worksheets for the logged in user (use the top bar to view the
open worksheet interface)
* Retrieval and visualization of data for open worksheets
* Minimum local storage support to cache the "project" configuration
* Map with coordinate tracker
* Visualise data from selected cells on a map

Next things coming:

* Select cell intervals in the spreadsheet
* Update spreadsheet by map interaction
