var utils = require('../utils');
var fse = require('fs-extra');
var path = require('path');
var glob = require('glob');
var fs = require('fs');
var protocolRegex = /^(?:(file|http(s?)|git)\:\/\/)?/;

try {
    var LRRR_PATH = require.resolve('lrrr').split(path.sep).slice(0, -2).join(path.sep);
} catch (e) {
    var LRRR_PATH = path.resolve('.');
}

var internal = {

    getTemplateConfig: function (templatePath, callback) {
        var templateConfPath = path.normalize(templatePath + path.sep + 'lrrr.json');
        fs.exists(templateConfPath, function (exists) {
            if (!exists) {
                callback(null, {});
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

                callback(null, conf);
            });

        });
    },

    findDef: function (resourceName, resourceType, conf) {
        var resourceTypeDir = utils.getResourceTypeDirName(resourceType);
        if (conf.create && conf.create.app &&
            conf.create.app[resourceTypeDir] && conf.create.app[resourceTypeDir][resourceName]) {
            return conf.create.app[resourceTypeDir][resourceName];
        }
        if (conf.add && conf.add[resourceType] && conf.add[resourceType][resourceName]) {
            return conf.add[resourceType][resourceName];
        }

        // TODO: warn that def does not exist
        return {
            files: '*'
        };
    },

    getResourceDef: function (resourceType, conf) {
        var def = conf.defaults.add[resourceType].def ? internal.findDef(conf.defaults.add[resourceType].def, resourceType, conf) :
            conf.defaults.add[resourceType];

        return def || {
            files: '*'
        };
    },

    getResourceGlob: function (conf, resourceType, templatePath, callback) {
        if (conf.defaults && conf.defaults.add && conf.defaults.add[resourceType]) {
            var def = this.getResourceDef(resourceType, conf);
            var files = def.files.map(function (pattern) {
                return path.normalize(templatePath + path.sep + utils.getResourceTypeDirName(resourceType) +
                (conf.defaults.add[resourceType].def ? (path.sep + conf.defaults.add[resourceType].def) : '') +
                path.sep + pattern);
            });

            callback(null, files);
        } else {
            utils.getResourceGlob(conf, resourceType, templatePath, function (err, pattern) {
                if (err) {
                    return callback(err, null);
                }

                callback(null, pattern);
            });
        }
    },

    list: function (pattern, callback) {
        if (Array.isArray(pattern)) {
            var len = pattern.length;
            var count = 0;
            var retVal = [];
            pattern.forEach(function (matcher) {
                glob(matcher, function (err, files) {
                    if (err) {
                        callback(err, null);
                    }

                    count++;
                    retVal = retVal.concat(files);
                    if (count === len) {
                        callback(null, retVal);
                    }
                });
            });
        } else {
            glob(pattern, function (err, files) {
                if (err) {
                    return callback(err, null);
                }

                callback(null, files);
            });
        }
    }

};

module.exports = {

    getTemplatePath: function (templateName, callback) {
        if (!templateName) {
            return callback(null, utils.getDefaultTemplatePath());
        }

        utils.getTemplatePath(templateName, function (err, templatePath) {
            if (err) {
                return callback(err, null);
            }

            callback(null, templatePath);
        });
    },

    getDestPath: function (resourceType, dest, destName, resourceName) {
        return path.resolve(dest + path.sep + utils.getResourceTypeDirName(resourceType) + path.sep + (destName || resourceName));
    },

    getResourceName: function (file, resourceType) {
        var resourceTypeDir = utils.getResourceTypeDirName(resourceType);
        var relativeFilePath = file.substr((file.indexOf(resourceTypeDir) + resourceTypeDir.length + 1));
        return relativeFilePath.split(path.sep).shift();
    },

    getResourceFiles: function (resourceType, resourceName, templateSrcPath, callback) {
        var templatePath = path.normalize(templateSrcPath + path.sep + 'template');
        // default component from default template

        internal.getTemplateConfig(templateSrcPath, function (err, conf) {
            if (err) {
                return callback(err, null);
            }

            internal.getResourceGlob(conf, resourceType, templatePath, function (err, pattern) {
                if (err) {
                    return callback(err, null);
                }

                internal.list(pattern, function (err, files) {
                    if (err) {
                        return callback(err, null);
                    }

                    callback(null, files);
                });
            });
        });
    }

};