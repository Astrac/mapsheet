# Mapsheet

An handy tool to visualize and edit geo-referenced data in a google spreadsheet.

## Installation

Some requirements to get started with development:

* [NodeJS](http://http://nodejs.org/) with [npm](https://npmjs.org/) package manager
* [Yeoman](http://yeoman.io/)

After installing node and yeoman you can clone the repository and run the commands:

    npm install
    bower install

Now to run the embedded server with livereload:

    grunt server

**Please note** that the API key used in the repository will only work if the
application is served at the URL http://127.0.0.1:9999

## What's working:

* Login with google account
* Retrieval of worksheets for the logged in user (use the top bar to view the
open worksheet interface)

Next things coming:

* Select cell intervals in the spreadsheet
* Visualise data from selected cells on a map
* Update spreadsheet by map interaction

We need badly:

* A decent design!
