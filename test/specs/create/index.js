var chai = require('chai');
var create = require('../../../src/create/index');
var path = require('path');
var fse = require('fs-extra');
var glob = require('glob');
var dest = 'test' + path.sep + 'tmp';

// resourceType, resourceName, template, destName, dest, options, callback
describe('create', function () {

    before(function (done) {
        // remove default template dir to ensure that create command actually
        // copied the files
        fse.remove(path.resolve(dest), function (err) {
            if (err) {
                throw err;
            }

            expected = 0;
            completed = 0;
            done();
        });
    });

    it('should create an application', function (done) {
        create('app', null, null, null, dest, null, function (err, result) {
            glob(dest + path.sep + '**/*.*', null, function (err, files) {
                if (err) {
                    throw err;
                }

                files = files.map(function (file) {
                    return file.replace('test' + path.sep + 'tmp' + path.sep, '');
                });
                chai.expect(files.length).to.be.equal(3);
                chai.expect(files[0]).to.be.equal('app/app.json');
                chai.expect(files[1]).to.be.equal('app/application.js');
                chai.expect(files[2]).to.be.equal('components/hello/views/index.hbs');
                done();
            });
        });
    });

});