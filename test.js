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

    t.deepEqual(fs.readdirSync(directory).sort(), [ 'bar', 'foo', 'hello' ])
    t.end()
  })
})

test('with filter-function', function (t) {
  var directory = newDirectory()
    , filter = function (filename) {
        // filter all files with a bar-prefix
        return filename.slice(0, 3) === 'bar'
      }

  fs.writeFileSync(directory + '/foo', '')
  fs.writeFileSync(directory + '/bar', '')
  fs.writeFileSync(directory + '/bar2', 'world')

  unlinkEmptyFiles(directory, filter, function (err) {
    if (err)
      return t.end(err)

    t.deepEqual(fs.readdirSync(directory).sort(), [ 'bar2', 'foo' ])
    t.end()
  })

})