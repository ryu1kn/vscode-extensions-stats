
'use strict';

const DAY_IN_MSEC = 24 * 60 * 60 * 1000;

class ExtensionDataFormatter {

    constructor(now) {
        this._now = now;
    }

    getHeader() {
        return 'EXTENSION_ID,PUBLISHED_DATE,INSTALL_COUNT,MOMENT,EXTENSION_NAME';
    }

    format(ext) {
        const elapsedDay = this._getElapsedDay(this._now, ext.publishedDate);
        const allPeriodMoment = ext.numberOfInstall / elapsedDay;
        return [
            ext.id,
            ext.publishedDate.toISOString(),
            ext.numberOfInstall,
            allPeriodMoment.toFixed(2),
            this._quoteIfNecessary(ext.displayName)
        ].join(',');
    }

    _getElapsedDay(newDate, oldDate) {
        return (newDate.getTime() - oldDate.getTime()) / DAY_IN_MSEC;
    }

    _quoteIfNecessary(string) {
        const needQuote = string.includes(',') || string.includes('"');
        if (!needQuote) return string;

        return `"${string.replace(/"/g, '""')}"`;
    }

}

module.exports = ExtensionDataFormatter;
