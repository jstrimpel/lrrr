var utils = require('../utils');
var resolver = require('../resolver/index');

module.exports = function (resourceType, resourceName, options, template, destName, dest, callback) {
    resolver.getTemplatePath(template, function (err, templatePath) {
        if (err) {
            return callback(err, null);
        }

        resolver.getResourceFiles(resourceType, resourceName, templatePath, options, function (err, files) {
            if (err) {
                return callback(err, null);
            }

            var destPath = resolver.getDestPath(resourceType, dest, destName, (resourceName || resolver.getResourceName(files[0], resourceType)));
            utils.copy(resourceType, templatePath, files, destPath, function (err, success) {
                if (err) {
                    return callback(err, null);
                }

                callback(null, success);
            });
        });
    });
};