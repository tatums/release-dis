var nconf = require('nconf');
var glob      = require('glob');
var configFile = glob.sync('**/release.config.js', {nodir: true})[0]

nconf.argv()
   .env()
   .file({file: configFile });

nconf.defaults({
    'base_dir':  '**/*'
  });

exports.get = function (key) {
  return nconf.get(key);
}
