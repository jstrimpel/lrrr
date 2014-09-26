var resolver = require('../resolver/index');
var fse = require('fs-extra');
var path = require('path');

module.exports = function (resourceType, resourceName, template, destName, dest, options, callback) {
    resolver.getTemplatePath(template, function (err, templatePath) {
        if (err) {
            return callback(err, null);
        }

        resolver.getResourceFiles(resourceType, resourceName, templatePath, options, function (err, files) {
            if (err) {
                return callback(err, null);
            }

            var len = files.length;
            var copied = 0;
            var self = this;
            var destPath = path.resolve(dest || '.');

            files.forEach(function (file) {
                var relativePath = file.replace(path.normalize(templatePath + path.sep + 'template' + path.sep), '');
                var destFilePath = path.normalize(destPath + path.sep + relativePath);

                fse.ensureDir(path.dirname(destFilePath), function (err) {
                    if (err) {
                        return callback(err, null);
                    }

                    fse.copy(file, destFilePath, function (err) {
                        if (err) {
                            return callback(err, null);
                        }
                        copied++;
                        if (copied === len) {
                            callback(null, 'lrrr: \'' + destPath + '\' app created.');
                        }
                    });
                });
            });
        });
    });
};