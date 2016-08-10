
'use strict';

const ENDPOINT = 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery';

class ExtensionGalleryReader {

    constructor(params) {
        this._request = params.request;
    }

    read() {
        return new Promise((resolve, reject) => {
            this._request({
                method: 'POST',
                url: ENDPOINT,
                qs: {'api-version': '3.0-preview.1'},
                json: this._getQuery()
            }, (err, response, body) => {
                if (err) reject(err);
                else resolve(body);
            });
        });
    }

    _getQuery() {
        return {
            assetTypes: ['Microsoft.VisualStudio.Services.Icons.Default'],
            filters: [{
                criteria: [{
                    filterType: 8,
                    value: 'Microsoft.VisualStudio.Code'
                }, {
                    filterType: 12,
                    value: '5122'
                }],
                direction: 2,
                pageSize: 20000,
                pageNumber: 1,
                sortBy: 4,
                sortOrder: 0,
                pagingToken: null
            }],
            flags: 806
        };
    }

}

module.exports = ExtensionGalleryReader;
