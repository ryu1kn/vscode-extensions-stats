
'use strict';

const CsvWriter = require('./csv/file-writer');
const FieldStringifier = require('./csv/field-stringifier');

class CsvWriterFactory {

    constructor(params) {
        this._fs = params.fs;
    }

    create(params) {
        return new CsvWriter({
            fieldStringifier: new FieldStringifier(),
            filePath: params.filePath,
            fs: this._fs,
            header: params.header
        });
    }

}

module.exports = CsvWriterFactory;
