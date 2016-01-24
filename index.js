#! /usr/bin/env node
var colors = require('colors');
var argv = require('yargs')
.demand(['version'])
.argv;

var git = require(__dirname + '/modules/git.js');
var release = require(__dirname + '/modules/release.js');


// 1. git tag and push
git.tag(argv.version);

// 2. upload the release to s3
var promise = release.publish(argv.version);

promise.then(function (publishedFiles) {
  return release.getBucketListing();
}).then(function (files){
  //build and upload the index page
  release.buildPage(files);
  console.log(
    colors.green(argv.version + ' has been released!')
  )
}).catch(function (err){
  console.log(err.name.red, err.message.red);
})

