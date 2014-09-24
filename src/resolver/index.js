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
    },

    getResourceFile: function (resource, resourceType, resourcePath, callback) {
        var resourceFileNames = {
            view: 'views/index.js',
            controller: 'controller.js',
            syncher: 'server/syncher.js'
        };
        var resolvedResourcePath = path.normalize(resourcePath + path.sep + resourceFileNames[resource]);

        fs.exists(resolvedResourcePath, function (exists) {
            if (exists) {
                return callback(null, resolvedResourcePath);
            }

            var defaultTemplatePath = path.normalize(utils.getDefaultTemplatePath() + path.sep + 'template');
            resolvedResourcePath = path.normalize(defaultTemplatePath + path.sep +
                utils.getResourceTypeDirName(resourceType) + path.sep +
                resourceType === 'component' ? 'hello' : resourceType +
                path.sep + resourceFileNames[resource]);

            return callback(null, resolvedResourcePath);
        });
    },

    getOptionalFiles: function (resourceType, resourcePath, options, callback) {
        var resolved = 0;
        var expected = Object.keys(options).length;
        var self = this;
        var files = [];

        if (!expected) {
            return callback(null, files);
        }

        for (var k in options) {
            (function (k) {
                self.getResourceFile(k, resourceType, resourcePath, function (err, file) {
                    if (err) {
                        return callback(err, null);
                    }

                    files.push(file);
                    resolved++;

                    if (resolved === expected) {
                        callback(null, files);
                    }
                });
            })(k);
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

    getResourcePath: function (file, resourceType) {
        var resourceTypeDir = utils.getResourceTypeDirName(resourceType);
        var i = -1;

        file = file.split(path.sep);
        i = file.indexOf(resourceTypeDir);
        // +2 because first element is empty & we need the resource name
        return file.slice(0, (i + 2)).join(path.sep);
    },

    getResourceName: function (file, resourceType) {
        var resourceTypeDir = utils.getResourceTypeDirName(resourceType);
        var relativeFilePath = file.substr((file.indexOf(resourceTypeDir) + resourceTypeDir.length + 1));
        return relativeFilePath.split(path.sep).shift();
    },

    getResourceFiles: function (resourceType, resourceName, templateSrcPath, options, callback) {
        var templatePath = path.normalize(templateSrcPath + path.sep + 'template');
        var self = this;

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

                    var resourcePath = self.getResourcePath(files[0], resourceType);
                    internal.getOptionalFiles(resourceType, resourcePath, options, function (err, optFiles) {
                        if (err) {
                            return callback(err, null);
                        }

                        callback(null, files.concat(optFiles));
                    });
                });
            });
        });
    }

};