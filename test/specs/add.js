var chai = require('chai');
var add = require('../../src/add');
var path = require('path');
var fse = require('fs-extra');
var glob = require('glob');
var dest = 'test' + path.sep + 'tmp';
var utils = require('../utils');


describe('add', function () {

    beforeEach(function (done) {
        // remove default template dir to ensure that create command actually
        // copied the files
        fse.remove(path.resolve(dest), function (err) {
            if (err) {
                throw err;
            }

            done();
        });
    });

    it('should add a component', function (done) {
        var expected = 2;
        var count = 0;

        function onDone () {
            count++;
            if (expected === count) {
                done();
            }
        }

        add('component', null, 'foo', 'test/tmp', null, function (err, result) {
            var pattern = dest + path.sep + 'components' + path.sep + 'foo' + path.sep + '**/*.*';

            chai.expect(result).to.be.true;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(1);
                chai.expect(files[0]).to.be.equal('test/tmp/components/foo/views/index.hbs');
                onDone();
            });
        });

        add('component', null, 'bar', 'test/tmp', { view: true, controller: true }, function (err, result) {
            var pattern = dest + path.sep + 'components' + path.sep + 'bar' + path.sep + '**/*.*';

            chai.expect(result).to.be.true;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(3);
                chai.expect(files[0]).to.be.equal('test/tmp/components/bar/controller.js');
                chai.expect(files[1]).to.be.equal('test/tmp/components/bar/views/index.hbs');
                chai.expect(files[2]).to.be.equal('test/tmp/components/bar/views/index.js');
                onDone();
            });
        });
    });

    it('should add a model', function (done) {
        var expected = 2;
        var count = 0;

        function onDone () {
            count++;
            if (expected === count) {
                done();
            }
        }

        add('model', null, 'foo', 'test/tmp', null, function (err, result) {
            var pattern = dest + path.sep + 'models' + path.sep + 'foo' + path.sep + '**/*.*';

            chai.expect(result).to.be.true;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(1);
                chai.expect(files[0]).to.be.equal('test/tmp/models/foo/model.js');
                onDone();
            });
        });

        add('model', null, 'bar', 'test/tmp', { syncher: true }, function (err, result) {
            var pattern = dest + path.sep + 'models' + path.sep + 'bar' + path.sep + '**/*.*';

            chai.expect(result).to.be.true;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(2);
                chai.expect(files[0]).to.be.equal('test/tmp/models/bar/model.js');
                chai.expect(files[1]).to.be.equal('test/tmp/models/bar/server/syncher.js');
                onDone();
            });
        });
    });

    it('should add a collection', function (done) {
        var expected = 2;
        var count = 0;

        function onDone () {
            count++;
            if (expected === count) {
                done();
            }
        }

        add('collection', null, 'foo', 'test/tmp', null, function (err, result) {
            var pattern = dest + path.sep + 'models' + path.sep + 'foo' + path.sep + '**/*.*';

            chai.expect(result).to.be.true;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(1);
                chai.expect(files[0]).to.be.equal('test/tmp/models/foo/collection.js');
                onDone();
            });
        });

        add('collection', null, 'bar', 'test/tmp', { syncher: true }, function (err, result) {
            var pattern = dest + path.sep + 'models' + path.sep + 'bar' + path.sep + '**/*.*';

            chai.expect(result).to.be.true;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(2);
                chai.expect(files[0]).to.be.equal('test/tmp/models/bar/collection.js');
                chai.expect(files[1]).to.be.equal('test/tmp/models/bar/server/syncher.js');
                onDone();
            });
        });
    });

});