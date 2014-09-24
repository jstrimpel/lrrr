var resource = require('./resource');
var template = require('./template/file');

var internal = {

    // resourceName, options, template, destName, dest, callback
    component: resource,

    // resourceName, options, template, destName, dest, callback
    model: resource,

    // resourceName, options, template, destName, dest, callback
    collection: resource,

    // template, callback
    template: template

};

module.exports = function (resourceType, resourceName, template, destName, dest, options, callback) {
    var method = internal[resourceType];
    if (!method) {
        return callback('lrrr: \'' + type + '\' is not a lrrr \'add\' command resource.', null);
    }

    if (resourceType === 'template') {
        method(template, callback);
    } else {
        method(resourceType, resourceName, options, template, destName, dest, callback);
    }
};