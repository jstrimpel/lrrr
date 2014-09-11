#!/usr/bin/env node

var path = require('path');
var lrrrPath = require.resolve('lrrr').split(path.sep).slice(0, -2).join(path.sep);
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var meta = JSON.parse(fs.readFileSync(path.normalize(lrrrPath + path.sep + 'package.json')));
var lrrr = require('../src/index.js');
var help = require('./help');
var getArgs = require('./args');

if (argv._.length && !argv.help) {
    var command = lrrr[argv._[0]];

    if (argv._[0] === 'help') {
        help(argv._[1]);
    } else if (!command) {
        console.log('lrrr: \'' + argv._[0] + '\' is not a lrrr command. See \'lrrr --help\'.');
    } else {
        command.apply(this, getArgs(argv, function (err, success) {
            if (err) {
                console.log(err + ' See \'lrrr --help\'.');
            }

            console.log(success);
        }));
    }
} else {
    if (argv.v) {
        console.log('v' + meta.version);
    } else if (argv.help) {
        help();
    } else {
        console.log('lrrr: Not a lrrr command. See \'lrrr --help\'.');
    }
}