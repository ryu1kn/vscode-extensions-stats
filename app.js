
const aws = require('aws-sdk');
const fs = require('fs');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const docClient = new aws.DynamoDB.DocumentClient();

const csvStringifier = createCsvStringifier({
    header: [   // TODO: Get header values dynamically
        {id: 'date', title: 'DATE'},
        {id: '2100095e-ca9e-42ef-9bb4-5da1002c8139', title: 'Annotator'},
        {id: '79afa437-682e-4fa2-a4fd-87844832a1dc', title: 'Partial Diff'},
        {id: 'ab840a62-e128-4f36-8587-2e52f4eecc06', title: 'Text Marker'},
        {id: 'fa3848aa-3e65-4989-86e3-99d138c7f90b', title: 'Put Print'},
        {id: '370f75d3-459d-498a-80ed-e380c87750c5', title: 'Edit with Shell Command'}
    ]
});


const repeatFn = scanResult => {
    const pagingParams = scanResult ? {ExclusiveStartKey: scanResult.LastEvaluatedKey} : null;
    const params = Object.assign({TableName : 'vsc-extension-stats--stats'}, pagingParams);
    return docClient.scan(params).promise()
        .then(scanResult => {
            const records = scanResult.Items.map(getWriteObject);
            const dataRecords = transformIntoDateRecords(records);
            console.log(csvStringifier.stringifyRecords(dataRecords));
            return scanResult;
        });
};
const shouldContinue = scanResult => !!scanResult.LastEvaluatedKey

console.log(csvStringifier.getHeaderString().trim());
doWhile(repeatFn, null, shouldContinue)
    .catch(e => { console.error(e.stack) });

function getWriteObject(item) {
    return {
        id: item.extensionId,
        date: item.fetchedAt.substring(0, 'yyyy-mm-dd'.length),
        installs: item.raw.statistics.filter(stat => stat.statisticName === 'install')[0].value,
        name: item.raw.displayName
    };
}

function transformIntoDateRecords(items) {
    return items.reduce((dayRecords, item) => {
        const dayRecord = dayRecords.find(dayRecord => dayRecord.date === item.date);
        if (dayRecord) {
            dayRecord[item.id] = item.installs;
        } else {
            dayRecords.push({
                date: item.date,
                [item.id]: item.installs
            });
        }
        return dayRecords;
    }, []);
}

function doWhile(fn, args, shouldContinue) {
    return fn.apply(null, args).then(result => {
        return shouldContinue(result) ? doWhile(fn, [result], shouldContinue) : result;
    });
}
