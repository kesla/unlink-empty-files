var fs = require('fs')
  , path = require('path')

  , after = require('after')
    // include all files
  , defaultFilter = function () { return true }

module.exports = function (dir, filter, callback) {
  if (!callback) {
    callback = filter
    filter = defaultFilter
  }

  fs.readdir(dir, function (err, files) {
    if (err)
      return callback(err)

    files = files.filter(filter)

    var done = after(files.length, callback)

    files.forEach(function (file) {
      file = path.join(dir, file)
      fs.stat(
          file
        , function (err, stat) {
            if (!stat.isFile() || stat.size > 0)
              done()
            else
              fs.unlink(file, done)
          }
      )
    })
  })
}