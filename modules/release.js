var fs        = require('fs');
var AWS       = require('aws-sdk');
var Mustache  = require('mustache');
var async     = require('async');
var mime      = require('mime');

var config        = require(__dirname + '/config.js');
var releaseFiles  = require(__dirname + '/release_files.js');

var customTemplate = fs.readFileSync(config.get('release_template'), 'utf-8')
var template = customTemplate || fs.readFileSync(__dirname + '/template.html','utf8');

AWS.config.update({
  accessKeyId: config.get('aws_access_key_id'),
  secretAccessKey: config.get('aws_secret_access_key'),
  region: config.get('region')
});


var s3 = new AWS.S3(
  {
    params: {
      Bucket: config.get('bucket')
    }
  }
);


var uploadFn = function (item, cb) {
  var params = {
    ACL: 'public-read',
    ContentType: mime.lookup(item.path),
    Key: 'releases/' + item.version + '/' + item.path,
    Body: fs.readFileSync(item.path)
  };
  s3.upload(params, function(err, data) {
    cb();
  });
}


exports.publish = function (version) {
  var path = config.get('release_files');
  var files = releaseFiles.get(version, path);
  return new Promise(function (resolve, reject) {
    async.map(files, uploadFn, function (err, results){
      resolve(results);
    });
  });
}

exports.getBucketListing = function () {
  return new Promise(function (resolve, reject){
    s3.listObjects({}, function (err, data) {
      if (err) return reject(err);
      else resolve(data.Contents);
    });
  });
}


exports.buildPage = function (files){
  var releases = releaseFiles.go(files);
  var output = Mustache.render(template, {releases: releases});
  var params = {
    ACL: 'public-read',
    ContentType: "text/html",
    Key: 'index.html',
    Body: output
  };
  s3.upload(params, function(err, data) {
    if (err) throw err;
  });
}
