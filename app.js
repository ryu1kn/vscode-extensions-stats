
'use strict';

const request = require('request');
const CsvWriter = require('csv-writer');

const ExtensionData = require('./lib/extension-data');
const ExtensionDataFormatter = require('./lib/extension-data-formatter');
const ExtensionGalleryReader = require('./lib/extension-gallery-reader');

const reader = new ExtensionGalleryReader({request});

reader.read().then(data => {
    const writer = new CsvWriter({
        path: `__extension-${getDateString(new Date())}.csv`,
        header: [
            {id: 'id', title: 'EXTENSION_ID'},
            {id: 'name', title: 'EXTENSION_NAME'},
            {id: 'publishedDate', title: 'PUBLISHED_DATE'},
            {id: 'installCount', title: 'INSTALL_COUNT'},
            {id: 'moment', title: 'MOMENT'}
        ]
    });
    const extensions = data.results[0].extensions;
    const formatter = new ExtensionDataFormatter(new Date());

    const callback = extension => writer.write(formatter.format(new ExtensionData(extension)));
    return sequence(extensions, callback);
}).catch(e => {
    console.error(e.stack);
});

function sequence(list, fn) {
    return list.reduce((promise, element) =>
        promise.then(() => fn(element)),
        Promise.resolve()
    );
}

function getDateString(date) {
    const year = date.getFullYear();
    const month = twoDigits(date.getMonth() + 1);
    const day = twoDigits(date.getDate());
    return year + month + day;
}

function twoDigits(n) {
    return n < 10 ? `0${n}` : n;
}
