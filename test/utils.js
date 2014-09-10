module.exports = {

    verifyDefaultTemplateList: function (chai, files, resolve) {
        chai.expect(files.length).to.be.equal(3);
        chai.expect(files[0]).to.be.equal('app/app.json');
        chai.expect(files[1]).to.be.equal('app/application.js');
        chai.expect(files[2]).to.be.equal('components/hello/views/index.hbs');
    }

};