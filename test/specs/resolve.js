var chai = require('chai');
var resolve = require('../../src/resolve');
var path = require('path');
var utils = require('../utils');
var defaultTemplatePath = path.normalize('templates' + path.sep + 'default');

try {
    var lrrrPath = require.resolve('lrrr').split(path.sep).slice(0, -2).join(path.sep);
} catch (e) {
    var lrrrPath = path.resolve('.');
}

describe('resolve', function () {

    it('should get a template path', function (done) {
        resolve.get(null, function (err, templatePath) {
            chai.expect(templatePath).to.be.equal(path.normalize(lrrrPath + path.sep + defaultTemplatePath));
            done();
        });
    });

    it('should list template files', function (done) {
        resolve.list('app', path.normalize(lrrrPath + path.sep + defaultTemplatePath), function (err, files) {
            if (err) {
                throw err;
            }

            files = files.map(function (file) {
                return file.replace(path.normalize(lrrrPath + path.sep + defaultTemplatePath + path.sep + 'template') + path.sep, '');
            });
            utils.verifyDefaultTemplateList(chai, files);
            done();
        });
    });

});