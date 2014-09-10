var chai = require('chai');
var resolve = require('../../src/resolve');
var path = require('path');
var utils = require('../utils');

describe('resolve', function () {

    it('should get a template path', function (done) {
        resolve.get(null, function (err, templatePath) {
            chai.expect(templatePath).to.be.equal(path.resolve('templates/default'));
            done();
        });
    });

    it('should list template files', function (done) {
        resolve.list('app', path.resolve('templates/default'), function (err, files) {
            if (err) {
                throw err;
            }

            files = files.map(function (file) {
                return file.replace(path.resolve('templates/default/template') + path.sep, '');
            });
            utils.verifyDefaultTemplateList(chai, files);
            done();
        });
    });

});