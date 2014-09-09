var utils = require('./utils');
var resolve = require('./resolve');

var methods = {
    app: function (template, dest) {
        resolve.get(template, function (err, templatePath) {
            resolve.list(templatePath, dest, function (err, files) {
                utils.copy(files, dest, function (err) {

                });
            });
        });
    }
};

// lrrr create app [dest]
module.exports = function (type, template, dest, callback) {
    if (!methods[type]) {
        return callback('Lrrr says, Action is not defined!');
    }
};