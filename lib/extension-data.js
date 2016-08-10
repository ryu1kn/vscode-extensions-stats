
'use strict';

class ExtensionData {

    constructor(data) {
        this._data = data;
    }

    get id() {
        return this._data.extensionId;
    }

    get displayName() {
        return this._data.displayName;
    }

    get publishedDate() {
        return new Date(this._data.publishedDate);
    }

    get numberOfInstall() {
        return this._data.statistics.find(item => item.statisticName === 'install').value;
    }

}

module.exports = ExtensionData;
