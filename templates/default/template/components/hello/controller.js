define(['lazoCtl'], function (LazoController) {

    'use strict';

    // https://github.com/walmartlabs/lazojs/wiki/Components
    return LazoController.extend({

        index: function (options) {
            options.success('index');
        }

    });

});