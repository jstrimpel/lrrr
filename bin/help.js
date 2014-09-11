var commands = {
    create: 'Create a new resource\n\tusage:\tlrrr create app [destination]',
    add: 'Add a resource to an application\n\tusage:\tlrrr add component|model|collection [name] [destination] [-scv]\n\t' +
        '[-s]\tSyncher for model or collection\n\t' +
        '[-v]\tComponent view object\n\t' +
        '[-c]\tComponent controller'
};

module.exports = function (command) {
    if (!command) {
        console.log('\n');
        console.log('usage: lrrr [-v] [--help] <command> [<args>]');
        console.log('\n');
        console.log('The lrrr commands are:\n');
        console.log('\tadd\t' + commands.add + '\n');
        console.log('\tcreate\t' + commands.create + '\n');
    } else {
        if (!commands[command]) {
            console.log('No entry for ' + command);
        } else {
            console.log('\n\t' + command + '\t' + commands[command] + '\n');
        }
    }
};