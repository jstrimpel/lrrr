// TODO:
// - need to split template argumnent to extract template name, resource type (e.g., component)
// - getters for paths, e.g., template dir for a template resource, template resource base path,
//   get template resource path (component, model, collection)

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
                glob(path.normalize(resourcePath + path.sep + matcher), function (err, files) {
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

        if (!conf.create) {
            return dir.files(templatePath, function (err, files) {
                if (err) {
                    return callback(err, null);
                }

                callback(null, files);
            });
        }

        conf = conf.create && conf.create.app;
        methods.getAppFiles(templatePath, conf.app, onDone);
        methods.getCmpModelFiles(templatePath, 'components', conf.components, onDone);
        methods.getCmpModelFiles(templatePath, 'models', conf.models, onDone);
    },

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

    filterCmpFiles: function (files, options, conf) {
        return files.filter(function (file) {
            if ((!options || !options.view) && file.indexOf('index.js') !== -1) {
                return false;
            }
            if ((!options || !options.controller) && file.indexOf('controller.js') !== -1) {
                return false;
            }

            return true;
        });
    },

    filterModelCollFiles: function (files, options, conf) {
        return files.filter(function (file) {
            if ((!options || !options.syncher) && file.indexOf('syncher.js') !== -1) {
                return false;
            }

            return true;
        });
    },

    getResourceGlob: function (templatePath, resourceType) {
        switch (resourceType) {
            case 'component':
                return templatePath + path.sep + resourceType + 's' + path.sep + 'hello' +
                    path.sep + '**' + path.sep + '*.*';
            case 'model':
            case 'collection':
                return templatePath + path.sep + 'models' + path.sep + resourceType +
                    path.sep + '**' + path.sep + '*.*';
        }
    },

    findDef: function (resourceName, type, conf) {
        if (conf.create && conf.create.app &&
            conf.create.app.components && conf.create.app.components[resourceName]) {
            return conf.create.app.components[resourceName];
        }
        if (conf.add && conf.add.components && conf.add.components[resourceName]) {
            return conf.add.components[resourceName];
        }

        // TODO: warn that def does not exist
        return [];
    },

    getOptions: function (resourceType, resourcePath, options, callback) {
        var expected = 0;
        var count = 0;
        var retVal = [];

        for (var k in options) {
            var relativeFilePath = methods.getOptionFilePath(k, resourceType);
            var absoluteFilePath = path.normalize(resourcePath + path.sep + relativeFilePath);
            if (fs.existsSync(absoluteFilePath)) {
                retVal.push(absoluteFilePath);
            }
        }

        callback(null, retVal);
    },

    // TODO: make paths cross platform
    getOptionFilePath: function (option, resourceType) {
        switch (option) {
            case 'view':
                return 'views/index.js';
            case 'controller':
               return 'controller.js';
            case 'syncher':
               return resourceType + '/server/syncher.js';
        }
    }

};

module.exports = {

    // TODO: need to define a resolution
    // if -vc are passed and a component does not have ones defined then it should
    // default to the default component parts
    getResourceFiles: function (resourceType, templateSrcPath, options, callback) {
        var templatePath = path.normalize(templateSrcPath + path.sep + 'template');
        // default component from default template
        var pattern = methods.getResourceGlob(templatePath, resourceType);


        methods.getTemplateConfig(templateSrcPath, function (err, conf) {
            if (err) {
                return callback(err, null);
            }

            if (conf.defaults && conf.defaults.add && conf.defaults.add[resourceType]) {
                var def = conf.defaults.add[resourceType].def ? methods.findDef(conf.defaults.add[resourceType].def, resourceType, conf) :
                    conf.defaults.add[resourceType];
                var resourcePath = resourceType === 'component' ?
                    path.normalize(templateSrcPath + path.sep + 'template' + path.sep + 'components' + path.sep + 'hello') :
                    path.normalize(templateSrcPath + path.sep + 'template' + path.sep + 'models');

                return methods.getResourceFiles(resourcePath, def, function (err, files) {
                    if (err) {
                        return callback(err, null);
                    }

                    if (options) {
                        methods.getOptions(resourceType, resourcePath, options, function (err, optFiles) {
                            files = files.concat(optFiles);
                            callback(null, files);
                        });
                    } else {
                        callback(null, files);
                    }
                });
            }

            glob(pattern, function (err, files) {
                if (err) {
                    return callback(err, null);
                }

                switch (resourceType) {
                    case 'component':
                        callback(null, methods.filterCmpFiles(files, options, conf));
                        break;
                    case 'model':
                    case 'collection':
                        callback(null, methods.filterModelCollFiles(files, options, conf));
                        break;
                    default:
                        callback('Lrrr says, Resource type does not exist!', null);
                        break;

                }
            });

        });
    },

    // this will be where the pulling down of a remote resource will occur
    get: function (template, callback) {
        try {
            var lrrrPath = require.resolve('lrrr').split(path.sep).slice(0, -2).join(path.sep);
        } catch (e) {
            var lrrrPath = path.resolve('.');
        }

        template = template || 'default';
        callback(null, path.normalize(lrrrPath + path.sep + 'templates' + path.sep + template));
    },

    // TODO: if lrr.json does not exist return bulk copy instructions
    list: function (type, templateSrcPath, callback) {
        var method = methods[type + 'List'];
        var templatePath = path.normalize(templateSrcPath + path.sep + 'template');

        if (!method) {
            return callback('Lrrr says, action does not exist!', null);
        }

        methods.getTemplateConfig(templateSrcPath, function (err, conf) {
            if (err) {
                return callback(err, null);
            }

            method(conf, templatePath, function (err, files) {
                if (err) {
                    return callback(err, null);
                }

                callback(null, files);
            });
        });
    }

};