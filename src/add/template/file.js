var path = require('path');
var os = require('os');
var utils = require('./utils');
var file = require('./file');
var fs = require('fs');
var fse = require('fs-extra');

function copyTemplate(src, dest, callback) {
    fse.copy(src, dest, { clobber: true }, function (err) {
        if (err) {
            callback(err, null);
        }

        callback(null, true);
    });
}

module.exports = function (template, callback) {
    var tmp = os.tmpDir();
    var protocol = utils.getProtocol(template);
    var templateName = utils.getTemplateName(template);
    var templatePath = path.resolve(templateName);
    var tmpDestDir = templateName.split(path.sep).pop();
    var tmpDestPath = path.normalize(tmp + path.sep + tmpDestDir);

    fs.exists(templatePath, function (exists) {
        if (!exists) {
            return callback(new Error('lrrr: \'' + templatePath + '\' does not exist.'), null);
        }

        fse.copy(templatePath, tmpDestPath, { clobber: true }, function (err) {
            if (err) {
                return callback(err, null);
            }

            var templateConfPath = path.normalize(tmpDestPath + path.sep + 'lrrr.json');
            fs.exists(templateConfPath, function (exists) {
                var destPath = path.normalize(utils.LRRR_PATH + path.sep + 'templates');
                var conf = {};

                if (exists) {
                    fs.readFile(templateConfPath, function (err, file) {
                        if (err) {
                            return callback(err, null);
                        }

                        try {
                            conf = JSON.parse(file);
                        } catch (e) {
                            return callback(e, null);
                        }

                        var resolvedTemplateName = conf.name || tmpDestDir;
                        destPath = path.normalize(destPath + path.sep + resolvedTemplateName);
                        copyTemplate(tmpDestPath, destPath, function (err) {
                            if (err) {
                                return callback(err, null);
                            }

                            callback(null, 'lrrr: \'' + resolvedTemplateName + '\' added.');
                        });
                    });
                } else {
                    destPath = path.normalize(destPath + path.sep + tmpDestDir);
                    copyTemplate(tmpDestPath, destPath, function (err) {
                        if (err) {
                            return callback(err, null);
                        }

                        callback(null, 'lrrr: \'' + tmpDestDir + '\' added.');
                    });
                }
            });
        });
    });
};