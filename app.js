
'use strict';

const fs = require('fs');
const request = require('request');

const ExtensionData = require('./lib/extension-data');
const ExtensionDataFormatter = require('./lib/extension-data-formatter');
const ExtensionGalleryReader = require('./lib/extension-gallery-reader');

const reader = new ExtensionGalleryReader({request});

reader.read().then(data => {
    const extensions = data.results[0].extensions;
    const formatter = new ExtensionDataFormatter(new Date());

    console.log(formatter.getHeader());
    extensions.forEach(extension => {
        console.log(formatter.format(new ExtensionData(extension)));
    });
}).catch(e => {
    console.error(e.stack);
});
