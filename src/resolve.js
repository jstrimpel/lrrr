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

        this.getResourceFiles(appPath, def, function (err, files) {
            if (err) {
                return callback(err, null);
            }

            callback(null, files);
        });
    },

    getCmpModelFiles: function (templatePath, resourceType, def, callback) {
        var resourcesPath = path.normalize(templatePath + path.sep + resourceType);

        if (!def) {
            this.getResourceFiles(resourcesPath, null, function (err, files) {
                if (err) {
                    return callback(err, null);
                }

                callback(null, files);
            });
        } else {
            var count = 0;
            var listed = 0;
            var self = this;
            var retVal = [];

            for (var k in def) {
                (function (k) {
                    var resourcePath = path.normalize(resourcesPath + path.sep + k);

                    count++;
                    self.getResourceFiles(resourcePath, def[k], function (err, files) {
                        if (err) {
                            return callback(err, null);
                        }

                        loaded++;
                        retVal = retVal.concat(files);
                        if (count === loaded) {
                            callback(null, retVal);
                        }
                    });
                })(k);
            }
        }
    },

    appList: function (conf, templatePath, callback) {
        var self = this;
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
                callback(null, files);
            }
        }

        if (!conf) {
            return dir.files(appPath, function (err, files) {
                if (err) {
                    return callback(err, null);
                }

                callback(files);
            });
        }

        conf = conf.app;
        this.getAppFiles(templatePath, conf.app, onDone);
        this.getCmpModelFiles(templatePath, 'components', conf.components, onDone);
        this.getCmpModelFiles(templatePath, 'models', conf.models, onDone);
    }

};

module.exports = {

    // this will be where the pulling down of a remote resource will occur
    get: function (template, callback) {
        template = template || 'default';
        callback(null, path.resolve(templates + path.sep + template));
    },

    list: function (type, templatePath) {
        var templateConfPath = path.resolve(templatePath + path.sep + 'lrrr.json');
        var method = methods[type + 'List'];

        if (!method) {
            return callback('Lrrr says, action does not exist!', null);
        }

        fs.exists(templateConfPath, function (err, exists) {
            if (!exists) {
                return method(null, templatePath, function (files) {

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

                method(conf, templatePath, function (files) {

                });
            });
        });
    }

};