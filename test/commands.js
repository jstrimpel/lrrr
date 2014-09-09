var lrrr = require('../src/index');

lrrr.create('app', null, 'tmp', function (err, result) {
    console.log('ACTION RESULT: ' + result);
});