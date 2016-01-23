var child_process = require('child_process');
var exec          = child_process.execSync;

exports.tag = function (version) {

  var buffer = exec('git name-rev --name-only HEAD');
  var branch = buffer.toString();

  if (branch !== 'master\n') {
    throw "dude - u gotta be on master";
  }

  exec('git tag -a ' + version + " -m 'release " + version + "'");
  exec("git push origin " + version);

}
