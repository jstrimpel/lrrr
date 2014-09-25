var chai = require('chai');
var add = require('../../../src/add/index');
var path = require('path');
var fse = require('fs-extra');
var glob = require('glob');
var dest = 'test' + path.sep + 'tmp';
var utils = require('../../utils');


// resourceType, resourceName, template, destName, dest, options, callback
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
        var expected = 4;
        var count = 0;

        function onDone () {
            count++;
            if (expected === count) {
                done();
            }
        }

        add('component', null, null, 'foo', 'test/tmp', null, function (err, result) {
            var pattern = dest + path.sep + 'components' + path.sep + 'foo' + path.sep + '**/*.*';
            chai.expect(err).to.be.null;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(1);
                chai.expect(files[0]).to.be.equal('test/tmp/components/foo/views/index.hbs');
                onDone();
            });
        });

        add('component', null, null, 'bar', 'test/tmp', { view: true, controller: true }, function (err, result) {
            var pattern = dest + path.sep + 'components' + path.sep + 'bar' + path.sep + '**/*.*';

            chai.expect(err).to.be.null;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(3);
                chai.expect(files[0]).to.be.equal('test/tmp/components/bar/controller.js');
                chai.expect(files[1]).to.be.equal('test/tmp/components/bar/views/index.hbs');
                chai.expect(files[2]).to.be.equal('test/tmp/components/bar/views/index.js');
                onDone();
            });
        });

        add('component', 'hello', null, 'baz', 'test/tmp', null, function (err, result) {
            var pattern = dest + path.sep + 'components' + path.sep + 'baz' + path.sep + '**/*.*';
            chai.expect(err).to.be.null;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(1);
                chai.expect(files[0]).to.be.equal('test/tmp/components/baz/views/index.hbs');
                onDone();
            });
        });

        add('component', 'hello', null, 'foobar', 'test/tmp', { view: true, controller: true }, function (err, result) {
            var pattern = dest + path.sep + 'components' + path.sep + 'foobar' + path.sep + '**/*.*';

            chai.expect(err).to.be.null;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(3);
                chai.expect(files[0]).to.be.equal('test/tmp/components/foobar/controller.js');
                chai.expect(files[1]).to.be.equal('test/tmp/components/foobar/views/index.hbs');
                chai.expect(files[2]).to.be.equal('test/tmp/components/foobar/views/index.js');
                onDone();
            });
        });
    });

    it('should add a model', function (done) {
        var expected = 4;
        var count = 0;

        function onDone () {
            count++;
            if (expected === count) {
                done();
            }
        }

        add('model', null, null, 'foo', 'test/tmp', null, function (err, result) {
            var pattern = dest + path.sep + 'models' + path.sep + 'foo' + path.sep + '**/*.*';

            chai.expect(err).to.be.null;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(1);
                chai.expect(files[0]).to.be.equal('test/tmp/models/foo/model.js');
                onDone();
            });
        });

        add('model', null, null, 'bar', 'test/tmp', { syncher: true }, function (err, result) {
            var pattern = dest + path.sep + 'models' + path.sep + 'bar' + path.sep + '**/*.*';

            chai.expect(err).to.be.null;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(2);
                chai.expect(files[0]).to.be.equal('test/tmp/models/bar/model.js');
                chai.expect(files[1]).to.be.equal('test/tmp/models/bar/server/syncher.js');
                onDone();
            });
        });

        add('model', 'model', null, 'baz', 'test/tmp', null, function (err, result) {
            var pattern = dest + path.sep + 'models' + path.sep + 'baz' + path.sep + '**/*.*';

            chai.expect(err).to.be.null;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(1);
                chai.expect(files[0]).to.be.equal('test/tmp/models/baz/model.js');
                onDone();
            });
        });

        add('model', 'model', null, 'foobar', 'test/tmp', { syncher: true }, function (err, result) {
            var pattern = dest + path.sep + 'models' + path.sep + 'foobar' + path.sep + '**/*.*';

            chai.expect(err).to.be.null;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(2);
                chai.expect(files[0]).to.be.equal('test/tmp/models/foobar/model.js');
                chai.expect(files[1]).to.be.equal('test/tmp/models/foobar/server/syncher.js');
                onDone();
            });
        });
    });

    it('should add a collection', function (done) {
        var expected = 4;
        var count = 0;

        function onDone () {
            count++;
            if (expected === count) {
                done();
            }
        }

        add('collection', null, null, 'foo', 'test/tmp', null, function (err, result) {
            var pattern = dest + path.sep + 'models' + path.sep + 'foo' + path.sep + '**/*.*';

            chai.expect(err).to.be.null;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(1);
                chai.expect(files[0]).to.be.equal('test/tmp/models/foo/collection.js');
                onDone();
            });
        });

        add('collection', null, null, 'bar', 'test/tmp', { syncher: true }, function (err, result) {
            var pattern = dest + path.sep + 'models' + path.sep + 'bar' + path.sep + '**/*.*';

            chai.expect(err).to.be.null;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(2);
                chai.expect(files[0]).to.be.equal('test/tmp/models/bar/collection.js');
                chai.expect(files[1]).to.be.equal('test/tmp/models/bar/server/syncher.js');
                onDone();
            });
        });

        add('collection', 'collection', null, 'baz', 'test/tmp', null, function (err, result) {
            var pattern = dest + path.sep + 'models' + path.sep + 'baz' + path.sep + '**/*.*';

            chai.expect(err).to.be.null;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(1);
                chai.expect(files[0]).to.be.equal('test/tmp/models/baz/collection.js');
                onDone();
            });
        });

        add('collection', 'collection', null, 'foobar', 'test/tmp', { syncher: true }, function (err, result) {
            var pattern = dest + path.sep + 'models' + path.sep + 'foobar' + path.sep + '**/*.*';

            chai.expect(err).to.be.null;
            glob(pattern, null, function (err, files) {
                chai.expect(files.length).to.be.equal(2);
                chai.expect(files[0]).to.be.equal('test/tmp/models/foobar/collection.js');
                chai.expect(files[1]).to.be.equal('test/tmp/models/foobar/server/syncher.js');
                onDone();
            });
        });

    });

});