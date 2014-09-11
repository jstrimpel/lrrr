var utils = require('./utils');
var resolve = require('./resolve');
var path = require('path');
var methods = {

    componentAdd: function (resourceType, options, template, destName, dest, callback) {
        resolve.get(template, function (err, templatePath) {
            if (err) {
                return callback(err, null);
            }

            resolve.getResourceFiles('component', templatePath, options, function (err, files) {
                if (err) {
                    return callback(err, null);
                }

                dest = (dest || '.') + path.sep + 'components' + path.sep + (destName || 'hello');
                templatePath = path.normalize(templatePath + path.sep + 'template' + path.sep + 'components' + path.sep + 'hello');
                utils.copy(templatePath, files, dest, function (err) {
                    if (err) {
                        callback(err, null);
                    }

                    callback(null, true);
                    callback(null, 'lrrr: created a '+ resourceType + ', ' + path.resolve(dest || '.'));
                });
            });
        });
    },

    modelAdd: function (resourceType, options, template, destName, dest, callback) {
        resolve.get(template, function (err, templatePath) {
            if (err) {
                return callback(err, null);
            }
            resolve.getResourceFiles(resourceType, templatePath, options, function (err, files) {
                if (err) {
                    return callback(err, null);
                }

                dest = (dest || '.') + path.sep + 'models' + path.sep + (destName || resourceType);
                templatePath = path.normalize(templatePath + path.sep + 'template' + path.sep + 'models' + path.sep + resourceType);
                utils.copy(templatePath, files, dest, function (err) {
                    if (err) {
                        callback(err, null);
                    }

                    callback(null, 'lrrr: created a '+ resourceType + ', ' + path.resolve(dest || '.'));
                });
            });
        });
    }

};

methods.collectionAdd = methods.modelAdd;

module.exports = function (resourceType, template, destName, dest, options, callback) {
    var method = methods[resourceType + 'Add'];
    if (!method) {
        return callback('lrrr: \'' + type + '\' is not a lrrr \'add\' command resource.', null);
    }

    method(resourceType, options, template, destName, dest, callback);
};