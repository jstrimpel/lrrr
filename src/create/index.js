var app = require('./app');

module.exports = function (resourceType, resourceName, template, destName, dest, options, callback) {
    app(resourceType, resourceName, template, destName, dest, null, callback);
};