var r = require("../../modules/release_files.js");

describe("get", function(){
  it("does", function(){
    expect(r.get('0.0.0', "spec/support/mock/**/*")).toEqual(
      [
        { version: '0.0.0', path: 'spec/support/mock/foo/bar.js' },
        { version: '0.0.0', path: 'spec/support/mock/test.js' }
      ]
    );
  });
});


describe("get", function(){
  it("does", function(){
    var files = [
      { Key: 'index.html'},
      { Key: '0.0.8/index.js'},
      { Key: '0.0.8/modules/stuff.js'},
      { Key: '0.0.7/index.js'},
      { Key: '0.0.7/modules/foo.js'},
    ]
    expect(r.go(files)).toEqual(
      [
        { version: '0.0.8', files: [ '0.0.8/index.js', '0.0.8/modules/stuff.js', ] },
        { version: '0.0.7', files: [ '0.0.7/index.js', '0.0.7/modules/foo.js', ] }
      ]
    );
  });
});

