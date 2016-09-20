
const aws = require('aws-sdk');
const fs = require('fs');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier

const argv = require('minimist')(process.argv.slice(2));

const config = JSON.parse(fs.readFileSync(argv.config, 'utf8'));
const docClient = new aws.DynamoDB.DocumentClient({
    region: config['aws.region'],
    accessKeyId: config['aws.accessKeyId'],
    secretAccessKey: config['aws.secretAccessKey']
});
const csvStringifier = createCsvStringifier({
    header: [
        {id: 'id', title: 'EXTENSION ID'},
        {id: 'name', title: 'EXTENSION NAME'},
        {id: 'date', title: 'DATE'},
        {id: 'installs', title: 'INSTALL COUNT'}
    ]
});

const params = {TableName : 'vsc-extension-stats--stats'};
docClient.scan(params).promise()
    .then(data => data.Items)
    .then(items => items.map(getWriteObject))
    .then(records => {
        console.log(csvStringifier.getHeaderString());
        console.log(csvStringifier.stringifyRecords(records));
    }).catch(e => {
        console.log(e);
    });

function getWriteObject(item) {
    return {
        id: item.extensionId,
        date: item.fetchedAt.substring(0, 'yyyy-mm-dd'.length),
        installs: item.raw.statistics.filter(stat => stat.statisticName === 'install')[0].value,
        name: item.raw.displayName
    };
}