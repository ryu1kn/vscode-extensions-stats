
'use strict';

class CsvWriter {

    constructor(params) {
        this._fs = params.fs;
        this._filePath = params.filePath;
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
            .then(() => this._write(this._getString(params), options));
    }

    writeHeader() {
        return this._write(this._headerString, {encoding: 'utf8'})
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

    get _headerString() {
        return this._header.map(field => this._sanitiseFieldValue(field.name)).join(',');
    }

    _getString(params) {
        return this._header.map(field => params[field.id]).join(',');
    }

    _sanitiseFieldValue(string) {
        const str = string.trim();
        const needsQuotes = str.includes(',') || str.startsWith('"') || str.endsWith('"');
        return needsQuotes ? `"${string.replace(/"/g, '""')}"` : string;
    }
}

module.exports = CsvWriter;
