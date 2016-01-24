var glob      = require('glob');

exports.get = function (version, path) {
  return glob.sync(path, {nodir: true}).map(function (file) {
    return { version: version, path: file }
  });
}

function fetch (version, items) {
  var foundItem;
  items.forEach(function(item){
    if (item.version == version) {
      foundItem = item;
    }
  });
  return foundItem
}

exports.go = function (files) {
  var items = [];
  files.map(function(file){
    var version = file.Key.split('/')[0];
    if (version != 'index.html') {
      var item = fetch (version, items);
      if (item != undefined)
        { item.files.push(file); }
      else
        { items.push({version: version, files: [file]}) }
    }
  })
  return items;
}
