var fs = require('fs')

  , mkdirp = require('mkdirp')
  , rimraf = require('rimraf')
  , test = require('tape')

  , unlinkEmptyFiles = require('./unlink-empty-files')

  , idx = 0
  , newDirectory = function () {
      idx++
      var directory = __dirname + '/testdir/dir' + idx

      rimraf.sync(directory)
      mkdirp.sync(directory)

      return directory
    }

test('simple', function (t) {
  var directory = newDirectory()

  fs.writeFileSync(directory + '/bar', 'whatever')
  fs.writeFileSync(directory + '/empty1', '')
  fs.writeFileSync(directory + '/foo', 'whatever')
  fs.writeFileSync(directory + '/empty2', '')
  fs.writeFileSync(directory + '/hello', 'whatever')

  unlinkEmptyFiles(directory, function (err) {
    if (err)
      return t.end(err)

    t.deepEqual(fs.readdirSync(directory), [ 'bar', 'foo', 'hello' ])
    t.end()
  })

})