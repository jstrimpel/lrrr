var fse = require('fs-extra');
var path = require('path');
var path = require('path');
var fs = require('fs');
var protocolRegex = /^(?:(file|http(s?)|git)\:\/\/)?/;

try {
    var LRRR_PATH = require.resolve('lrrr').split(path.sep).slice(0, -2).join(path.sep);
} catch (e) {
    var LRRR_PATH = path.resolve('.');
}

var internal = {

    getDirs: function (dir, callback) {
        fs.readdir(dir, function (err, files) {
            if (err) {
                return callback(err, null);
            }

            files = files.filter(function (file) {
                return fs.statSync(file).isDirectory();
            });

            callback(null, files);
        });
    }

};

module.exports = {

    // nondeterministic
    // TODO: add error handling for the case where there is not at least one of a resource type
    getResourceGlob: function (conf, resourceType, templatePath, callback) {
        internal.getDirs(path.normalize(templatePath + path.sep + this.getResourceTypeDirName(resourceType)), function (err, dirs) {
            if (err) {
                return callback(err, null);
            }

            callback(null, path.normalize(dirs[0] + path.sep + '*'));
        });
    },

    getProtocol: function (templateResource) {
        var protocol = protocolRegex.exec(templateResource);
        return protocol[1] || this.protocols.file;
    },

    getTemplateName: function (templateResource) {
        var protocol = protocolRegex.exec(templateResource);
        if (!protocol[0]) {
            return templateResource;
        }

        return templateResource.substr(protocol[0].length);
    },

    LRRR_PATH: path.resolve('../'),

    protocols: {
        file: 'file',
        git: 'git',
        http: 'http',
        https: 'https'
    },

    getTemplatePath: function (templateName, callback) {
        var templatePath = LRRR_PATH + path.sep + 'templates' + path.sep + templateName;

        fs.exists(templatePath, function (exists) {
            if (!exists) {
                return callback(new Error('lrrr: \'' + templateName + '\' is not a valid template.'), null);
            }

            callback(null, templatePath);
        });
    },

    getDefaultTemplatePath: function () {
        return path.normalize(LRRR_PATH + path.sep + 'templates' + path.sep + 'default');
    },

    getResourceTypeDirName: function (resourceType) {
        return (resourceType === 'model' || resourceType === 'collection') ? 'models' :
        (resourceType === 'app' ? 'app' : 'components');
    },

    copy: function (resourceType, templateBasePath, files, dest, callback) {
        var len = files.length;
        var copied = 0;
        var self = this;

        function getRelativePath(file, resourceType) {
            var resourceTypeDir = self.getResourceTypeDirName(resourceType);
            var relativeFilePath = file.substr((file.indexOf(resourceTypeDir) + resourceTypeDir.length + 1));
            return relativeFilePath.split(path.sep).slice(1).join(path.sep);
        }

        files.forEach(function (file) {
            var relativeFilePath = getRelativePath(file, resourceType);
            var destFilePath = path.normalize(path.resolve(dest) + path.sep + relativeFilePath);
            var fileDestDir = path.dirname(destFilePath);

            fse.ensureDir(fileDestDir, function (err) {
                if (err) {
                    return callback(err, null);
                }

                fse.copy(file, destFilePath, function (err) {
                    if (err) {
                        return callback(err, null);
                    }
                    copied++;
                    if (copied === len) {
                        callback(null, true);
                    }
                });
            });
        });
    }

};