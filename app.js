
'use strict';

const request = require('request');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const ExtensionData = require('./lib/extension-data');
const ExtensionDataFormatter = require('./lib/extension-data-formatter');
const ExtensionGalleryReader = require('./lib/extension-gallery-reader');

const reader = new ExtensionGalleryReader({request});

reader.read().then(data => {
    const writer = createCsvWriter({
        path: `__extension-${getDateString(new Date())}.csv`,
        header: [
            {id: 'id', title: 'EXTENSION_ID'},
            {id: 'name', title: 'EXTENSION_NAME'},
            {id: 'publishedDate', title: 'PUBLISHED_DATE'},
            {id: 'installCount', title: 'INSTALL_COUNT'},
            {id: 'moment', title: 'MOMENT'}
        ]
    });
    const formatter = new ExtensionDataFormatter(new Date());
    const records = data.results[0].extensions
        .map(extension => formatter.format(new ExtensionData(extension)));
    return writer.writeRecords(records);
}).catch(e => {
    console.error(e.stack);
});

function getDateString(date) {
    const year = date.getFullYear();
    const month = twoDigits(date.getMonth() + 1);
    const day = twoDigits(date.getDate());
    return year + month + day;
}

function twoDigits(n) {
    return n < 10 ? `0${n}` : n;
}
