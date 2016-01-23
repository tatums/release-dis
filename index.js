#! /usr/bin/env node

var argv = require('yargs')
.demand(['version'])
.argv;

var git = require('./modules/git.js')
var release = require('./modules/release.js');

console.log('1 - tag')
// 1. git tag and push
// git.tag(argv.version)

console.log('2 - publish')
// 2. upload the release to s3
var promise = release.publish(argv.version);

promise.then(function(publishedFiles){
  return release.getBucketListing();
}).then(function(files){
  //build and upload the index page
  release.buildPage(files);
}).catch(function(err){
  console.log(err.name, err.message);
})

