var chai = require('chai');
var resolve = require('../../src/resolve');
var path = require('path');
var utils = require('../utils');

try {
    var lrrrPath = require.resolve('lrrr').split(path.sep).slice(0, -2).join(path.sep);
} catch (e) {
    var lrrrPath = path.resolve('.');
}

describe('resolve', function () {

    it('should get a template path', function (done) {
        resolve.get(null, function (err, templatePath) {
            chai.expect(templatePath).to.be.equal(path.normalize(lrrrPath + path.sep + 'templates/default'));
            done();
        });
    });

    it('should list template files', function (done) {
        resolve.list('app', path.normalize(lrrrPath + path.sep + 'templates/default'), function (err, files) {
            if (err) {
                throw err;
            }

            files = files.map(function (file) {
                return file.replace(path.normalize(lrrrPath + path.sep + 'templates/default/template') + path.sep, '');
            });
            utils.verifyDefaultTemplateList(chai, files);
            done();
        });
    });

});