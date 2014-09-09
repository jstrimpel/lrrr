var utils = require('./utils');
var resolve = require('./resolve');
var path = require('path');

var methods = {
    app: function (template, dest, callback) {
        resolve.get(template, function (err, templatePath) {
            resolve.list('app', templatePath, function (err, files) {
                if (err) {
                    return callback(err, false);
                }

                templatePath = path.normalize(templatePath + path.sep + 'template');
                utils.copy(templatePath, files, dest || '.', function (err) {
                    if (err) {
                        return callback(err, false);
                    }
                });
            });
        });
    }
};

// lrrr create app [dest]
module.exports = function (type, template, dest, callback) {
    if (!methods[type]) {
        return callback('Lrrr says, Action is not defined!', null);
    }
    methods[type](template, dest, callback);
};