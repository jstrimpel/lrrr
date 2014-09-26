var chai = require('chai');
var resolver = require('../../../src/resolver/index');
var path = require('path');
var fse = require('fs-extra');
var glob = require('glob');
var dest = 'test' + path.sep + 'tmp';

try {
    var lrrrPath = require.resolve('lrrr').split(path.sep).slice(0, -2).join(path.sep);
} catch (e) {
    var lrrrPath = path.resolve('.');
}

describe('resolver', function () {

    var expected = 0;
    var completed = 0;

    function onDone (done) {
        completed++;
        if (expected === completed) {
            done();
        }
    }

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

    it('should get a template path', function (done) {
        var expectedPath = path.normalize(lrrrPath + path.sep + 'templates' + path.sep + 'default');
        expected = 2;

        // specified path
        resolver.getTemplatePath('default', function (err, templatePath) {
            chai.expect(templatePath).to.be.equal(expectedPath);
            onDone(done);
        });

        // unspecified path
        resolver.getTemplatePath(null, function (err, templatePath) {
            chai.expect(templatePath).to.be.equal(expectedPath);
            onDone(done);
        });

    });

    it('should get a resource destination path', function () {
        var basePath = path.resolve('.' + path.sep + 'test' + path.sep + 'tmp');

        // component
        var expectedPath = path.normalize(basePath + path.sep + 'components' + path.sep + 'foo');
        chai.expect(resolver.getDestPath('component', 'test/tmp', 'foo', null)).to.be.equal(expectedPath);

        expectedPath = path.normalize(basePath + path.sep + 'components' + path.sep + 'foo');
        chai.expect(resolver.getDestPath('component', 'test/tmp', null, 'foo')).to.be.equal(expectedPath);

        // model
        expectedPath = path.normalize(basePath + path.sep + 'models' + path.sep + 'foo');
        chai.expect(resolver.getDestPath('model', 'test/tmp', 'foo', null)).to.be.equal(expectedPath);

        expectedPath = path.normalize(basePath + path.sep + 'models' + path.sep + 'foo');
        chai.expect(resolver.getDestPath('model', 'test/tmp', null, 'foo')).to.be.equal(expectedPath);

        // collection
        expectedPath = path.normalize(basePath + path.sep + 'models' + path.sep + 'foo');
        chai.expect(resolver.getDestPath('collection', 'test/tmp', 'foo', null)).to.be.equal(expectedPath);

        expectedPath = path.normalize(basePath + path.sep + 'models' + path.sep + 'foo');
        chai.expect(resolver.getDestPath('collection', 'test/tmp', null, 'foo')).to.be.equal(expectedPath);
    });

    it('should get a resource path', function () {
        var basePath = path.normalize(lrrrPath + path.sep + 'templates' + path.sep + 'default' + path.sep + 'template');

        // component
        var cmpPath = path.normalize(basePath + path.sep + 'components' + path.sep + 'foo');
        var ctlFilePath = path.normalize(cmpPath + path.sep + 'controller.js');
        var viewFilePath = path.normalize(cmpPath + path.sep + 'views' + path.sep + 'index.js');
        chai.expect(resolver.getResourcePath(ctlFilePath, 'component')).to.be.equal(cmpPath);
        chai.expect(resolver.getResourcePath(viewFilePath, 'component')).to.be.equal(cmpPath);

        // model
        var modelPath = path.normalize(basePath + path.sep + 'models' + path.sep + 'foo');
        var modelFilePath = path.normalize(modelPath + path.sep + 'model.js');
        var syncherFilePath = path.normalize(modelPath + path.sep + 'server' + path.sep + 'syncher.js');
        chai.expect(resolver.getResourcePath(modelFilePath, 'model')).to.be.equal(modelPath);
        chai.expect(resolver.getResourcePath(syncherFilePath, 'model')).to.be.equal(modelPath);

        // collection
        var collectionPath = path.normalize(basePath + path.sep + 'models' + path.sep + 'foo');
        var collectionFilePath = path.normalize(collectionPath + path.sep + 'collection.js');
        var collectionSyncherFilePath = path.normalize(collectionPath + path.sep + 'server' + path.sep + 'syncher.js');
        chai.expect(resolver.getResourcePath(collectionFilePath, 'collection')).to.be.equal(collectionPath);
        chai.expect(resolver.getResourcePath(collectionSyncherFilePath, 'collection')).to.be.equal(collectionPath);
    });

    it('should get a resource name', function () {
        var basePath = path.normalize(lrrrPath + path.sep + 'templates' + path.sep + 'default' + path.sep + 'template');

        // component
        var cmpPath = path.normalize(basePath + path.sep + 'components' + path.sep + 'foo');
        var ctlFilePath = path.normalize(cmpPath + path.sep + 'controller.js');
        var viewFilePath = path.normalize(cmpPath + path.sep + 'views' + path.sep + 'index.js');
        chai.expect(resolver.getResourceName(ctlFilePath, 'component')).to.be.equal('foo');
        chai.expect(resolver.getResourceName(viewFilePath, 'component')).to.be.equal('foo');

        // model
        var modelPath = path.normalize(basePath + path.sep + 'models' + path.sep + 'foo');
        var modelFilePath = path.normalize(modelPath + path.sep + 'model.js');
        var syncherFilePath = path.normalize(modelPath + path.sep + 'server' + path.sep + 'syncher.js');
        chai.expect(resolver.getResourceName(modelFilePath, 'model')).to.be.equal('foo');
        chai.expect(resolver.getResourceName(syncherFilePath, 'model')).to.be.equal('foo');

        // collection
        var collectionPath = path.normalize(basePath + path.sep + 'models' + path.sep + 'foo');
        var collectionFilePath = path.normalize(collectionPath + path.sep + 'collection.js');
        var collectionSyncherFilePath = path.normalize(collectionPath + path.sep + 'server' + path.sep + 'syncher.js');
        chai.expect(resolver.getResourceName(collectionFilePath, 'collection')).to.be.equal('foo');
        chai.expect(resolver.getResourceName(collectionSyncherFilePath, 'collection')).to.be.equal('foo');
    });

    it('should get a resource name', function (done) {
        var templateSrcPath = path.normalize(lrrrPath + path.sep + 'templates' + path.sep + 'default');
        expected = 7;

        resolver.getResourceFiles('component', null, templateSrcPath, null, function (err, files) {
            chai.expect(files.length).to.be.equal(1);
            onDone(done);
        });

        resolver.getResourceFiles('component', null, templateSrcPath, { view: true, controller: true }, function (err, files) {
            chai.expect(files.length).to.be.equal(3);
            onDone(done);
        });

        resolver.getResourceFiles('model', null, templateSrcPath, null, function (err, files) {
            chai.expect(files.length).to.be.equal(1);
            onDone(done);
        });

        resolver.getResourceFiles('model', null, templateSrcPath, { syncher: true }, function (err, files) {
            chai.expect(files.length).to.be.equal(2);
            onDone(done);
        });

        resolver.getResourceFiles('collection', null, templateSrcPath, null, function (err, files) {
            chai.expect(files.length).to.be.equal(1);
            onDone(done);
        });

        resolver.getResourceFiles('collection', null, templateSrcPath, { syncher: true }, function (err, files) {
            chai.expect(files.length).to.be.equal(2);
            onDone(done);
        });

        resolver.getResourceFiles('app', null, templateSrcPath, null, function (err, files) {
            chai.expect(files.length).to.be.equal(3);
            onDone(done);
        });
    });

});