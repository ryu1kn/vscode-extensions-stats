
'use strict';

class CsvFileWriter {

    constructor(params) {
        this._fs = params.fs;
        this._filePath = params.filePath;
        this._fieldStringifier = params.fieldStringifier;
        this._header = params.header;
        this._headerWritten = false;
    }

    write(params) {
        const options = {
            encoding: 'utf8',
            flag: 'a'
        };
        return Promise.resolve()
            .then(() => this._headerWritten || this.writeHeader())
            .then(() => this._write(this._getFieldString(params), options));
    }

    writeHeader() {
        return this._write(this._getHeaderString(), {encoding: 'utf8'})
            .then(() => { this._headerWritten = true; });
    }

    _write(string, options) {
        return new Promise((resolve, reject) => {
            this._fs.writeFile(this._filePath, string, options, err => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    _getHeaderString() {
        return this._header.map(
            field => this._fieldStringifier.stringify(field.name)
        ).join(',') + '\n';
    }

    _getFieldString(params) {
        return this._header.map(
            field => this._fieldStringifier.stringify(params[field.id])
        ).join(',') + '\n';
    }

}

module.exports = CsvFileWriter;
