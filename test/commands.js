var lrrr = require('../src/index');


// #### ADD ####
// resourceType, resourceName, template, destName, dest, options, callback

// component
lrrr.add('component', null, null, null, 'tmp', { view: true, controller: true }, function (err, status) {
    if (err) {
        return console.log(err);
    }

    console.log(status);
});

// model
// lrrr.add('model', null, null, null, 'tmp', { syncher: true }, function (err, status) {
//     if (err) {
//         return console.log(err);
//     }

//     console.log(status);
// });

// collection
// lrrr.add('collection', null, null, null, 'tmp', { syncher: true }, function (err, status) {
//     if (err) {
//         return console.log(err);
//     }

//     console.log(status);
// });

// template
// lrrr.add('template', null, 'file://../../morbo', null, null, null, function (err, status) {
//     if (err) {
//         return console.log(err);
//     }

//     console.log(status);
// });