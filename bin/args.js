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
        case 'create':
            return [args._[1], args.t || null, args._[2] || '.', callback];
        // args._[1] resource type, e.g., 'component'
        // args._[2] destination name, e.g., component|model|collection name
        // args._[3] destination
        // args.v view
        // args.c controller
        // args.s syncher
        // resourceType, template, destName, dest, options, callback
        case 'add':
            return [args._[1], args.t || null, args._[2] || null, args._[3] || '.', getOptions(args._[1], args), callback];
    }

};