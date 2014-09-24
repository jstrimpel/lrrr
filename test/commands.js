var lrrr = require('../src/index');

// type, template, dest, callback
// lrrr.create('app', null, 'tmp', function (err, result) {
//     console.log('ACTION RESULT: ' + result);
// });


// resourceType, template, destName, dest, options, callback
// lrrr.add('component', null, 'bar', 'test/tmp', { controller: true }, function (err, result) {
//     console.log('ACTION RESULT: ' + result);
// });

// lrrr.add('collection', null, 'baz', 'test/tmp', { syncher: true }, function (err, result) {
//     console.log('ACTION RESULT: ' + result);
// });

// ADD arguments
// resourceType, resourceName, template, destName, dest, options, callback


// COMPONENT
lrrr.add('component', null, null, null, 'tmp', null, function (err, status) {
    if (err) {
        return console.log(err);
    }

    console.log(status);
});


// TEMPLATE
// lrrr.add('template', null, 'file://../../morbo', null, null, null, function (err, status) {
//     if (err) {
//         return console.log(err);
//     }

//     console.log(status);
// });