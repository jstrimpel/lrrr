var chai = require('chai');
var create = require('../../src/create');
var path = require('path');
var fse = require('fs-extra');
var glob = require('glob');
var dest = 'test' + path.sep + 'tmp';
var utils = require('../utils');


describe('create', function () {

    before(function (done) {
        // remove default template dir to ensure that create command actually
        // copied the files
        fse.remove(path.resolve(dest), function (err) {
            if (err) {
                throw err;
            }

            done();
        });
    });

    it('should create an application', function (done) {
        create('app', null, dest, function (err, result) {
            glob(dest + path.sep + '**/*.*', null, function (err, files) {
                if (err) {
                    throw err;
                }

                files = files.map(function (file) {
                    return file.replace('test' + path.sep + 'tmp' + path.sep, '');
                });
                utils.verifyDefaultTemplateList(chai, files);
                done();
            });
        });
    });

});