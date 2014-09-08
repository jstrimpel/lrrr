#!/usr/bin/env node

var program = require('commander');
var template = require('lrr-template');
var fs = require('fs');
var meta = JSON.parse(fs.syncReadFile('package.json'));
var lrrr = require('../src/index.js');

program
    .version(meta.version);