var nconf = require('nconf');
nconf.argv()
   .env()
   .file({file: 'config/release.json' });

nconf.defaults({
    'base_dir':  '**/*'
  });

exports.get = function (key) {
  return nconf.get(key);
}
