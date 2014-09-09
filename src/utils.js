var fse = require('fs-extra');
var path = require('path');

module.exports = {

    copy: function (templateBasePath, files, dest, callback) {
        var len = files.length;
        var copied = 0;

        files.forEach(function (file) {
            var relativeFilePath = file.replace(templateBasePath + path.sep, '');
            var destFilePath = path.normalize(path.resolve(dest) + path.sep + relativeFilePath);
            var fileDestDir = path.dirname(destFilePath);

            fse.mkdirs(fileDestDir, function (err) {
                if (err) {
                    return callback(err, null);
                }

                fse.copy(file, destFilePath, function (err) {
                    if (err) {
                        return callback(err, null);
                    }
                    copied++;
                    if (copied === len) {
                        callback(null, true);
                    }
                });
            });
        });
    }

};