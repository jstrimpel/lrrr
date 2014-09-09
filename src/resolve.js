var dir = require('node-dir');
var glob = require('glob');
var fse = require('fs-extra');
var fs = require('fs');
var path = require('path');
var templates = path.resolve('../templates');

var methods = {

    getResourceFiles: function (resourcePath, def, callback) {
        var pattern = def && def.files ? def.files : '*';

        if (Array.isArray(pattern)) {
            var len = pattern.length;
            var count = 0;
            var retVal = [];
            pattern.forEach(function (matcher) {
                glob(path.normalize(resourcePath + path.sep + pattern), function (err, files) {
                    count++;
                    retVal = retVal.concat(files);
                    if (count === len) {
                        callback(null, retVal);
                    }
                });
            });
        } else {
            glob(path.normalize(resourcePath + path.sep + pattern), function (err, files) {
                if (err) {
                    return callback(err, null);
                }

                callback(null, files);
            });
        }
    },

    getAppFiles: function (templatePath, def, callback) {
        var appPath = path.normalize(templatePath + path.sep + 'app');

        methods.getResourceFiles(appPath, def, function (err, files) {
            if (err) {
                return callback(err, null);
            }

            callback(null, files);
        });
    },

    getCmpModelFiles: function (templatePath, resourceType, def, callback) {
        var resourcesPath = path.normalize(templatePath + path.sep + resourceType);

        if (!def) {
            return callback(null, []);
        } else {
            var count = 0;
            var listed = 0;
            var self = methods;
            var retVal = [];

            for (var k in def) {
                (function (k) {
                    var resourcePath = path.normalize(resourcesPath + path.sep + k);

                    count++;
                    self.getResourceFiles(resourcePath, def[k], function (err, files) {
                        if (err) {
                            return callback(err, null);
                        }

                        listed++;
                        retVal = retVal.concat(files);
                        if (count === listed) {
                            callback(null, retVal);
                        }
                    });
                })(k);
            }
        }
    },

    appList: function (conf, templatePath, callback) {
        var self = methods;
        var count = 0;
        var list = [];
        var appPath = path.normalize(templatePath + path.sep + 'app');

        function onDone(err, files) {
            if (err) {
                return callback(err, null);
            }
            count++;
            list = list.concat(files);
            if (count === 3) {
                callback(null, list);
            }
        }

        if (!conf) {
            return dir.files(templatePath, function (err, files) {
                if (err) {
                    return callback(err, null);
                }

                callback(null, files);
            });
        }

        conf = conf.app;
        methods.getAppFiles(templatePath, conf.app, onDone);
        methods.getCmpModelFiles(templatePath, 'components', conf.components, onDone);
        methods.getCmpModelFiles(templatePath, 'models', conf.models, onDone);
    }

};

module.exports = {

    // this will be where the pulling down of a remote resource will occur
    get: function (template, callback) {
        template = template || 'default';
        callback(null, path.resolve(templates + path.sep + template));
    },

    // TODO: if lrr.json does not exist return bulk copy instructions
    list: function (type, templatePath, callback) {
        var templateConfPath = path.normalize(templatePath + path.sep + 'lrrr.json');
        var method = methods[type + 'List'];

        templatePath = path.normalize(templatePath + path.sep + 'template');

        if (!method) {
            return callback('Lrrr says, action does not exist!', null);
        }


        fs.exists(templateConfPath, function (exists) {
            if (!exists) {
                return method(null, templatePath, function (err, files) {
                    if (err) {
                        return callback(err, null);
                    }

                    callback(null, files);
                });
            }

            fs.readFile(templateConfPath, function (err, conf) {
                if (err) {
                    return callback(err, null);
                }

                try {
                    conf = JSON.parse(conf);
                } catch (err) {
                    return callback('Lrrr says, Error parsing template JSON!', null);
                }

                method(conf, templatePath, function (err, files) {
                    if (err) {
                        return callback(err, null);
                    }

                    callback(null, files);
                });
            });
        });
    }

};