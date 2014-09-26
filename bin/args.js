module.exports = function (args, callback) {

    function getOptions(resourceType, args) {
        var options = {};

        if (resourceType === 'component') {
            if (args.v) {
                options.view = true;
            }
            if (args.c) {
                options.controller = true;
            }

            if (Object.keys(options).length) {
                return options;
            }
        } else if (args.s) {
            return { syncher: true };
        }

        return null;
    }

    switch (args._[0]) {
        // args._[1] resource type, e.g., 'app'
        // args._[2] destination
        // args.t
        // resourceType, resourceName, template, destName, dest, options, callback
        case 'create':
            return [args._[1], null, args.t || null, null, args._[2] || '.', null, callback];
        // args._[1] resource type, e.g., 'component'
        // args._[2] destination name, e.g., component|model|collection name
        // args._[3] destination
        // args.v view
        // args.c controller
        // args.s syncher
        // args.r resrouce name
        // resourceType, resourceName, template, destName, dest, options, callback
        case 'add':
            return [
                args._[1], // resourceType
                args.r || null, // resourceName
                args.t || (args._[1] === 'template' ? args._[2] : null), // template
                args._[2] && args._.length > 3 && args._[1] !== 'template' ? args._[2] : null, // destName
                args._.length === 3 && args._[1] !== 'template' ? args._[2] : '.',
                getOptions(args._[1], args),
                callback
            ];
    }

};