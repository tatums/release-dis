var glob      = require('glob');
var fs        = require('fs');
var AWS       = require('aws-sdk');
var Mustache  = require('mustache');
var template  = fs.readFileSync('template.html','utf8');
var async     = require('async');
var mime      = require('mime');

AWS.config.update({
  accessKeyId: process.env.AWS_KEYID,
  secretAccessKey: process.env.AWS_SECRET,
  region: 'us-east-1'
});

var s3 = new AWS.S3();

var git = require('./modules/git.js')
var release = require('./modules/release.js');

exports.release = function (version) {

  // 1. git tag and push
  git.tag(argv.version)

  // 2. upload the release to s3
  var promise = release.publish(argv.version);

  promise.then(function(publishedFiles){
    return release.getBucketListing();
  }).then(function(files){
    //build and upload the index page
    release.buildPage(files);
  })

}

