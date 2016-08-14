
'use strict';

const DAY_IN_MSEC = 24 * 60 * 60 * 1000;

class ExtensionDataFormatter {

    constructor(now) {
        this._now = now;
    }

    format(ext) {
        const elapsedDay = this._getElapsedDay(this._now, ext.publishedDate);
        const allPeriodMoment = ext.numberOfInstall / elapsedDay;
        return {
            id: ext.id,
            name: ext.displayName,
            publishedDate: ext.publishedDate.toISOString(),
            installCount: ext.numberOfInstall,
            moment: allPeriodMoment.toFixed(2)
        };
    }

    _getElapsedDay(newDate, oldDate) {
        return (newDate.getTime() - oldDate.getTime()) / DAY_IN_MSEC;
    }

}

module.exports = ExtensionDataFormatter;
