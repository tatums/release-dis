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
exports.getBucketListing = function () {
  var params = {
    Bucket: 'comment-card-launcher',
  };

  return new Promise(function (resolve, reject){
    s3.listObjects(params, function (err, data) {
      if (err) return reject(err);
      else resolve(data.Contents);
    });
  });
}

var uploadFn = function (item, cb) {
  var params = {
    ACL: 'private',
    Bucket: 'comment-card-launcher',
    ContentType: mime.lookup(item.path),
    Key: item.version + item.path.replace(/dist/, ''),
    Body: fs.readFileSync(item.path)
  };
  s3.upload(params, function(err, data) {
    console.log(data);
    cb(false);
  });
}

exports.publish = function (version) {
  var items = glob.sync("dist/**/*").map(function(f) { return {version: version, path: f} } )
  return new Promise(function (resolve, reject) {
    async.map(items, uploadFn, function (err, results){
      resolve(results);
    });
  });
}

exports.buildPage = function (files){
  var output = Mustache.render(template, {files: files});
  var params = {
    ACL: 'private',
    ContentType: "text/html",
    Bucket: 'comment-card-launcher',
    Key: 'index.html',
    Body: output
  };
  s3.upload(params, function(err, data) {
    console.log(data);
  });
}
