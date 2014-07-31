var fs = require('fs')
  , path = require('path')

  , after = require('after')

module.exports = function (dir, callback) {
  fs.readdir(dir, function (err, files) {
    if (err)
      return callback(err)

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