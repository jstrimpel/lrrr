var path = require('path');
var fs = require('fs');
var protocolRegex = /^(?:(file|http(s?)|git)\:\/\/)?/;

try {
    var LRRR_PATH = require.resolve('lrrr').split(path.sep).slice(0, -2).join(path.sep);
} catch (e) {
    var LRRR_PATH = path.resolve('.');
}

module.exports = {

    getProtocol: function (templateResource) {
        var protocol = protocolRegex.exec(templateResource);
        return protocol[1] || this.protocols.file;
    },

    getTemplateName: function (templateResource) {
        var protocol = protocolRegex.exec(templateResource);
        if (!protocol[0]) {
            return templateResource;
        }

        return templateResource.substr(protocol[0].length);
    },

    LRRR_PATH: path.resolve('../'),

    protocols: {
        file: 'file',
        git: 'git',
        http: 'http',
        https: 'https'
    }

};